
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/*  Table of Contents 
01. Superfish v1.4.8 - jQuery menu widget
02. Supersubs v0.2b - jQuery plugin
03. prettyPhoto Lightbox Plugin
04. jtwt - a simple jQuery Twitter plugin
05. Awkward Showcase - jQuery plugin
06. ANYTHING SLIDER JQUERY PLUGINS - jQuery plugin
07. jQuery Nivo Slider v2.6
08. jQuery EasyTabs plugin 2.3.3
09. jQuery Validation Plugin 1.8.1 
*/

// place any jQuery/helper plugins in here, instead of separate, slower script files.

/*
=============================================== 01. Superfish v1.4.8 - jQuery menu widget  ===============================================
* Copyright (c) 2008 Joel Birch
*
* Dual licensed under the MIT and GPL licenses:
* 	http://www.opensource.org/licenses/mit-license.php
* 	http://www.gnu.org/licenses/gpl.html
*
* CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

;(function($){
	$.fn.superfish = function(op){

		var sf = $.fn.superfish,
			c = sf.c,
			$arrow = $(['<span class="',c.arrowClass,'"> &#187;</span>'].join('')),
			over = function(){
				var $$ = $(this), menu = getMenu($$);
				clearTimeout(menu.sfTimer);
				$$.showSuperfishUl().siblings().hideSuperfishUl();
			},
			out = function(){
				var $$ = $(this), menu = getMenu($$), o = sf.op;
				clearTimeout(menu.sfTimer);
				menu.sfTimer=setTimeout(function(){
					o.retainPath=($.inArray($$[0],o.$path)>-1);
					$$.hideSuperfishUl();
					if (o.$path.length && $$.parents(['li.',o.hoverClass].join('')).length<1){over.call(o.$path);}
				},o.delay);	
			},
			getMenu = function($menu){
				var menu = $menu.parents(['ul.',c.menuClass,':first'].join(''))[0];
				sf.op = sf.o[menu.serial];
				return menu;
			},
			addArrow = function($a){ $a.addClass(c.anchorClass).append($arrow.clone()); };
			
		return this.each(function() {
			var s = this.serial = sf.o.length;
			var o = $.extend({},sf.defaults,op);
			o.$path = $('li.'+o.pathClass,this).slice(0,o.pathLevels).each(function(){
				$(this).addClass([o.hoverClass,c.bcClass].join(' '))
					.filter('li:has(ul)').removeClass(o.pathClass);
			});
			sf.o[s] = sf.op = o;
			
			$('li:has(ul)',this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over,out).each(function() {
				if (o.autoArrows) addArrow( $('>a:first-child',this) );
			})
			.not('.'+c.bcClass)
				.hideSuperfishUl();
			
			var $a = $('a',this);
			$a.each(function(i){
				var $li = $a.eq(i).parents('li');
				$a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});
			});
			o.onInit.call(this);
			
		}).each(function() {
			var menuClasses = [c.menuClass];
			if (sf.op.dropShadows  && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
			$(this).addClass(menuClasses.join(' '));
		});
	};

	var sf = $.fn.superfish;
	sf.o = [];
	sf.op = {};
	sf.IE7fix = function(){
		var o = sf.op;
		if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity!=undefined)
			this.toggleClass(sf.c.shadowClass+'-off');
		};
	sf.c = {
		bcClass     : 'sf-breadcrumb',
		menuClass   : 'sf-js-enabled',
		anchorClass : 'sf-with-ul',
		arrowClass  : 'sf-sub-indicator',
		shadowClass : 'sf-shadow'
	};
	sf.defaults = {
		hoverClass	: 'sfHover',
		pathClass	: 'overideThisToUse',
		pathLevels	: 1,
		delay		: 800,
		animation	: {opacity:'show'},
		speed		: 'normal',
		autoArrows	: true,
		dropShadows : true,
		disableHI	: false,		// true disables hoverIntent detection
		onInit		: function(){}, // callback functions
		onBeforeShow: function(){},
		onShow		: function(){},
		onHide		: function(){}
	};
	$.fn.extend({
		hideSuperfishUl : function(){
			var o = sf.op,
				not = (o.retainPath===true) ? o.$path : '';
			o.retainPath = false;
			var $ul = $(['li.',o.hoverClass].join(''),this).add(this).not(not).removeClass(o.hoverClass)
					.find('>ul').hide().css('visibility','hidden');
			o.onHide.call($ul);
			return this;
		},
		showSuperfishUl : function(){
			var o = sf.op,
				sh = sf.c.shadowClass+'-off',
				$ul = this.addClass(o.hoverClass)
					.find('>ul:hidden').css('visibility','visible');
			sf.IE7fix.call($ul);
			o.onBeforeShow.call($ul);
			$ul.animate(o.animation,o.speed,function(){ sf.IE7fix.call($ul); o.onShow.call($ul); });
			return this;
		}
	});

})(jQuery);


/*
=============================================== 02. Supersubs v0.2b - jQuery plugin  ===============================================
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 *
 * This plugin automatically adjusts submenu widths of suckerfish-style menus to that of
 * their longest list item children. If you use this, please expect bugs and report them
 * to the jQuery Google Group with the word 'Superfish' in the subject line.
 *
 */

;(function($){ // $ will refer to jQuery within this closure

	$.fn.supersubs = function(options){
		var opts = $.extend({}, $.fn.supersubs.defaults, options);
		// return original object to support chaining
		return this.each(function() {
			// cache selections
			var $$ = $(this);
			// support metadata
			var o = $.meta ? $.extend({}, opts, $$.data()) : opts;
			// get the font size of menu.
			// .css('fontSize') returns various results cross-browser, so measure an em dash instead
			var fontsize = $('<li id="menu-fontsize">&#8212;</li>').css({
				'padding' : 0,
				'position' : 'absolute',
				'top' : '-999em',
				'width' : 'auto'
			}).appendTo($$).width(); //clientWidth is faster, but was incorrect here
			// remove em dash
			$('#menu-fontsize').remove();
			// cache all ul elements
			$ULs = $$.find('ul');
			// loop through each ul in menu
			$ULs.each(function(i) {	
				// cache this ul
				var $ul = $ULs.eq(i);
				// get all (li) children of this ul
				var $LIs = $ul.children();
				// get all anchor grand-children
				var $As = $LIs.children('a');
				// force content to one line and save current float property
				var liFloat = $LIs.css('white-space','nowrap').css('float');
				// remove width restrictions and floats so elements remain vertically stacked
				var emWidth = $ul.add($LIs).add($As).css({
					'float' : 'none',
					'width'	: 'auto'
				})
				// this ul will now be shrink-wrapped to longest li due to position:absolute
				// so save its width as ems. Clientwidth is 2 times faster than .width() - thanks Dan Switzer
				.end().end()[0].clientWidth / fontsize;
				// add more width to ensure lines don't turn over at certain sizes in various browsers
				emWidth += o.extraWidth;
				// restrict to at least minWidth and at most maxWidth
				if (emWidth > o.maxWidth)		{ emWidth = o.maxWidth; }
				else if (emWidth < o.minWidth)	{ emWidth = o.minWidth; }
				emWidth += 'em';
				// set ul to width in ems
				$ul.css('width',emWidth);
				// restore li floats to avoid IE bugs
				// set li width to full width of this ul
				// revert white-space to normal
				$LIs.css({
					'float' : liFloat,
					'width' : '100%',
					'white-space' : 'normal'
				})
				// update offset position of descendant ul to reflect new width of parent
				.each(function(){
					var $childUl = $('>ul',this);
					var offsetDirection = $childUl.css('left')!==undefined ? 'left' : 'right';
					$childUl.css(offsetDirection,emWidth);
				});
			});
			
		});
	};
	// expose defaults
	$.fn.supersubs.defaults = {
		minWidth		: 9,		// requires em unit.
		maxWidth		: 25,		// requires em unit.
		extraWidth		: 0			// extra width can ensure lines don't sometimes turn over due to slight browser differences in how they round-off values
	};
	
})(jQuery); // plugin code ends




