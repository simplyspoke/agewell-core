'use strict';

require('dotenv').load(); // eslint-disable-line global-require

var fs = require('fs-extra'),
  gulp = require('gulp'),
  runSequence = require('run-sequence');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp')
  .filter(function(file) {
    return (/\.(js|coffee)$/i).test(file);
  })
  .map(function(file) {
    return require('./gulp/' + file);
  });

// Run the project in development mode
gulp.task('default', function(done) {
  runSequence('dev', done);
});

// Run the project in development mode
gulp.task('dev', function(done) {
  runSequence('env:dev', 'build', ['nodemon', 'watch'], done);
});

// Set NODE_ENV to 'dev'
gulp.task('env:dev', function() {
  process.env.NODE_ENV = 'dev';
});

// Set NODE_ENV to 'prod'
gulp.task('env:prod', function() {
  process.env.NODE_ENV = 'prod';
});

// Set NODE_ENV to 'test'
gulp.task('env:test', function() {
  process.env.NODE_ENV = 'test';
});

// Lint CSS and JavaScript files.
gulp.task('lint', function(done) {
  runSequence('sass', ['csslint', 'eslint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function(done) {
  runSequence('env:dev', 'makeUploadsDir', 'wiredep', 'lint', done);
});

gulp.task('build:prod', function(done) {
  runSequence('env:prod', ['makeUploadsDir', 'templatecache'], 'wiredep:prod', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project in debug mode
gulp.task('debug', function(done) {
  runSequence('env:dev', ['makeUploadsDir'], 'lint', ['nodemon-nodebug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function(done) {
  runSequence('build:prod', 'seed:prod', 'env:prod', 'nodemon:prod', done);
});

// Run the project in production mode
gulp.task('live', function(done) {
  runSequence('env:prod', 'nodemon:prod', done);
});
