const fs = require('fs');
const defaultAssets = require('../config/assets/default');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins({
  rename: {
    'gulp-angular-templatecache': 'templateCache'
  }
});

// CSS minifying task
gulp.task('cssmin', function() {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.csso())
    .pipe(plugins.concat('application.min.css'))
    .pipe(plugins.rev())
    .pipe(gulp.dest('public/dist'));
});

// Sass task
gulp.task('sass', function() {
  return gulp.src(defaultAssets.client.sass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.flatten())
    .pipe(gulp.dest('./public/assets/css/'));
});