/*
=============================================== 03. prettyPhoto Lightbox Plugin  ===============================================
	Class: prettyPhoto
	Use: Lightbox clone for jQuery
	Author: Stephane Caron (http://www.no-margin-for-errors.com)
	Version: 3.1.6
------------------------------------------------------------------------- */
!function(e){function t(){var e=location.href;return hashtag=-1!==e.indexOf("#prettyPhoto")?decodeURI(e.substring(e.indexOf("#prettyPhoto")+1,e.length)):!1,hashtag&&(hashtag=hashtag.replace(/<|>/g,"")),hashtag}function i(){"undefined"!=typeof theRel&&(location.hash=theRel+"/"+rel_index+"/")}function p(){-1!==location.href.indexOf("#prettyPhoto")&&(location.hash="prettyPhoto")}function o(e,t){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var i="[\\?&]"+e+"=([^&#]*)",p=new RegExp(i),o=p.exec(t);return null==o?"":o[1]}e.prettyPhoto={version:"3.1.6"},e.fn.prettyPhoto=function(a){function s(){e(".pp_loaderIcon").hide(),projectedTop=scroll_pos.scrollTop+(I/2-f.containerHeight/2),projectedTop<0&&(projectedTop=0),$ppt.fadeTo(settings.animation_speed,1),$pp_pic_holder.find(".pp_content").animate({height:f.contentHeight,width:f.contentWidth},settings.animation_speed),$pp_pic_holder.animate({top:projectedTop,left:j/2-f.containerWidth/2<0?0:j/2-f.containerWidth/2,width:f.containerWidth},settings.animation_speed,function(){$pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(f.height).width(f.width),$pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed),isSet&&"image"==h(pp_images[set_position])?$pp_pic_holder.find(".pp_hoverContainer").show():$pp_pic_holder.find(".pp_hoverContainer").hide(),settings.allow_expand&&(f.resized?e("a.pp_expand,a.pp_contract").show():e("a.pp_expand").hide()),!settings.autoplay_slideshow||P||v||e.prettyPhoto.startSlideshow(),settings.changepicturecallback(),v=!0}),m(),a.ajaxcallback()}function n(t){$pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility","hidden"),$pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed,function(){e(".pp_loaderIcon").show(),t()})}function r(t){t>1?e(".pp_nav").show():e(".pp_nav").hide()}function l(e,t){if(resized=!1,d(e,t),imageWidth=e,imageHeight=t,(k>j||b>I)&&doresize&&settings.allow_resize&&!$){for(resized=!0,fitting=!1;!fitting;)k>j?(imageWidth=j-200,imageHeight=t/e*imageWidth):b>I?(imageHeight=I-200,imageWidth=e/t*imageHeight):fitting=!0,b=imageHeight,k=imageWidth;(k>j||b>I)&&l(k,b),d(imageWidth,imageHeight)}return{width:Math.floor(imageWidth),height:Math.floor(imageHeight),containerHeight:Math.floor(b),containerWidth:Math.floor(k)+2*settings.horizontal_padding,contentHeight:Math.floor(y),contentWidth:Math.floor(w),resized:resized}}function d(t,i){t=parseFloat(t),i=parseFloat(i),$pp_details=$pp_pic_holder.find(".pp_details"),$pp_details.width(t),detailsHeight=parseFloat($pp_details.css("marginTop"))+parseFloat($pp_details.css("marginBottom")),$pp_details=$pp_details.clone().addClass(settings.theme).width(t).appendTo(e("body")).css({position:"absolute",top:-1e4}),detailsHeight+=$pp_details.height(),detailsHeight=detailsHeight<=34?36:detailsHeight,$pp_details.remove(),$pp_title=$pp_pic_holder.find(".ppt"),$pp_title.width(t),titleHeight=parseFloat($pp_title.css("marginTop"))+parseFloat($pp_title.css("marginBottom")),$pp_title=$pp_title.clone().appendTo(e("body")).css({position:"absolute",top:-1e4}),titleHeight+=$pp_title.height(),$pp_title.remove(),y=i+detailsHeight,w=t,b=y+titleHeight+$pp_pic_holder.find(".pp_top").height()+$pp_pic_holder.find(".pp_bottom").height(),k=t}function h(e){return e.match(/youtube\.com\/watch/i)||e.match(/youtu\.be/i)?"youtube":e.match(/vimeo\.com/i)?"vimeo":e.match(/\b.mov\b/i)?"quicktime":e.match(/\b.swf\b/i)?"flash":e.match(/\biframe=true\b/i)?"iframe":e.match(/\bajax=true\b/i)?"ajax":e.match(/\bcustom=true\b/i)?"custom":"#"==e.substr(0,1)?"inline":"image"}function c(){if(doresize&&"undefined"!=typeof $pp_pic_holder){if(scroll_pos=_(),contentHeight=$pp_pic_holder.height(),contentwidth=$pp_pic_holder.width(),projectedTop=I/2+scroll_pos.scrollTop-contentHeight/2,projectedTop<0&&(projectedTop=0),contentHeight>I)return;$pp_pic_holder.css({top:projectedTop,left:j/2+scroll_pos.scrollLeft-contentwidth/2})}}function _(){return self.pageYOffset?{scrollTop:self.pageYOffset,scrollLeft:self.pageXOffset}:document.documentElement&&document.documentElement.scrollTop?{scrollTop:document.documentElement.scrollTop,scrollLeft:document.documentElement.scrollLeft}:document.body?{scrollTop:document.body.scrollTop,scrollLeft:document.body.scrollLeft}:void 0}function g(){I=e(window).height(),j=e(window).width(),"undefined"!=typeof $pp_overlay&&$pp_overlay.height(e(document).height()).width(j)}function m(){isSet&&settings.overlay_gallery&&"image"==h(pp_images[set_position])?(itemWidth=57,navWidth="facebook"==settings.theme||"pp_default"==settings.theme?50:30,itemsPerPage=Math.floor((f.containerWidth-100-navWidth)/itemWidth),itemsPerPage=itemsPerPage<pp_images.length?itemsPerPage:pp_images.length,totalPage=Math.ceil(pp_images.length/itemsPerPage)-1,0==totalPage?(navWidth=0,$pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide()):$pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show(),galleryWidth=itemsPerPage*itemWidth,fullGalleryWidth=pp_images.length*itemWidth,$pp_gallery.css("margin-left",-(galleryWidth/2+navWidth/2)).find("div:first").width(galleryWidth+5).find("ul").width(fullGalleryWidth).find("li.selected").removeClass("selected"),goToPage=Math.floor(set_position/itemsPerPage)<totalPage?Math.floor(set_position/itemsPerPage):totalPage,e.prettyPhoto.changeGalleryPage(goToPage),$pp_gallery_li.filter(":eq("+set_position+")").addClass("selected")):$pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave")}function u(){if(settings.social_tools&&(facebook_like_link=settings.social_tools.replace("{location_href}",encodeURIComponent(location.href))),settings.markup=settings.markup.replace("{pp_social}",""),e("body").append(settings.markup),$pp_pic_holder=e(".pp_pic_holder"),$ppt=e(".ppt"),$pp_overlay=e("div.pp_overlay"),isSet&&settings.overlay_gallery){currentGalleryPage=0,toInject="";for(var t=0;t<pp_images.length;t++)pp_images[t].match(/\b(jpg|jpeg|png|gif)\b/gi)?(classname="",img_src=pp_images[t]):(classname="default",img_src=""),toInject+="<li class='"+classname+"'><a href='#'><img src='"+img_src+"' width='50' alt='' /></a></li>";toInject=settings.gallery_markup.replace(/{gallery}/g,toInject),$pp_pic_holder.find("#pp_full_res").after(toInject),$pp_gallery=e(".pp_pic_holder .pp_gallery"),$pp_gallery_li=$pp_gallery.find("li"),$pp_gallery.find(".pp_arrow_next").click(function(){return e.prettyPhoto.changeGalleryPage("next"),e.prettyPhoto.stopSlideshow(),!1}),$pp_gallery.find(".pp_arrow_previous").click(function(){return e.prettyPhoto.changeGalleryPage("previous"),e.prettyPhoto.stopSlideshow(),!1}),$pp_pic_holder.find(".pp_content").hover(function(){$pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()},function(){$pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()}),itemWidth=57,$pp_gallery_li.each(function(t){e(this).find("a").click(function(){return e.prettyPhoto.changePage(t),e.prettyPhoto.stopSlideshow(),!1})})}settings.slideshow&&($pp_pic_holder.find(".pp_nav").prepend('<a href="#" class="pp_play">Play</a>'),$pp_pic_holder.find(".pp_nav .pp_play").click(function(){return e.prettyPhoto.startSlideshow(),!1})),$pp_pic_holder.attr("class","pp_pic_holder "+settings.theme),$pp_overlay.css({opacity:0,height:e(document).height(),width:e(window).width()}).bind("click",function(){settings.modal||e.prettyPhoto.close()}),e("a.pp_close").bind("click",function(){return e.prettyPhoto.close(),!1}),settings.allow_expand&&e("a.pp_expand").bind("click",function(){return e(this).hasClass("pp_expand")?(e(this).removeClass("pp_expand").addClass("pp_contract"),doresize=!1):(e(this).removeClass("pp_contract").addClass("pp_expand"),doresize=!0),n(function(){e.prettyPhoto.open()}),!1}),$pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click",function(){return e.prettyPhoto.changePage("previous"),e.prettyPhoto.stopSlideshow(),!1}),$pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click",function(){return e.prettyPhoto.changePage("next"),e.prettyPhoto.stopSlideshow(),!1}),c()}a=jQuery.extend({hook:"rel",animation_speed:"fast",ajaxcallback:function(){},slideshow:5e3,autoplay_slideshow:!1,opacity:.8,show_title:!0,allow_resize:!0,allow_expand:!0,default_width:500,default_height:344,counter_separator_label:"/",theme:"pp_default",horizontal_padding:20,hideflash:!1,wmode:"opaque",autoplay:!0,modal:!1,deeplinking:!0,overlay_gallery:!0,overlay_gallery_max:30,keyboard_shortcuts:!0,changepicturecallback:function(){},callback:function(){},ie6_fallback:!0,markup:'<div class="pp_pic_holder"> 						<div class="ppt">&nbsp;</div> 						<div class="pp_top"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 						<div class="pp_content_container"> 							<div class="pp_left"> 							<div class="pp_right"> 								<div class="pp_content"> 									<div class="pp_loaderIcon"></div> 									<div class="pp_fade"> 										<a href="#" class="pp_expand" title="Expand the image">Expand</a> 										<div class="pp_hoverContainer"> 											<a class="pp_next" href="#">next</a> 											<a class="pp_previous" href="#">previous</a> 										</div> 										<div id="pp_full_res"></div> 										<div class="pp_details"> 											<div class="pp_nav"> 												<a href="#" class="pp_arrow_previous">Previous</a> 												<p class="currentTextHolder">0/0</p> 												<a href="#" class="pp_arrow_next">Next</a> 											</div> 											<p class="pp_description"></p> 											<div class="pp_social">{pp_social}</div> 											<a class="pp_close" href="#">Close</a> 										</div> 									</div> 								</div> 							</div> 							</div> 						</div> 						<div class="pp_bottom"> 							<div class="pp_left"></div> 							<div class="pp_middle"></div> 							<div class="pp_right"></div> 						</div> 					</div> 					<div class="pp_overlay"></div>',gallery_markup:'<div class="pp_gallery"> 								<a href="#" class="pp_arrow_previous">Previous</a> 								<div> 									<ul> 										{gallery} 									</ul> 								</div> 								<a href="#" class="pp_arrow_next">Next</a> 							</div>',image_markup:'<img id="fullResImage" src="{path}" />',flash_markup:'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',quicktime_markup:'<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',iframe_markup:'<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',inline_markup:'<div class="pp_inline">{content}</div>',custom_markup:"",social_tools:'<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&layout=button_count&show_faces=true&width=500&action=like&font&colorscheme=light&height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>'},a);var f,v,y,w,b,k,P,x=this,$=!1,I=e(window).height(),j=e(window).width();return doresize=!0,scroll_pos=_(),e(window).unbind("resize.prettyphoto").bind("resize.prettyphoto",function(){c(),g()}),a.keyboard_shortcuts&&e(document).unbind("keydown.prettyphoto").bind("keydown.prettyphoto",function(t){if("undefined"!=typeof $pp_pic_holder&&$pp_pic_holder.is(":visible"))switch(t.keyCode){case 37:e.prettyPhoto.changePage("previous"),t.preventDefault();break;case 39:e.prettyPhoto.changePage("next"),t.preventDefault();break;case 27:settings.modal||e.prettyPhoto.close(),t.preventDefault()}}),e.prettyPhoto.initialize=function(){return settings=a,"pp_default"==settings.theme&&(settings.horizontal_padding=16),theRel=e(this).attr(settings.hook),galleryRegExp=/\[(?:.*)\]/,isSet=galleryRegExp.exec(theRel)?!0:!1,pp_images=isSet?jQuery.map(x,function(t){return-1!=e(t).attr(settings.hook).indexOf(theRel)?e(t).attr("href"):void 0}):e.makeArray(e(this).attr("href")),pp_titles=isSet?jQuery.map(x,function(t){return-1!=e(t).attr(settings.hook).indexOf(theRel)?e(t).find("img").attr("alt")?e(t).find("img").attr("alt"):"":void 0}):e.makeArray(e(this).find("img").attr("alt")),pp_descriptions=isSet?jQuery.map(x,function(t){return-1!=e(t).attr(settings.hook).indexOf(theRel)?e(t).attr("title")?e(t).attr("title"):"":void 0}):e.makeArray(e(this).attr("title")),pp_images.length>settings.overlay_gallery_max&&(settings.overlay_gallery=!1),set_position=jQuery.inArray(e(this).attr("href"),pp_images),rel_index=isSet?set_position:e("a["+settings.hook+"^='"+theRel+"']").index(e(this)),u(this),settings.allow_resize&&e(window).bind("scroll.prettyphoto",function(){c()}),e.prettyPhoto.open(),!1},e.prettyPhoto.open=function(t){return"undefined"==typeof settings&&(settings=a,pp_images=e.makeArray(arguments[0]),pp_titles=e.makeArray(arguments[1]?arguments[1]:""),pp_descriptions=e.makeArray(arguments[2]?arguments[2]:""),isSet=pp_images.length>1?!0:!1,set_position=arguments[3]?arguments[3]:0,u(t.target)),settings.hideflash&&e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility","hidden"),r(e(pp_images).size()),e(".pp_loaderIcon").show(),settings.deeplinking&&i(),settings.social_tools&&(facebook_like_link=settings.social_tools.replace("{location_href}",encodeURIComponent(location.href)),$pp_pic_holder.find(".pp_social").html(facebook_like_link)),$ppt.is(":hidden")&&$ppt.css("opacity",0).show(),$pp_overlay.show().fadeTo(settings.animation_speed,settings.opacity),$pp_pic_holder.find(".currentTextHolder").text(set_position+1+settings.counter_separator_label+e(pp_images).size()),"undefined"!=typeof pp_descriptions[set_position]&&""!=pp_descriptions[set_position]?$pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position])):$pp_pic_holder.find(".pp_description").hide(),movie_width=parseFloat(o("width",pp_images[set_position]))?o("width",pp_images[set_position]):settings.default_width.toString(),movie_height=parseFloat(o("height",pp_images[set_position]))?o("height",pp_images[set_position]):settings.default_height.toString(),$=!1,-1!=movie_height.indexOf("%")&&(movie_height=parseFloat(e(window).height()*parseFloat(movie_height)/100-150),$=!0),-1!=movie_width.indexOf("%")&&(movie_width=parseFloat(e(window).width()*parseFloat(movie_width)/100-150),$=!0),$pp_pic_holder.fadeIn(function(){switch($ppt.html(settings.show_title&&""!=pp_titles[set_position]&&"undefined"!=typeof pp_titles[set_position]?unescape(pp_titles[set_position]):"&nbsp;"),imgPreloader="",skipInjection=!1,h(pp_images[set_position])){case"image":imgPreloader=new Image,nextImage=new Image,isSet&&set_position<e(pp_images).size()-1&&(nextImage.src=pp_images[set_position+1]),prevImage=new Image,isSet&&pp_images[set_position-1]&&(prevImage.src=pp_images[set_position-1]),$pp_pic_holder.find("#pp_full_res")[0].innerHTML=settings.image_markup.replace(/{path}/g,pp_images[set_position]),imgPreloader.onload=function(){f=l(imgPreloader.width,imgPreloader.height),s()},imgPreloader.onerror=function(){alert("Image cannot be loaded. Make sure the path is correct and image exist."),e.prettyPhoto.close()},imgPreloader.src=pp_images[set_position];break;case"youtube":f=l(movie_width,movie_height),movie_id=o("v",pp_images[set_position]),""==movie_id&&(movie_id=pp_images[set_position].split("youtu.be/"),movie_id=movie_id[1],movie_id.indexOf("?")>0&&(movie_id=movie_id.substr(0,movie_id.indexOf("?"))),movie_id.indexOf("&")>0&&(movie_id=movie_id.substr(0,movie_id.indexOf("&")))),movie="http://www.youtube.com/embed/"+movie_id,movie+=o("rel",pp_images[set_position])?"?rel="+o("rel",pp_images[set_position]):"?rel=1",settings.autoplay&&(movie+="&autoplay=1"),toInject=settings.iframe_markup.replace(/{width}/g,f.width).replace(/{height}/g,f.height).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);break;case"vimeo":f=l(movie_width,movie_height),movie_id=pp_images[set_position];var t=/http(s?):\/\/(www\.)?vimeo.com\/(\d+)/,i=movie_id.match(t);movie="http://player.vimeo.com/video/"+i[3]+"?title=0&byline=0&portrait=0",settings.autoplay&&(movie+="&autoplay=1;"),vimeo_width=f.width+"/embed/?moog_width="+f.width,toInject=settings.iframe_markup.replace(/{width}/g,vimeo_width).replace(/{height}/g,f.height).replace(/{path}/g,movie);break;case"quicktime":f=l(movie_width,movie_height),f.height+=15,f.contentHeight+=15,f.containerHeight+=15,toInject=settings.quicktime_markup.replace(/{width}/g,f.width).replace(/{height}/g,f.height).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,pp_images[set_position]).replace(/{autoplay}/g,settings.autoplay);break;case"flash":f=l(movie_width,movie_height),flash_vars=pp_images[set_position],flash_vars=flash_vars.substring(pp_images[set_position].indexOf("flashvars")+10,pp_images[set_position].length),filename=pp_images[set_position],filename=filename.substring(0,filename.indexOf("?")),toInject=settings.flash_markup.replace(/{width}/g,f.width).replace(/{height}/g,f.height).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,filename+"?"+flash_vars);break;case"iframe":f=l(movie_width,movie_height),frame_url=pp_images[set_position],frame_url=frame_url.substr(0,frame_url.indexOf("iframe")-1),toInject=settings.iframe_markup.replace(/{width}/g,f.width).replace(/{height}/g,f.height).replace(/{path}/g,frame_url);break;case"ajax":doresize=!1,f=l(movie_width,movie_height),doresize=!0,skipInjection=!0,e.get(pp_images[set_position],function(e){toInject=settings.inline_markup.replace(/{content}/g,e),$pp_pic_holder.find("#pp_full_res")[0].innerHTML=toInject,s()});break;case"custom":f=l(movie_width,movie_height),toInject=settings.custom_markup;break;case"inline":myClone=e(pp_images[set_position]).clone().append('<br clear="all" />').css({width:settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo(e("body")).show(),doresize=!1,f=l(e(myClone).width(),e(myClone).height()),doresize=!0,e(myClone).remove(),toInject=settings.inline_markup.replace(/{content}/g,e(pp_images[set_position]).html())}imgPreloader||skipInjection||($pp_pic_holder.find("#pp_full_res")[0].innerHTML=toInject,s())}),!1},e.prettyPhoto.changePage=function(t){currentGalleryPage=0,"previous"==t?(set_position--,set_position<0&&(set_position=e(pp_images).size()-1)):"next"==t?(set_position++,set_position>e(pp_images).size()-1&&(set_position=0)):set_position=t,rel_index=set_position,doresize||(doresize=!0),settings.allow_expand&&e(".pp_contract").removeClass("pp_contract").addClass("pp_expand"),n(function(){e.prettyPhoto.open()})},e.prettyPhoto.changeGalleryPage=function(e){"next"==e?(currentGalleryPage++,currentGalleryPage>totalPage&&(currentGalleryPage=0)):"previous"==e?(currentGalleryPage--,currentGalleryPage<0&&(currentGalleryPage=totalPage)):currentGalleryPage=e,slide_speed="next"==e||"previous"==e?settings.animation_speed:0,slide_to=currentGalleryPage*itemsPerPage*itemWidth,$pp_gallery.find("ul").animate({left:-slide_to},slide_speed)},e.prettyPhoto.startSlideshow=function(){"undefined"==typeof P?($pp_pic_holder.find(".pp_play").unbind("click").removeClass("pp_play").addClass("pp_pause").click(function(){return e.prettyPhoto.stopSlideshow(),!1}),P=setInterval(e.prettyPhoto.startSlideshow,settings.slideshow)):e.prettyPhoto.changePage("next")},e.prettyPhoto.stopSlideshow=function(){$pp_pic_holder.find(".pp_pause").unbind("click").removeClass("pp_pause").addClass("pp_play").click(function(){return e.prettyPhoto.startSlideshow(),!1}),clearInterval(P),P=void 0},e.prettyPhoto.close=function(){$pp_overlay.is(":animated")||(e.prettyPhoto.stopSlideshow(),$pp_pic_holder.stop().find("object,embed").css("visibility","hidden"),e("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed,function(){e(this).remove()}),$pp_overlay.fadeOut(settings.animation_speed,function(){settings.hideflash&&e("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css("visibility","visible"),e(this).remove(),e(window).unbind("scroll.prettyphoto"),p(),settings.callback(),doresize=!0,v=!1,delete settings}))},!pp_alreadyInitialized&&t()&&(pp_alreadyInitialized=!0,hashIndex=t(),hashRel=hashIndex,hashIndex=hashIndex.substring(hashIndex.indexOf("/")+1,hashIndex.length-1),hashRel=hashRel.substring(0,hashRel.indexOf("/")),setTimeout(function(){e("a["+a.hook+"^='"+hashRel+"']:eq("+hashIndex+")").trigger("click")},50)),this.unbind("click.prettyphoto").bind("click.prettyphoto",e.prettyPhoto.initialize)}}(jQuery);var pp_alreadyInitialized=!1;




/*
=============================================== 04. jtwt - a simple jQuery Twitter plugin  ===============================================
* hello@buzzrocket.de.
* http://buzzrocket.de/labs/jtwt/
*/


(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		jtwt: function(options) {


			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				username : 'google',
                count : 1,
                image_size: 48,
                convert_links: 1,
                loader_text: 'loading new tweets'
			}
				
			var options =  $.extend(defaults, options);

    		return this.each(function() {
				var o = options;
                var obj = $(this);  
                
$(obj).append('<p id="jtwt_loader" style="display:none;">' + o.loader_text + '</p>');	
$("#jtwt_loader").fadeIn('slow');

			
						$.getJSON('https://api.twitter.com/1/statuses/user_timeline/' + o.username + '.json?count=' + o.count + '&callback=?', function(data){ 


               


			$.each(data, function(i, item) {       
            
                jtweet = '<div id="jtwt">';
                
                
                
                if (o.image_size != 0) {
                
                today = new Date();
  
                jtweet += '<div id="jtwt_picture">';
                jtweet += '<a href="http://twitter.com/' + item.user['screen_name'] + '">'
                jtweet += '<img width="' + o.image_size +'" height="' + o.image_size + '" src="' + item.user['profile_image_url'] + '" />';
                jtweet += '</a><br />';
                jtweet += '</div>';
                jtweet += '<div id="jtwt_tweet">';
                } 
                
                
               
                var tweettext = item.text;
                var tweetdate = item.created_at;
                
                if (o.convert_links != 0) {
                

  
                tweettext = tweettext.replace(/(http\:\/\/[A-Za-z0-9\/\.\?\=\-]*)/g,'<a href="$1">$1</a>');
                tweettext = tweettext.replace(/@([A-Za-z0-9\/_]*)/g,'<a href="http://twitter.com/$1">@$1</a>');
                tweettext = tweettext.replace(/#([A-Za-z0-9\/\.]*)/g,'<a href="http://twitter.com/search?q=$1">#$1</a>');
                
                }
                
                jtweet += '<div id="jtwt_text">';
                jtweet += tweettext;
                jtweet += '<br />';
                
                
                tweetdate = tweetdate.replace(/201.{1}/, "");
                tweetdate = tweetdate.replace(/\+00.{2}/, "");
                jtweet += '<a href="http://twitter.com/' + item.user['screen_name'] + '/statuses/' + item.id + '" id="jtwt_date">';
                
                jtweet += tweetdate;
                jtweet += '</a></div>';
                jtweet += '</div>';

   				$(obj).append(jtweet);
        
    


          		 });   
                 

$("#jtwt_loader").fadeOut('fast');   
           
		});
    
    
			
    		});
    	}
	});
	
})(jQuery);




/*
=============================================== 05. Awkward Showcase - jQuery plugin   ===============================================
http://www.jquery.com
http://www.awkwardgroup.com/sandbox/awkward-showcase-a-jquery-plugin
http://demo.awkwardgroup.com/showcase
Version: 1.1.1
Copyright (C) 2011 Awkward Group (http://www.awkwardgroup.com)
Licensed under Attribution-ShareAlike 3.0 Unported
http://creativecommons.org/licenses/by-sa/3.0/

*/

