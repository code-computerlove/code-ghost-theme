/*jslint node: true */
'use strict';

/* ============================================================ *\
	SASS / CSS
\* ============================================================ */

var es 				= require('event-stream');
var gif				= require('gulp-if');
var livereload		= require('gulp-livereload');
var gutil 			= require('gulp-util');

var autoprefixer	= require('gulp-autoprefixer');
var minifyCss		= require('gulp-minify-css');
var sass			= require('gulp-sass');
var scssLint		= require('gulp-scss-lint');

var minifyCssOpts = {
	advanced: false,
	keepSpecialComments: 0,
	mediaMerging: false,
	processImport: false,
	roundingPrecision: 6
};

var sassReporter = function(file, stream) {
	if(!file.scsslint.success) {
		var errors = [],
			plural,
			warnings = [];

		file.scsslint.issues.forEach(function (err) {
			if (err) {
				var isError = err.severity === 'error',
					message = [];

				message.push('   line ' + err.line + /*', col ' + err.col + */': ');
				message.push((isError) ? gutil.colors.red(err.reason) : gutil.colors.blue(err.reason) + '. ' + gutil.colors.grey('[' + err.linter + ']'));

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

	var sass_files = [config.paths.src.sass_main, config.paths.src.sass_styleguide];

	gulp.task('sass', function () {
		gulp.src(sass_files)
			.pipe(sass({errLogToConsole: true, includePaths: [config.paths.src.sass_includes], outputStyle: 'compact'}).on('error', sass.logError))
			.pipe(autoprefixer({browsers: ['> 5%']}))
			.pipe(gif(config.isProd, minifyCss(minifyCssOpts)))
			.pipe(gulp.dest(config.paths.dest.css))
			.pipe(gif(!config.isProd, livereload()));
	});

	gulp.task('sass:lint', function () {
		return gulp.src([config.paths.src.sass + '/**/*.scss'])
			.pipe(scssLint({'bundleExec': true, 'customReport': sassReporter, 'reporterOutputFormat': 'Checkstyle'}))
			.pipe(gulp.dest(config.paths.dest.css));
	});

	gulp.task('watch:sass', function () {
		if(!config.isProd) {
			gulp.watch([config.paths.src.sass  +  '/**/*.scss'], ['sass', 'sass:lint']);
		}
	});

	tasks.default.push('sass');
	tasks.watch.push('watch:sass');

};
