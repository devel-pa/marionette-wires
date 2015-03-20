var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var handleErrors = require('../util/handleErrors.js');
var tools = require('../util/tools.js');

var merge        = require('merge-stream');

var spiffy = require('jshint-spiffy-reporter');

gulp.task('scripts', function() {
	if (config.release) {
    var debug = config.debug;
		var stream = browserify(config.browserify)
			.bundle()
			.on('error', handleErrors)
			.pipe(source(config.js.destFile))
			.pipe(buffer())
      .pipe($.if(debug, $.sourcemaps.init({ loadMaps: true })))
      .pipe($.if(debug, $.sourcemaps.write('./')))
			.pipe($.if(!debug, $.uglify()))
			.pipe(gulp.dest(config.js.dest))
      ;

		stream.on('end', function() {
			console.log('-->               Done building');
		});
	}
	else {
		tools.merge(
      config.browserify,
      {
        cache: {},
        packageCache: {},
        fullPaths: true,
        debug: true
      }
    );

		var bundler = watchify(browserify(config.browserify));

		function bundle(changedFiles) {
			console.log('-->               Bundling ' + config.js.destFile + ' started');

			var compileStream = bundler.bundle()
				.on('error', handleErrors)
				.pipe(source(config.js.destFile))
				.pipe(buffer())
				.pipe($.sourcemaps.init({loadMaps: true}))
				//.pipe($.preprocess())
				.pipe($.sourcemaps.write('./'))
				.pipe(gulp.dest(config.js.dest))
        .pipe(reload({ stream: true }))
				.on('end', function() {
					var d = new Date();
					var t = ' at ';
					if (d.getHours() > 12) t += d.getHours() - 12;
					else t += d.getHours();
					t += ':'+d.getMinutes();
					if (d.getHours() > 12) t += 'pm';
					else t += 'am';
					t += ' '+d.getSeconds()+'s';
					console.log('-->               Updated ' + config.js.destFile+t);
				});

      if (changedFiles) {
        var lintStream = gulp.src(changedFiles)//to add tests
          .pipe($.plumber())
          .pipe($.cached('linting'), { optimizeMemory:true } )
          .pipe($.remember('linting'))
          .pipe($.jshint())
          .pipe($.jshint.reporter(spiffy))
          .on('error', handleErrors)
          .on('end', function() {
            // console.log('-->               Done linting');
          })
          ;

        return merge(lintStream, compileStream);

      }

      return compileStream;

		}

    bundler.on('update', bundle); // on any dep update, runs the bundler

		return bundle(); // and bundle immediately
	}
});