(function(jQuery){jQuery.fn.awShowcase=function(options){var defaults={content_width:700,content_height:470,fit_to_parent:false,auto:false,interval:3000,continuous:false,loading:true,tooltip_width:200,tooltip_icon_width:32,tooltip_icon_height:32,tooltip_offsetx:18,tooltip_offsety:0,arrows:true,buttons:true,btn_numbers:false,keybord_keys:false,mousetrace:false,pauseonover:true,stoponclick:true,transition:'hslide',transition_delay:300,transition_speed:500,show_caption:'onload',thumbnails:false,thumbnails_position:'outside-last',thumbnails_direction:'vertical',thumbnails_slidex:0,dynamic_height:false,speed_change:false,viewline:false,fullscreen_width_x:15,custom_function:null};options=jQuery.extend(defaults,options);var current_id=0;var previous_id=0;var break_loop=false;var pause_loop=false;var myInterval=null;var showcase=jQuery(this);var showcase_width=options.content_width;var animating=false;var content_viewline_width=10000;var animation_distance=0;var old_animation_distance=0;var remaining_width=0;var content_container=jQuery(document.createElement('div')).css('overflow','hidden').css('position','relative').addClass('showcase-content-container').prependTo(showcase);if(options.fit_to_parent){showcase_width=jQuery(showcase).width()+options.fullscreen_width_x}if(options.viewline){options.thumbnails=false;options.dynamic_height=false;content_container.css('width',content_viewline_width);showcase.css('overflow','hidden');$('.showcase-arrow-previous').hide()}var contentArray=[];var thumbnailArray=[];var content_count=0;showcase.children('.showcase-slide').each(function(){var object=jQuery(this);content_count++;if(options.thumbnails){var thumb=object.find('.showcase-thumbnail');thumbnailArray.push(thumb);thumb.remove()}var object_width=object.find('.showcase-content').children().width();var object_height=object.find('.showcase-content').children().height();contentArray.push(object.html());object.remove();var new_object=getContent(content_count-1);if(options.viewline||content_count===1){content_container.append(new_object)}if(options.viewline){new_object.css('position','relative');new_object.css('float','left');new_object.css('width',object_width)}if(options.dynamic_height){new_object.css('height',object_height);if(content_count===1){content_container.css('height',object_height)}}else{new_object.css('height',options.content_height);if(content_count===1){content_container.css('height',options.content_height)}}if(options.viewline||content_count===1){displayAnchors(new_object);displayCaption(new_object);if(options.show_caption==='show'){jQuery(new_object).find('.showcase-caption').show()}}});var thumb_wrapper;var thumbnailStretch=0;var thumbnailsPerPage=0;if(options.thumbnails){thumb_container=jQuery('<div />');thumb_restriction=jQuery('<div />');thumb_wrapper=jQuery('<div />');for(i=thumbnailArray.length-1;i>=0;--i){var thumbnail=jQuery(thumbnailArray[i]).css({'overflow':'hidden'});thumbnail.attr('id','showcase-thumbnail-'+i);thumbnail.addClass((i===0)?'active':'');thumbnail.click(function(a,b){return function(){if(myInterval){pause_loop=true;clearInterval(myInterval)}changeContent(a,b)}}(i,''));thumb_wrapper.prepend(thumbnail)}if(options.thumbnails_position==='outside-first'||options.thumbnails_position==='outside-last'){if(options.thumbnails_direction!=='horizontal'){content_container.css('float','left');content_container.css('width',options.content_width);thumb_container.css('float','left');thumb_container.css('height',options.content_height)}else{jQuery(thumb_wrapper).find('.showcase-thumbnail').css('float','left')}if(options.thumbnails_position==='outside-last'){showcase.append(thumb_container);if(options.thumbnails_direction!=='horizontal'){showcase.append(jQuery('<div />').addClass('clear'))}}else{showcase.prepend(thumb_container);if(options.thumbnails_direction!=='horizontal'){showcase.append(jQuery('<div />').addClass('clear'))}}}else{thumb_container.css({'position':'absolute','z-index':20});if(options.thumbnails_direction==='horizontal'){thumb_container.css({'left':0,'right':0});jQuery(thumb_wrapper).find('.showcase-thumbnail').css('float','left');jQuery(thumb_wrapper).append(jQuery('<div />').addClass('clear'));if(options.thumbnails_position==='inside-first'){thumb_container.css('top',0)}else{thumb_container.css('bottom',0)}}else{thumb_container.css({'top':0,'bottom':0});if(options.thumbnails_position==='inside-first'){thumb_container.css('left',0)}else{thumb_container.css('right',0)}}content_container.prepend(thumb_container)}thumb_container.addClass('showcase-thumbnail-container');thumb_container.css('overflow','hidden');thumb_restriction.addClass('showcase-thumbnail-restriction');thumb_restriction.css({'overflow':'hidden','position':'relative'});if(options.thumbnails_direction==='horizontal'){thumb_restriction.css({'float':'left'})}thumb_wrapper.addClass('showcase-thumbnail-wrapper');if(options.thumbnails_direction==='horizontal'){thumb_wrapper.addClass('showcase-thumbnail-wrapper-horizontal')}else{thumb_wrapper.addClass('showcase-thumbnail-wrapper-vertical')}thumb_wrapper.css('position','relative');thumb_restriction.append(thumb_wrapper);thumb_container.append(thumb_restriction);var buttonBackward=jQuery('<div class="showcase-thumbnail-button-backward" />');if(options.thumbnails_direction!=='horizontal'){buttonBackward.html('<span class="showcase-thumbnail-vertical"><span>Up</span></span>')}else{buttonBackward.css({'float':'left'});buttonBackward.html('<span class="showcase-thumbnail-horizontal"><span>Left</span></span>')}buttonBackward.click(function(){slideThumbnailWrapper('backward',false,true)});thumb_container.prepend(buttonBackward);var buttonForward=jQuery('<div class="showcase-thumbnail-button-forward" />');if(options.thumbnails_direction!=='horizontal'){buttonForward.html('<span class="showcase-thumbnail-vertical"><span>Down</span></span>')}else{buttonForward.css({'float':'left'});buttonForward.html('<span class="showcase-thumbnail-horizontal"><span>Right</span></span>')}buttonForward.click(function(){slideThumbnailWrapper('forward',false,true)});thumb_container.append(buttonForward);var thumbnailVisibleStretch=0;if(options.thumbnails_direction!=='horizontal'){thumbnailVisibleStretch=getElementHeight(thumb_wrapper,false);thumbnailVisibleStretch+=(getElementHeight(buttonBackward))+(getElementHeight(buttonForward));while(thumbnailVisibleStretch<options.content_height){thumbnailVisibleStretch+=getElementHeight(jQuery(thumbnailArray[0]));thumbnailsPerPage++}}else{thumbnailVisibleStretch=getElementWidth(thumb_wrapper,false);thumbnailVisibleStretch+=(getElementWidth(buttonBackward))+(getElementWidth(buttonForward));while(thumbnailVisibleStretch<showcase_width){thumbnailVisibleStretch+=getElementWidth(jQuery(thumbnailArray[0]));thumbnailsPerPage++}}if(thumbnailsPerPage+1>thumbnailArray.length){if(options.thumbnails_direction!=='horizontal'){thumb_restriction.css('margin-top',getElementHeight(buttonBackward))}else{thumb_restriction.css('margin-left',getElementWidth(buttonBackward))}buttonBackward.hide();buttonForward.hide()}if(options.thumbnails_direction!=='horizontal'){var buttonsHeight=(getElementHeight(buttonBackward))+(getElementHeight(buttonForward));thumb_restriction.css('height',options.content_height-buttonsHeight)}else{var buttonsWidth=(getElementWidth(buttonBackward))+(getElementWidth(buttonForward));thumb_restriction.css('width',showcase_width-buttonsWidth)}if(options.thumbnails_direction==='horizontal'){jQuery('.showcase-thumbnail').each(function(){thumbnailStretch+=getElementWidth(jQuery(this))});thumb_wrapper.css('width',thumbnailStretch)}else{jQuery('.showcase-thumbnail').each(function(){thumbnailStretch+=getElementHeight(jQuery(this))})}}if(options.thumbnails&&options.thumbnails_position.indexOf("outside")!==-1&&options.thumbnails_direction!=='horizontal'&&!options.viewline){showcase.css('width',showcase_width+getElementWidth(thumb_wrapper,true,false))}else if(!options.fit_to_parent){showcase.css('width',showcase_width)}if(content_count>1&&options.auto){myInterval=window.setInterval(autoChange,options.interval)}if(options.auto&&options.pauseonover){showcase.mouseenter(function(){break_loop=true;clearInterval(myInterval)});showcase.mouseleave(function(){if(!pause_loop){break_loop=false;myInterval=window.setInterval(autoChange,options.interval)}})}if(options.arrows&&content_count>1){jQuery(document.createElement('div')).addClass('showcase-arrow-previous').prependTo(showcase).click(function(){if(myInterval){if(options.stoponclick){pause_loop=true}clearInterval(myInterval)}changeContent((current_id===0)?content_count-1:parseInt(current_id)-1,'previous')});jQuery(document.createElement('div')).addClass('showcase-arrow-next').prependTo(showcase).click(function(){if(myInterval){if(options.stoponclick){pause_loop=true}clearInterval(myInterval)}changeContent(current_id+1,'next')});if(options.viewline){$('.showcase-arrow-previous').hide()}}if(options.buttons&&content_count>1){jQuery(document.createElement('div')).css('clear','both').addClass('showcase-button-wrapper').appendTo(showcase);i=0;while(i<content_count){jQuery(document.createElement('span')).attr('id','showcase-navigation-button-'+i).addClass((i===0)?'active':'').html((options.btn_numbers)?parseInt(i)+1:'&#9679;').click(function(a,b){return function(){if(myInterval){if(options.stoponclick){pause_loop=true}clearInterval(myInterval)}changeContent(a,b)}}(i,'')).appendTo(jQuery(showcase).find('.showcase-button-wrapper'));i++}}if(options.keybord_keys){jQuery(document).keydown(function(e){if(options.stoponclick){pause_loop=true}if(myInterval)clearInterval(myInterval);if(e.keyCode===37){changeContent((current_id===0)?content_count-1:parseInt(current_id)-1,'previous')}if(e.keyCode===39){changeContent((current_id===content_count-1)?0:parseInt(current_id)+1,'next')}})}function getContent(id){var new_content=jQuery(document.createElement('div')).attr('id','showcase-content-'+id).css('overflow','hidden').css('position','absolute').addClass('showcase-content').html(contentArray[id]);if(!options.viewline){new_content.css('width',options.content_width)}if(options.fit_to_parent&&!options.viewline){new_content.css('left',(showcase_width/2)-options.content_width/2)}return new_content}function autoChange(){var nextID=parseInt(current_id)+1;if(nextID===content_count&&options.continuous){nextID=0}else if(nextID===content_count&&!options.continuous){break_loop=true;clearInterval(myInterval)}if(!break_loop){changeContent(nextID,'next')}}function changeContent(id,direction){if(current_id!==id&&!animating){var obj;var obj2;var delay=0;var i;var lrpos=(options.fit_to_parent)?(showcase_width/2)-(options.content_width/2):0;if((id>current_id&&direction!=='previous')||direction==='next'){if(options.viewline){if(current_id<content_count-1){if(!options.speed_change){animating=true}updateContentViewlineWidth();if(options.pauseonover){window.clearInterval(myInterval)}remaining_width=0;for(i=current_id+1,len=content_count;i<len;++i){obj=addedContentArray[i];remaining_width+=obj.find('.showcase-content').children().width()}if(remaining_width>showcase_width){old_animation_distance=animation_distance;animation_distance-=addedContentArray[current_id].find('.showcase-content').children().width()}else if($('.showcase-arrow-next').is(':visible')){old_animation_distance=animation_distance;animation_distance=-(content_viewline_width-(remaining_width+(showcase_width-remaining_width)));$('.showcase-arrow-next').fadeOut(300)}content_container.animate({left:animation_distance+'px'},options.transition_speed,function(){animating=false});if($('.showcase-arrow-next').is(':visible')){current_id++}$('.showcase-arrow-previous').fadeIn(300)}}else{if(!options.speed_change){animating=true}obj=jQuery(showcase).find('#showcase-content-'+parseInt(current_id));obj2=getContent(id);content_container.append(obj2);if(options.dynamic_height){obj2.css('height',obj2.find('.showcase-content').children().height())}else{obj2.css('height',options.content_height)}if(obj.find('.showcase-content').children().height()>obj2.find('.showcase-content').children().height()&&options.dynamic_height){content_container.stop(true,true).animate({height:obj2.find('.showcase-content').children().height()},200);delay=100}if(options.transition==='hslide'){jQuery(obj).delay(delay).animate({left:-(options.content_width)},options.transition_speed+options.transition_delay,function(){obj.remove()})}else if(options.transition==='vslide'){jQuery(obj).delay(delay).animate({top:-(options.content_height)},options.transition_speed+options.transition_delay,function(){obj.remove()})}else{jQuery(obj).delay(delay).fadeOut(options.transition_speed,function(){obj.remove()})}displayAnchors(obj,true);displayCaption(obj,true);if(options.transition==='hslide'){obj2.css('left',showcase_width);jQuery(obj2).delay(delay).animate({left:lrpos},options.transition_speed,function(){displayAnchors(obj2);displayCaption(obj2);afterAnimation(obj2)})}else if(options.transition==='vslide'){obj2.css('top',showcase.height());jQuery(obj2).delay(delay).animate({top:'0px'},options.transition_speed,function(){displayAnchors(obj2);displayCaption(obj2);afterAnimation(obj2)})}else{obj2.css('left',lrpos);obj2.css('display','none');jQuery(obj2).delay(delay).fadeIn(options.transition_speed,function(){displayAnchors(obj2);displayCaption(obj2);afterAnimation(obj2)})}}}else if(id<current_id||direction==='previous'){if(options.viewline){if(current_id!==0){if(!options.speed_change){animating=true}updateContentViewlineWidth();if(options.pauseonover){window.clearInterval(myInterval)}content_container.animate({left:old_animation_distance+'px'},options.transition_speed,function(){animating=false});animation_distance=old_animation_distance;current_id--;if(current_id===0){$('.showcase-arrow-previous').fadeOut(300)}old_id=current_id-1;sub_width=jQuery(addedContentArray[old_id]).width();old_animation_distance=old_animation_distance+sub_width}$('.showcase-arrow-next').fadeIn(300)}else{if(!options.speed_change){animating=true}obj=jQuery(showcase).find('#showcase-content-'+parseInt(current_id));obj2=getContent(id);content_container.append(obj2);if(options.dynamic_height){obj2.css('height',obj2.find('.showcase-content').children().height())}else{obj2.css('height',options.content_height)}if(obj.find('.showcase-content').children().height()>obj2.find('.showcase-content').children().height()&&options.dynamic_height){content_container.stop(true,true).animate({height:obj2.find('.showcase-content').children().height()},200);delay=100}if(options.transition==='hslide'){jQuery(obj).delay(delay).animate({left:(showcase_width)+'px'},options.transition_speed+options.transition_delay,function(){displayAnchors(obj,true);displayCaption(obj,true);obj.remove()})}else if(options.transition==='vslide'){jQuery(obj).delay(delay).animate({top:(options.content_height)+'px'},options.transition_speed+options.transition_delay,function(){displayAnchors(obj,true);displayCaption(obj,true);obj.remove()})}else{jQuery(obj).delay(delay).fadeOut(options.transition_speed,function(){displayAnchors(obj,true);displayCaption(obj,true);obj.remove()})}if(options.transition==='hslide'){obj2.css('left','-'+options.content_width+'px');jQuery(obj2).delay(delay).animate({left:lrpos},options.transition_speed,function(){displayAnchors(obj2);displayCaption(obj2);afterAnimation(obj2)})}else if(options.transition==='vslide'){obj2.css('top','-'+showcase.height()+'px');jQuery(obj2).delay(delay).animate({top:'0px'},options.transition_speed,function(){displayAnchors(obj2);displayCaption(obj2);afterAnimation(obj2)})}else{obj2.css('left',lrpos);obj2.css('display','none');jQuery(obj2).delay(delay).fadeIn(options.transition_speed,function(){displayAnchors(obj2);displayCaption(obj2);afterAnimation(obj2)})}content_container.append(obj2)}}if(!options.viewline){previous_id=current_id;current_id=id;if(options.thumbnails){if((current_id>previous_id&&direction!=='previous')||direction==='next'){slideThumbnailWrapper('forward',true)}else if(current_id<previous_id||direction==='previous'){slideThumbnailWrapper('backward',true)}}if(options.arrows){jQuery(showcase).find('.showcase-arrow-previous').unbind('click').click(function(){if(myInterval){if(options.stoponclick){pause_loop=true}clearInterval(myInterval)}changeContent((current_id===0)?content_count-1:parseInt(current_id)-1,'previous')});jQuery(showcase).find('.showcase-arrow-next').unbind('click').click(function(){if(myInterval){if(options.stoponclick){pause_loop=true}clearInterval(myInterval)}changeContent((current_id===content_count-1)?0:parseInt(current_id)+1,'next')})}if(options.thumbnails){i=0;showcase.find('.showcase-thumbnail').each(function(){var object=jQuery(this);object.removeClass('active');if(i===current_id){object.addClass('active')}i++})}if(options.show_caption==='show'){jQuery(obj2).find('.showcase-caption').show()}}if(options.buttons){i=0;showcase.find('.showcase-button-wrapper span').each(function(){var object=jQuery(this);object.removeClass('active');if(i===current_id){object.addClass('active')}i++})}if(typeof options.custom_function=='function'){options.custom_function()}}}function afterAnimation(obj){if(options.dynamic_height){content_container.stop(true,true).animate({height:obj.find('.showcase-content').children().height()},200)}animating=false}var thumbnailSlidePosition=0;function slideThumbnailWrapper(direction,check,backwardforward){var doTheSlide=true;var thumbnailHeightOrWidth=getElementHeight(jQuery(thumb_wrapper).find('.showcase-thumbnail'));if(options.thumbnails_direction==='horizontal'){thumbnailHeightOrWidth=getElementWidth(jQuery(thumb_wrapper).find('.showcase-thumbnail'))}var multiplySlidePosition=1;if(options.thumbnails_slidex===0){options.thumbnails_slidex=thumbnailsPerPage}if(check){var thumbnailSlidePositionCopy=thumbnailSlidePosition;var thumbnailsScrolled=0;while(thumbnailSlidePositionCopy<0){if(options.thumbnails_direction==='horizontal'){thumbnailSlidePositionCopy+=getElementWidth(jQuery(thumbnailArray[0]))}else{thumbnailSlidePositionCopy+=getElementHeight(jQuery(thumbnailArray[0]))}thumbnailsScrolled++}var firstVisible=thumbnailsScrolled;var lastVisible=thumbnailsPerPage+thumbnailsScrolled-1;if(current_id>=firstVisible&&current_id<=lastVisible){doTheSlide=false}var distance;if((current_id-lastVisible)>options.thumbnails_slidex){distance=current_id-lastVisible;while(distance>options.thumbnails_slidex){distance-=options.thumbnails_slidex;multiplySlidePosition++}}else if((firstVisible-current_id)>options.thumbnails_slidex){distance=firstVisible-current_id;while(distance>options.thumbnails_slidex){distance-=options.thumbnails_slidex;multiplySlidePosition++}}else{multiplySlidePosition=1}}if(direction==='forward'&&doTheSlide){if(options.thumbnails_direction==='vertical'&&options.content_height<(thumbnailStretch+thumbnailSlidePosition)){thumbnailSlidePosition-=thumbnailHeightOrWidth*(options.thumbnails_slidex*multiplySlidePosition)}else if(options.thumbnails_direction==='horizontal'&&options.content_width<(thumbnailStretch+thumbnailSlidePosition)){thumbnailSlidePosition-=thumbnailHeightOrWidth*(options.thumbnails_slidex*multiplySlidePosition)}else if(current_id===0){if(!backwardforward){thumbnailSlidePosition=0}}if(options.thumbnails_direction==='horizontal'){thumb_wrapper.animate({left:thumbnailSlidePosition},300)}else{thumb_wrapper.animate({top:thumbnailSlidePosition},300)}}else if(doTheSlide){if(thumbnailSlidePosition<0){thumbnailSlidePosition+=thumbnailHeightOrWidth*(options.thumbnails_slidex*multiplySlidePosition)}else if(current_id===content_count-1){if(!backwardforward){thumbnailSlidePosition-=thumbnailHeightOrWidth*(options.thumbnails_slidex*multiplySlidePosition)}}else{thumbnailSlidePosition=0}if(options.thumbnails_direction==='horizontal'){thumb_wrapper.animate({left:thumbnailSlidePosition},300)}else{thumb_wrapper.animate({top:thumbnailSlidePosition},300)}}}function displayCaption(container,fadeOut){var caption=container.find('.showcase-caption');if(!fadeOut){if(options.show_caption==='onload'){caption.fadeIn(300)}else if(options.show_caption==='onhover'){jQuery(container).mouseenter(function(){caption.fadeIn(300)});jQuery(container).mouseleave(function(){caption.stop(true,true).fadeOut(100)})}}else{caption.stop(true,true).fadeOut(300)}}function displayAnchors(container,fadeOut){container.find('.showcase-tooltips a').each(function(){if(!fadeOut){var coords=jQuery(this).attr('coords');coords=coords.split(',');jQuery(this).addClass('showcase-plus-anchor');jQuery(this).css('position','absolute');jQuery(this).css('display','none');jQuery(this).css('width',options.tooltip_icon_width);jQuery(this).css('height',options.tooltip_icon_height);jQuery(this).css('left',parseInt(coords[0])-(parseInt(options.tooltip_icon_width)/2));jQuery(this).css('top',parseInt(coords[1])-(parseInt(options.tooltip_icon_height)/2));var content=jQuery(this).html();jQuery(this).mouseenter(function(){animateTooltip(container,coords[0],coords[1],content)});jQuery(this).mouseleave(function(){animateTooltip(container,coords[0],coords[1],content)});jQuery(this).html('');jQuery(this).fadeIn(300)}else{jQuery(this).stop(true,true).fadeOut(300)}})}var tooltip=null;function animateTooltip(container,x,y,content){if(tooltip===null){tooltip=jQuery(document.createElement('div')).addClass('showcase-tooltip').css('display','none').css('position','absolute').css('max-width',options.tooltip_width).html(content);container.append(tooltip);var tooltip_paddingx=parseInt(tooltip.css('padding-right'))*2+parseInt(tooltip.css('border-right-width'))*2;var tooltip_paddingy=parseInt(tooltip.css('padding-bottom'))*2+parseInt(tooltip.css('border-bottom-width'))*2;lastx=parseInt(x)+tooltip.width()+tooltip_paddingx;lasty=parseInt(y)+tooltip.height()+tooltip_paddingy;if(lastx<options.content_width){tooltip.css('left',parseInt(x)+parseInt(options.tooltip_offsetx))}else{tooltip.css('left',(parseInt(x)-parseInt(options.tooltip_offsetx))-(parseInt(tooltip.width())+parseInt(options.tooltip_offsetx)))}if(lasty<options.content_height){tooltip.css('top',parseInt(y)+parseInt(options.tooltip_offsety))}else{tooltip.css('top',(parseInt(y)-parseInt(options.tooltip_offsety))-(parseInt(tooltip.height())+parseInt(tooltip_paddingy)))}tooltip.fadeIn(400)}else{tooltip.fadeOut(400);tooltip.remove();tooltip=null}}function getElementHeight(el,incHeight,incMargin,incPadding,incBorders){incHeight=typeof(incHeight)!=='undefined'?incHeight:true;incMargin=typeof(incMargin)!=='undefined'?incMargin:true;incPadding=typeof(incPadding)!=='undefined'?incPadding:true;incBorders=typeof(incBorders)!=='undefined'?incBorders:true;var elHeight=(incHeight)?jQuery((el)).height():0;var elMargin=(incMargin)?parseFloat(jQuery((el)).css('margin-top'))+parseFloat(jQuery(el).css('margin-bottom')):0;var elPadding=(incPadding)?parseFloat(jQuery((el)).css('padding-top'))+parseFloat(jQuery(el).css('padding-bottom')):0;var elBorder=(incBorders)?parseFloat(jQuery((el)).css('border-top-width'))+parseFloat(jQuery((el)).css('border-bottom-width')):0;elHeight+=elMargin+elPadding+elBorder;return elHeight}function getElementWidth(el,incWidth,incMargin,incPadding,incBorders){incWidth=typeof(incWidth)!=='undefined'?incWidth:true;incMargin=typeof(incMargin)!=='undefined'?incMargin:true;incPadding=typeof(incPadding)!=='undefined'?incPadding:true;incBorders=typeof(incBorders)!=='undefined'?incBorders:true;var elWidth=(incWidth)?jQuery((el)).width():0;var elMargin=(incMargin)?parseFloat(jQuery((el)).css('margin-left'))+parseFloat(jQuery(el).css('margin-right')):0;var elPadding=(incPadding)?parseFloat(jQuery((el)).css('padding-left'))+parseFloat(jQuery((el)).css('padding-right')):0;var elBorder=(incBorders)?parseFloat(jQuery((el)).css('border-left-width'))+parseFloat(jQuery((el)).css('border-right-width')):0;elWidth+=elMargin+elPadding+elBorder;return elWidth}if(options.mousetrace){var mousetrace=jQuery(document.createElement('div')).css('position','absolute').css('top','0').css('background-color','#fff').css('color','#000').css('padding','3px 5px').css('x-index','30').html('X: 0 Y: 0');showcase.append(mousetrace);var offset=showcase.offset();content_container.mousemove(function(e){mousetrace.html('X: '+(e.pageX-offset.left)+' Y: '+(e.pageY-offset.top))})}$('#awOnePageButton').click(function showInOnePage(){if($('.view-page').is(':visible')){var temp_container=jQuery(document.createElement('div'));temp_container.addClass('showcase-onepage');showcase.before(temp_container);if(myInterval){pause_loop=true;clearInterval(myInterval)}$(this).find('.view-page').hide();$(this).find('.view-slide').show();showcase.hide();$.each(contentArray,function(index,value){obj=getContent(index);obj.css('position','relative');temp_container.append(obj);displayAnchors(obj);displayCaption(obj);if(options.dynamic_height){obj.css('height',obj.find('.showcase-content').children().height())}else{obj.css('height',options.content_height)}});var clear=jQuery(document.createElement('div'));clear.addClass('clear');temp_container.append(clear)}else{$('.showcase-onepage').remove();$(this).find('.view-page').show();$(this).find('.view-slide').hide();showcase.show()}return false});var addedContentArray=[];function updateContentViewlineWidth(){content_viewline_width=0;content_container.children('div').each(function(){content_viewline_width+=$(this).find('.showcase-content').children().width();addedContentArray.push($(this))})}showcase.removeClass('showcase-load')}})(jQuery);



