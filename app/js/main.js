$(function() {
	// Select
	$('select').select2();

	// package-slider
	$('.content-slider').slick({
		slidesToShow: 3,
		slidesToScroll: 3,
		dots: true,
		arrows: false,
		responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
			}
		}]
	});
	$('.package-slider').slick({
		draggable: false
	});

	// holiday-slider
	$('.holiday-slider').slick({
		slidesToShow: 4,
		slidesToScroll: 4,
		responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
			}
		}]
	});

	$('.menu-toggle').click(function(event) {
		$('.menu-block').toggleClass('menu-active');
	});

	// Date Picker
	var today = new Date();
	flatpickr(".datepicker", {
		altInput: true,
		altFormat: "d/m/y",
		minDate: today,
		"mode": "range"
	});
});