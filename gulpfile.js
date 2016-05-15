/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sourcemaps gulp-babel gulp-sass gulp-autoprefixer --save-dev
*/
// grab our gulp packages
var gulp  = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("concat", function() {
	var files = "wysie permissions storage node unit expression functions scope primitive primitive.imgur collection prettyprint debug storage.dropbox storage.github"
	            .split(" ").map(path => "src/" + path + ".js");
	files.unshift("../bliss/bliss.js");
	files.unshift("../stretchy/stretchy.js");

	return gulp.src(files)
		.pipe(sourcemaps.init())
		.pipe(concat("wysie.js"))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("."));
});

gulp.task("sass", function() {
	return gulp.src(["**/*.scss", "!node_modules/**"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
			cascade: false
		}))
		.pipe(rename({ extname: ".css" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("."));
});

gulp.task("transpile", ["concat"], function() {
	return gulp.src(["wysie.js"])
	.pipe(sourcemaps.init())
	.pipe(babel({
		"presets": ["ES2015"],
		compact: false
	}))
	.on("error", function(error) {
		console.error(error.message, error.loc);
		this.emit("end");
	})
	.pipe(rename({ suffix: ".es5" }))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest("."));

});

gulp.task("minify", ["concat", "transpile"], function() {
	var u = uglify({output: {
		max_line_len  : 1000 // to prevent merge conflicts
	}});

	u.on("error", function(error) {
		console.error(error);
		u.end();
	});

	return gulp.src(["wysie.es5.js"])
	.pipe(sourcemaps.init())
	.pipe(u)
	.pipe(rename("wysie.min.js"))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest("."));

});

gulp.task("watch", function() {
	gulp.watch(["src/*.js", "../bliss/bliss.min.js", "../stretchy/stretchy.js"], ["concat", "transpile", "minify"]);
	gulp.watch(["**/*.scss"], ["sass"]);
});

gulp.task("default", ["concat", "sass", "transpile", "minify"]);