/*
=============================================== 06. ANYTHING SLIDER JQUERY PLUGINS - jQuery plugin   ===============================================	
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
/*
	AnythingSlider v1.7.12
	Original by Chris Coyier: http://css-tricks.com
	Get the latest version: https://github.com/ProLoser/AnythingSlider

	To use the navigationFormatter function, you must have a function that
	accepts two paramaters, and returns a string of HTML text.

	index = integer index (1 based);
	panel = jQuery wrapped LI item this tab references
	@return = Must return a string of HTML/Text

	navigationFormatter: function(index, panel){
		return "Panel #" + index; // This would have each tab with the text 'Panel #X' where X = index
	}
*/

(function($) {

	$.anythingSlider = function(el, options) {

		var base = this, o;

		// Wraps the ul in the necessary divs and then gives Access to jQuery element
		base.el = el;
		base.$el = $(el).addClass('anythingBase').wrap('<div class="anythingSlider"><div class="anythingWindow" /></div>');

		// Add a reverse reference to the DOM object
		base.$el.data("AnythingSlider", base);

		base.init = function(){

			// Added "o" to be used in the code instead of "base.options" which doesn't get modifed by the compiler - reduces size by ~1k
			base.options = o = $.extend({}, $.anythingSlider.defaults, options);

			base.initialized = false;
			if ($.isFunction(o.onBeforeInitialize)) { base.$el.bind('before_initialize', o.onBeforeInitialize); }
			base.$el.trigger('before_initialize', base);

			// Cache existing DOM elements for later
			// base.$el = original ul
			// for wrap - get parent() then closest in case the ul has "anythingSlider" class
			base.$wrapper = base.$el.parent().closest('div.anythingSlider').addClass('anythingSlider-' + o.theme);
			base.$window = base.$el.closest('div.anythingWindow');
			base.win = window;
			base.$win = $(base.win);

			base.$controls = $('<div class="anythingControls"></div>').appendTo( (o.appendControlsTo !== null && $(o.appendControlsTo).length) ? $(o.appendControlsTo) : base.$wrapper);
			base.$startStop = $('<a href="#" class="start-stop"></a>');
			if (o.buildStartStop) {
				base.$startStop.appendTo( (o.appendStartStopTo !== null && $(o.appendStartStopTo).length) ? $(o.appendStartStopTo) : base.$controls );
			}
			base.$nav = $('<ul class="thumbNav" />').appendTo( (o.appendNavigationTo !== null && $(o.appendNavigationTo).length) ? $(o.appendNavigationTo) : base.$controls );

			// Set up a few defaults & get details
			base.flag    = false; // event flag to prevent multiple calls (used in control click/focusin)
			base.playing = o.autoPlay; // slideshow state; removed "startStopped" option
			base.slideshow = false; // slideshow flag needed to correctly trigger slideshow events
			base.hovered = false; // actively hovering over the slider
			base.panelSize = [];  // will contain dimensions and left position of each panel
			base.currentPage = o.startPanel = parseInt(o.startPanel,10) || 1; // make sure this isn't a string
			o.changeBy = parseInt(o.changeBy,10) || 1;
			base.adj = (o.infiniteSlides) ? 0 : 1; // adjust page limits for infinite or limited modes
			base.width = base.$el.width();
			base.height = base.$el.height();
			base.outerPad = [ base.$wrapper.innerWidth() - base.$wrapper.width(), base.$wrapper.innerHeight() - base.$wrapper.height() ];
			if (o.playRtl) { base.$wrapper.addClass('rtl'); }

			// Expand slider to fit parent
			if (o.expand) {
				base.$outer = base.$wrapper.parent();
				base.$window.css({ width: '100%', height: '100%' }); // needed for Opera
				base.checkResize();
			}

			// Build start/stop button
			if (o.buildStartStop) { base.buildAutoPlay(); }

			// Build forwards/backwards buttons
			if (o.buildArrows) { base.buildNextBackButtons(); }

			// can't lock autoplay it if it's not enabled
			if (!o.autoPlay) { o.autoPlayLocked = false; }

			base.updateSlider();

			base.$lastPage = base.$currentPage;

			// Get index (run time) of this slider on the page
			base.runTimes = $('div.anythingSlider').index(base.$wrapper) + 1;
			base.regex = new RegExp('panel' + base.runTimes + '-(\\d+)', 'i'); // hash tag regex
			if (base.runTimes === 1) { base.makeActive(); } // make the first slider on the page active

			// Make sure easing function exists.
			if (!$.isFunction($.easing[o.easing])) { o.easing = "swing"; }

			// If pauseOnHover then add hover effects
			if (o.pauseOnHover) {
				base.$wrapper.hover(function() {
					if (base.playing) {
						base.$el.trigger('slideshow_paused', base);
						base.clearTimer(true);
					}
				}, function() {
					if (base.playing) {
						base.$el.trigger('slideshow_unpaused', base);
						base.startStop(base.playing, true);
					}
				});
			}

			// If a hash can not be used to trigger the plugin, then go to start panel
			base.setCurrentPage(base.gotoHash() || o.startPage, false);

			// Hide/Show navigation & play/stop controls
			base.slideControls(false);
			base.$wrapper.bind('mouseenter mouseleave', function(e){
				base.hovered = (e.type === "mouseenter") ? true : false;
				base.slideControls( base.hovered, false );
			});

			// Add keyboard navigation
			$(document).keyup(function(e){
				// Stop arrow keys from working when focused on form items
				if (o.enableKeyboard && base.$wrapper.is('.activeSlider') && !e.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
					if (!o.vertical && (e.which === 38 || e.which === 40)) { return; }
					switch (e.which) {
						case 39: case 40: // right & down arrow
							base.goForward();
							break;
						case 37: case 38: // left & up arrow
							base.goBack();
							break;
					}
				}
			});

			// Fix tabbing through the page, but don't change the view if the link is in view (showMultiple = true)
			base.$items.delegate('a', 'focus.AnythingSlider', function(e){
				var panel = $(this).closest('.panel'),
				 indx = base.$items.index(panel) + base.adj;
				base.$items.find('.focusedLink').removeClass('focusedLink');
				$(this).addClass('focusedLink');
				base.$window.scrollLeft(0);
				if ( (indx >= base.currentPage + o.showMultiple || indx < base.currentPage)) {
					base.gotoPage(indx);
					e.preventDefault();
				}
			});

			// Binds events
			var triggers = "slideshow_paused slideshow_unpaused slide_init slide_begin slideshow_stop slideshow_start initialized swf_completed".split(" ");
			$.each("onShowPause onShowUnpause onSlideInit onSlideBegin onShowStop onShowStart onInitialized onSWFComplete".split(" "), function(i,f){
				if ($.isFunction(o[f])){
					base.$el.bind(triggers[i], o[f]);
				}
			});
			if ($.isFunction(o.onSlideComplete)){
				// Added setTimeout (zero time) to ensure animation is complete... see this bug report: http://bugs.jquery.com/ticket/7157
				base.$el.bind('slide_complete', function(){
					setTimeout(function(){ o.onSlideComplete(base); }, 0);
				});
			}
			base.initialized = true;
			base.$el.trigger('initialized', base);

			// trigger the slideshow
			base.startStop(base.playing);

		};

		// called during initialization & to update the slider if a panel is added or deleted
		base.updateSlider = function(){
			// needed for updating the slider
			base.$el.children('.cloned').remove();
			base.$nav.empty();
			// set currentPage to 1 in case it was zero - occurs when adding slides after removing them all
			base.currentPage = base.currentPage || 1;

			base.$items = base.$el.children();
			base.pages = base.$items.length;
			base.dir = (o.vertical) ? 'top' : 'left';
			o.showMultiple = (o.vertical) ? 1 : parseInt(o.showMultiple,10) || 1; // only integers allowed

			if (o.showMultiple > 1) {
				if (o.showMultiple > base.pages) { o.showMultiple = base.pages; }
				base.adjustMultiple = (o.infiniteSlides && base.pages > 1) ? 0 : o.showMultiple - 1;
				base.pages = base.$items.length - base.adjustMultiple;
			}

			// Hide navigation & player if there is only one page
			base.$controls
				.add(base.$nav)
				.add(base.$startStop)
				.add(base.$forward)
				.add(base.$back)[(base.pages <= 1) ? 'hide' : 'show']();
			if (base.pages > 1) {
				// Build/update navigation tabs
				base.buildNavigation();
			}

			// Top and tail the list with 'visible' number of items, top has the last section, and tail has the first
			// This supports the "infinite" scrolling, also ensures any cloned elements don't duplicate an ID
			// Moved removeAttr before addClass otherwise IE7 ignores the addClass: http://bugs.jquery.com/ticket/9871
			if (o.infiniteSlides && base.pages > 1) {
				base.$el.prepend( base.$items.filter(':last').clone().removeAttr('id').addClass('cloned') );
				// Add support for multiple sliders shown at the same time
				if (o.showMultiple > 1) {
					base.$el.append( base.$items.filter(':lt(' + o.showMultiple + ')').clone().removeAttr('id').addClass('cloned').addClass('multiple') );
				} else {
					base.$el.append( base.$items.filter(':first').clone().removeAttr('id').addClass('cloned') );
				}
				base.$el.find('.cloned').each(function(){
					// disable all focusable elements in cloned panels to prevent shifting the panels by tabbing
					$(this).find('a,input,textarea,select,button,area').attr('disabled', 'disabled');
					$(this).find('[id]').removeAttr('id');
				});
			}

			// We just added two items, time to re-cache the list, then get the dimensions of each panel
			base.$items = base.$el.children().addClass('panel' + (o.vertical ? ' vertical' : ''));
			base.setDimensions();

			// Set the dimensions of each panel
			if (o.resizeContents) {
				base.$items.css('width', base.width);
				base.$wrapper.css('width', base.getDim(base.currentPage)[0]);
				base.$wrapper.add(base.$items).css('height', base.height);
			} else {
				base.$win.load(function(){ base.setDimensions(); }); // set dimensions after all images load
			}

			if (base.currentPage > base.pages) {
				base.currentPage = base.pages;
			}
			base.setCurrentPage(base.currentPage, false);
			base.$nav.find('a').eq(base.currentPage - 1).addClass('cur'); // update current selection

		};

		// Creates the numbered navigation links
		base.buildNavigation = function() {
			if (o.buildNavigation && (base.pages > 1)) {
				var t, $a;
				base.$items.filter(':not(.cloned)').each(function(i) {
					var index = i + 1;
					t = ((index === 1) ? 'first' : '') + ((index === base.pages) ? 'last' : '');
					$a = $('<a href="#"></a>').addClass('panel' + index).wrap('<li class="' + t + '" />');
					base.$nav.append($a.parent()); // use $a.parent() so it will add <li> instead of only the <a> to the <ul>

					// If a formatter function is present, use it
					if ($.isFunction(o.navigationFormatter)) {
						t = o.navigationFormatter(index, $(this));
						$a.html('<span>' + t + '</span>');
						// Add formatting to title attribute if text is hidden
						if (parseInt($a.find('span').css('text-indent'),10) < 0) { $a.addClass(o.tooltipClass).attr('title', t); }
					} else {
						$a.html('<span>' + index + '</span>');
					}

					$a.bind(o.clickControls, function(e) {
						if (!base.flag && o.enableNavigation) {
							// prevent running functions twice (once for click, second time for focusin)
							base.flag = true; setTimeout(function(){ base.flag = false; }, 100);
							base.gotoPage(index);
							if (o.hashTags) { base.setHash(index); }
						}
						e.preventDefault();
					});
				});

				// Add navigation tab scrolling
				if (o.navigationSize !== false && parseInt(o.navigationSize,10) < base.pages) {
					if (!base.$controls.find('.anythingNavWindow').length){
						base.$nav
							.before('<ul><li class="prev"><a href="#"><span>' + o.backText + '</span></a></li></ul>')
							.after('<ul><li class="next"><a href="#"><span>' + o.forwardText + '</span></a></li></ul>')
							.wrap('<div class="anythingNavWindow"></div>');
					}
					// include half of the left position to include extra width from themes like tabs-light and tabs-dark (still not perfect)
					base.navWidths = base.$nav.find('li').map(function(){
						return $(this).innerWidth() + Math.ceil(parseInt($(this).find('span').css('left'),10)/2 || 0);
					}).get();
					base.navLeft = 1;
					// add 5 pixels to make sure the tabs don't wrap to the next line
					base.$nav.width( base.navWidth( 1, base.pages + 1 ) + 5 );
					base.$controls.find('.anythingNavWindow')
						.width( base.navWidth( 1, o.navigationSize + 1 ) ).end()
						.find('.prev,.next').bind(o.clickControls, function(e) {
							if (!base.flag) {
								base.flag = true; setTimeout(function(){ base.flag = false; }, 200);
								base.navWindow( base.navLeft + o.navigationSize * ( $(this).is('.prev') ? -1 : 1 ) );
							}
							e.preventDefault();
						});
				}

			}
		};

		base.navWidth = function(x,y){
			var s = Math.min(x,y),
				e = Math.max(x,y),
				w = 0;
			for (; s < e; s++) {
				w += base.navWidths[s-1] || 0;
			}
			return w;
		};

		base.navWindow = function(n){
			var p = base.pages - o.navigationSize + 1;
			n = (n <= 1) ? 1 : (n > 1 && n < p) ? n : p;
			if (n !== base.navLeft) {
				base.$controls.find('.anythingNavWindow').animate(
					{ scrollLeft: base.navWidth(1, n), width: base.navWidth(n, n + o.navigationSize) },
					{ queue: false, duration: o.animationTime });
				base.navLeft = n;
			}
		};

		// Creates the Forward/Backward buttons
		base.buildNextBackButtons = function() {
			base.$forward = $('<span class="arrow forward"><a href="#"><span>' + o.forwardText + '</span></a></span>');
			base.$back = $('<span class="arrow back"><a href="#"><span>' + o.backText + '</span></a></span>');

			// Bind to the forward and back buttons
			base.$back.bind(o.clickBackArrow, function(e) {
				// prevent running functions twice (once for click, second time for swipe)
				if (o.enableArrows && !base.flag) {
					base.flag = true; setTimeout(function(){ base.flag = false; }, 100);
					base.goBack();
				}
				e.preventDefault();
			});
			base.$forward.bind(o.clickForwardArrow, function(e) {
				// prevent running functions twice (once for click, second time for swipe)
				if (o.enableArrows && !base.flag) {
					base.flag = true; setTimeout(function(){ base.flag = false; }, 100);
					base.goForward();
				}
				e.preventDefault();
			});
			// using tab to get to arrow links will show they have focus (outline is disabled in css)
			base.$back.add(base.$forward).find('a').bind('focusin focusout',function(){
			 $(this).toggleClass('hover');
			});

			// Append elements to page
			base.$back.appendTo( (o.appendBackTo !== null && $(o.appendBackTo).length) ? $(o.appendBackTo) : base.$wrapper );
			base.$forward.appendTo( (o.appendForwardTo !== null && $(o.appendForwardTo).length) ? $(o.appendForwardTo) : base.$wrapper );

			base.$arrowWidth = base.$forward.width(); // assuming the left & right arrows are the same width - used for toggle
		};

		// Creates the Start/Stop button
		base.buildAutoPlay = function(){
			base.$startStop
				.html('<span>' + (base.playing ? o.stopText : o.startText) + '</span>')
				.bind(o.clickSlideshow, function(e) {
					if (o.enableStartStop) {
						base.startStop(!base.playing);
						base.makeActive();
						if (base.playing && !o.autoPlayDelayed) {
							base.goForward(true);
						}
					}
					e.preventDefault();
				})
				// show button has focus while tabbing
				.bind('focusin focusout',function(){
					$(this).toggleClass('hover');
				});
		};

		// Adjust slider dimensions on parent element resize
		base.checkResize = function(stopTimer){
			clearTimeout(base.resizeTimer);
			base.resizeTimer = setTimeout(function(){
				var w = base.$outer.width() - base.outerPad[0],
					h = (base.$outer[0].tagName === "BODY" ? base.$win.height() : base.$outer.height()) - base.outerPad[1];
				// base.width = width of one panel, so multiply by # of panels; outerPad is padding added for arrows.
				if (base.width * o.showMultiple !== w || base.height !== h) {
					base.setDimensions(); // adjust panel sizes
					// make sure page is lined up (use -1 animation time, so we can differeniate it from when animationTime = 0)
					base.gotoPage(base.currentPage, base.playing, null, -1);
				}
				if (typeof(stopTimer) === 'undefined'){ base.checkResize(); }
			}, 500);
		};

		// Set panel dimensions to either resize content or adjust panel to content
		base.setDimensions = function(){
			var w, h, c, edge = 0,
				// determine panel width
				pw = (o.showMultiple > 1) ? base.width || base.$window.width()/o.showMultiple : base.$window.width(),
				winw = base.$win.width();
			if (o.expand){
				w = base.$outer.width() - base.outerPad[0];
				base.height = h = base.$outer.height() - base.outerPad[1];
				base.$wrapper.add(base.$window).add(base.$items).css({ width: w, height: h });
				base.width = pw = (o.showMultiple > 1) ? w/o.showMultiple : w;
			}
			base.$items.each(function(i){
				c = $(this).children();
				if (o.resizeContents){
					// resize panel
					w = base.width;
					h = base.height;
					$(this).css({ width: w, height: h });
					if (c.length && c[0].tagName === "EMBED") { c.attr({ width: '100%', height: '100%' }); } // needed for IE7; also c.length > 1 in IE7
					// resize panel contents, if solitary (wrapped content or solitary image)
					if (c.length === 1){
						c.css({ width: '100%', height: '100%' });
					}
				} else {
					// get panel width & height and save it
					w = $(this).width(); // if not defined, it will return the width of the ul parent
					if (c.length === 1 && w >= winw){
						w = (c.width() >= winw) ? pw : c.width(); // get width of solitary child
						c.css('max-width', w);   // set max width for all children
					}
					$(this).css('width', w); // set width of panel
					h = (c.length === 1) ? c.outerHeight(true) : $(this).height(); // get height after setting width
					$(this).css('height', h);
				}
				base.panelSize[i] = [w,h,edge];
				edge += (o.vertical) ? h : w;
			});
			// Set total width of slider, Note that this is limited to 32766 by Opera - option removed
			base.$el.css((o.vertical ? 'height' : 'width'), edge);
		};

		// get dimension of multiple panels, as needed
		base.getDim = function(page){
			if (base.pages < 1 || isNaN(page)) { return [ base.width, base.height ]; } // prevent errors when base.panelSize is empty
			page = (o.infiniteSlides && base.pages > 1) ? page : page - 1;
			var i,
				w = base.panelSize[page][0],
				h = base.panelSize[page][1];
			if (o.showMultiple > 1) {
				for (i=1; i < o.showMultiple; i++) {
					w += base.panelSize[(page + i)%o.showMultiple][0];
					h = Math.max(h, base.panelSize[page + i][1]);
				}
			}
			return [w,h];
		};

		base.goForward = function(autoplay) {
			base.gotoPage(base.currentPage + o.changeBy * (o.playRtl ? -1 : 1), autoplay);
		};

		base.goBack = function(autoplay) {
			base.gotoPage(base.currentPage + o.changeBy * (o.playRtl ? 1 : -1), autoplay);
		};

		base.gotoPage = function(page, autoplay, callback, time) {
			if (autoplay !== true) {
				autoplay = false;
				base.startStop(false);
				base.makeActive();
			}
			// check if page is an id or class name
			if (/^[#|.]/.test(page) && $(page).length) {
				page = $(page).closest('.panel').index() + base.adj;
			}
			// rewind effect occurs here when changeBy > 1 
			if (o.changeBy !== 1){
				if (page < 0) { page += base.pages; }
				if (page > base.pages) { page -= base.pages; }
			}
			if (base.pages <= 1) { return; } // prevents animation
			base.$lastPage = base.$currentPage;
			if (typeof(page) !== "number") {
				page = o.startPanel;
				base.setCurrentPage(page);
			}

			// pause YouTube videos before scrolling or prevent change if playing
			if (autoplay && o.isVideoPlaying(base)) { return; }

			if (page > base.pages + 1 - base.adj) { page = (!o.infiniteSlides && !o.stopAtEnd) ? 1 : base.pages; }
			if (page < base.adj ) { page = (!o.infiniteSlides && !o.stopAtEnd) ? base.pages : 1; }
			base.currentPage = ( page > base.pages ) ? base.pages : ( page < 1 ) ? 1 : base.currentPage;
			base.$currentPage = base.$items.eq(base.currentPage - base.adj);
			base.exactPage = page;
			base.$targetPage = base.$items.eq( (page === 0) ? base.pages - base.adj : (page > base.pages) ? 1 - base.adj : page - base.adj );
			time = time || o.animationTime;
			// don't trigger events when time = 1 - to prevent FX from firing multiple times on page resize
			if (time >= 0) { base.$el.trigger('slide_init', base); }

			base.slideControls(true, false);

			// When autoplay isn't passed, we stop the timer
			if (autoplay !== true) { autoplay = false; }
			// Stop the slider when we reach the last page, if the option stopAtEnd is set to true
			if (!autoplay || (o.stopAtEnd && page === base.pages)) { base.startStop(false); }

			if (time >= 0) { base.$el.trigger('slide_begin', base); }

			// delay starting slide animation
			setTimeout(function(d){
				// resize slider if content size varies
				if (!o.resizeContents) {
					// animating the wrapper resize before the window prevents flickering in Firefox
					d = base.getDim(page);
					base.$wrapper.filter(':not(:animated)').animate(
						// prevent animating a dimension to zero
						{ width: d[0] || base.width, height: d[1] || base.height },
						{ queue: false, duration: (time < 0 ? 0 : time), easing: o.easing }
					);
				}
				d = {};
				d[base.dir] = -base.panelSize[(o.infiniteSlides && base.pages > 1) ? page : page - 1][2];
				// Animate Slider
				base.$el.filter(':not(:animated)').animate(
					d, { queue: false, duration: time, easing: o.easing, complete: function(){ base.endAnimation(page, callback, time); } }
				);
			}, parseInt(o.delayBeforeAnimate, 10) || 0);
		};

		base.endAnimation = function(page, callback, time){
			if (page === 0) {
				base.$el.css( base.dir, -base.panelSize[base.pages][2]);
				page = base.pages;
			} else if (page > base.pages) {
				// reset back to start position
				base.$el.css( base.dir, -base.panelSize[1][2]);
				page = 1;
			}
			base.exactPage = page;
			base.setCurrentPage(page, false);
			// Add active panel class
			base.$items.removeClass('activePage').eq(page - base.adj).addClass('activePage');

			if (!base.hovered) { base.slideControls(false); }

			if (time >= 0) { base.$el.trigger('slide_complete', base); }
			// callback from external slide control: $('#slider').anythingSlider(4, function(slider){ })
			if (typeof callback === 'function') { callback(base); }

			// Continue slideshow after a delay
			if (o.autoPlayLocked && !base.playing) {
				setTimeout(function(){
					base.startStop(true);
				// subtract out slide delay as the slideshow waits that additional time.
				}, o.resumeDelay - (o.autoPlayDelayed ? o.delay : 0));
			}
		};

		base.setCurrentPage = function(page, move) {
			page = parseInt(page, 10);
			if (base.pages < 1 || page === 0 || isNaN(page)) { return; }
			if (page > base.pages + 1 - base.adj) { page = base.pages - base.adj; }
			if (page < base.adj ) { page = 1; }

			// Set visual
			if (o.buildNavigation){
				base.$nav
					.find('.cur').removeClass('cur').end()
					.find('a').eq(page - 1).addClass('cur');
			}

			// hide/show arrows based on infinite scroll mode
			if (!o.infiniteSlides && o.stopAtEnd){
				base.$wrapper
					.find('span.forward')[ page === base.pages ? 'addClass' : 'removeClass']('disabled').end()
					.find('span.back')[ page === 1 ? 'addClass' : 'removeClass']('disabled');
				if (page === base.pages && base.playing) { base.startStop(); }
			}

			// Only change left if move does not equal false
			if (!move) {
				var d = base.getDim(page);
				base.$wrapper
					.css({ width: d[0], height: d[1] })
					.add(base.$window).scrollLeft(0); // reset in case tabbing changed this scrollLeft - probably overly redundant
				base.$el.css( base.dir, -base.panelSize[(o.infiniteSlides && base.pages > 1) ? page : page - 1][2] );
			}
			// Update local variable
			base.currentPage = page;
			base.$currentPage = base.$items.removeClass('activePage').eq(page - base.adj).addClass('activePage');

		};

		base.makeActive = function(){
			// Set current slider as active so keyboard navigation works properly
			if (!base.$wrapper.is('.activeSlider')){
				$('.activeSlider').removeClass('activeSlider');
				base.$wrapper.addClass('activeSlider');
			}
		};

		// This method tries to find a hash that matches an ID and panel-X
		// If either found, it tries to find a matching item
		// If that is found as well, then it returns the page number
		base.gotoHash = function(){
			var h = base.win.location.hash,
				i = h.indexOf('&'),
				n = h.match(base.regex);
			if (n === null && !/^#&/.test(h)) {
				// #quote2&panel1-3&panel3-3
				h = h.substring(0, (i >= 0 ? i : h.length));
				// ensure the element is in the same slider
				n = ($(h).closest('.anythingBase')[0] === base.el) ? $(h).closest('.panel').index() : null;
			} else if (n !== null) {
				// #&panel1-3&panel3-3
				n = (o.hashTags) ? parseInt(n[1],10) : null;
			}
			return n;
		};

		base.setHash = function(n){
			var s = 'panel' + base.runTimes + '-',
				h = base.win.location.hash;
			if ( typeof h !== 'undefined' ) {
				base.win.location.hash = (h.indexOf(s) > 0) ? h.replace(base.regex, s + n) : h + "&" + s + n;
			}
		};

		// Slide controls (nav and play/stop button up or down)
		base.slideControls = function(toggle){
			var dir = (toggle) ? 'slideDown' : 'slideUp',
				t1 = (toggle) ? 0 : o.animationTime,
				t2 = (toggle) ? o.animationTime: 0,
				op = (toggle) ? 1 : 0,
				sign = (toggle) ? 0 : 1; // 0 = visible, 1 = hidden
			if (o.toggleControls) {
				base.$controls.stop(true,true).delay(t1)[dir](o.animationTime/2).delay(t2);
			}
			if (o.buildArrows && o.toggleArrows) {
				if (!base.hovered && base.playing) { sign = 1; op = 0; } // don't animate arrows during slideshow
				base.$forward.stop(true,true).delay(t1).animate({ right: sign * base.$arrowWidth, opacity: op }, o.animationTime/2);
				base.$back.stop(true,true).delay(t1).animate({ left: sign * base.$arrowWidth, opacity: op }, o.animationTime/2);
			}
		};

		base.clearTimer = function(paused){
			// Clear the timer only if it is set
			if (base.timer) {
				base.win.clearInterval(base.timer);
				if (!paused && base.slideshow) {
					base.$el.trigger('slideshow_stop', base);
					base.slideshow = false;
				}
			}
		};

		// Pass startStop(false) to stop and startStop(true) to play
		base.startStop = function(playing, paused) {
			if (playing !== true) { playing = false; }  // Default if not supplied is false
			base.playing = playing;

			if (playing && !paused) {
				base.$el.trigger('slideshow_start', base);
				base.slideshow = true;
			}

			// Toggle playing and text
			if (o.buildStartStop) {
				base.$startStop.toggleClass('playing', playing).find('span').html( playing ? o.stopText : o.startText );
				// add button text to title attribute if it is hidden by text-indent
				if (parseInt(base.$startStop.find('span').css('text-indent'),10) < 0) {
					base.$startStop.addClass(o.tooltipClass).attr( 'title', playing ? o.stopText : o.startText );
				}
			}

			// Pause slideshow while video is playing
			if (playing){
				base.clearTimer(true); // Just in case this was triggered twice in a row
				base.timer = base.win.setInterval(function() {
					// prevent autoplay if video is playing
					if ( !o.isVideoPlaying(base) ) {
						base.goForward(true);
					// stop slideshow if resume if false
					} else if (!o.resumeOnVideoEnd) {
						base.startStop();
					}
				}, o.delay);
			} else {
				base.clearTimer();
			}
		};

		// Trigger the initialization
		base.init();
	};

	$.anythingSlider.defaults = {
		// Appearance
		theme               : "default", // Theme name, add the css stylesheet manually
		expand              : false,     // If true, the entire slider will expand to fit the parent element
		resizeContents      : true,      // If true, solitary images/objects in the panel will expand to fit the viewport
		vertical            : false,     // If true, all panels will slide vertically; they slide horizontally otherwise
		showMultiple        : false,     // Set this value to a number and it will show that many slides at once
		easing              : "swing",   // Anything other than "linear" or "swing" requires the easing plugin or jQuery UI

		buildArrows         : true,      // If true, builds the forwards and backwards buttons
		buildNavigation     : true,      // If true, builds a list of anchor links to link to each panel
		buildStartStop      : true,      // ** If true, builds the start/stop button

		appendForwardTo     : null,      // Append forward arrow to a HTML element (jQuery Object, selector or HTMLNode), if not null
		appendBackTo        : null,      // Append back arrow to a HTML element (jQuery Object, selector or HTMLNode), if not null
		appendControlsTo    : null,      // Append controls (navigation + start-stop) to a HTML element (jQuery Object, selector or HTMLNode), if not null
		appendNavigationTo  : null,      // Append navigation buttons to a HTML element (jQuery Object, selector or HTMLNode), if not null
		appendStartStopTo   : null,      // Append start-stop button to a HTML element (jQuery Object, selector or HTMLNode), if not null

		toggleArrows        : false,     // If true, side navigation arrows will slide out on hovering & hide @ other times
		toggleControls      : false,     // if true, slide in controls (navigation + play/stop button) on hover and slide change, hide @ other times

		startText           : "Start",   // Start button text
		stopText            : "Stop",    // Stop button text
		forwardText         : "&raquo;", // Link text used to move the slider forward (hidden by CSS, replaced with arrow image)
		backText            : "&laquo;", // Link text used to move the slider back (hidden by CSS, replace with arrow image)
		tooltipClass        : "tooltip", // Class added to navigation & start/stop button (text copied to title if it is hidden by a negative text indent)

		// Function
		enableArrows        : true,      // if false, arrows will be visible, but not clickable.
		enableNavigation    : true,      // if false, navigation links will still be visible, but not clickable.
		enableStartStop     : true,      // if false, the play/stop button will still be visible, but not clickable. Previously "enablePlay"
		enableKeyboard      : true,      // if false, keyboard arrow keys will not work for this slider.

		// Navigation
		startPanel          : 1,         // This sets the initial panel
		changeBy            : 1,         // Amount to go forward or back when changing panels.
		hashTags            : true,      // Should links change the hashtag in the URL?
		infiniteSlides      : true,      // if false, the slider will not wrap & not clone any panels
		navigationFormatter : null,      // Details at the top of the file on this use (advanced use)
		navigationSize      : false,     // Set this to the maximum number of visible navigation tabs; false to disable

		// Slideshow options
		autoPlay            : false,     // If true, the slideshow will start running; replaces "startStopped" option
		autoPlayLocked      : false,     // If true, user changing slides will not stop the slideshow
		autoPlayDelayed     : false,     // If true, starting a slideshow will delay advancing slides; if false, the slider will immediately advance to the next slide when slideshow starts
		pauseOnHover        : true,      // If true & the slideshow is active, the slideshow will pause on hover
		stopAtEnd           : false,     // If true & the slideshow is active, the slideshow will stop on the last page. This also stops the rewind effect when infiniteSlides is false.
		playRtl             : false,     // If true, the slideshow will move right-to-left

		// Times
		delay               : 3000,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
		resumeDelay         : 15000,     // Resume slideshow after user interaction, only if autoplayLocked is true (in milliseconds).
		animationTime       : 600,       // How long the slideshow transition takes (in milliseconds)
		delayBeforeAnimate  : 0,         // How long to pause slide animation before going to the desired slide (used if you want your "out" FX to show).

		// Callbacks - removed from options to reduce size - they still work

		// Interactivity
		clickForwardArrow   : "click",         // Event used to activate forward arrow functionality (e.g. add jQuery mobile's "swiperight")
		clickBackArrow      : "click",         // Event used to activate back arrow functionality (e.g. add jQuery mobile's "swipeleft")
		clickControls       : "click focusin", // Events used to activate navigation control functionality
		clickSlideshow      : "click",         // Event used to activate slideshow play/stop button

		// Video
		resumeOnVideoEnd    : true,      // If true & the slideshow is active & a supported video is playing, it will pause the autoplay until the video is complete
		addWmodeToObject    : "opaque",  // If your slider has an embedded object, the script will automatically add a wmode parameter with this setting
		isVideoPlaying      : function(base){ return false; } // return true if video is playing or false if not - used by video extension

	};

	$.fn.anythingSlider = function(options, callback) {

		return this.each(function(){
			var page, anySlide = $(this).data('AnythingSlider');

			// initialize the slider but prevent multiple initializations
			if ((typeof(options)).match('object|undefined')){
				if (!anySlide) {
					(new $.anythingSlider(this, options));
				} else {
					anySlide.updateSlider();
				}
			// If options is a number, process as an external link to page #: $(element).anythingSlider(#)
			} else if (/\d/.test(options) && !isNaN(options) && anySlide) {
				page = (typeof(options) === "number") ? options : parseInt($.trim(options),10); // accepts "  2  "
				// ignore out of bound pages
				if ( page >= 1 && page <= anySlide.pages ) {
					anySlide.gotoPage(page, false, callback); // page #, autoplay, one time callback
				}
			// Accept id or class name
			} else if (/^[#|.]/.test(options) && $(options).length) {
				anySlide.gotoPage(options, false, callback);
			}
		});
	};

})(jQuery);
/*
 * AnythingSlider Video Controller 1.0 beta for AnythingSlider v1.6+
 * By Rob Garrison (aka Mottie & Fudgey)
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {
	$.fn.anythingSliderVideo = function(options){

		//Set the default values, use comma to separate the settings, example:
		var defaults = {
			videoID : 'asvideo' // id prefix
		};

		return this.each(function(){
			// make sure a AnythingSlider is attached
			var video, tmp, service, sel, base = $(this).data('AnythingSlider');
			if (!base) { return; }
			video = base.video = {};
			video.options = $.extend({}, defaults, options);

			// check if SWFObject is loaded
			video.hasSwfo = (typeof(swfobject) !== 'undefined' && swfobject.hasOwnProperty('embedSWF') && typeof(swfobject.embedSWF) === 'function') ? true : false;

			video.list = {};
			video.hasVid = false;
			video.hasEmbed = false;
			video.services = $.fn.anythingSliderVideo.services;
			video.len = 0; // used to add a unique ID to videos "asvideo#"
			video.hasEmbedCount = 0;
			video.hasiframeCount = 0;
			video.$items = base.$items.filter(':not(.cloned)');

			// find and save all known videos
			for (service in video.services) {
				if (typeof(service) === 'string') {
					sel = video.services[service].selector;
					video.$items.find(sel).each(function(){
						tmp = $(this);
						// save panel and video selector in the list
						tmp.attr('id', video.options.videoID + video.len);
						video.list[video.len] = {
							id       : video.options.videoID + video.len++,
							panel    : tmp.closest('.panel')[0],
							service  : service,
							selector : sel,
							status   : -1 // YouTube uses -1 to mean the video is unstarted 
						};
						video.hasVid = true;
						if (sel.match('embed|object')) {
							video.hasEmbed = true;
							video.hasEmbedCount++;
						} else if (sel.match('iframe')) {
							video.hasiframeCount++;
						}
					});
				}
			}

			// Initialize each video, as needed
			$.each(video.list, function(i,s){
				// s.id = ID, s.panel = slider panel (DOM), s.selector = 'jQuery selector'
				var tmp, $tar, vidsrc, opts,
					$vid = $(s.panel).find(s.selector),
					service = video.services[s.service],
					api = service.initAPI || '';
				// Initialize embeded video javascript api using SWFObject, if loaded
				if (video.hasEmbed && video.hasSwfo && s.selector.match('embed|object')) {
					$vid.each(function(){
						// Older IE doesn't have an object - just make sure we are wrapping the correct element
						$tar = ($(this).parent()[0].tagName === 'OBJECT') ? $(this).parent() : $(this);
						vidsrc = ($tar[0].tagName === 'EMBED') ? $tar.attr('src') : $tar.find('embed').attr('src') || $tar.children().filter('[name=movie]').attr('value');
						opts = $.extend(true, {}, {
							flashvars : null,
							params    : { allowScriptAccess: 'always', wmode : base.options.addWmodeToObject, allowfullscreen : true },
							attr      : { 'class' : $tar.attr('class'), 'style' : $tar.attr('style'), 'data-url' : vidsrc }
						}, service.embedOpts);
						$tar.wrap('<div id="' + s.id + '"></div>');
						// use SWFObject if it exists, it replaces the wrapper with the object/embed
						swfobject.embedSWF(vidsrc + (api === '' ? '': api + s.id), s.id,
							$tar.attr('width'), $tar.attr('height'), '10', null,
							opts.flashvars, opts.params, opts.attr, function(){
								// run init code if it exists
								if (service.hasOwnProperty('init')) {
									video.list[i].player = service.init(base, s.id, i);
								}
								if (i >= video.hasEmbedCount) {
									base.$el.trigger('swf_completed', base); // swf callback
								}
							}
						);
					});
				} else if (s.selector.match('iframe')) {
					$vid.each(function(i,v){
						vidsrc = $(this).attr('src');
						tmp = (vidsrc.match(/\?/g) ? '' : '?') + '&wmode=' + base.options.addWmodeToObject; // string connector & wmode
						$(this).attr('src', function(i,r){ return r + tmp + (api === '' ? '': api + s.id); });
					});
				}
			});

			// Returns URL parameter; url: http://www.somesite.com?name=hello&id=11111
			// Original code from Netlobo.com (http://www.netlobo.com/url_query_string_javascript.html)
			video.gup = function(n,s){
				n = n.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
				var p = (new RegExp("[\\?&]"+n+"=([^&#]*)")).exec(s || window.location.href);
				return (p===null) ? "" : p[1];
			};

			// postMessage to iframe - http://benalman.com/projects/jquery-postmessage-plugin/ (FOR IE7)
			video.postMsg = function(data, vid){
				var $vid = $('#' + vid);
				if ($vid.length){
					$vid[0].contentWindow.postMessage(data, $vid.attr('src').split('?')[0]);
				}
			};

			// receive message from iframe
			video.message = function(e){
				if (e.data) {
					if (/infoDelivery/g.test(e.data)) { return; } // ignore youtube video loading spam
					var data = $.parseJSON(e.data);
					$.each(video.list, function(i,s){
						if (video.services[video.list[i].service].hasOwnProperty('message')) {
							video.services[video.list[i].service].message(base, data);
						}
					});
				}
			};

			// toDO = 'cont', 'pause' or 'isPlaying'
			video.control = function(toDo){
				var i,
					s = video.list,
					slide = (toDo === 'pause') ? base.$lastPage[0] : base.$currentPage[0],
					isPlaying = false;
				for (i=0; i < video.len; i++){
					if (s[i].panel === slide && video.services[s[i].service].hasOwnProperty(toDo)){
						isPlaying = video.services[s[i].service][toDo](base, s[i].id, i);
					}
				}
				return isPlaying;
			};

			// iframe event listener
			if (video.hasiframeCount){
				if (window.addEventListener){
					window.addEventListener('message', video.message, false);
				} else { // IE
					window.attachEvent('onmessage', video.message, false);
				}
			}

			// bind to events
			base.$el
				.bind('slide_init', function(){
					video.control('pause');
				})
				.bind('slide_complete', function(){
					video.control('cont');
				});

			base.options.isVideoPlaying = function(){ return video.control('isPlaying'); };

		});
	};

/* Each video service is set up as follows
 * service-name : {
 *  // initialization
 *  selector  : 'object[data-url*=service], embed[src*=service]', // required: jQuery selector used to find the video ('video' or 'iframe[src*=service]' are other examples)
 *  initAPI   : 'string added to the URL to initialize the API',  // optional: the string must end with a parameter pointing to the video id (e.g. "&player_id=")
 *  embedOpts : { flashvars: {}, params: {}, attr: {} },          // optional: add any required flashvars, parameters or attributes to initialize the API
 *  // video startup functions
 *  init      : function(base, vid, index){ }, // optional: include any additional initialization code here; function called AFTER the embeded video is added using SWFObject
 *  // required functions
 *  cont      : function(base, vid, index){ }, // required: continue play if video was previously played
 *  pause     : function(base, vid, index){ }, // required: pause ALL videos
 *  message   : function(base, data){ },       // required for iframe: process data received from iframe and update the video status for the "isPlaying" function
 *  isPlaying : function(base, vid, index){ }  // required: return true if video is playing and return false if not playing (paused or ended)
 * }
 *
 * Function variables
 *  base (object) = plugin base, all video values/functions are stored in base.video
 *  vid (string) is the ID of the video: vid = "asvideo1"; so jQuery needs a "#" in front... "#" + videoID option default ("asvideo") + index (e.g. "1"); each video matching a service will have a unquie vid
 *  index (number) is the unique video number from the vid (starts from zero)
 *
 *  var list = base.video.list[index]; list will contain:
 *   list.id = vid
 *   list.service = service name (e.g. 'video', 'vimeo1', 'vimeo2', etc)
 *   list.selector = 'jQuery selector' (e.g. 'video', 'object[data-url*=vimeo]', 'iframe[src*=vimeo]', etc)
 *   list.panel = AnythingSlider panel DOM object. So you can target the video using $(list[index].panel).find(list[index].service) or $('#' + vid)
 *   list.status = video status, updated by the iframe event listeners added in the video service "ready" function; see examples below
 */

$.fn.anythingSliderVideo.services = {

	// *** HTML5 video ***
	video : {
		selector : 'video',
		cont : function(base, vid, index){
			var $vid = $('#' + vid);
			if ($vid.length && $vid[0].paused && $vid[0].currentTime > 0 && !$vid[0].ended) {
				$vid[0].play();
			}
		},
		pause : function(base, vid){
			// pause ALL videos on the page
			$('video').each(function(){
				if (typeof(this.pause) !== 'undefined') { this.pause(); } // throws an error in older ie without this
			});
		},
		isPlaying : function(base, vid, index){
			var $vid = $('#' + vid);
			// media.paused seems to be the only way to determine if a video is playing
			return ($vid.length && typeof($vid[0].pause) !== 'undefined' && !$vid[0].paused && !$vid[0].ended) ? true : false;
		}
	},

	// *** Vimeo iframe *** isolated demo: http://jsfiddle.net/Mottie/GxwEX/
	vimeo1 : {
		selector : 'iframe[src*=vimeo]',
		initAPI : '&api=1&player_id=', // video ID added to the end
		cont : function(base, vid, index){
			if (base.video.list[index].status === 'pause'){
				// Commands sent to the iframe originally had "JSON.stringify" applied to them,
				// but not all browsers support this, so it's just as easy to wrap it in quotes.
				base.video.postMsg('{"method":"play"}', vid);
			}
		},
		pause : function(base, vid){
			// pause ALL videos on the page
			$('iframe[src*=vimeo]').each(function(){
				base.video.postMsg('{"method":"pause"}', this.id);
			});
		},
		message : function(base, data){
			// *** VIMEO *** iframe uses data.player_id
			var index, vid = data.player_id || ''; // vid = data.player_id (unique to vimeo)
			if (vid !== ''){
				index = vid.replace(base.video.options.videoID, '');
				if (data.event === 'ready') {
					// Vimeo ready, add additional event listeners for video status
					base.video.postMsg('{"method":"addEventListener","value":"play"}', vid);
					base.video.postMsg('{"method":"addEventListener","value":"pause"}', vid);
					base.video.postMsg('{"method":"addEventListener","value":"finish"}', vid);
				}
				// update current status - vimeo puts it in data.event
				if (base.video.list[index]) { base.video.list[index].status = data.event; }
			}
		},
		isPlaying : function(base, vid, index){
			return (base.video.list[index].status === 'play') ? true : false;
		}
	},

	// *** Embeded Vimeo ***
	// SWFObject adds the url to the object data
	// using param as a selector, the script above looks for the parent if it sees "param"
	vimeo2 : {
		selector : 'object[data-url*=vimeo], embed[src*=vimeo]',
		embedOpts : { flashvars : { api : 1 } },
		cont : function(base, vid, index) {
			var $vid = $('#' + vid);
			// continue video if previously played & not finished (api_finish doesn't seem to exist) - duration can be a decimal number, so subtract it and look at the difference (2 seconds here)
			if (typeof($vid[0].api_play) === 'function' && $vid[0].api_paused() && $vid[0].api_getCurrentTime() !== 0 && ($vid[0].api_getDuration() - $vid[0].api_getCurrentTime()) > 2) {
				$vid[0].api_play();
			}
		},
		pause : function(base, vid){
			// find ALL videos and pause them, just in case
			$('object[data-url*=vimeo], embed[src*=vimeo]').each(function(){
				var el = (this.tagName === 'EMBED') ? $(this).parent()[0] : this;
				if (typeof(el.api_pause) === 'function') {
					el.api_pause();
				}
			});
		},
		isPlaying : function(base, vid, index){
			var $vid = $('#' + vid);
			return (typeof($vid[0].api_paused) === 'function' && !$vid[0].api_paused()) ? true : false;
		}
	},

	// *** iframe YouTube *** isolated demo: http://jsfiddle.net/Mottie/qk5MY/
	youtube1 : {
		selector : 'iframe[src*=youtube]',
		// "iv_load_policy=3" should turn off annotations on init, but doesn't seem to
		initAPI : '&iv_load_policy=3&enablejsapi=1&playerapiid=',
		cont : function(base, vid, index){
			if (base.video.list[index].status === 2){
				base.video.postMsg('{"event":"command","func":"playVideo"}', vid);
			}
		},
		pause : function(base, vid, index){
			// pause ALL videos on the page - in IE, pausing a video means it will continue when next seen =(
			$('iframe[src*=youtube]').each(function(){
//			if (this.id !== vid || (this.id === vid && base.video.list[index].status >= 0)) { // trying to fix the continue video problem; this only breaks it
				base.video.postMsg('{"event":"command","func":"pauseVideo"}', vid);
//			}
			});
		},
		message : function(base, data){
			if (data.event === 'infoDelivery') { return; } // ignore youtube video loading spam
			// *** YouTube *** iframe returns an embeded url (data.info.videoUrl) but no video id...
			if (data.info && data.info.videoUrl) {
				// figure out vid for youtube
				// data.info.videoURL = http://www.youtube.com/watch?v=###########&feature=player_embedded
				var url = base.video.gup('v', data.info.videoUrl), // end up with ###########, now find it
					vid = $('iframe[src*=' + url + ']')[0].id,
					index = vid.replace(base.video.options.videoID, '');
				// YouTube ready, add additional event listeners for video status. BUT this never fires off =(
				// Fixing this may solve the continue problem
				if (data.event === 'onReady') {
					base.video.postMsg('{"event":"listening","func":"onStateChange"}', vid); // **** FIX: NEED TO DETERMINE VID ***
				}
				// Update status, so the "isPlaying" function can access it
				if (data.event === 'onStateChange' && base.video.list[index]) {
					// update list with current status; data.state = YouTube
					base.video.list[index].status = data.state;
				}
			}
		},
		isPlaying : function(base, vid, index){
			var status = base.video.list[index].status;
			// state: unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
			return (status === 1 || status > 2) ? true : false;
		}
	},

	// *** Embeded YouTube ***
	// include embed for IE; SWFObject adds the url to the object data attribute
	youtube2 : {
		selector : 'object[data-url*=youtube], embed[src*=youtube]',
		initAPI : '&iv_load_policy=3&enablejsapi=1&version=3&playerapiid=', // video ID added to the end
		// YouTube - player states: unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
		cont : function(base, vid, index) {
			var $vid = $('#' + vid);
			// continue video if previously played and not cued
			if ($vid.length && typeof($vid[0].getPlayerState) === 'function' && $vid[0].getPlayerState() > 0) {
				$vid[0].playVideo();
			}
		},
		pause : function(base, vid){
			// find ALL videos and pause them, just in case
			$('object[data-url*=youtube], embed[src*=youtube]').each(function(){
				var el = (this.tagName === 'EMBED') ? $(this).parent()[0] : this;
				// player states: unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
				if (typeof(el.getPlayerState) === 'function' && el.getPlayerState() > 0) {
					// pause video if not autoplaying (if already initialized)
					el.pauseVideo();
				}
			});
		},
		isPlaying : function(base, vid){
			var $vid = $('#' + vid);
			return (typeof($vid[0].getPlayerState) === 'function' && ($vid[0].getPlayerState() === 1 || $vid[0].getPlayerState() > 2)) ? true : false;
		}
	}

};

})(jQuery);

