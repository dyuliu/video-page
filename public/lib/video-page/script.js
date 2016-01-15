
/*  Table of Contents 

01. MENU ACTIVATION
02. SUB-MENU HOVER
03. IE7 Z-INDEX FIX
04. LIGHTBOX ACTIVATION
05. JQUERY TABS
06. TRANSPARENCY OPACITY ON HOVER
07. HOVER FOR ICONS

*/

/*
=============================================== 01. MENU ACTIVATION  ===============================================
*/
jQuery(function(){
	$("ul.sf-menu").supersubs({ 
	        minWidth:    5,   // minimum width of sub-menus in em units 
	        maxWidth:    25,   // maximum width of sub-menus in em units 
	        extraWidth:  1     // extra width can ensure lines don't sometimes turn over 
	                           // due to slight rounding differences and font-family 
	    }).superfish({ 
			animation: {height:'show'},   // slide-down effect without fade-in 
			speed:         'normal',           // speed of the animation. Equivalent to second parameter of jQuery’s .animate() method 
			autoArrows:    true,               // if true, arrow mark-up generated automatically = cleaner source code at expense of initialisation performance 
			dropShadows:   true,               // completely disable drop shadows by setting this to false 
			delay:     400               // 400 ms delay on timeout
		});
});


/*
=============================================== 02. SUB-MENU HOVER  ===============================================
*/
jQuery(function(){
	$('nav ul.sf-menu ul li a').mouseover(function () {
	$(this).stop().animate({  paddingLeft: "22px" }, 150 );
    });
	$('nav ul.sf-menu ul li a').mouseout(function () {
	$(this).stop().animate({ paddingLeft: "12px" }, 150 );
    });
});

/*
=============================================== 03. IE7 Z-INDEX FIX  ===============================================
*/
jQuery(document).ready(function() {
            //fix ie 7 and less quirks issue
            if (($.browser.msie) && (parseInt($.browser.version, 10) <= 7)) {
                $(function() {
                    var zIndexNumber = 1000;
                    $('div').each(function() {
                        $(this).css('zIndex', zIndexNumber);
                        zIndexNumber -= 10;
                    });
                });
            }
        });

/*
=============================================== 04. LIGHTBOX ACTIVATION  ===============================================
*/
jQuery(document).ready(function($) {
		$("a[rel^='prettyPhoto']").prettyPhoto({
			animation_speed: 'fast', /* fast/slow/normal */
			slideshow: 5000, /* false OR interval time in ms */
			autoplay_slideshow: false, /* true/false */
			opacity: 0.80, /* Value between 0 and 1 */
			show_title: true, /* true/false */
			allow_resize: true, /* Resize the photos bigger than viewport. true/false */
			default_width: 500,
			default_height: 344,
			counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
			theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
			horizontal_padding: 20, /* The padding on each side of the picture */
			hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
			wmode: 'opaque', /* Set the flash wmode attribute */
			autoplay: false, /* Automatically start videos: True/False */
			modal: false, /* If set to true, only the close button will close the window */
			deeplinking: false, /* Allow prettyPhoto to update the url to enable deeplinking. */
			overlay_gallery: false, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
			keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
			ie6_fallback: true,
			social_tools: '' /* html or false to disable  <div class="pp_social"><div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="http://www.facebook.com/plugins/like.php?locale=en_US&href='+location.href+'&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div></div> */
		});
});


/*
=============================================== 05. JQUERY TABS  ===============================================
*/

jQuery(document).ready(function($) {  
	$('.tabs').easytabs({
	    tabActiveClass: "selected-tab",
		animate: true
	  });
  });



/*
=============================================== 06. TRANSPARENCY OPACITY ON HOVER  ===============================================
*/
jQuery(document).ready(function($) {  
            $('.transparent').each(function() {
                $(this).hover(
                    function() {
                        $(this).stop().animate({ opacity: 0.6 }, 200);
                    },
                   function() {
                       $(this).stop().animate({ opacity: 1.0 }, 200);
                   })
                });
});


/*
=============================================== 07. HOVER FOR ICONS  ===============================================
*/
jQuery(document).ready(function($) {  
    $(".icon-container").hide();
    $(".gallery-hover").hover( 
        function(){ 
			$(this).children(".icon-container").stop(true, true).fadeIn('medium'); 
		},
        function(){ 
			$(this).children(".icon-container").fadeOut('medium'); 
		}
    );
});