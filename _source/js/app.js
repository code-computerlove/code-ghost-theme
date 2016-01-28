(function(window, undefined){
	"use strict";

	var Website = Website || {};

	Website = function(){

		var _self = this;

		var $nav_btn = document.querySelector('[data-nav-btn]');
		var $nav_links = document.querySelectorAll('[data-nav-link]');
		var $nav_list = document.querySelector('[data-nav-list]');

		var classActive = 'is-active';

		function init(){
			$nav_btn.addEventListener('click', showNav);
			$nav_btn.addEventListener('focus', showNav);
			$nav_btn.addEventListener('blur', hideNav);

			Array.prototype.forEach.call($nav_links, function(el, i){
				el.addEventListener('focus', showNav);
				el.addEventListener('blur', hideNav);
			});
		}

		function addClass(el, className) {
			if (el.classList) {
				el.classList.add(className);
			} else {
				el.className += ' ' + className;
			}
		}

		function hasClass(el, className) {
			if (el.classList) {
				return el.classList.contains(className);
			} else {
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			}
		}

		function removeClass(el, className) {
			if (el.classList) {
				el.classList.remove(className);
			} else {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		}

		function showNav(e, className) {
			if(!hasClass($nav_btn, classActive)) {
				addClass($nav_btn, classActive);
			}

			if(!hasClass($nav_list, classActive)) {
				addClass($nav_list, classActive);
			}
		}

		function hideNav(e, className) {
			removeClass($nav_btn, classActive);
			removeClass($nav_list, classActive);
		}

		init();
	};

	var website = new Website();

})(window);
