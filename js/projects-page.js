(function ($) {
	'use strict';

	function escapeHtml(value) {
		return String(value || '').replace(/[&<>"']/g, function (char) {
			return {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;'
			}[char];
		});
	}

	function slug(value) {
		return String(value || 'project')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'project';
	}

	function projectUrl(project) {
		return 'project-view.html?id=' + encodeURIComponent(project.id);
	}

	function matchesCategory($el, filter) {
		return filter === 'all' || String($el.attr('data-category') || '') === filter;
	}

	function updateEmptyState($page) {
		var $cards = $page.find('.a26-project-card');
		var visibleCount = $cards.not('.is-hidden').length;

		$page.find('.a26-projects-empty').toggleClass('is-hidden', visibleCount > 0);
		$page.find('.a26-project-grid').toggleClass('is-hidden', visibleCount === 0);
	}

	function initProjectFilters($page) {
		var $buttons = $page.find('.a26-filter-btn');
		var $cards = $page.find('.a26-project-card');

		$buttons.off('click.a26Filter').on('click.a26Filter', function () {
			var filter = $(this).data('filter');

			$buttons.removeClass('is-active');
			$(this).addClass('is-active');

			$cards.each(function () {
				$(this).toggleClass('is-hidden', !matchesCategory($(this), filter));
			});
			updateEmptyState($page);
		});
	}

	function renderFilters(projects) {
		var filters = document.querySelector('.a26-project-filters');
		var label = document.querySelector('.a26-project-filters-label');
		var categories = [];

		if (!filters) return;

		projects.forEach(function (project) {
			var category = project.category || 'Project';
			if (categories.indexOf(category) === -1) {
				categories.push(category);
			}
		});

		if (label) label.textContent = 'Browse By Category';
		filters.innerHTML =
			'<button type="button" class="a26-filter-btn is-active" data-filter="all">All Work</button>' +
			categories.map(function (category) {
				return '<button type="button" class="a26-filter-btn" data-filter="' + slug(category) + '">' + escapeHtml(category) + '</button>';
			}).join('');
	}

	function projectCard(project, index) {
		var image = project.main_image || '';
		return '' +
			'<article class="a26-project-card a26-project-card--equal wow fadeInUp" data-wow-duration="1s" data-category="' + slug(project.category) + '">' +
				'<div class="a26-project-card-media">' +
					'<img src="' + image + '" alt="' + escapeHtml(project.project_name) + '">' +
					'<span class="a26-project-index">' + String(index).padStart(2, '0') + '</span>' +
					'<div class="a26-project-card-overlay">' +
						'<span class="a26-project-cat">' + escapeHtml(project.category || 'Project') + '</span>' +
						'<h4>' + escapeHtml(project.project_name) + '</h4>' +
						'<p>' + escapeHtml(project.description || 'View this project detail page.') + '</p>' +
					'</div>' +
					'<a href="' + projectUrl(project) + '" class="a26-project-zoom" aria-label="Open project details"><i class="las la-arrow-right"></i></a>' +
				'</div>' +
			'</article>';
	}

	function loadBackendProjects($page) {
		var gallery = document.getElementById('lightgallery');
		if (!gallery) return;

		gallery.innerHTML =
			'<div class="a26-project-grid" id="projectGalleryGrid"></div>' +
			'<div class="a26-projects-empty is-hidden" id="projectGalleryEmpty" aria-live="polite">' +
				'<i class="las la-images"></i>' +
				'<h4>No projects in this category yet</h4>' +
				'<p>Try another category or view all work.</p>' +
			'</div>';

		var grid = document.getElementById('projectGalleryGrid');
		var empty = document.getElementById('projectGalleryEmpty');

		fetch('backend/api/projects.php', { cache: 'no-store' })
			.then(function (response) { return response.json(); })
			.then(function (data) {
				var projects = data && data.success ? data.projects : [];
				grid.innerHTML = '';
				renderFilters(projects);

				if (!projects.length) {
					if (empty) empty.classList.remove('is-hidden');
					return;
				}

				if (empty) empty.classList.add('is-hidden');
				projects.forEach(function (project, index) {
					grid.insertAdjacentHTML('beforeend', projectCard(project, index + 1));
				});
				initProjectFilters($page);
			})
			.catch(function () {
				if (empty) empty.classList.remove('is-hidden');
			});
	}

	$(document).ready(function () {
		var $page = $('.a26-projects-page');
		if (!$page.length) {
			return;
		}

		loadBackendProjects($page);
	});
})(jQuery);
