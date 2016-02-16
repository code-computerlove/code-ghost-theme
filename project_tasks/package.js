/*jslint node: true */
'use strict';

/* ============================================================ *\
   ZIP / PACKAGE
\* ============================================================ */

var gif				= require('gulp-if');
var gutil 			= require('gulp-util');

var zip				= require('gulp-zip');
var preprocess		= require('gulp-preprocess');

module.exports = function(gulp, config, tasks) {

	gulp.task('package', tasks.default, function() {

		if(!config.isProd) {
			gutil.log(gutil.colors.red('Packaging development assets'));
			gutil.log(gutil.colors.red('Use --prod flag to package production assets'));
		}

	    return gulp.src(config.paths.dest.html + '/**/*')
	        .pipe(zip(config.files.package))
	        .pipe(gulp.dest(config.dirs.root));
	});

};
