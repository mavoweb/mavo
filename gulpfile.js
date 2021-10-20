/*
Build file to concat & minify files, compile SCSS and so on.
*/
// grab our gulp packages
var gulp = require("gulp");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var minify = require("gulp-babel-minify");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var notify = require("gulp-notify");
var merge = require("merge2");
var injectVersion = require("gulp-inject-version");
var csso = require("gulp-csso");
var fs = require("fs");
var sorcery = require("sorcery");
var replace = require("gulp-replace");

sass.compiler = require("sass");

var dependencies = ["../../bliss/bliss.shy.min.js", "../../stretchy/stretchy.min.js", "../../jsep/dist/jsep.iife.min.js"];
var src = `mavo util locale locale.en plugins ui.bar ui.message permissions backend formats
			node group primitive ui.popup elements collection implicit-collection ui.itembar
			expression domexpression expressions mv-if functions functions.date mavoscript actions data
			backend.github`
	.split(/\s+/);
var versionOptions = {
	replace: /%%VERSION%%/g
};

src.push("local");

src = src.map(path => `src/${path}.js`);

gulp.task("concat-parts", function () {
	return merge(
		gulp.src("lib/*.js")
			.pipe(replace(/\/\/# sourceMappingURL=.+/, ""))
			.pipe(sourcemaps.init())
			.pipe(concat("deps.js"))
			.pipe(sourcemaps.write("maps"))
			.pipe(gulp.dest("dist")),
		gulp.src(src, {allowEmpty: true})
			.pipe(sourcemaps.init())
			.pipe(injectVersion(versionOptions))
			.pipe(concat("mavo-nodeps.js"))
			.pipe(sourcemaps.write("maps"))
			.pipe(gulp.dest("dist"))
	);
});

gulp.task("concat", gulp.series("concat-parts", function() {
	return gulp.src(["dist/deps.js", "dist/mavo-nodeps.js"])
		.pipe(sourcemaps.init())
		.pipe(concat("mavo.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
}));

gulp.task("sass", function () {
	return gulp.src(["src-css/*.scss", "!**/_*.scss"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 2 versions"],
			cascade: false
		}))
		.pipe(rename({ extname: ".css" }))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"))
		.pipe(notify({
			message: "Sass done!",
			onLast: true
		}));
});

var transpileStream = () => gulp.src("dist/mavo-nodeps.js")
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: [
			["@babel/preset-env"]
		],
		compact: false
	}))
	.on("error", function (error) {
		console.error(error.message, error.loc);
		this.emit("end");
	});

gulp.task("transpile", function () {
	return merge(gulp.src("dist/deps.js"), transpileStream())
		.pipe(concat("mavo.es5.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify", function () {
	return merge(gulp.src("dist/deps.js"), gulp.src("dist/mavo-nodeps.js").pipe(minify({mangle: false})))
		.pipe(sourcemaps.init())
		.pipe(concat("mavo.min.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify-es5", function () {
	return merge(gulp.src("dist/deps.js"), transpileStream().pipe(minify({mangle: false})))
		.pipe(sourcemaps.init())
		.pipe(concat("mavo.es5.min.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify-css", function () {
	return gulp.src("dist/mavo.css")
		.pipe(sourcemaps.init())
		.pipe(csso())
		.pipe(concat("mavo.min.css"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("lib", function () {
	return gulp.src(dependencies).pipe(gulp.dest("lib"));
});

function fixMaps (files) {
	files.forEach(file => {
		try {
			const chain = sorcery.loadSync(`dist/${file}`);
			chain.writeSync(); // Overwrites dist/file.js and adds dist/file.js.map
		}
		catch (e) {
			console.log(`Sorcery error: ${e}`);
			return;
		}
	});

	// Move generated maps to dist/maps
	files.forEach(file => {
		try {
			fs.renameSync(`dist/${file}.map`, `dist/maps/${file}.map`)
		}
		catch (e) {
			console.log(`Move map error: ${e}`);
			return;
		}
	});
}

// Fix for https://github.com/mavoweb/mavo/issues/734
// To make this task work we automatically remove sourceMappingURL from files in the lib folder via gulp-replace
gulp.task("fix-maps", function (cb) {
	const files = ["deps.js", "mavo-nodeps.js", "mavo.js", "mavo.min.js", "mavo.es5.js", "mavo.es5.min.js", "mavo.css", "mavo.min.css"];
	fixMaps(files);
	cb();
});

gulp.task("watch-maps", function (cb) {
	fixMaps(["mavo.js", "mavo.es5.js"]);
	cb();
});

gulp.task("watch", function () {
	gulp.watch(dependencies, gulp.series("lib"));
	gulp.watch(["src/*.js", "lib/*.js"], gulp.series("concat"));
	gulp.watch(["dist/mavo-nodeps.js", "dist/deps.js"], gulp.series("transpile", "watch-maps"));
	gulp.watch(["**/*.scss"], gulp.series("sass"));
});

gulp.task("default", gulp.series(gulp.parallel(gulp.series("concat", gulp.parallel("transpile", "minify", "minify-es5")), gulp.series("sass", "minify-css")), "fix-maps"));
