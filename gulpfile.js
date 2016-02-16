/*jslint node: true */

'use strict';

/* ============================================================ *\
	PLUGINS
\* ============================================================ */

var argv			= require('yargs').argv;
var gulp 			= require('gulp');


/* ============================================================ *\
	CONFIG
\* ============================================================ */

var config			= {};

config.dirs			= require('./project_config/dirs.json');
config.files 		= require('./project_config/files.json');
config.paths 		= require('./project_config/paths.js')(config);

config.isProd 		= argv.prod || false;
config.isWatched	= argv.watch || false;


/* ============================================================ *\
	TASKS
\* ============================================================ */

var tasks			= {};

tasks.default 		=[];
tasks.watch 		=[];

require('./project_tasks/html.js')(gulp, config, tasks);
require('./project_tasks/images.js')(gulp, config, tasks);
require('./project_tasks/package.js')(gulp, config, tasks);
require('./project_tasks/sass.js')(gulp, config, tasks);
require('./project_tasks/scripts.js')(gulp, config, tasks);


/* ============================================================ *\
	MAIN TASKS
\* ============================================================ */

gulp.task('watch', tasks.watch);
gulp.task('default', tasks.default.concat(tasks.watch));