// Initialize video extension automatically
jQuery(window).load(function(){
 jQuery('.anythingBase').anythingSliderVideo();
});



/*
=============================================== 07. jQuery Nivo Slider v2.6   ===============================================
 *
 * http://nivo.dev7studios.com
 *
 * Copyright 2011, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * March 2010
 */

(function($){var NivoSlider=function(element,options){var settings=$.extend({},$.fn.nivoSlider.defaults,options);var vars={currentSlide:0,currentImage:'',totalSlides:0,randAnim:'',running:false,paused:false,stop:false};var slider=$(element);slider.data('nivo:vars',vars);slider.css('position','relative');slider.addClass('nivoSlider');var kids=slider.children();kids.each(function(){var child=$(this);var link='';if(!child.is('img')){if(child.is('a')){child.addClass('nivo-imageLink');link=child;}
child=child.find('img:first');}
var childWidth=child.width();if(childWidth==0)childWidth=child.attr('width');var childHeight=child.height();if(childHeight==0)childHeight=child.attr('height');if(childWidth>slider.width()){slider.width(childWidth);}
if(childHeight>slider.height()){slider.height(childHeight);}
if(link!=''){link.css('display','none');}
child.css('display','none');vars.totalSlides++;});if(settings.startSlide>0){if(settings.startSlide>=vars.totalSlides)settings.startSlide=vars.totalSlides-1;vars.currentSlide=settings.startSlide;}
if($(kids[vars.currentSlide]).is('img')){vars.currentImage=$(kids[vars.currentSlide]);}else{vars.currentImage=$(kids[vars.currentSlide]).find('img:first');}
if($(kids[vars.currentSlide]).is('a')){$(kids[vars.currentSlide]).css('display','block');}
slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');slider.append($('<div class="nivo-caption"><p></p></div>').css({display:'none',opacity:settings.captionOpacity}));var processCaption=function(settings){var nivoCaption=$('.nivo-caption',slider);if(vars.currentImage.attr('title')!=''&&vars.currentImage.attr('title')!=undefined){var title=vars.currentImage.attr('title');if(title.substr(0,1)=='#')title=$(title).html();if(nivoCaption.css('display')=='block'){nivoCaption.find('p').fadeOut(settings.animSpeed,function(){$(this).html(title);$(this).fadeIn(settings.animSpeed);});}else{nivoCaption.find('p').html(title);}
nivoCaption.fadeIn(settings.animSpeed);}else{nivoCaption.fadeOut(settings.animSpeed);}}
processCaption(settings);var timer=0;if(!settings.manualAdvance&&kids.length>1){timer=setInterval(function(){nivoRun(slider,kids,settings,false);},settings.pauseTime);}
if(settings.directionNav){slider.append('<div class="nivo-directionNav"><a class="nivo-prevNav">'+settings.prevText+'</a><a class="nivo-nextNav">'+settings.nextText+'</a></div>');if(settings.directionNavHide){$('.nivo-directionNav',slider).hide();slider.hover(function(){$('.nivo-directionNav',slider).show();},function(){$('.nivo-directionNav',slider).hide();});}
$('a.nivo-prevNav',slider).live('click',function(){if(vars.running)return false;clearInterval(timer);timer='';vars.currentSlide-=2;nivoRun(slider,kids,settings,'prev');});$('a.nivo-nextNav',slider).live('click',function(){if(vars.running)return false;clearInterval(timer);timer='';nivoRun(slider,kids,settings,'next');});}
if(settings.controlNav){var nivoControl=$('<div class="nivo-controlNav"></div>');slider.append(nivoControl);for(var i=0;i<kids.length;i++){if(settings.controlNavThumbs){var child=kids.eq(i);if(!child.is('img')){child=child.find('img:first');}
if(settings.controlNavThumbsFromRel){nivoControl.append('<a class="nivo-control" rel="'+i+'"><img src="'+child.attr('rel')+'" alt="" /></a>');}else{nivoControl.append('<a class="nivo-control" rel="'+i+'"><img src="'+child.attr('src').replace(settings.controlNavThumbsSearch,settings.controlNavThumbsReplace)+'" alt="" /></a>');}}else{nivoControl.append('<a class="nivo-control" rel="'+i+'">'+(i+1)+'</a>');}}
$('.nivo-controlNav a:eq('+vars.currentSlide+')',slider).addClass('active');$('.nivo-controlNav a',slider).live('click',function(){if(vars.running)return false;if($(this).hasClass('active'))return false;clearInterval(timer);timer='';slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');vars.currentSlide=$(this).attr('rel')-1;nivoRun(slider,kids,settings,'control');});}
if(settings.keyboardNav){$(window).keypress(function(event){if(event.keyCode=='37'){if(vars.running)return false;clearInterval(timer);timer='';vars.currentSlide-=2;nivoRun(slider,kids,settings,'prev');}
if(event.keyCode=='39'){if(vars.running)return false;clearInterval(timer);timer='';nivoRun(slider,kids,settings,'next');}});}
if(settings.pauseOnHover){slider.hover(function(){vars.paused=true;clearInterval(timer);timer='';},function(){vars.paused=false;if(timer==''&&!settings.manualAdvance){timer=setInterval(function(){nivoRun(slider,kids,settings,false);},settings.pauseTime);}});}
slider.bind('nivo:animFinished',function(){vars.running=false;$(kids).each(function(){if($(this).is('a')){$(this).css('display','none');}});if($(kids[vars.currentSlide]).is('a')){$(kids[vars.currentSlide]).css('display','block');}
if(timer==''&&!vars.paused&&!settings.manualAdvance){timer=setInterval(function(){nivoRun(slider,kids,settings,false);},settings.pauseTime);}
settings.afterChange.call(this);});var createSlices=function(slider,settings,vars){for(var i=0;i<settings.slices;i++){var sliceWidth=Math.round(slider.width()/settings.slices);if(i==settings.slices-1){slider.append($('<div class="nivo-slice"></div>').css({left:(sliceWidth*i)+'px',width:(slider.width()-(sliceWidth*i))+'px',height:'0px',opacity:'0',background:'url("'+vars.currentImage.attr('src')+'") no-repeat -'+((sliceWidth+(i*sliceWidth))-sliceWidth)+'px 0%'}));}else{slider.append($('<div class="nivo-slice"></div>').css({left:(sliceWidth*i)+'px',width:sliceWidth+'px',height:'0px',opacity:'0',background:'url("'+vars.currentImage.attr('src')+'") no-repeat -'+((sliceWidth+(i*sliceWidth))-sliceWidth)+'px 0%'}));}}}
var createBoxes=function(slider,settings,vars){var boxWidth=Math.round(slider.width()/settings.boxCols);var boxHeight=Math.round(slider.height()/settings.boxRows);for(var rows=0;rows<settings.boxRows;rows++){for(var cols=0;cols<settings.boxCols;cols++){if(cols==settings.boxCols-1){slider.append($('<div class="nivo-box"></div>').css({opacity:0,left:(boxWidth*cols)+'px',top:(boxHeight*rows)+'px',width:(slider.width()-(boxWidth*cols))+'px',height:boxHeight+'px',background:'url("'+vars.currentImage.attr('src')+'") no-repeat -'+((boxWidth+(cols*boxWidth))-boxWidth)+'px -'+((boxHeight+(rows*boxHeight))-boxHeight)+'px'}));}else{slider.append($('<div class="nivo-box"></div>').css({opacity:0,left:(boxWidth*cols)+'px',top:(boxHeight*rows)+'px',width:boxWidth+'px',height:boxHeight+'px',background:'url("'+vars.currentImage.attr('src')+'") no-repeat -'+((boxWidth+(cols*boxWidth))-boxWidth)+'px -'+((boxHeight+(rows*boxHeight))-boxHeight)+'px'}));}}}}
var nivoRun=function(slider,kids,settings,nudge){var vars=slider.data('nivo:vars');if(vars&&(vars.currentSlide==vars.totalSlides-1)){settings.lastSlide.call(this);}
if((!vars||vars.stop)&&!nudge)return false;settings.beforeChange.call(this);if(!nudge){slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');}else{if(nudge=='prev'){slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');}
if(nudge=='next'){slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');}}
vars.currentSlide++;if(vars.currentSlide==vars.totalSlides){vars.currentSlide=0;settings.slideshowEnd.call(this);}
if(vars.currentSlide<0)vars.currentSlide=(vars.totalSlides-1);if($(kids[vars.currentSlide]).is('img')){vars.currentImage=$(kids[vars.currentSlide]);}else{vars.currentImage=$(kids[vars.currentSlide]).find('img:first');}
if(settings.controlNav){$('.nivo-controlNav a',slider).removeClass('active');$('.nivo-controlNav a:eq('+vars.currentSlide+')',slider).addClass('active');}
processCaption(settings);$('.nivo-slice',slider).remove();$('.nivo-box',slider).remove();if(settings.effect=='random'){var anims=new Array('sliceDownRight','sliceDownLeft','sliceUpRight','sliceUpLeft','sliceUpDown','sliceUpDownLeft','fold','fade','boxRandom','boxRain','boxRainReverse','boxRainGrow','boxRainGrowReverse');vars.randAnim=anims[Math.floor(Math.random()*(anims.length+1))];if(vars.randAnim==undefined)vars.randAnim='fade';}
if(settings.effect.indexOf(',')!=-1){var anims=settings.effect.split(',');vars.randAnim=anims[Math.floor(Math.random()*(anims.length))];if(vars.randAnim==undefined)vars.randAnim='fade';}
vars.running=true;if(settings.effect=='sliceDown'||settings.effect=='sliceDownRight'||vars.randAnim=='sliceDownRight'||settings.effect=='sliceDownLeft'||vars.randAnim=='sliceDownLeft'){createSlices(slider,settings,vars);var timeBuff=0;var i=0;var slices=$('.nivo-slice',slider);if(settings.effect=='sliceDownLeft'||vars.randAnim=='sliceDownLeft')slices=$('.nivo-slice',slider)._reverse();slices.each(function(){var slice=$(this);slice.css({'top':'0px'});if(i==settings.slices-1){setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;i++;});}
else if(settings.effect=='sliceUp'||settings.effect=='sliceUpRight'||vars.randAnim=='sliceUpRight'||settings.effect=='sliceUpLeft'||vars.randAnim=='sliceUpLeft'){createSlices(slider,settings,vars);var timeBuff=0;var i=0;var slices=$('.nivo-slice',slider);if(settings.effect=='sliceUpLeft'||vars.randAnim=='sliceUpLeft')slices=$('.nivo-slice',slider)._reverse();slices.each(function(){var slice=$(this);slice.css({'bottom':'0px'});if(i==settings.slices-1){setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;i++;});}
else if(settings.effect=='sliceUpDown'||settings.effect=='sliceUpDownRight'||vars.randAnim=='sliceUpDown'||settings.effect=='sliceUpDownLeft'||vars.randAnim=='sliceUpDownLeft'){createSlices(slider,settings,vars);var timeBuff=0;var i=0;var v=0;var slices=$('.nivo-slice',slider);if(settings.effect=='sliceUpDownLeft'||vars.randAnim=='sliceUpDownLeft')slices=$('.nivo-slice',slider)._reverse();slices.each(function(){var slice=$(this);if(i==0){slice.css('top','0px');i++;}else{slice.css('bottom','0px');i=0;}
if(v==settings.slices-1){setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;v++;});}
else if(settings.effect=='fold'||vars.randAnim=='fold'){createSlices(slider,settings,vars);var timeBuff=0;var i=0;$('.nivo-slice',slider).each(function(){var slice=$(this);var origWidth=slice.width();slice.css({top:'0px',height:'100%',width:'0px'});if(i==settings.slices-1){setTimeout(function(){slice.animate({width:origWidth,opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({width:origWidth,opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;i++;});}
else if(settings.effect=='fade'||vars.randAnim=='fade'){createSlices(slider,settings,vars);var firstSlice=$('.nivo-slice:first',slider);firstSlice.css({'height':'100%','width':slider.width()+'px'});firstSlice.animate({opacity:'1.0'},(settings.animSpeed*2),'',function(){slider.trigger('nivo:animFinished');});}
else if(settings.effect=='slideInRight'||vars.randAnim=='slideInRight'){createSlices(slider,settings,vars);var firstSlice=$('.nivo-slice:first',slider);firstSlice.css({'height':'100%','width':'0px','opacity':'1'});firstSlice.animate({width:slider.width()+'px'},(settings.animSpeed*2),'',function(){slider.trigger('nivo:animFinished');});}
else if(settings.effect=='slideInLeft'||vars.randAnim=='slideInLeft'){createSlices(slider,settings,vars);var firstSlice=$('.nivo-slice:first',slider);firstSlice.css({'height':'100%','width':'0px','opacity':'1','left':'','right':'0px'});firstSlice.animate({width:slider.width()+'px'},(settings.animSpeed*2),'',function(){firstSlice.css({'left':'0px','right':''});slider.trigger('nivo:animFinished');});}
else if(settings.effect=='boxRandom'||vars.randAnim=='boxRandom'){createBoxes(slider,settings,vars);var totalBoxes=settings.boxCols*settings.boxRows;var i=0;var timeBuff=0;var boxes=shuffle($('.nivo-box',slider));boxes.each(function(){var box=$(this);if(i==totalBoxes-1){setTimeout(function(){box.animate({opacity:'1'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){box.animate({opacity:'1'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=20;i++;});}
else if(settings.effect=='boxRain'||vars.randAnim=='boxRain'||settings.effect=='boxRainReverse'||vars.randAnim=='boxRainReverse'||settings.effect=='boxRainGrow'||vars.randAnim=='boxRainGrow'||settings.effect=='boxRainGrowReverse'||vars.randAnim=='boxRainGrowReverse'){createBoxes(slider,settings,vars);var totalBoxes=settings.boxCols*settings.boxRows;var i=0;var timeBuff=0;var rowIndex=0;var colIndex=0;var box2Darr=new Array();box2Darr[rowIndex]=new Array();var boxes=$('.nivo-box',slider);if(settings.effect=='boxRainReverse'||vars.randAnim=='boxRainReverse'||settings.effect=='boxRainGrowReverse'||vars.randAnim=='boxRainGrowReverse'){boxes=$('.nivo-box',slider)._reverse();}
boxes.each(function(){box2Darr[rowIndex][colIndex]=$(this);colIndex++;if(colIndex==settings.boxCols){rowIndex++;colIndex=0;box2Darr[rowIndex]=new Array();}});for(var cols=0;cols<(settings.boxCols*2);cols++){var prevCol=cols;for(var rows=0;rows<settings.boxRows;rows++){if(prevCol>=0&&prevCol<settings.boxCols){(function(row,col,time,i,totalBoxes){var box=$(box2Darr[row][col]);var w=box.width();var h=box.height();if(settings.effect=='boxRainGrow'||vars.randAnim=='boxRainGrow'||settings.effect=='boxRainGrowReverse'||vars.randAnim=='boxRainGrowReverse'){box.width(0).height(0);}
if(i==totalBoxes-1){setTimeout(function(){box.animate({opacity:'1',width:w,height:h},settings.animSpeed/1.3,'',function(){slider.trigger('nivo:animFinished');});},(100+time));}else{setTimeout(function(){box.animate({opacity:'1',width:w,height:h},settings.animSpeed/1.3);},(100+time));}})(rows,prevCol,timeBuff,i,totalBoxes);i++;}
prevCol--;}
timeBuff+=100;}}}
var shuffle=function(arr){for(var j,x,i=arr.length;i;j=parseInt(Math.random()*i),x=arr[--i],arr[i]=arr[j],arr[j]=x);return arr;}
var trace=function(msg){if(this.console&&typeof console.log!="undefined")
console.log(msg);}
this.stop=function(){if(!$(element).data('nivo:vars').stop){$(element).data('nivo:vars').stop=true;trace('Stop Slider');}}
this.start=function(){if($(element).data('nivo:vars').stop){$(element).data('nivo:vars').stop=false;trace('Start Slider');}}
settings.afterLoad.call(this);return this;};$.fn.nivoSlider=function(options){return this.each(function(key,value){var element=$(this);if(element.data('nivoslider'))return element.data('nivoslider');var nivoslider=new NivoSlider(this,options);element.data('nivoslider',nivoslider);});};$.fn.nivoSlider.defaults={effect:'random',slices:15,boxCols:8,boxRows:4,animSpeed:500,pauseTime:3000,startSlide:0,directionNav:true,directionNavHide:true,controlNav:true,controlNavThumbs:false,controlNavThumbsFromRel:false,controlNavThumbsSearch:'.jpg',controlNavThumbsReplace:'_thumb.jpg',keyboardNav:true,pauseOnHover:true,manualAdvance:false,captionOpacity:0.8,prevText:'Prev',nextText:'Next',beforeChange:function(){},afterChange:function(){},slideshowEnd:function(){},lastSlide:function(){},afterLoad:function(){}};$.fn._reverse=[].reverse;})(jQuery);



/*
=============================================== 08. jQuery EasyTabs plugin 2.3.3   ===============================================
 *
 * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: Thu Sep 15 09:50:00 2011 -0500
 */
(function(b){function a(f,c,e){var d=b.Event(c);f.trigger(d,e);return d.result!==false}b.fn.easyTabs=function(){b.error("easyTabs() is no longer used. Now use easytabs() -- no capitalization.")};b.fn.easytabs=function(d){var c=arguments;return this.each(function(){var f=b(this),e=f.data("easytabs");if(!e){b.fn.easytabs.methods.init.apply(f,[d]);b.fn.easytabs.methods.initHashChange.apply(f);b.fn.easytabs.methods.initCycle.apply(f)}if(b.fn.easytabs.publicMethods[d]){return b.fn.easytabs.publicMethods[d].apply(f,Array.prototype.slice.call(c,1))}})};b.fn.easytabs.defaults={animate:true,panelActiveClass:"active",tabActiveClass:"active",defaultTab:"li:first-child",animationSpeed:"normal",tabs:"> ul > li",updateHash:true,cycle:false,collapsible:false,collapsedClass:"collapsed",collapsedByDefault:true,uiTabs:false,transitionIn:"fadeIn",transitionOut:"fadeOut",transitionCollapse:"slideUp",transitionUncollapse:"slideDown",cache:true};b.fn.easytabs.methods={init:function(d){var i=this,h,c,g=b(),f,j,e={fast:200,normal:400,slow:600};if(d&&d.uiTabs){i.addClass("ui-tabs");b.extend(b.fn.easytabs.defaults,{tabActiveClass:"ui-tabs-selected"})}if(d&&d.collapsible&&d.defaultTab){b.fn.easytabs.defaults.collapsedByDefault=false}h=b.extend({},b.fn.easytabs.defaults,d);if(typeof(h.animationSpeed)=="string"){h.animationSpeed=e[h.animationSpeed]}c=i.find(h.tabs);c.each(function(){var m=b(this),l=m.children("a"),k=m.children("a").data("target");if(k!==undefined&&k!==null){m.data("easytabs",{ajax:l.attr("href")})}else{k=l.attr("href")}k=k.match(/#([^\?]+)/)[0].substr(1);$matchingPanel=i.find("#"+k);if($matchingPanel.size()>0){$matchingPanel.data("easytabs",{position:$matchingPanel.css("position"),visibility:$matchingPanel.css("visibility")});g=g.add($matchingPanel.hide());m.data("easytabs",b.extend(m.data("easytabs"),{panel:$matchingPanel}))}else{c=c.not(m)}});b("a.anchor").remove().prependTo("body");i.data("easytabs",{opts:h,skipUpdateToHash:false,tabs:c,panels:g}).attr("data-easytabs",true);b.fn.easytabs.methods.setDefaultTab.apply(i);c.children("a").bind("click.easytabs",function(k){k.preventDefault();i.data("easytabs").opts.cycle=false;i.data("easytabs").skipUpdateToHash=false;$clicked=b(this);b.fn.easytabs.methods.selectTab.apply($clicked,[i])})},loadFromData:function(){return this.data("easytabs")},setDefaultTab:function(){var m=this,h=b.fn.easytabs.methods.loadFromData.apply(m),c=h.opts,j=h.tabs,d=h.panels,g=window.location.hash.match(/^[^\?]*/)[0],i=b.fn.easytabs.methods.matchTab(j,g).parent(),e,f,l,k,n;if(i.size()==1){e=i;m.data("easytabs").opts.cycle=false}else{n=b.fn.easytabs.methods.matchInPanel(d,g);if(n.length){g="#"+n.attr("id");e=b.fn.easytabs.methods.matchTab(j,g).parent()}else{e=j.parent().find(c.defaultTab);if(e.size()==0){b.error("The specified default tab ('"+c.defaultTab+"') could not be found in the tab set.")}}}f=e.children("a").first();m.data("easytabs").defaultTab=e;m.data("easytabs").defaultTabLink=f;if(c.collapsible&&i.size()==0&&c.collapsedByDefault){e.addClass(c.collapsedClass).children().addClass(c.collapsedClass)}else{l=b(e.data("easytabs").panel);k=e.data("easytabs").ajax;if(k&&(!c.cache||!e.data("easytabs").cached)){m.trigger("easytabs:ajax:beforeSend",[f,l]);l.load(k,function(p,o,q){e.data("easytabs").cached=true;m.trigger("easytabs:ajax:complete",[f,l,p,o,q])})}e.data("easytabs").panel.show().addClass(c.panelActiveClass);e.addClass(c.tabActiveClass).children().addClass(c.tabActiveClass)}},getHeightForHidden:function(){if(this.data("easytabs")&&this.data("easytabs").lastHeight){return this.data("easytabs").lastHeight}var d=this.css("display"),c=this.wrap(b("<div>",{position:"absolute",visibility:"hidden",overflow:"hidden"})).css({position:"relative",visibility:"hidden",display:"block"}).outerHeight();this.unwrap();this.css({position:this.data("easytabs").position,visibility:this.data("easytabs").visibility,display:d});b.extend(this.data("easytabs"),{lastHeight:c});return c},setAndReturnHeight:function(){var c=this.outerHeight(),d={lastHeight:c};if(this.data("easytabs")){b.extend(this.data("easytabs"),d)}else{this.data("easytabs",d)}return c},selectTab:function(q,i){var r=this,h=window.location,e=h.hash.match(/^[^\?]*/)[0],v=b.fn.easytabs.methods.loadFromData.apply(q),n=v.opts,g=v.skipUpdateToHash,d=v.tabs,k=v.panels,f=r.parent().data("easytabs").panel,u=r.parent().data("easytabs").ajax,p=v.defaultTabLink,t=(n.animate)?{show:n.transitionIn,hide:n.transitionOut,speed:n.animationSpeed,collapse:n.transitionCollapse,uncollapse:n.transitionUncollapse,halfSpeed:n.animationSpeed/2}:{show:"show",hide:"hide",speed:0,collapse:"hide",uncollapse:"show",halfSpeed:0};if(n.collapsible&&!g&&(r.hasClass(n.tabActiveClass)||r.hasClass(n.collapsedClass))){k.stop(true,true);if(a(q,"easytabs:before",[r,f,v])){d.filter("."+n.tabActiveClass).removeClass(n.tabActiveClass).children().removeClass(n.tabActiveClass);if(r.hasClass(n.collapsedClass)){if(u&&(!n.cache||!r.parent().data("easytabs").cached)){q.trigger("easytabs:ajax:beforeSend",[r,f]);f.load(u,function(x,w,y){r.parent().data("easytabs").cached=true;q.trigger("easytabs:ajax:complete",[r,f,x,w,y])})}r.parent().removeClass(n.collapsedClass).addClass(n.tabActiveClass).children().removeClass(n.collapsedClass).addClass(n.tabActiveClass);f.addClass(n.panelActiveClass)[t.uncollapse](t.speed,function(){q.trigger("easytabs:midTransition",[r,f,v]);if(typeof i=="function"){i()}})}else{r.parent().addClass(n.collapsedClass).children().addClass(n.collapsedClass);f.removeClass(n.panelActiveClass)[t.collapse](t.speed,function(){q.trigger("easytabs:midTransition",[r,f,v]);if(typeof i=="function"){i()}})}}}else{if(!r.hasClass(n.tabActiveClass)||!f.hasClass(n.panelActiveClass)){k.stop(true,true);if(a(q,"easytabs:before",[r,f,v])){var l=k.filter(":visible"),o=f.parent(),j=b.fn.easytabs.methods.getHeightForHidden.apply(f),m=l.length?b.fn.easytabs.methods.setAndReturnHeight.apply(l):0,c=j-m,s=function(){q.trigger("easytabs:midTransition",[r,f,v]);if(n.animate&&n.transitionIn=="fadeIn"&&c<0){o.animate({height:o.height()+c},t.halfSpeed).css({"min-height":""})}if(n.updateHash&&!g){window.location.hash="#"+f.attr("id")}else{q.data("easytabs").skipUpdateToHash=false}f[t.show](t.speed,function(){q.data("easytabs").tabs=d;q.data("easytabs").panels=k;o.css({height:"","min-height":""});q.trigger("easytabs:after",[r,f,v]);if(typeof i=="function"){i()}})};if(u&&(!n.cache||!r.parent().data("easytabs").cached)){q.trigger("easytabs:ajax:beforeSend",[r,f]);f.load(u,function(x,w,y){r.parent().data("easytabs").cached=true;q.trigger("easytabs:ajax:complete",[r,f,x,w,y])})}if(n.animate&&n.transitionOut=="fadeOut"){if(c>0){o.animate({height:(o.height()+c)},t.halfSpeed)}else{o.css({"min-height":o.height()})}}d.filter("."+n.tabActiveClass).removeClass(n.tabActiveClass).children().removeClass(n.tabActiveClass);d.filter("."+n.collapsedClass).removeClass(n.collapsedClass).children().removeClass(n.collapsedClass);r.parent().addClass(n.tabActiveClass).children().addClass(n.tabActiveClass);k.filter("."+n.panelActiveClass).removeClass(n.panelActiveClass);f.addClass(n.panelActiveClass);if(l.size()>0){l[t.hide](t.speed,s)}else{f[t.uncollapse](t.speed,s)}}}}},matchTab:function(c,d){return c.find("[href='"+d+"'],[data-target='"+d+"']").first()},matchInPanel:function(c,d){return(d?c.filter(":has("+d+")").first():[])},selectTabFromHashChange:function(){var k=this,h=b.fn.easytabs.methods.loadFromData.apply(k),c=h.opts,i=h.tabs,d=h.panels,e=h.defaultTab,f=h.defaultTabLink,g=window.location.hash.match(/^[^\?]*/)[0],j=b.fn.easytabs.methods.matchTab(i,g),l;if(c.updateHash){if(j.length){k.data("easytabs").skipUpdateToHash=true;b.fn.easytabs.methods.selectTab.apply(j,[k])}else{l=b.fn.easytabs.methods.matchInPanel(d,g);if(l.length){g="#"+l.attr("id");j=b.fn.easytabs.methods.matchTab(i,g);k.data("easytabs").skipUpdateToHash=true;b.fn.easytabs.methods.selectTab.apply(j,[k])}else{if(!e.hasClass(c.tabActiveClass)&&!c.cycle){if(g==""||k.closest(g).length){k.data("easytabs").skipUpdateToHash=true;b.fn.easytabs.methods.selectTab.apply(f,[k])}}}}}},cycleTabs:function(d){var g=this,f=b.fn.easytabs.methods.loadFromData.apply(g),e=f.opts,c=f.tabs;if(e.cycle){d=d%c.size();$tab=b(c[d]).children("a").first();g.data("easytabs").skipUpdateToHash=true;b.fn.easytabs.methods.selectTab.apply($tab,[g,function(){setTimeout(function(){b.fn.easytabs.methods.cycleTabs.apply(g,[d+1])},e.cycle)}])}},initHashChange:function(){var c=this;if(typeof b(window).hashchange=="function"){b(window).hashchange(function(){b.fn.easytabs.methods.selectTabFromHashChange.apply(c)})}else{if(b.address&&typeof b.address.change=="function"){b.address.change(function(){b.fn.easytabs.methods.selectTabFromHashChange.apply(c)})}}},initCycle:function(){var h=this,g=b.fn.easytabs.methods.loadFromData.apply(h),f=g.opts,d=g.tabs,e=g.defaultTab,c;if(f.cycle){c=d.index(e);setTimeout(function(){b.fn.easytabs.methods.cycleTabs.apply(h,[c+1])},f.cycle)}}};b.fn.easytabs.publicMethods={select:function(d){var g=this,f=b.fn.easytabs.methods.loadFromData.apply(g),c=f.tabs,e;if((e=c.filter(d)).size()==0){if((e=c.find("a[href='"+d+"']")).size()==0){if((e=c.find("a"+d)).size()==0){if((e=c.find("[data-target='"+d+"']")).size()==0){b.error("Tab '"+d+"' does not exist in tab set")}}}}else{e=e.children("a").first()}b.fn.easytabs.methods.selectTab.apply(e,[g])}}})(jQuery);

/*
=============================================== 09. jQuery Validation Plugin 1.8.1   ===============================================
* http://bassistance.de/jquery-plugins/jquery-plugin-validation/
* http://docs.jquery.com/Plugins/Validation
*
* Copyright (c) 2006 - 2011 Jörn Zaefferer
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html

*/

(function(c){c.extend(c.fn,{validate:function(a){if(this.length){var b=c.data(this[0],"validator");if(b)return b;b=new c.validator(a,this[0]);c.data(this[0],"validator",b);if(b.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){b.cancelSubmit=true});b.settings.submitHandler&&this.find("input, button").filter(":submit").click(function(){b.submitButton=this});this.submit(function(d){function e(){if(b.settings.submitHandler){if(b.submitButton)var f=c("<input type='hidden'/>").attr("name",
b.submitButton.name).val(b.submitButton.value).appendTo(b.currentForm);b.settings.submitHandler.call(b,b.currentForm);b.submitButton&&f.remove();return false}return true}b.settings.debug&&d.preventDefault();if(b.cancelSubmit){b.cancelSubmit=false;return e()}if(b.form()){if(b.pendingRequest){b.formSubmitted=true;return false}return e()}else{b.focusInvalid();return false}})}return b}else a&&a.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing")},valid:function(){if(c(this[0]).is("form"))return this.validate().form();
else{var a=true,b=c(this[0].form).validate();this.each(function(){a&=b.element(this)});return a}},removeAttrs:function(a){var b={},d=this;c.each(a.split(/\s/),function(e,f){b[f]=d.attr(f);d.removeAttr(f)});return b},rules:function(a,b){var d=this[0];if(a){var e=c.data(d.form,"validator").settings,f=e.rules,g=c.validator.staticRules(d);switch(a){case "add":c.extend(g,c.validator.normalizeRule(b));f[d.name]=g;if(b.messages)e.messages[d.name]=c.extend(e.messages[d.name],b.messages);break;case "remove":if(!b){delete f[d.name];
return g}var h={};c.each(b.split(/\s/),function(j,i){h[i]=g[i];delete g[i]});return h}}d=c.validator.normalizeRules(c.extend({},c.validator.metadataRules(d),c.validator.classRules(d),c.validator.attributeRules(d),c.validator.staticRules(d)),d);if(d.required){e=d.required;delete d.required;d=c.extend({required:e},d)}return d}});c.extend(c.expr[":"],{blank:function(a){return!c.trim(""+a.value)},filled:function(a){return!!c.trim(""+a.value)},unchecked:function(a){return!a.checked}});c.validator=function(a,
b){this.settings=c.extend(true,{},c.validator.defaults,a);this.currentForm=b;this.init()};c.validator.format=function(a,b){if(arguments.length==1)return function(){var d=c.makeArray(arguments);d.unshift(a);return c.validator.format.apply(this,d)};if(arguments.length>2&&b.constructor!=Array)b=c.makeArray(arguments).slice(1);if(b.constructor!=Array)b=[b];c.each(b,function(d,e){a=a.replace(RegExp("\\{"+d+"\\}","g"),e)});return a};c.extend(c.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",
validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:c([]),errorLabelContainer:c([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(a){this.lastActive=a;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass);this.addWrapper(this.errorsFor(a)).hide()}},onfocusout:function(a){if(!this.checkable(a)&&(a.name in this.submitted||!this.optional(a)))this.element(a)},
onkeyup:function(a){if(a.name in this.submitted||a==this.lastElement)this.element(a)},onclick:function(a){if(a.name in this.submitted)this.element(a);else a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).addClass(b).removeClass(d):c(a).addClass(b).removeClass(d)},unhighlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).removeClass(b).addClass(d):c(a).removeClass(b).addClass(d)}},setDefaults:function(a){c.extend(c.validator.defaults,
a)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:c.validator.format("Please enter no more than {0} characters."),
minlength:c.validator.format("Please enter at least {0} characters."),rangelength:c.validator.format("Please enter a value between {0} and {1} characters long."),range:c.validator.format("Please enter a value between {0} and {1}."),max:c.validator.format("Please enter a value less than or equal to {0}."),min:c.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){function a(e){var f=c.data(this[0].form,"validator");e="on"+e.type.replace(/^validate/,
"");f.settings[e]&&f.settings[e].call(f,this[0])}this.labelContainer=c(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||c(this.currentForm);this.containers=c(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var b=this.groups={};c.each(this.settings.groups,function(e,f){c.each(f.split(/\s/),function(g,h){b[h]=e})});var d=this.settings.rules;
c.each(d,function(e,f){d[e]=c.validator.normalizeRule(f)});c(this.currentForm).validateDelegate(":text, :password, :file, select, textarea","focusin focusout keyup",a).validateDelegate(":radio, :checkbox, select, option","click",a);this.settings.invalidHandler&&c(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){this.checkForm();c.extend(this.submitted,this.errorMap);this.invalid=c.extend({},this.errorMap);this.valid()||c(this.currentForm).triggerHandler("invalid-form",
[this]);this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(a){this.lastElement=a=this.clean(a);this.prepareElement(a);this.currentElements=c(a);var b=this.check(a);if(b)delete this.invalid[a.name];else this.invalid[a.name]=true;if(!this.numberOfInvalids())this.toHide=this.toHide.add(this.containers);this.showErrors();return b},showErrors:function(a){if(a){c.extend(this.errorMap,
a);this.errorList=[];for(var b in a)this.errorList.push({message:a[b],element:this.findByName(b)[0]});this.successList=c.grep(this.successList,function(d){return!(d.name in a)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){c.fn.resetForm&&c(this.currentForm).resetForm();this.submitted={};this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},
objectLength:function(a){var b=0,d;for(d in a)b++;return b},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{c(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(a){}},findLastActive:function(){var a=this.lastActive;return a&&c.grep(this.errorList,function(b){return b.element.name==
a.name}).length==1&&a},elements:function(){var a=this,b={};return c(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&a.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in b||!a.objectLength(c(this).rules()))return false;return b[this.name]=true})},clean:function(a){return c(a)[0]},errors:function(){return c(this.settings.errorElement+"."+this.settings.errorClass,
this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=c([]);this.toHide=c([]);this.currentElements=c([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset();this.toHide=this.errorsFor(a)},check:function(a){a=this.clean(a);if(this.checkable(a))a=this.findByName(a.name).not(this.settings.ignore)[0];var b=c(a).rules(),d=false,e;for(e in b){var f={method:e,parameters:b[e]};try{var g=
c.validator.methods[e].call(this,a.value.replace(/\r/g,""),a,f.parameters);if(g=="dependency-mismatch")d=true;else{d=false;if(g=="pending"){this.toHide=this.toHide.not(this.errorsFor(a));return}if(!g){this.formatAndAdd(a,f);return false}}}catch(h){this.settings.debug&&window.console&&console.log("exception occured when checking element "+a.id+", check the '"+f.method+"' method",h);throw h;}}if(!d){this.objectLength(b)&&this.successList.push(a);return true}},customMetaMessage:function(a,b){if(c.metadata){var d=
this.settings.meta?c(a).metadata()[this.settings.meta]:c(a).metadata();return d&&d.messages&&d.messages[b]}},customMessage:function(a,b){var d=this.settings.messages[a];return d&&(d.constructor==String?d:d[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(arguments[a]!==undefined)return arguments[a]},defaultMessage:function(a,b){return this.findDefined(this.customMessage(a.name,b),this.customMetaMessage(a,b),!this.settings.ignoreTitle&&a.title||undefined,c.validator.messages[b],"<strong>Warning: No message defined for "+
a.name+"</strong>")},formatAndAdd:function(a,b){var d=this.defaultMessage(a,b.method),e=/\$?\{(\d+)\}/g;if(typeof d=="function")d=d.call(this,b.parameters,a);else if(e.test(d))d=jQuery.format(d.replace(e,"{$1}"),b.parameters);this.errorList.push({message:d,element:a});this.errorMap[a.name]=d;this.submitted[a.name]=d},addWrapper:function(a){if(this.settings.wrapper)a=a.add(a.parent(this.settings.wrapper));return a},defaultShowErrors:function(){for(var a=0;this.errorList[a];a++){var b=this.errorList[a];
this.settings.highlight&&this.settings.highlight.call(this,b.element,this.settings.errorClass,this.settings.validClass);this.showLabel(b.element,b.message)}if(this.errorList.length)this.toShow=this.toShow.add(this.containers);if(this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight){a=0;for(b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass)}this.toHide=this.toHide.not(this.toShow);
this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return c(this.errorList).map(function(){return this.element})},showLabel:function(a,b){var d=this.errorsFor(a);if(d.length){d.removeClass().addClass(this.settings.errorClass);d.attr("generated")&&d.html(b)}else{d=c("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(a),generated:true}).addClass(this.settings.errorClass).html(b||
"");if(this.settings.wrapper)d=d.hide().show().wrap("<"+this.settings.wrapper+"/>").parent();this.labelContainer.append(d).length||(this.settings.errorPlacement?this.settings.errorPlacement(d,c(a)):d.insertAfter(a))}if(!b&&this.settings.success){d.text("");typeof this.settings.success=="string"?d.addClass(this.settings.success):this.settings.success(d)}this.toShow=this.toShow.add(d)},errorsFor:function(a){var b=this.idOrName(a);return this.errors().filter(function(){return c(this).attr("for")==b})},
idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(a){var b=this.currentForm;return c(document.getElementsByName(a)).map(function(d,e){return e.form==b&&e.name==a&&e||null})},getLength:function(a,b){switch(b.nodeName.toLowerCase()){case "select":return c("option:selected",b).length;case "input":if(this.checkable(b))return this.findByName(b.name).filter(":checked").length}return a.length},
depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):true},dependTypes:{"boolean":function(a){return a},string:function(a,b){return!!c(a,b.form).length},"function":function(a,b){return a(b)}},optional:function(a){return!c.validator.methods.required.call(this,c.trim(a.value),a)&&"dependency-mismatch"},startRequest:function(a){if(!this.pending[a.name]){this.pendingRequest++;this.pending[a.name]=true}},stopRequest:function(a,b){this.pendingRequest--;if(this.pendingRequest<
0)this.pendingRequest=0;delete this.pending[a.name];if(b&&this.pendingRequest==0&&this.formSubmitted&&this.form()){c(this.currentForm).submit();this.formSubmitted=false}else if(!b&&this.pendingRequest==0&&this.formSubmitted){c(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}},previousValue:function(a){return c.data(a,"previousValue")||c.data(a,"previousValue",{old:null,valid:true,message:this.defaultMessage(a,"remote")})}},classRuleSettings:{required:{required:true},
email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(a,b){a.constructor==String?this.classRuleSettings[a]=b:c.extend(this.classRuleSettings,a)},classRules:function(a){var b={};(a=c(a).attr("class"))&&c.each(a.split(" "),function(){this in c.validator.classRuleSettings&&c.extend(b,c.validator.classRuleSettings[this])});return b},attributeRules:function(a){var b=
{};a=c(a);for(var d in c.validator.methods){var e=a.attr(d);if(e)b[d]=e}b.maxlength&&/-1|2147483647|524288/.test(b.maxlength)&&delete b.maxlength;return b},metadataRules:function(a){if(!c.metadata)return{};var b=c.data(a.form,"validator").settings.meta;return b?c(a).metadata()[b]:c(a).metadata()},staticRules:function(a){var b={},d=c.data(a.form,"validator");if(d.settings.rules)b=c.validator.normalizeRule(d.settings.rules[a.name])||{};return b},normalizeRules:function(a,b){c.each(a,function(d,e){if(e===
false)delete a[d];else if(e.param||e.depends){var f=true;switch(typeof e.depends){case "string":f=!!c(e.depends,b.form).length;break;case "function":f=e.depends.call(b,b)}if(f)a[d]=e.param!==undefined?e.param:true;else delete a[d]}});c.each(a,function(d,e){a[d]=c.isFunction(e)?e(b):e});c.each(["minlength","maxlength","min","max"],function(){if(a[this])a[this]=Number(a[this])});c.each(["rangelength","range"],function(){if(a[this])a[this]=[Number(a[this][0]),Number(a[this][1])]});if(c.validator.autoCreateRanges){if(a.min&&
a.max){a.range=[a.min,a.max];delete a.min;delete a.max}if(a.minlength&&a.maxlength){a.rangelength=[a.minlength,a.maxlength];delete a.minlength;delete a.maxlength}}a.messages&&delete a.messages;return a},normalizeRule:function(a){if(typeof a=="string"){var b={};c.each(a.split(/\s/),function(){b[this]=true});a=b}return a},addMethod:function(a,b,d){c.validator.methods[a]=b;c.validator.messages[a]=d!=undefined?d:c.validator.messages[a];b.length<3&&c.validator.addClassRules(a,c.validator.normalizeRule(a))},
methods:{required:function(a,b,d){if(!this.depend(d,b))return"dependency-mismatch";switch(b.nodeName.toLowerCase()){case "select":return(a=c(b).val())&&a.length>0;case "input":if(this.checkable(b))return this.getLength(a,b)>0;default:return c.trim(a).length>0}},remote:function(a,b,d){if(this.optional(b))return"dependency-mismatch";var e=this.previousValue(b);this.settings.messages[b.name]||(this.settings.messages[b.name]={});e.originalMessage=this.settings.messages[b.name].remote;this.settings.messages[b.name].remote=
e.message;d=typeof d=="string"&&{url:d}||d;if(this.pending[b.name])return"pending";if(e.old===a)return e.valid;e.old=a;var f=this;this.startRequest(b);var g={};g[b.name]=a;c.ajax(c.extend(true,{url:d,mode:"abort",port:"validate"+b.name,dataType:"json",data:g,success:function(h){f.settings.messages[b.name].remote=e.originalMessage;var j=h===true;if(j){var i=f.formSubmitted;f.prepareElement(b);f.formSubmitted=i;f.successList.push(b);f.showErrors()}else{i={};h=h||f.defaultMessage(b,"remote");i[b.name]=
e.message=c.isFunction(h)?h(a):h;f.showErrors(i)}e.valid=j;f.stopRequest(b,j)}},d));return"pending"},minlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)>=d},maxlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)<=d},rangelength:function(a,b,d){a=this.getLength(c.trim(a),b);return this.optional(b)||a>=d[0]&&a<=d[1]},min:function(a,b,d){return this.optional(b)||a>=d},max:function(a,b,d){return this.optional(b)||a<=d},range:function(a,b,d){return this.optional(b)||
a>=d[0]&&a<=d[1]},email:function(a,b){return this.optional(b)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(a)},
url:function(a,b){return this.optional(b)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},
date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a))},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)},number:function(a,b){return this.optional(b)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9-]+/.test(a))return false;var d=0,e=0,f=false;a=a.replace(/\D/g,"");for(var g=a.length-1;g>=
0;g--){e=a.charAt(g);e=parseInt(e,10);if(f)if((e*=2)>9)e-=9;d+=e;f=!f}return d%10==0},accept:function(a,b,d){d=typeof d=="string"?d.replace(/,/g,"|"):"png|jpe?g|gif";return this.optional(b)||a.match(RegExp(".("+d+")$","i"))},equalTo:function(a,b,d){d=c(d).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){c(b).valid()});return a==d.val()}}});c.format=c.validator.format})(jQuery);
(function(c){var a={};if(c.ajaxPrefilter)c.ajaxPrefilter(function(d,e,f){e=d.port;if(d.mode=="abort"){a[e]&&a[e].abort();a[e]=f}});else{var b=c.ajax;c.ajax=function(d){var e=("port"in d?d:c.ajaxSettings).port;if(("mode"in d?d:c.ajaxSettings).mode=="abort"){a[e]&&a[e].abort();return a[e]=b.apply(this,arguments)}return b.apply(this,arguments)}}})(jQuery);
(function(c){!jQuery.event.special.focusin&&!jQuery.event.special.focusout&&document.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.handle.call(this,e)}c.event.special[b]={setup:function(){this.addEventListener(a,d,true)},teardown:function(){this.removeEventListener(a,d,true)},handler:function(e){arguments[0]=c.event.fix(e);arguments[0].type=b;return c.event.handle.apply(this,arguments)}}});c.extend(c.fn,{validateDelegate:function(a,
b,d){return this.bind(b,function(e){var f=c(e.target);if(f.is(a))return d.apply(f,arguments)})}})})(jQuery);



