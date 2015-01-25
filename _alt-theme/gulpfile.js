// gulpfile.js based on Google Web Starter Kit:
// https://github.com/google/web-starter-kit/blob/master/gulpfile.js
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var assets = require('./static_src/assets/assets.json');
var dest = '../themes/alt/source/';

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('styles', function() {
  return gulp.src([
    'assets/styles/*.scss', // Don't add Sass partials for performance
    'assets/styles/**/*.css',
    'assets/bower_components/**/*.css'
  ], { cwd: 'static_src' })
    .pipe($.changed('styles'))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest('static_src/.tmp/styles'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('assets:styles', ['styles'], function() {
  return gulp.src(assets.css.files, { cwd: 'static_src/.tmp' })
    .pipe($.concat(assets.css.name))
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest(dest + 'styles'));
});

gulp.task('assets:javascripts', function() {
  return gulp.src(assets.js.files, { cwd: 'static_src/assets' })
    .pipe($.concat(assets.js.name))
    .pipe($.uglify())
    .pipe(gulp.dest(dest + 'javascripts'));
});

gulp.task('assets:images', function() {
  return gulp.src(['images/**/*'], { cwd: 'static_src/assets' })
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(dest + 'images'));
});

gulp.task('clean', del.bind(null,
  ['static_src/.tmp/*',
  dest + 'styles/*',
  dest + 'javascripts/*',
  dest + 'images/*'],
  {dot: true, force: true}));

gulp.task('watch', function () {
  gulp.watch(['assets/**/*.{scss,css}',
    'assets/assets.json'],
    { cwd: 'static_src' },
    ['assets:styles']);
  gulp.watch(['assets/**/*.js',
    'assets/assets.json'],
    { cwd: 'static_src' },
    ['assets:javascripts']);
  gulp.watch(['assets/images/**/*'],
    { cwd: 'static_src' },
    ['assets:images']);
});

gulp.task('default', ['clean', 'assets:styles', 'assets:javascripts', 'assets:images', 'watch']);
