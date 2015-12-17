/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sass --save-dev
*/
// grab our gulp packages
var gulp  = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename')
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('concat', function() {
	var files = "stretchy wysie storage unit scope primitive collection storage.dropbox ".split(" ").map(path => "components/" + path + ".js");

	return gulp.src(files)
		.pipe(concat('wysie.js'))
		.pipe(gulp.dest('.'));
});

gulp.task('sass', function() {
	return gulp.src(["**/*.scss", "!node_modules/**"])
		.pipe(sass().on('error', sass.logError))
		.pipe(rename({ extname: '.css' }))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
	gulp.watch(["**/*.js", "**/*.scss"], ['concat', 'sass']);
});

gulp.task('default', ['concat', 'sass']);
