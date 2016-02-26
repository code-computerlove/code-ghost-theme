/*jslint node: true */
'use strict';

/* ============================================================ *\
   HTML / HBS (HANDLEBARS) TEMPLATES
\* ============================================================ */

var gif				= require('gulp-if');

var inlineSource	= require('gulp-inline-source');
var livereload		= require('gulp-livereload');
var preprocess		= require('gulp-preprocess');

module.exports = function(gulp, config, tasks) {

	var env = (config.isProd) ? 'prod' : 'dev';

	gulp.task('html', function () {
		return gulp.src([config.paths.src.html + '/**/*.hbs', config.paths.src.html + '/*.json'])
			.pipe(preprocess({"context": { "NODE_ENV": env}}))
			.pipe(gif(config.isProd, inlineSource({"rootpath": config.paths.dest.html})))
			.pipe(gulp.dest(config.paths.dest.html));
	});

	gulp.task('watch:html', function () {
		gulp.watch([config.paths.src.html + '/**/*.hbs'], ['html']);
		gulp.watch([config.paths.dest.html + '/**/*.hbs']).on('change', livereload.changed);
	});

	tasks.default.push('html');

	if(config.isWatched) {
		tasks.watch.push('watch:html');
	}

};
