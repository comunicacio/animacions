$(document).ready(function() {
	$(".toggle-header , .toggle-btn").click(function() {
		$(this).parent().toggleClass("active");
	});
});