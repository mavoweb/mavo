/*
Build file to concat & minify files, compile SCSS and so on.
*/
// grab our gulp packages
let gulp = require("gulp");
let rename = require("gulp-rename");
let concat = require("gulp-concat");
let sass = require("gulp-sass")(require("sass"));
let babel = require("gulp-babel");
let minify = require("gulp-babel-minify");
let autoprefixer = require("gulp-autoprefixer");
let sourcemaps = require("gulp-sourcemaps");
let notify = require("gulp-notify");
let merge = require("merge2");
let injectVersion = require("gulp-inject-version");
let csso = require("gulp-csso");

let dependencies = ["../../bliss/bliss.shy.min.js", "../../stretchy/stretchy.min.js", "../../jsep/dist/jsep.iife.min.js"];
let src = `mavo util locale locale.en plugins ui.bar ui.message permissions backend formats
			node group primitive ui.popup elements collection implicit-collection ui.itembar
			expression domexpression expressions mv-if functions functions.date mavoscript actions data
			backend.github`
	.split(/\s+/);
let versionOptions = {
	replace: /%%VERSION%%/g
};

src.push("local");

src = src.map(path => `src/${path}.js`);

gulp.task("concat-parts", function () {
	return merge(
		gulp.src("lib/*.js")
			.pipe(sourcemaps.init())
			.pipe(concat("deps.js"))
			.pipe(sourcemaps.mapSources((sourcePath, file) => "../../lib/" + sourcePath))
			.pipe(sourcemaps.write("maps"))
			.pipe(gulp.dest("dist")),
		gulp.src(src, {allowEmpty: true})
			.pipe(sourcemaps.init())
			.pipe(injectVersion(versionOptions))
			.pipe(concat("mavo-nodeps.js"))
			.pipe(sourcemaps.mapSources((sourcePath, file) => "../../src/" + sourcePath))
			.pipe(sourcemaps.write("maps"))
			.pipe(gulp.dest("dist"))
	);
});

gulp.task("concat", gulp.series("concat-parts", function() {
	return gulp.src(["dist/deps.js", "dist/mavo-nodeps.js"])
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat("mavo.js"))
		.pipe(sourcemaps.mapSources((sourcePath, file) => "../" + sourcePath))
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
		.pipe(sourcemaps.mapSources((sourcePath, file) => "../../src-css/" + sourcePath))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"))
		.pipe(notify({
			message: "Sass done!",
			onLast: true
		}));
});

let transpileStream = () => gulp.src("dist/mavo-nodeps.js")
	.pipe(sourcemaps.init({loadMaps: true}))
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
		.pipe(sourcemaps.mapSources((sourcePath, file) => "../" + sourcePath))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify", function () {
	return merge(
			gulp.src("dist/deps.js").pipe(sourcemaps.init()),
			gulp.src("dist/mavo-nodeps.js").pipe(sourcemaps.init()).pipe(minify({mangle: false}))
		)
		.pipe(concat("mavo.min.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify-es5", function () {
	return merge(
			gulp.src("dist/deps.js").pipe(sourcemaps.init()),
			transpileStream().pipe(minify({mangle: false}))
		)
		.pipe(concat("mavo.es5.min.js"))
		.pipe(sourcemaps.mapSources((sourcePath, file) => "../" + sourcePath))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify-css", function () {
	return gulp.src("dist/mavo.css")
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(csso())
		.pipe(concat("mavo.min.css"))
		.pipe(sourcemaps.mapSources((sourcePath, file) => "../" + sourcePath))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("lib", function () {
	return gulp.src(dependencies).pipe(gulp.dest("lib"));
});

gulp.task("watch", function () {
	gulp.watch(dependencies, gulp.series("lib"));
	gulp.watch(["src/*.js", "lib/*.js"], gulp.series("concat"));
	gulp.watch(["dist/mavo-nodeps.js", "dist/deps.js"], gulp.series("transpile"));
	gulp.watch(["**/*.scss"], gulp.series("sass"));
});

gulp.task("default", gulp.parallel(gulp.series("concat", gulp.parallel("transpile", "minify", "minify-es5")), gulp.series("sass", "minify-css")));
