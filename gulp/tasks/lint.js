var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var spiffy = require('jshint-spiffy-reporter');

var handleErrors = require('../util/handleErrors.js');

gulp.task('lint', function() {
	return gulp.src([config.js.all].concat(config.js.tests))//to add tests
    .pipe($.plumber())
		.pipe($.cached('linting'), { optimizeMemory:true } )
    .pipe($.remember('linting'))
		.pipe($.jshint())
		.pipe($.jshint.reporter(spiffy))
		.on('error', handleErrors)
		.on('end', function() {
			// console.log('-->               Done linting');
		});
});
