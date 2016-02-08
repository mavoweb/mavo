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
var babel = require('gulp-babel');

gulp.task('concat', function() {
	var files = "stretchy wysie storage unit scope primitive collection storage.dropbox ".split(" ").map(path => "src/" + path + ".js");

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

gulp.task('transpile', ['concat'], function() {
	return gulp.src(['wysie.js'])
	.pipe(babel({
		"plugins": [
			"transform-es2015-arrow-functions",
			"transform-es2015-template-literals"
		]
	}))
	.pipe(rename({ suffix: '.es5' }))
	.pipe(gulp.dest('.'));

});

gulp.task('minify', ['concat', "transpile"], function() {
	var u = uglify();
	u.on('error', function(error){
		console.error(error);
		u.end();
	});

	return gulp.src(['wysie.es5.js'])
	.pipe(u)
	.pipe(rename("wysie.min.js"))
	.pipe(gulp.dest('.'));

});

gulp.task('watch', function() {
	gulp.watch(["src/*.js", "**/*.scss"], ['concat', 'sass', 'transpile', 'minify']);
});

gulp.task('default', ['concat', 'sass', 'transpile', 'minify']);
