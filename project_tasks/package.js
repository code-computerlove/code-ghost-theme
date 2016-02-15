/*jslint node: true */
'use strict';

/* ============================================================ *\
   ZIP / PACKAGE
\* ============================================================ */

var gif				= require('gulp-if');

var zip				= require('gulp-zip');
var preprocess		= require('gulp-preprocess');

module.exports = function(gulp, config, tasks) {

	config.isProd = true;

	gulp.task('package', tasks.default, function() {
	    return gulp.src(config.paths.dest.html + '/**/*')
	        .pipe(zip(config.files.package))
	        .pipe(gulp.dest(config.dirs.root));
	});

};
