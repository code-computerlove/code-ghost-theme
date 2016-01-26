/*jslint node: true */

'use strict';

var es = require('event-stream'),
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*']
	});

var config = {
	dest: '_dest',
	css: 'css',
	img: 'images',
	js: 'js',
	js_file: 'main.js',
	root: '.',
	sass: 'sass',
	src: '_source',
	pixelBase: '16px'
};

var minifyCssOpts = {
	advanced: false,
	mediaMerging: false,
	processImport: false,
	roundingPrecision: 6
};

var paths = {
	dest: {
		css: config.root + '/' + config.dest + '/assets/' + config.css,
		html: config.root + '/' + config.dest,
		img: config.root + '/' + config.dest + '/assets/' + config.img,
		js: config.root + '/' + config.dest + '/assets/' + config.js,
		js_file: config.root + '/' + config.dest + '/assets/' + config.js + '/' + config.js_file
	},
	src: {
		html: config.root + '/' + config.src,
		img: config.root + '/' + config.src + '/' + config.img,
		js: config.root + '/' + config.src + '/' + config.js,
		sass: config.root + '/' + config.src + '/' + config.sass,
		sass_file: config.root + '/' + config.src + '/' + config.sass + '/main.scss'
	}
};

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


/* ============================================================ *\
	HTML / HBS (HANDLEBARS) TEMPLATES
\* ============================================================ */

gulp.task('html', function () {
	gulp.src([paths.src.html + '/**/*.hbs', paths.src.html + '/*.json'])
		.pipe(gulp.dest(paths.dest.html));
});


/* ============================================================ *\
	IMAGES
\* ============================================================ */

gulp.task('images', function () {
	gulp.src([paths.src.img + '/**/*.{jpg,png,gif,ico,svg}'])
		.pipe(plugins.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(gulp.dest(paths.dest.img));
});


/* ============================================================ *\
	SASS / CSS
\* ============================================================ */

gulp.task('sass:dev', function () {
	gulp.src([paths.src.sass_file])
		.pipe(plugins.sass({errLogToConsole: true, includePaths: [paths.src.sass_includes], outputStyle: 'compact'}).on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer({browsers: ['> 5%']}))
		.pipe(gulp.dest(paths.dest.css))
		.pipe(plugins.livereload());
});

gulp.task('sass:init', function () {
	gulp.src([paths.src.sass_file])
		.pipe(plugins.sass({errLogToConsole: true, includePaths: [paths.src.sass_includes], outputStyle: 'compact'}).on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer({browsers: ['> 5%']}))
		.pipe(gulp.dest(paths.dest.css));
});

gulp.task('sass:lint', function () {
	return gulp.src([paths.src.sass + '/**/*.scss'])
		.pipe(plugins.scssLint({'bundleExec': true, 'customReport': sassReporter, 'reporterOutputFormat': 'Checkstyle', 'filePipeOutput': 'SassLintReport.xml'}))
		.pipe(gulp.dest(paths.dest.css));
});

gulp.task('sass:prod', function () {
	gulp.src([paths.src.sass_file])
		.pipe(plugins.sass({errLogToConsole: true, includePaths: [paths.src.sass_includes]}).on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer({browsers: ['> 5%']}))
		.pipe(plugins.minifyCss(minifyCssOpts))
		.pipe(gulp.dest(paths.dest.css));
});


/* ============================================================ *\
	SCRIPTS / JS
\* ============================================================ */

gulp.task('scripts:dev', function () {

	gulp.src(paths.src.js + '/*.js')
		.pipe(plugins.concat(config.js_file))
		.pipe(gulp.dest(paths.dest.js))
		.pipe(plugins.livereload());
});

gulp.task('scripts:init', function () {
	gulp.src(paths.src.js + '/*.js')
		.pipe(plugins.concat(config.js_file))
		.pipe(gulp.dest(paths.dest.js));
});

gulp.task('scripts:prod', function () {
	gulp.src(paths.src.js + '/*.js')
		.pipe(plugins.concat(config.js_file))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(paths.dest.js));
});

gulp.task('scripts:lint', function() {
	gulp.src([paths.src.js + '/*.js'])
		.pipe(plugins.jshint())
		.pipe(es.map(jsReporter));
});


/* ============================================================ *\
	MAIN TASKS
\* ============================================================ */

gulp.task('watch', function () {
	gulp.watch([paths.src.sass  +  '/**/*.scss'], ['sass:dev', 'sass:lint']);
	gulp.watch([paths.src.js + '/**/*.js'], ['scripts:dev', 'scripts:lint']);
	gulp.watch([paths.src.html + '/**/*.hbs'], ['html']);
	gulp.watch([paths.dest.html + '/**/*.hbs']).on('change', plugins.livereload.changed);
});

gulp.task('dev', ['sass:init', 'scripts:lint', 'scripts:init', 'images', 'html']);
gulp.task('prod', ['sass:prod', 'scripts:lint', 'scripts:prod', 'images', 'html']);