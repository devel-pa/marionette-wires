var gulp = require('gulp');
var stubbing = require('stubbing');
var $ = require('gulp-load-plugins')();

gulp.task('runstubb', function() {
  stubbing({
    baseDir: './api',
    timeout: 0,
    cors: true,
    port: 4040
  })
});

gulp.task('watchFiles', ['browserSync'], function() {
  config.reporter = 'dot';

  gulp.watch(config.js.allTests).on('change', function (event) {
    if (event.type === 'deleted') { // if a file is deleted, forget about it
      delete $.cache.caches['scripts'][event.path];
      $.remember.forget('scripts', event.path);
    }
  });;
  gulp.watch(config.js.allTests, ['test']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch([config.less.src, config.less.all], ['styles']);
  gulp.watch([config.html.all], ['html']);
});
