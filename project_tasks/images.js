/*jslint node: true */
'use strict';

/* ============================================================ *\
	SCRIPTS / JS
\* ============================================================ */

var imagemin		= require('gulp-imagemin');

module.exports = function(gulp, config, tasks) {

	gulp.task('images', function () {
		return gulp.src([config.paths.src.img + '/**/*.{jpg,png,gif,ico,svg}'])
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}]
			}))
			.pipe(gulp.dest(config.paths.dest.img));
	});

	tasks.default.push('images');

};
