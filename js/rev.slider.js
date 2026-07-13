var dzrevapi;
var dzQuery = jQuery;

function dz_rev_slider_1() {
	if (dzQuery("#rev_slider_1164_1").revolution === undefined) {
		revslider_showDoubleJqueryError("#rev_slider_1164_1");
	} else {
		dzrevapi = dzQuery("#rev_slider_1164_1").show().revolution({
			sliderType: "standard",
			jsFileLocation: "plugins/revolution/revolution/js/",
			sliderLayout: "auto",
			dottedOverlay: "none",
			delay: 9000,
			navigation: {
				keyboardNavigation: "off",
				keyboard_direction: "horizontal",
				mouseScrollNavigation: "off",
				mouseScrollReverse: "default",
				onHoverStop: "off",
				bullets: {
					enable: true,
					hide_onmobile: true,
					hide_under: 300,
					style: "hermes",
					hide_onleave: false,
					direction: "vertical",
					container: "layergrid",
					h_align: "left",
					v_align: "center",
					h_offset: -100,
					v_offset: 0,
					space: 2,
					tmp: ''
				}
			},
			responsiveLevels: [1240, 1025, 778, 480],
			visibilityLevels: [1240, 1025, 778, 480],
			gridwidth: [1240, 1025, 778, 480],
			gridheight: [720, 680, 620, 560],
			lazyType: "single",
			parallax: {
				type: "scroll",
				origo: "slidercenter",
				speed: 400,
				levels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 46, 47, 48, 49, 50, 51, 55]
			},
			shadow: 0,
			spinner: "off",
			autoHeight: "off",
			fullScreenAutoWidth: "off",
			fullScreenAlignForce: "off",
			fullScreenOffsetContainer: "",
			disableProgressBar: "on",
			hideThumbsOnMobile: "off",
			hideSliderAtLimit: 0,
			hideCaptionAtLimit: 0,
			hideAllCaptionAtLilmit: 0,
			debugMode: false,
			fallbacks: {
				simplifyAll: "off",
				nextSlideOnWindowFocus: "off",
				disableFocusListener: false
			}
		});
	}
}
