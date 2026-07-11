(function ($) {
	'use strict';

	function matchesCategory($el, filter) {
		if (filter === 'all') {
			return true;
		}

		var categories = String($el.attr('data-category') || '')
			.split(/\s+/)
			.filter(Boolean);

		return categories.indexOf(filter) !== -1;
	}

	function updateEmptyState($page) {
		var $featured = $page.find('.a26-project-featured');
		var $cards = $page.find('.a26-project-card');
		var visibleCount = $featured.not('.is-hidden').length + $cards.not('.is-hidden').length;

		$page.find('.a26-projects-empty').toggleClass('is-hidden', visibleCount > 0);
		$page.find('.a26-project-grid').toggleClass('is-hidden', visibleCount === 0);
	}

	function initProjectFilters($page) {
		var $buttons = $page.find('.a26-filter-btn');
		var $featured = $page.find('.a26-project-featured');
		var $cards = $page.find('.a26-project-card');

		$buttons.on('click', function () {
			var filter = $(this).data('filter');

			$buttons.removeClass('is-active');
			$(this).addClass('is-active');

			$featured.toggleClass('is-hidden', !matchesCategory($featured, filter));
			$cards.each(function () {
				$(this).toggleClass('is-hidden', !matchesCategory($(this), filter));
			});
			updateEmptyState($page);
		});
	}

	$(document).ready(function () {
		var $page = $('.a26-projects-page');
		if (!$page.length) {
			return;
		}

		initProjectFilters($page);
	});
})(jQuery);
