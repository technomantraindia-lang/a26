(function ($) {
	'use strict';

	var WHATSAPP_NUMBER = '919978120010';

	function getFieldValue(form, name) {
		var field = form.querySelector('[name="' + name + '"]');
		if (!field) {
			return '';
		}
		return String(field.value || '').trim();
	}

	function buildEnquiryMessage(form) {
		var lines = [
			'Hi A26 DESIGNS, I would like to enquire.',
			'',
			'Name: ' + getFieldValue(form, 'dzFirstName'),
			'Phone: ' + getFieldValue(form, 'dzPhoneNumber'),
			'Email: ' + getFieldValue(form, 'dzEmail')
		];

		var company = getFieldValue(form, 'dzOther[company_name]');
		var service = getFieldValue(form, 'dzOther[service]') || getFieldValue(form, 'dzService');
		var subject = getFieldValue(form, 'dzOther[subject]');
		var location = getFieldValue(form, 'dzLocation');
		var message = getFieldValue(form, 'dzMessage');

		if (company) lines.push('Company: ' + company);
		if (service) lines.push('Service: ' + service);
		if (subject) lines.push('Subject: ' + subject);
		if (location) lines.push('Location: ' + location);
		if (message) {
			lines.push('');
			lines.push('Message:');
			lines.push(message);
		}

		return lines.join('\n');
	}

	function openWhatsApp(message) {
		window.open(
			'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message),
			'_blank',
			'noopener,noreferrer'
		);
	}

	$(document).on('submit', 'form.contact-box', function (e) {
		e.preventDefault();
		var form = this;
		var $msg = $(form).find('.dzFormMsg');
		var $submit = $(form).find('[type="submit"]');

		$msg.html('<div class="alert alert-success">Opening WhatsApp...</div>');
		$submit.prop('disabled', true);

		openWhatsApp(buildEnquiryMessage(form));
		form.reset();

		$msg.html('<div class="alert alert-success">Thank you! Continue on WhatsApp to send your enquiry.</div>');
		$submit.prop('disabled', false);

		window.setTimeout(function () {
			$msg.find('.alert').fadeOut(400, function () {
				$(this).remove();
			});
		}, 4000);
	});
})(jQuery);
