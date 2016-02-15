/*jslint node: true */
'use strict';

/* ============================================================ *\
	SCRIPTS / JS
\* ============================================================ */

var es 				= require('event-stream');
var gif				= require('gulp-if');
var livereload		= require('gulp-livereload');
var gutil 			= require('gulp-util');

var concat			= require('gulp-concat');
var jshint			= require('gulp-jshint');
var uglify			= require('gulp-uglify');

var jsReporter = function (file, stream) {
	if (!file.jshint.success && (file.path.indexOf('vendor') === -1)) {
		var errors = [],
			plural,
			warnings = [];

		file.jshint.results.forEach(function (err) {
			if (err) {
				var isError = err.error.code && err.error.code[0] === 'E',
					message = [];

				message.push('   line ' + err.error.line + /*', col ' + err.error.character + */': ');
				message.push((isError) ? gutil.colors.red(err.error.reason) : gutil.colors.blue(err.error.reason));

				if(isError) {
					errors.push(message.join(''));
				} else {
					warnings.push(message.join(''));
				}
			}
		});

		if(warnings.length) {
			plural = (warnings.length>1) ? 's' : '';
			gutil.log(gutil.colors.yellow(warnings.length + ' warning'+ plural) +' found in ' + gutil.colors.magenta(file.relative));
			warnings.forEach(function(warning) {
				gutil.log(warning);
			});
		}

		if (errors.length) {
			plural = (errors.length>1) ? 's' : '';
			gutil.log(gutil.colors.red(errors.length + ' error'+ plural) +' found in ' + gutil.colors.magenta(file.relative));
			errors.forEach(function(error) {
				gutil.log(error);
			});
			// gutil.log(gutil.colors.red('BUILD TERMINATED') + ' (Hasta la vista, baby)');
			// process.exit(1);
		}

	}
};

module.exports = function(gulp, config, tasks) {

	gulp.task('scripts', function () {
		gulp.src([config.paths.src.js + '/vendor/*.js', config.paths.src.js + '/*.js'])
			.pipe(concat(config.files.js_main))
			.pipe(gif(config.isProd, uglify()))
			.pipe(gulp.dest(config.paths.dest.js))
			.pipe(gif(!config.isProd, livereload()));
	});

	gulp.task('scripts:lint', function() {
		gulp.src([config.paths.src.js + '/*.js'])
			.pipe(jshint())
			.pipe(es.map(jsReporter));
	});

	gulp.task('watch:scripts', function () {
		if(!config.isProd) {
			gulp.watch([config.paths.src.sass  +  '/**/*.scss'], ['scripts', 'scripts:lint']);
		}
	});

	tasks.default.push('scripts');
	tasks.watch.push('watch:scripts');

};
