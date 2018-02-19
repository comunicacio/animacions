$(document).ready(function() {
	$(".info-link").click(function() {
		$(".info-txt").toggleClass("active");
	});
	$(".rellotge1-link").click(function() {
		$(".Rellotge_1").toggleClass("active");
		$(".Rellotge_2").removeClass("active").toggleClass("disable");
		$(".Rellotge_3").removeClass("active").toggleClass("disable");
	});
	$(".rellotge2-link , .rellotge2-link-active").click(function() {
		$(".Rellotge_2").toggleClass("active");
		$(".Rellotge_1").removeClass("active").toggleClass("disable");
		$(".Rellotge_3").removeClass("active").toggleClass("disable");
	});
	$(".rellotge3-link").click(function() {
		$(".Rellotge_3").toggleClass("active");
		$(".Rellotge_1").removeClass("active").toggleClass("disable");
		$(".Rellotge_2").removeClass("active").toggleClass("disable");
	});


	$(".close-link").click(function() {
		$(".info-txt").removeClass("active");
	});
	$(".close-link_1_").click(function() {
		$(".Rellotge_1").removeClass("active");
		$(".Rellotge_2").removeClass("active").removeClass("disable");
		$(".Rellotge_3").removeClass("active").removeClass("disable");
	});
	$(".close-link_2_").click(function() {
		$(".Rellotge_2").removeClass("active");
		$(".Rellotge_1").removeClass("active").removeClass("disable");
		$(".Rellotge_3").removeClass("active").removeClass("disable");
	});
	$(".close-link_3_").click(function() {
		$(".Rellotge_3").removeClass("active");
		$(".Rellotge_1").removeClass("active").removeClass("disable");
		$(".Rellotge_2").removeClass("active").removeClass("disable");
	});
});