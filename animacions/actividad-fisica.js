jQuery(document).ready(function() {
	jQuery(".info-link").click(function() {
		jQuery(".info-txt").toggleClass("active");
	});
	jQuery(".rellotge1-link").click(function() {
		jQuery(".Rellotge_1").toggleClass("active");
		jQuery(".Rellotge_2").removeClass("active").toggleClass("disable");
		jQuery(".Rellotge_3").removeClass("active").toggleClass("disable");
	});
	jQuery(".rellotge2-link , .rellotge2-link-active").click(function() {
		jQuery(".Rellotge_2").toggleClass("active");
		jQuery(".Rellotge_1").removeClass("active").toggleClass("disable");
		jQuery(".Rellotge_3").removeClass("active").toggleClass("disable");
	});
	jQuery(".rellotge3-link").click(function() {
		jQuery(".Rellotge_3").toggleClass("active");
		jQuery(".Rellotge_1").removeClass("active").toggleClass("disable");
		jQuery(".Rellotge_2").removeClass("active").toggleClass("disable");
	});


	jQuery(".close-link").click(function() {
		jQuery(".info-txt").removeClass("active");
	});
	jQuery(".close-link_1_").click(function() {
		jQuery(".Rellotge_1").removeClass("active");
		jQuery(".Rellotge_2").removeClass("active").removeClass("disable");
		jQuery(".Rellotge_3").removeClass("active").removeClass("disable");
	});
	jQuery(".close-link_2_").click(function() {
		jQuery(".Rellotge_2").removeClass("active");
		jQuery(".Rellotge_1").removeClass("active").removeClass("disable");
		jQuery(".Rellotge_3").removeClass("active").removeClass("disable");
	});
	jQuery(".close-link_3_").click(function() {
		jQuery(".Rellotge_3").removeClass("active");
		jQuery(".Rellotge_1").removeClass("active").removeClass("disable");
		jQuery(".Rellotge_2").removeClass("active").removeClass("disable");
	});
});