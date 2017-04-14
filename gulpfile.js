/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sourcemaps gulp-babel gulp-sass gulp-autoprefixer --save-dev
*/
// grab our gulp packages
var gulp  = require("gulp");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var notify = require("gulp-notify");
var merge = require("merge2");

var dependencies = ["../bliss/bliss.min.js", "../stretchy/stretchy.js", "../jsep/build/jsep.min.js"];
var mavo = `mavo util plugins ui.bar ui.message permissions backend formats node group primitive ui.popup elements collection ui.itembar
			expression domexpression expressions mv-if mv-value functions
			backend.dropbox backend.github`
			.split(/\s+/).map(path => `src/${path}.js`);

gulp.task("concat", function() {
	var files = ["lib/*.js", ...mavo];

	return gulp.src(files)
		.pipe(sourcemaps.init())
		.pipe(concat("mavo.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("sass", function() {
	return gulp.src(["src-css/*.scss", "!**/_*.scss"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
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

var transpileStream = () => gulp.src(mavo)
	.pipe(sourcemaps.init())
	.pipe(babel({
		"presets": [
			["env", {
				"targets": {
					"browsers": ["last 4 versions"]
				}
			}
			]
		],
		compact: false
	}))
	.on("error", function(error) {
		console.error(error.message, error.loc);
		this.emit("end");
	});

gulp.task("transpile", function() {
	return merge(gulp.src(dependencies), transpileStream())
		.pipe(concat("mavo.es5.js"))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("minify", function() {
	return gulp.src(["dist/mavo.js", "dist/mavo.es5.js"])
		.pipe(sourcemaps.init())
		.pipe(babel({
			"presets": [
				["babili"]
			]
		}))
		.on("error", function(error) {
			console.error(error.message, error.loc);
			this.emit("end");
		})
		.pipe(rename({ extname: ".min.js" }))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));
});

gulp.task("lib", function() {
	gulp.src(dependencies).pipe(gulp.dest("lib"));
});

gulp.task("watch", function() {
	gulp.watch(dependencies, ["lib"]);
	gulp.watch(["src/*.js", "lib/*.js"], ["concat"]);
	gulp.watch(["dist/mavo.js"], ["transpile"]);
	gulp.watch(["**/*.scss"], ["sass"]);
});

gulp.task("default", ["concat", "sass", "transpile", "minify"]);
