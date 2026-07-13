(function ($) {
	'use strict';

	$(document).ready(function () {
		if ($('.amenities-carousel').length) {
			$('.amenities-carousel').owlCarousel({
				loop: true,
				margin: 0,
				nav: true,
				center: true,
				autoplay: false,
				dots: false,
				stagePadding: 50,
				navText: ['<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>'],
				responsive: {
					0: { items: 1 },
					480: { items: 1 },
					767: { items: 2 },
					1000: { items: 2 }
				}
			});
		}

		if ($('.blog-carousel').length) {
			$('.blog-carousel').owlCarousel({
				loop: true,
				margin: 30,
				nav: true,
				autoplay: false,
				dots: false,
				navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
				responsive: {
					0: { items: 1 },
					480: { items: 1, center: true, stagePadding: 50 },
					767: { items: 2 },
					1000: { items: 3 }
				}
			});
		}
	});

	(function initTestimonials() {
		var carousel = document.querySelector('.a26-testimonials-carousel');
		if (!carousel) return;

		var track = carousel.querySelector('.a26-testimonials-track');
		var stage = carousel.querySelector('.a26-testimonials-stage');
		var dots = carousel.querySelectorAll('.a26-testimonials-dot');
		var prevBtn = carousel.querySelector('.a26-testimonials-prev');
		var nextBtn = carousel.querySelector('.a26-testimonials-next');
		var originals = Array.prototype.slice.call(track.querySelectorAll('.a26-testimonial-item'));
		var total = originals.length;
		var activePos = 1;
		var isAnimating = false;
		var autoplayTimer = null;
		var autoplayDelay = 5000;
		var transitionMs = 550;

		if (total < 2) return;

		var firstClone = originals[0].cloneNode(true);
		var lastClone = originals[total - 1].cloneNode(true);
		firstClone.classList.add('is-clone');
		lastClone.classList.add('is-clone');
		track.insertBefore(lastClone, originals[0]);
		track.appendChild(firstClone);

		var items = track.querySelectorAll('.a26-testimonial-item');

		function getLogicalIndex(pos) {
			if (pos === 0) return total - 1;
			if (pos === items.length - 1) return 0;
			return pos - 1;
		}

		function updateSlides() {
			items.forEach(function (item, i) {
				item.classList.remove('is-center', 'is-left', 'is-right', 'is-far');
				if (i === activePos) {
					item.classList.add('is-center');
				} else if (i === activePos - 1) {
					item.classList.add('is-left');
				} else if (i === activePos + 1) {
					item.classList.add('is-right');
				} else {
					item.classList.add('is-far');
				}
			});
			var logical = getLogicalIndex(activePos);
			dots.forEach(function (dot, i) {
				dot.classList.toggle('is-active', i === logical);
			});
		}

		function centerTrack(animate) {
			var centerItem = items[activePos];
			if (!centerItem || !stage || !track) return;
			var offset = centerItem.offsetLeft - (stage.offsetWidth / 2) + (centerItem.offsetWidth / 2);
			track.style.transition = animate === false ? 'none' : 'transform ' + (transitionMs / 1000) + 's cubic-bezier(0.4, 0, 0.2, 1)';
			track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';
		}

		function afterTransition(fn) {
			window.setTimeout(fn, transitionMs + 30);
		}

		function resetIfNeeded() {
			if (activePos === items.length - 1) {
				activePos = 1;
				updateSlides();
				centerTrack(false);
			} else if (activePos === 0) {
				activePos = total;
				updateSlides();
				centerTrack(false);
			}
		}

		function moveNext() {
			if (isAnimating) return;
			isAnimating = true;
			activePos += 1;
			updateSlides();
			centerTrack(true);
			afterTransition(function () {
				resetIfNeeded();
				isAnimating = false;
			});
		}

		function movePrev() {
			if (isAnimating) return;
			isAnimating = true;
			activePos -= 1;
			updateSlides();
			centerTrack(true);
			afterTransition(function () {
				resetIfNeeded();
				isAnimating = false;
			});
		}

		function goToSlideForward(targetIndex) {
			var current = getLogicalIndex(activePos);
			if (targetIndex === current || isAnimating) return;

			var steps = (targetIndex - current + total) % total;
			if (!steps) return;

			stopAutoplay();

			var completed = 0;
			function step() {
				if (completed >= steps) {
					startAutoplay();
					return;
				}
				moveNext();
				completed += 1;
				if (completed < steps) {
					afterTransition(step);
				} else {
					afterTransition(startAutoplay);
				}
			}
			step();
		}

		function startAutoplay() {
			stopAutoplay();
			autoplayTimer = window.setInterval(moveNext, autoplayDelay);
		}

		function stopAutoplay() {
			if (autoplayTimer) {
				window.clearInterval(autoplayTimer);
				autoplayTimer = null;
			}
		}

		if (prevBtn) prevBtn.addEventListener('click', function () { stopAutoplay(); movePrev(); startAutoplay(); });
		if (nextBtn) nextBtn.addEventListener('click', function () { stopAutoplay(); moveNext(); startAutoplay(); });

		dots.forEach(function (dot) {
			dot.addEventListener('click', function () {
				goToSlideForward(Number(dot.getAttribute('data-index')));
			});
		});

		carousel.addEventListener('mouseenter', stopAutoplay);
		carousel.addEventListener('mouseleave', startAutoplay);
		window.addEventListener('resize', function () { centerTrack(false); });

		updateSlides();
		window.requestAnimationFrame(function () { centerTrack(false); });
		startAutoplay();
	}());

	(function initCounters() {
		var counterWrap = document.querySelector('.a26-counter-wrap');
		var counters = document.querySelectorAll('.a26-counter-number');
		var hasStarted = false;

		function runCounters() {
			if (hasStarted) return;
			hasStarted = true;
			counters.forEach(function (counter) {
				var target = Number(counter.getAttribute('data-target'));
				var startTime = null;
				var duration = 1600;
				function updateCounter(timestamp) {
					if (!startTime) startTime = timestamp;
					var progress = Math.min((timestamp - startTime) / duration, 1);
					var eased = 1 - Math.pow(1 - progress, 3);
					counter.textContent = Math.floor(eased * target);
					if (progress < 1) {
						window.requestAnimationFrame(updateCounter);
					} else {
						counter.textContent = target;
					}
				}
				window.requestAnimationFrame(updateCounter);
			});
		}

		if ('IntersectionObserver' in window && counterWrap) {
			var observer = new IntersectionObserver(function (entries) {
				if (entries[0].isIntersecting) {
					runCounters();
					observer.disconnect();
				}
			}, { threshold: 0.3 });
			observer.observe(counterWrap);
		} else {
			runCounters();
		}
	}());

	(function initServiceCards() {
		var cards = document.querySelectorAll('#ourServices.home-services .service-box');
		cards.forEach(function (card) {
			card.setAttribute('tabindex', '0');
			card.setAttribute('role', 'button');
			card.addEventListener('click', function () {
				var wasActive = card.classList.contains('is-active');
				cards.forEach(function (item) {
					item.classList.remove('is-active');
				});
				if (!wasActive) {
					card.classList.add('is-active');
				}
			});
		});
	}());

	function observeInView(elementId, className, threshold) {
		var section = document.getElementById(elementId);
		if (!section) return;
		if ('IntersectionObserver' in window) {
			var observer = new IntersectionObserver(function (entries) {
				if (entries[0].isIntersecting) {
					section.classList.add(className);
					observer.disconnect();
				}
			}, { threshold: threshold });
			observer.observe(section);
		} else {
			section.classList.add(className);
		}
	}

	observeInView('workingProcess', 'process-in-view', 0.18);
	observeInView('specifications', 'spec-in-view', 0.18);
})(jQuery);
