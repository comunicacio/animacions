jQuery(document).ready(function() {
	jQuery(".btn").click(function() {
		jQuery(this).toggleClass("active");
	});

	if(jQuery(window).width() >= 800) {
    
		jQuery('.btn').hover(function() {
			jQuery(this).addClass("active");
		});

		jQuery('.btn').mouseleave(function() {
			jQuery(this).removeClass("active");
		});
	}
  
	jQuery('.btn.disable').click(false);
	
});