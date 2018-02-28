jQuery(document).ready(function() {
  jQuery('nav a').click( function(){

    jQuery('.dibuix-cos').addClass('active');

    var isActive = false;
    if (jQuery(this).hasClass('active')) isActive = true;
    jQuery('nav a, .dibuix-cos').removeClass('active');
    if (!isActive) {
      jQuery(this).addClass('active');
      var target = jQuery(this).attr('data-target');
      jQuery('.dibuix-cos' + target).addClass('active');
    }
    else {
      jQuery('#inici').addClass('active');
    }
  });
  jQuery('.close').click( function(){
    jQuery('nav a, .dibuix-cos').removeClass('active');
  });
  jQuery('.btn-hover').mouseenter( function(){
    var target = jQuery(this).attr('data-target');
    jQuery('.content' + target).addClass('active');
  });
  jQuery('.btn-hover').mouseleave( function(){
    var target = jQuery(this).attr('data-target');
    jQuery('.content' + target).removeClass('active');
  });

});