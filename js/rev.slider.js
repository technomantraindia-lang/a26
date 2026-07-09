var dzrevapi;
var dzQuery =jQuery;
function dz_rev_slider_1(){
	if(dzQuery("#rev_slider_1164_1").revolution == undefined){
		revslider_showDoubleJqueryError("#rev_slider_1164_1");
	}else{
		dzrevapi = dzQuery("#rev_slider_1164_1").show().revolution({
			sliderType:"standard",
			jsFileLocation:"plugins/revolution/revolution/js/",
			sliderLayout:"fullscreen",
			dottedOverlay:"none",
			delay:9000,
			navigation: {
				keyboardNavigation:"off",
				keyboard_direction: "horizontal",
				mouseScrollNavigation:"off",
				mouseScrollReverse:"default",
				onHoverStop:"off",
				bullets: {
					enable:true,
					hide_onmobile:true,
					hide_under:300,
					style:"hermes",
					hide_onleave:false,
					direction:"vertical",
					container:"layergrid",
					h_align:"left",
					v_align:"center",
					h_offset:-100,
					v_offset:0,
					space:2,
					tmp:''
				}
			},
			responsiveLevels:[1240,1025,778,480],
			visibilityLevels:[1240,1025,778,480],
			gridwidth:[1240,1025,778,480],
			gridheight:[970,970,960,720],
			lazyType:"single",
			parallax: {
				type:"scroll",
				origo:"slidercenter",
				speed:400,
				levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
				type:"scroll",
			},
			shadow:0,
			spinner:"off",
			autoHeight:"off",
			fullScreenAutoWidth:"off",
			fullScreenAlignForce:"off",
			fullScreenOffsetContainer: "",
			disableProgressBar:"on",
			hideThumbsOnMobile:"off",
			hideSliderAtLimit:0,
			hideCaptionAtLimit:0,
			hideAllCaptionAtLilmit:0,
			debugMode:false,
			fallbacks: {
				simplifyAll:"off",
				nextSlideOnWindowFocus:"off",
				disableFocusListener:false,
			}
		});
	}
}
function dz_rev_slider_2(){
	if(dzQuery("#rev_slider_11_1").revolution == undefined){
		revslider_showDoubleJqueryError("#rev_slider_11_1");
	}else{
		dzrevapi = dzQuery("#rev_slider_11_1").show().revolution({
			sliderType:"standard",
			sliderLayout:"fullscreen",
			dottedOverlay:"none",
			delay:5000,
			navigation: {
				onHoverStop:"off",
			},
			responsiveLevels:[1240,1240,778,778],
			visibilityLevels:[1240,1240,778,778],
			gridwidth:[1640,1640,778,778],
			gridheight:[768,768,960,960],
			lazyType:"none",
			parallax: {
				type:"mouse",
				origo:"enterpoint",
				speed:400,
			  speedbg:0,
			  speedls:0,
				levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
			},
			shadow:0,
			spinner:"spinner0",
			stopLoop:"off",
			shuffle:"off",
			autoHeight:"off",
			fullScreenOffsetContainer: "",
			disableProgressBar:"on",
			hideThumbsOnMobile:"off",
			hideSliderAtLimit:0,
			hideCaptionAtLimit:0,
			hideAllCaptionAtLilmit:0,
			debugMode:false,
			fallbacks: {
				simplifyAll:"off",
				nextSlideOnWindowFocus:"off",
				disableFocusListener:false,
			}
		});
	}
}
function dz_rev_slider_3(){
	if(dzQuery("#rev_slider_1077_1").revolution == undefined){
		revslider_showDoubleJqueryError("#rev_slider_1077_1");
	}else{
		dzrevapi = dzQuery("#rev_slider_1077_1").show().revolution({
			sliderType:"standard",
			jsFileLocation:"plugins/revolution/revolution/js/",
			sliderLayout:"fullscreen",
			dottedOverlay:"none",
			delay:5000,
			navigation: {
				keyboardNavigation:"off",
				keyboard_direction: "horizontal",
				mouseScrollNavigation:"off",
				mouseScrollReverse:"default",
				onHoverStop:"off",
				touch:{
					touchenabled:"on",
					swipe_threshold: 75,
					swipe_min_touches: 1,
					swipe_direction: "horizontal",
					drag_block_vertical: false
				}
				,
				bullets: {
					enable:true,
					hide_onmobile:true,
					hide_under:960,
					style:"zeus",
					hide_onleave:false,
					direction:"horizontal",
					h_align:"right",
					v_align:"bottom",
					h_offset:80,
					v_offset:50,
					space:5,
					tmp:'<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span><span class="tp-bullet-title">{{title}}</span>'
				}
			},
			responsiveLevels:[1240,1024,778,480],
			visibilityLevels:[1240,1024,778,480],
			gridwidth:[1240,1024,778,480],
			gridheight:[868,768,960,720],
			lazyType:"none",
			parallax: {
				type:"mouse",
				origo:"slidercenter",
				speed:2000,
				levels:[2,3,4,5,6,7,12,16,10,50,46,47,48,49,50,55],
				type:"mouse",
				disable_onmobile:"on"
			},
			shadow:0,
			spinner:"off",
			stopLoop:"on",
			stopAfterLoops:-1,
			stopAtSlide:1,
			shuffle:"off",
			autoHeight:"off",
			fullScreenAutoWidth:"off",
			fullScreenAlignForce:"off",
			fullScreenOffsetContainer: ".site-header",
			fullScreenOffset: "0px",
			disableProgressBar:"on",
			hideThumbsOnMobile:"off",
			hideSliderAtLimit:0,
			hideCaptionAtLimit:0,
			hideAllCaptionAtLilmit:0,
			debugMode:false,
			fallbacks: {
				simplifyAll:"off",
				nextSlideOnWindowFocus:"off",
				disableFocusListener:false,
			}
		});
		var newCall = new Object(),
		cslide;

		newCall.callback = function() { 
		var proc = revapi1077.revgetparallaxproc(),
		fade = 1+proc,
		scale = 1+(Math.abs(proc)/10);

		punchgs.TweenLite.set(revapi1077.find('.slotholder, .rs-background-video-layer'),{opacity:fade,scale:scale});		
		}
		newCall.inmodule = "parallax";
		newCall.atposition = "start";

		/*revapi1077.bind("revolution.slide.onloaded",function (e) {
		revapi1077.revaddcallback(newCall);
		});*/				
	}
}
