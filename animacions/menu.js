$(document).ready(function() {
	$(".btn").click(function() {
		$(".btn").removeClass("active");
		if(!$(this).hasClass("disable")) $(this).toggleClass("active");
	});
 


  if(jQuery(window).width() >= 1024) {
    jQuery('.btn').click(false);

    jQuery('.btn').hover(function() {
      $(".btn").removeClass("active");
      if(!$(this).hasClass("disable")) $(this).toggleClass("active");
    });
    jQuery('.btn').mouseleave(function() {
      $(".btn").removeClass("active");
      $(this).removeClass("active");
    });
  }
});