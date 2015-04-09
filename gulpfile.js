/* The following Gulp configuration has been created by Elena Torro */
var gulp       = require("gulp");
var gutil      = require("gulp-util");
var jshint     = require("gulp-jshint");
var browserify = require("gulp-browserify");
var concat     = require("gulp-concat");
var clean      = require("gulp-clean");
var uglify     = require("gulp-uglify");
var rename     = require("gulp-rename");
var bowerFiles = require("main-bower-files");
var server     = require("gulp-express");
var minifycss  = require("gulp-minify-css");
var gulpFilter = require("gulp-filter");
var flatten    = require("gulp-flatten");
var sass       = require('gulp-sass');

/* bower */
gulp.task('bower-files', function() {
	  var jsFilter = gulpFilter('*.js');
    var cssFilter = gulpFilter('*.css');
    var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);
    var dest_path = "./public/assets/bower_components";
	return gulp.src(bowerFiles())

	// grab vendor js files from bower_components, minify and push in /public
	.pipe(jsFilter)
	.pipe(gulp.dest(dest_path + '/js/vendor'))
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest(dest_path + '/js/vendor'))
	.pipe(jsFilter.restore())

	// grab vendor css files from bower_components, minify and push in /public
	.pipe(cssFilter)
	.pipe(gulp.dest(dest_path + '/css'))
	.pipe(minifycss())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest(dest_path + '/css'))
	.pipe(cssFilter.restore())

	// grab vendor font files from bower_components and push in /public
	.pipe(fontFilter)
	.pipe(flatten())
	.pipe(gulp.dest(dest_path + '/fonts'))
});

/* javascript dependencies */
var jsDepPath      = "./app/assets/dependencies/scripts/";
var jsDepDest      = "./public/assets/dependencies/scripts"
var jsDependencies = [jsDepPath + "jquery-1.11.2.min.js",
                      jsDepPath + "modernizr.custom.js",
                      jsDepPath + "bootstrap.min.js",
                      jsDepPath + "underscore-min.js",

											jsDepPath + "snap.svg-min.js",
                      jsDepPath + "modernizr.custom.js",
                      jsDepPath + "classie.js",
                      jsDepPath + "sliderFx.js"
											];

gulp.task("jsDependencies", function() {
  return gulp.src(jsDependencies)
  .pipe(concat("dependencies.js"))
  .pipe(gulp.dest(jsDepDest));
});

/* javascript angular browserify */
gulp.task("bundle", function() {
  gulp.src(["app/assets/scripts/main.js", "app/assets/scripts/**/*.js"])
  // .pipe(browserify({
  //   insertGlobals: true,
  //   debug: true
  // }))
  .pipe(concat("angular_bundle.js"))
  .pipe(gulp.dest("./public/assets/scripts"));
})

/* style dependencies */
var cssDepPath = "./app/assets/dependencies/styles/";
var cssDepDest = "./public/assets/dependencies/styles/";
var cssDependencies = [
                       cssDepPath + "bootstrap.css",
                       cssDepPath + "bootswatch.css",
											 cssDepPath + "normalize.css",
											 cssDepPath + "slideshow.css"
                     ];

 gulp.task("cssDependencies", function() {
   return gulp.src(cssDependencies)
   .pipe(concat("dependencies.css"))
   .pipe(minifycss())
   .pipe(gulp.dest(cssDepDest));
 });

 gulp.task("style", function() {
   return gulp.src("./app/assets/styles/*.css")
   .pipe(concat("style.css"))
   .pipe(minifycss())
   .pipe(gulp.dest("./public/assets/styles"));
 })

/* custom sass */
//TODO
gulp.task("customStyle", function() {
	return gulp.src("./app/assets/styles/main.scss")
	.pipe(sass())
	.pipe(gulp.dest("./public/assets/styles"));
})

/* views */
gulp.task("views", function() {
  //index
  gulp.src("./app/index.html")
  .pipe(gulp.dest("./public/"));
  //all the views
  gulp.src("./app/views/**/*")
  .pipe(gulp.dest("./public/views/"));
})

/* images */
gulp.task("images", function() {
  //index
  gulp.src("./app/assets/images/*")
  .pipe(gulp.dest("./public/assets/images"));
})

/* icons */
gulp.task("icons", function() {
  //index
  gulp.src("./app/assets/icons/*")
  .pipe(gulp.dest("./public/assets/icons"));
})

/* watch */
gulp.task('watch', function() {
  gulp.watch(jsDependencies, ["jsDependencies"]);
  gulp.watch(cssDependencies, ["cssDependencies"]);
  gulp.watch(["app/assets/scripts/*.js", "app/assets/scripts/**/*.js"], ["bundle"]);
  gulp.watch("./app/assets/styles/*.css", ["style"]);
  gulp.watch(["./app/assets/styles/*.scss", "./app/assets/styles/**/*.scss"], ["customStyle"]);
  gulp.watch(["./app/views/**/*", "./app/index.html"], ["views"]);
  gulp.watch("./app/assets/images/*", ["images"]);
  gulp.watch("./app/assets/icons/*", ["icons"]);
})
/*server */
gulp.task("run", function() {
  server.run(["app.js"]);
})

gulp.task("build", ["bower-files", "jsDependencies", "cssDependencies",
                      "style", "customStyle", "bundle", "views", "images", "icons"]);

gulp.task("default", ["build", "run", "watch"]);
