var gulp       = require('gulp');
var gutil      = require('gulp-util');
var jshint     = require('gulp-jshint');
var browserify = require('gulp-browserify');
var concat     = require('gulp-concat');
var clean      = require('gulp-clean');

var sourcePath = 'assets';
var distPath   = 'public';

/* linter */
gulp.task('lint', function() {
  gulp.src('./'+ sourcePath +'/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('browserify', fuction() {
  gulp.src([sourcePath + '/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest(distPath + '/scripts'))
});

gulp.task('watch', ['lint'], function() {
  gulp.watch([sourcePath + 'scripts/*.js', sourcePath + 'scripts/**/*.js'], [
    'lint',
    'browserify'
  ])
});
