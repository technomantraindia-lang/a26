(function ($) {
	'use strict';

	var modalHtml = [
		'<div class="a26-enquiry-overlay" id="a26EnquiryModal" aria-hidden="true">',
		'  <div class="a26-enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="a26EnquiryTitle">',
		'    <div class="a26-enquiry-layout">',
		'      <aside class="a26-enquiry-sidebar">',
		'        <div class="a26-enquiry-sidebar-glow" aria-hidden="true"></div>',
		'        <div class="a26-enquiry-brand">',
		'          <div class="a26-enquiry-badge"><i class="las la-drafting-compass" aria-hidden="true"></i></div>',
		'          <div class="a26-enquiry-visual">',
		'            <img src="images/a26-premium/exterior-modern-home.jpg" alt="A26 Designs architecture project">',
		'          </div>',
		'          <p class="a26-enquiry-kicker">Trusted Partner In</p>',
		'          <h3>Architecture · Interiors · Turnkey Solutions</h3>',
		'        </div>',
		'        <div class="a26-enquiry-contacts">',
		'          <div class="a26-enquiry-contact-card">',
		'            <span class="a26-enquiry-contact-icon"><i class="las la-phone" aria-hidden="true"></i></span>',
		'            <div><span class="a26-enquiry-contact-label">Call Us</span><a href="tel:+919978120010">9978120010</a></div>',
		'          </div>',
		'          <div class="a26-enquiry-contact-card">',
		'            <span class="a26-enquiry-contact-icon"><i class="las la-envelope" aria-hidden="true"></i></span>',
		'            <div><span class="a26-enquiry-contact-label">Email Us</span><a href="mailto:a26designs1@gmail.com">a26designs1@gmail.com</a></div>',
		'          </div>',
		'          <div class="a26-enquiry-contact-card">',
		'            <span class="a26-enquiry-contact-icon"><i class="las la-shield-alt" aria-hidden="true"></i></span>',
		'            <div><span class="a26-enquiry-contact-label">Design Support</span><span>Planning and project enquiries</span></div>',
		'          </div>',
		'        </div>',
		'      </aside>',
		'      <div class="a26-enquiry-form-panel">',
		'        <button type="button" class="a26-enquiry-close" aria-label="Close enquiry form"><i class="las la-times"></i></button>',
		'        <h2 id="a26EnquiryTitle">Get in Touch</h2>',
		'        <p class="a26-enquiry-subtitle">Send us your requirement and our team will get back to you shortly.</p>',
		'        <div class="a26-enquiry-form-msg dzFormMsg"></div>',
		'        <form class="a26-enquiry-form" action="script/contact_smtp.php" method="post" novalidate>',
		'          <input type="hidden" name="dzToDo" value="Contact">',
		'          <input type="hidden" name="reCaptchaEnable" value="0">',
		'          <div class="a26-enquiry-grid">',
		'            <label class="a26-enquiry-field">',
		'              <i class="las la-user" aria-hidden="true"></i>',
		'              <input type="text" name="dzFirstName" required placeholder="Full Name">',
		'            </label>',
		'            <label class="a26-enquiry-field">',
		'              <i class="las la-envelope" aria-hidden="true"></i>',
		'              <input type="email" name="dzEmail" required placeholder="Email Address">',
		'            </label>',
		'            <label class="a26-enquiry-field">',
		'              <i class="las la-phone" aria-hidden="true"></i>',
		'              <input type="text" name="dzPhoneNumber" required placeholder="Phone Number">',
		'            </label>',
		'            <label class="a26-enquiry-field">',
		'              <i class="las la-building" aria-hidden="true"></i>',
		'              <input type="text" name="dzOther[company_name]" placeholder="Company Name">',
		'            </label>',
		'            <label class="a26-enquiry-field a26-enquiry-field-wide a26-enquiry-field-select">',
		'              <i class="las la-briefcase" aria-hidden="true"></i>',
		'              <select class="a26-enquiry-select" name="dzOther[service]" required>',
		'                <option value="" disabled selected hidden>Select Service</option>',
		'                <option>Architectural Design</option>',
		'                <option>Interior Design</option>',
		'                <option>House Planning</option>',
		'                <option>Elevation Design</option>',
		'                <option>Turnkey Project</option>',
		'                <option>3D Visualization</option>',
		'                <option>Consultation</option>',
		'              </select>',
		'            </label>',
		'            <label class="a26-enquiry-field a26-enquiry-field-wide">',
		'              <i class="las la-file-alt" aria-hidden="true"></i>',
		'              <input type="text" name="dzOther[subject]" placeholder="Subject">',
		'            </label>',
		'            <label class="a26-enquiry-field a26-enquiry-field-wide a26-enquiry-field-message">',
		'              <i class="las la-pencil-alt" aria-hidden="true"></i>',
		'              <textarea name="dzMessage" rows="4" required placeholder="Message"></textarea>',
		'            </label>',
		'          </div>',
		'          <button type="submit" class="a26-enquiry-submit">Send Enquiry <i class="las la-arrow-right" aria-hidden="true"></i></button>',
		'        </form>',
		'        <p class="a26-enquiry-note"><i class="las la-shield-alt" aria-hidden="true"></i> We\'ll respond within 24 hours</p>',
		'      </div>',
		'    </div>',
		'  </div>',
		'</div>'
	].join('');

	function openModal() {
		var $overlay = $('#a26EnquiryModal');
		$overlay.addClass('is-open').attr('aria-hidden', 'false');
		$('body').addClass('a26-enquiry-open');
		setTimeout(function () {
			$overlay.find('input[name="dzFirstName"]').trigger('focus');
		}, 250);
	}

	function closeModal() {
		var $overlay = $('#a26EnquiryModal');
		$overlay.removeClass('is-open').attr('aria-hidden', 'true');
		$('body').removeClass('a26-enquiry-open');
	}

	function showMessage(type, text) {
		var klass = type === 'success' ? 'alert-success' : 'alert-danger';
		$('#a26EnquiryModal .a26-enquiry-form-msg').html('<div class="alert ' + klass + '">' + text + '</div>');
	}

	$(function () {
		if (!$('#a26EnquiryModal').length) {
			$('body').append(modalHtml);
		}

		var $serviceSelect = $('#a26EnquiryModal select.a26-enquiry-select');
		if ($serviceSelect.length && $serviceSelect.parent().hasClass('bootstrap-select')) {
			$serviceSelect.selectpicker('destroy');
		}

		$(document).on('click', '.a26-enquire-trigger', function (e) {
			e.preventDefault();
			openModal();
		});

		$(document).on('click', '#a26EnquiryModal', function (e) {
			if ($(e.target).is('#a26EnquiryModal')) {
				closeModal();
			}
		});

		$(document).on('click', '.a26-enquiry-close', function () {
			closeModal();
		});

		$(document).on('keydown', function (e) {
			if (e.key === 'Escape' && $('#a26EnquiryModal').hasClass('is-open')) {
				closeModal();
			}
		});

		$(document).on('submit', '#a26EnquiryModal .a26-enquiry-form', function (e) {
			e.preventDefault();
			var $form = $(this);
			var $submit = $form.find('.a26-enquiry-submit');

			showMessage('success', 'Submitting...');
			$submit.prop('disabled', true);

			$.ajax({
				method: 'POST',
				url: $form.attr('action'),
				data: $form.serialize(),
				dataType: 'json'
			}).done(function (res) {
				if (res && res.status === 1) {
					showMessage('success', res.msg || 'Thank you! We will contact you shortly.');
					$form[0].reset();
					setTimeout(closeModal, 2200);
				} else {
					showMessage('error', (res && res.msg) ? res.msg : 'Something went wrong. Please try again.');
				}
			}).fail(function () {
				showMessage('error', 'Unable to send enquiry right now. Please call 9978120010.');
			}).always(function () {
				$submit.prop('disabled', false);
			});
		});
	});
})(jQuery);
