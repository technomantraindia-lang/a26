/* JavaScript Document */
jQuery(document).ready(function() {
    'use strict';

	/*  testimonial one function by = owl.carousel.js */
	jQuery('.amenities-carousel').owlCarousel({
		loop:true,
		margin:0,
		nav:true,
		center:true,
		autoplaySpeed: 3000,
		navSpeed: 3000,
		paginationSpeed: 3000,
		slideSpeed: 3000,
		smartSpeed: 3000,
        autoplay: false,
		dots: false,
		stagePadding:50,
		navText: ['<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>'],
		responsive:{
			0:{
				items:1
			},
			
			480:{
				items:1
			},			
			
			767:{
				items:2
			},
			1000:{
				items:2
			}
		}
	})
	
	
	/*  testimonial one function by = owl.carousel.js */
	jQuery('.blog-carousel').owlCarousel({
		loop:true,
		margin:30,
		nav:true,
		autoplaySpeed: 3000,
		navSpeed: 3000,
		paginationSpeed: 3000,
		slideSpeed: 3000,
		smartSpeed: 3000,
        autoplay: false,
		dots: false,
		navText: ['<i class="las la-angle-left"></i>', '<i class="las la-angle-right"></i>'],
		responsive:{
			0:{
				items:1
			},
			
			480:{
				items:1,
				center:true,
				stagePadding:50,
			},			
			
			767:{
				items:2
			},
			1000:{
				items:3
			}
		}
	})
	
	/*  Blog post Carousel function by = owl.carousel.js */
	jQuery('.team-carousel').owlCarousel({
		loop:true,
		autoplay:true,
		margin:30,
		nav:true,
		autoplaySpeed: 1000,
		navSpeed: 1000,
		paginationSpeed: 1000,
		slideSpeed: 1000,
		dots: false,
		navText: ['<i class="la la-long-arrow-left"></i>', '<i class="la la-long-arrow-right"></i>'],
		responsive:{
			0:{
				items:1,
				stagePadding: 0
			},
			480:{
				items:2
			},			
			991:{
				items:3
			},
			1200:{
				items:4
			}
		}
	})
	/*  Blog post Carousel function by = owl.carousel.js */
	jQuery('.client-logo').owlCarousel({
		loop:true,
		autoplay:true,
		margin:20,
		nav:true,
		autoplaySpeed: 1000,
		navSpeed: 1000,
		paginationSpeed: 1000,
		slideSpeed: 1000,
		dots: false,
		navText: ['<i class="la la-long-arrow-left"></i>', '<i class="la la-long-arrow-right"></i>'],
		responsive:{
			0:{
				items:2
			},
			480:{
				items:4
			},			
			991:{
				items:5
			},
			1000:{
				items:6
			}
		}
	})
	/* testimonial two function by = owl.carousel.js */
	jQuery('.testimonial-two-dots-bx').owlCarousel({
		loop:true,
		autoplay:false,
		margin:30,
		nav:true,
		dots: true,
		navText: ['<i class="flaticon-left-arrow"></i>', '<i class="flaticon-right-arrow"></i>'],
		responsive:{
			0:{
				items:1
			},
			
			480:{
				items:1
			},			
			
			991:{
				items:2
			},
			1000:{
				items:2
			}
		}
	})
	
	/* testimonial two function by = owl.carousel.js */
	jQuery('.exhibition-carousel').owlCarousel({
		loop:true,
		autoplay:true,
		right:true,
		margin:0,
		nav:true,
		dots: true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive:{
			0:{
				items:1
			},
			
			480:{
				items:1
			},			
			
			991:{
				items:1
			},
			1000:{
				items:1
			}
		}
	})
	
	/* testimonial two function by = owl.carousel.js */
	jQuery('.project-carousel-1').owlCarousel({
		loop:true,
		autoplay:true,
		right:true,
		margin:0,
		nav:true,
		autoplaySpeed: 1000,
		navSpeed: 1000,
		paginationSpeed: 1000,
		slideSpeed: 1000,
		dots: true,
		navText: ['<i class="la la-arrow-left"></i> Prev', 'Next <i class="la la-arrow-right"></i>'],
		responsive:{
			0:{
				items:1
			},
			
			480:{
				items:1
			},			
			
			991:{
				items:1
			},
			1000:{
				items:1
			}
		}
	})
	
	/* image-carousel function by = owl.carousel.js */
	jQuery('.project-carousel').owlCarousel({
		loop:true,
		center:true,
		margin:30,
		nav:true,
		dots: false,
		navText: ['<i class="la la-long-arrow-left"></i>', '<i class="la la-long-arrow-right"></i>'],
		responsive:{
			0:{
				items:1,
			},
			480:{
				items:2,
				margin:20
			},			
			1024:{
				items:3
			},
			1200:{
				items:2
			},
			1400:{
				items:2
			}
		}
	})
	
});


/* Window Resize START */
jQuery(window).on('resize',function () {
	'use strict'; 
	if(jQuery('.main-slider').length > 0)
	{
		setTimeout(function(){
			jQuery('.main-slider').data('owl.carousel')._invalidated.width = true;
			jQuery('.main-slider').trigger('refresh.owl.carousel');
		}, 2000); 
	}
	
});

/* Document .ready END */