var browserSync = require('browser-sync');
var gulp = require('gulp');

var stubbing = require('stubbing');

var api = stubbing({
  baseDir: './services',
  timeout: 0,
  cors: false,
  middleware: true
});

gulp.task('browserSync', ['build'], function() {
  var cfg = config.browserSync;

  cfg.middleware = function(req, res, next) {
    api(req, res, next);

  };
  return browserSync(cfg);
});
