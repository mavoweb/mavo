/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sourcemaps gulp-babel gulp-sass gulp-autoprefixer --save-dev
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

var dependencies = ["../../bliss/bliss.shy.min.js", "../../stretchy/stretchy.min.js", "../../jsep/build/jsep.min.js"];
var src = `mavo util locale locale.en plugins ui.bar ui.message permissions backend formats
			node group primitive ui.popup elements collection implicit-collection ui.itembar
			expression domexpression expressions mv-if functions functions.date mavoscript actions data
			backend.dropbox backend.github`
	.split(/\s+/);
var versionOptions = {
	replace: /%%VERSION%%/g
};

src.push("local");

src = src.map(path => `src/${path}.js`);

gulp.task("concat-parts", function () {
	return merge(
		gulp.src("lib/*.js")
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
		"presets": [
			["@babel/env", {
				"targets": {
					"browsers": ["last 4 versions", "IE 11"]
				}
			}
			]
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
	return merge(gulp.src("dist/deps.js"), gulp.src("dist/mavo-nodeps.js").pipe(minify()))
		.pipe(sourcemaps.init())
		.pipe(concat("mavo.min.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify-es5", function () {
	return merge(gulp.src("dist/deps.js"), transpileStream().pipe(minify()))
		.pipe(sourcemaps.init())
		.pipe(concat("mavo.es5.min.js"))
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

gulp.task("default", gulp.parallel(gulp.series("concat", gulp.parallel("transpile", "minify", "minify-es5")), "sass"));
