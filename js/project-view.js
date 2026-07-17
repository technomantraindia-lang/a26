(function () {
	'use strict';

	var galleryState = {
		images: [],
		index: 0
	};

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

	function imageBlock(src, index, name) {
		if (!src) return '';
		return '' +
			'<button class="a26-project-detail-image" type="button" data-gallery-image="' + src + '" data-gallery-index="' + (index - 1) + '" data-gallery-title="' + escapeHtml(name + ' image ' + index) + '">' +
				'<img src="' + src + '" alt="' + escapeHtml(name + ' image ' + index) + '">' +
				'<span>Image ' + String(index).padStart(2, '0') + '</span>' +
			'</button>';
	}

	function ensureImageModal() {
		var existing = document.getElementById('projectImageModal');
		if (existing) return existing;

		var modal = document.createElement('div');
		modal.id = 'projectImageModal';
		modal.className = 'a26-project-image-modal';
		modal.setAttribute('aria-hidden', 'true');
		modal.innerHTML =
			'<div class="a26-project-image-modal-backdrop" data-close-gallery-modal></div>' +
			'<div class="a26-project-image-modal-dialog" role="dialog" aria-modal="true" aria-label="Project image preview">' +
				'<button class="a26-project-image-modal-close" type="button" data-close-gallery-modal aria-label="Close image preview"><i class="las la-times"></i></button>' +
				'<button class="a26-project-image-modal-nav a26-project-image-modal-prev" type="button" data-gallery-prev aria-label="Previous image"><i class="las la-angle-left"></i></button>' +
				'<button class="a26-project-image-modal-nav a26-project-image-modal-next" type="button" data-gallery-next aria-label="Next image"><i class="las la-angle-right"></i></button>' +
				'<img src="" alt="Project image preview">' +
				'<div class="a26-project-image-modal-count"></div>' +
			'</div>';
		document.body.appendChild(modal);
		return modal;
	}

	function showModalImage(index) {
		var modal = ensureImageModal();
		var img = modal.querySelector('img');
		var count = modal.querySelector('.a26-project-image-modal-count');
		if (!galleryState.images.length) return;

		galleryState.index = (index + galleryState.images.length) % galleryState.images.length;
		var current = galleryState.images[galleryState.index];
		if (img) {
			img.src = current.src;
			img.alt = current.title || 'Project image preview';
		}
		if (count) {
			count.textContent = String(galleryState.index + 1).padStart(2, '0') + ' / ' + String(galleryState.images.length).padStart(2, '0');
		}
	}

	function openImageModal(index) {
		var modal = ensureImageModal();
		showModalImage(index);
		modal.classList.add('is-open');
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('a26-project-modal-open');
	}

	function changeModalImage(direction) {
		var modal = document.getElementById('projectImageModal');
		if (!modal || !modal.classList.contains('is-open')) return;
		showModalImage(galleryState.index + direction);
	}

	function closeImageModal() {
		var modal = document.getElementById('projectImageModal');
		if (!modal) return;
		modal.classList.remove('is-open');
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('a26-project-modal-open');
	}

	function renderProject(project) {
		var title = document.getElementById('projectDetailTitle');
		var content = document.getElementById('projectDetailContent');
		if (!content) return;

		if (!project) {
			content.className = 'a26-project-detail-empty';
			content.innerHTML = '<h2>Project not found</h2><p>This project is not available in the database.</p>';
			return;
		}

		document.title = project.project_name + ' | A26 DESIGNS';
		if (title) title.textContent = project.project_name;

		var heroImage = project.main_image;
		var galleryImages = project.sub_images || [];
		galleryState.images = galleryImages.map(function (src, index) {
			return {
				src: src,
				title: project.project_name + ' image ' + (index + 1)
			};
		});
		galleryState.index = 0;
		content.className = 'a26-project-detail-content';
		content.innerHTML =
			'<section class="a26-detail-hero-panel">' +
				'<div class="a26-detail-hero-copy">' +
					'<span>' + escapeHtml(project.category || 'Project') + '</span>' +
					'<h2>' + escapeHtml(project.project_name) + '</h2>' +
					'<p>' + escapeHtml(project.description) + '</p>' +
					'<div class="a26-detail-summary">' +
						'<span>' + galleryImages.length + ' Photos</span>' +
						'<span>Interior & Architecture</span>' +
					'</div>' +
				'</div>' +
				'<div class="a26-project-detail-hero">' +
					'<img src="' + heroImage + '" alt="' + escapeHtml(project.project_name) + '">' +
				'</div>' +
			'</section>' +
			'<div class="a26-project-gallery-head">' +
				'<span>Project Gallery</span>' +
				'<h3>More Images</h3>' +
			'</div>' +
			'<div class="a26-project-detail-gallery">' +
				(galleryImages.length ? galleryImages.map(function (src, index) {
					return imageBlock(src, index + 1, project.project_name);
				}).join('') : '<p class="a26-project-detail-empty-text">No sub images uploaded yet.</p>') +
			'</div>';
	}

		document.addEventListener('DOMContentLoaded', function () {
		var params = new URLSearchParams(window.location.search);
		var id = params.get('id');
		var content = document.getElementById('projectDetailContent');

		if (!id) {
			renderProject(null);
			return;
		}

		fetch('backend/api/projects.php?id=' + encodeURIComponent(id), { cache: 'no-store' })
			.then(function (response) { return response.json(); })
			.then(function (data) {
				renderProject(data && data.success ? data.project : null);
			})
			.catch(function () {
				if (content) {
					content.className = 'a26-project-detail-empty';
					content.innerHTML = '<h2>Unable to load project</h2><p>Please check the backend connection.</p>';
				}
			});

		document.addEventListener('click', function (event) {
			var imageButton = event.target.closest('[data-gallery-image]');
			if (imageButton) {
				openImageModal(parseInt(imageButton.getAttribute('data-gallery-index') || '0', 10));
				return;
			}

			if (event.target.closest('[data-gallery-prev]')) {
				changeModalImage(-1);
				return;
			}

			if (event.target.closest('[data-gallery-next]')) {
				changeModalImage(1);
				return;
			}

			if (event.target.closest('[data-close-gallery-modal]')) {
				closeImageModal();
			}
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				closeImageModal();
			} else if (event.key === 'ArrowLeft') {
				changeModalImage(-1);
			} else if (event.key === 'ArrowRight') {
				changeModalImage(1);
			}
		});
	});
}());
