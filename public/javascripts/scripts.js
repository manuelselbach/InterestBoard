/*! Global website scripts */

var website = null;

(function($) { 
	
	new function website() { 
		
		// map this to that (to use this in anonymous functions)
		var that = this;
		website = this;
		
		this.tooltips = null;

		// fires initial Event...
		$(document).bind("ready", function bindReady(event) { 
			that.initDom();
			that.setScrollState($(window).scrollTop()); 
		});

		$(window).bind("load", function bindLoad(event) { 
			that.onLoad(); 
		});
 
        $(window).bind("scroll", function bindScroll(event) {
            that.setScrollState($(window).scrollTop());
        });
		
		$(window).bind("resize", function bindResize(event) {
            that.setScrollState($(window).scrollTop());
        });
        
		/**
		 * called when DOM is initialized
		 */
		this.initDom = function initDom(event) {
			console.debug("scripts.js - init!");	
		}

		/**
		 * called when Page is loaded
		 */
		this.onLoad = function onLoad(event) {
			console.debug("scripts.js - website is loaded.");	
		}
		
		/** 
		 * called when page is scrolled 
		 * - fix the footer
		 */
		this.setScrollState = function setScrollState(scrollTop) {
			var scrollPosition = scrollTop + ($(window).height() - $("#footer").height());
			$("#footer").offset({ top: scrollPosition });
		}
		
	} 
})(jQuery);
