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
    return gulp.src('./app/assets/bower_components/**/*')
    .pipe(gulp.dest('./public/assets/bower_components/'));
});

/* javascript dependencies */
var jsDepPath      = "./app/assets/dependencies/scripts/";
var jsDepDest      = "./public/assets/dependencies/scripts"
var jsDependencies = [
	jsDepPath + "jquery-1.11.2.min.js",
  jsDepPath + "modernizr.custom.js",
  jsDepPath + "bootstrap.min.js",
  jsDepPath + "underscore.js"
];

gulp.task("jsDependencies", function() {
  return gulp.src(jsDependencies)
  .pipe(concat("dependencies.js"))
  .pipe(gulp.dest(jsDepDest));
});

/* javascript angular browserify */
gulp.task("bundle", function() {
  gulp.src(["app/assets/scripts/main.js", "app/assets/scripts/**/*.js"])
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
	 cssDepPath + "hover-min.css"
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

	gulp.src(["./app/assets/templates/*.html", "./app/assets/templates/**/*.html"])
	.pipe(gulp.dest("./public/assets/templates"));
})

/* images */
gulp.task("images", function() {
  //index
  gulp.src("./app/assets/images/*")
  .pipe(gulp.dest("./public/assets/images"));
})

gulp.task("fonts", function() {
  //index
  gulp.src("./app/assets/fonts/*")
  .pipe(gulp.dest("./public/assets/fonts"));
})

/* icons */
gulp.task("icons", function() {
  //index
  gulp.src("./app/assets/icons/**/*.png")
  .pipe(gulp.dest("./public/assets/icons"));
})

/* sounds */
gulp.task("sounds", function() {
  gulp.src("./app/assets/sounds/**/*")
  .pipe(gulp.dest("./public/assets/sounds/"));
})

/* watch */
gulp.task('watch', function() {
  gulp.watch(jsDependencies, ["jsDependencies"]);
  gulp.watch(cssDependencies, ["cssDependencies"]);
  gulp.watch(["app/assets/scripts/*.js", "app/assets/scripts/**/*.js"], ["bundle"]);
  gulp.watch("./app/assets/styles/*.css", ["style"]);
  gulp.watch(["./app/assets/styles/*.scss", "./app/assets/styles/**/*.scss"], ["customStyle"]);
  gulp.watch(["./app/views/**/*", "./app/index.html", "./app/assets/templates/*.html"], ["views"]);
  gulp.watch("./app/assets/images/*", ["images"]);
  gulp.watch("./app/assets/icons/*", ["icons"]);
})
/*server */
gulp.task("run", function() {
  server.run(["app.js"]);
})

gulp.task("build", ["bower-files", "jsDependencies", "cssDependencies",
                      "style", "customStyle", "bundle", "views", "images", "icons", "fonts", "sounds"]);

gulp.task("deploy", ["jsDependencies", "cssDependencies",
                      "style", "customStyle", "bundle", "views", "images", "icons", "fonts", "sounds"]);

gulp.task("default", ["build", "run", "watch"]);
