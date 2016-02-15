/* jshint node: true */
'use strict';

function getPaths(config) {
	var SLASH = "/";

	var paths = {
		"dest": {
			"css": config.dirs.root + SLASH + config.dirs.dest + SLASH + "assets" + SLASH + config.dirs.css,
			"html": config.dirs.root + SLASH + config.dirs.dest,
			"img": config.dirs.root + SLASH + config.dirs.dest + SLASH + "assets" + SLASH + config.dirs.img,
			"js": config.dirs.root + SLASH + config.dirs.dest + SLASH + "assets" + SLASH + config.dirs.js,
			"js_main": config.dirs.root + SLASH + config.dirs.dest + SLASH + "assets" + SLASH + config.dirs.js + SLASH + config.files.js_main
		},
		"src": {
			"html": config.dirs.root + SLASH + config.dirs.src,
			"img": config.dirs.root + SLASH + config.dirs.src + SLASH + config.dirs.img,
			"js": config.dirs.root + SLASH + config.dirs.src + SLASH + config.dirs.js,
			"sass": config.dirs.root + SLASH + config.dirs.src + SLASH + config.dirs.sass,
			"sass_main": config.dirs.root + SLASH + config.dirs.src + SLASH + config.dirs.sass + SLASH + config.files.sass_main,
			"sass_styleguide": config.dirs.root + SLASH + config.dirs.src + SLASH + config.dirs.sass + SLASH + config.files.sass_styleguide
		}
	};

	return paths;
}

module.exports = getPaths;
