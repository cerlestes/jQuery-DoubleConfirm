/*!
 * jQuery DoubleConfirm Plugin 1.0.0
 * https://github.com/cerlestes/jQuery-DoubleConfirm
 *
 * Copyright 2013, Kevin Fischer
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

 (function($) {

 	'use strict';



 	// The constructor function
 	var DoubleConfirm = function($element, options) {
 		this.$element = $element;
 		this.options = options;
 		this.countdown = -1;
 		this.countdownTimeoutId = 0;
 		this.cooldownTimeoutId = 0;
 		this.html = "";

 		this.$element.on('click', this.onClick.bind(this));
 	};

 	// The default config
 	DoubleConfirm.DEFAULTS = {
 		"countdown": 3,
 		"countdown-format": "§ (#)",
 		"countdown-css": "disabled",
 		"cooldown": 10,
 		"cooldown-css": "",
 		"on-countdown": $.noop,
 		"on-cooldown": $.noop
 	};

 	DoubleConfirm.prototype.format = function(format) {
 		if(typeof format === "undefined") {
 			format = this.options["countdown-format"];
 		}

 		return (typeof format === "function") ? format(this) : format.replace("§", this.html).replace("#", this.countdown);
 	};

 	DoubleConfirm.prototype.disable = function() {
 		this.html = this.$element.html();

 		this.$element.toggleClass(this.options["countdown-css"]);
 		this.$element.css("min-width", this.$element.width() + "px");
 		this.$element.blur();
 	};

 	DoubleConfirm.prototype.enable = function() {
 		this.$element.toggleClass(this.options["countdown-css"]);
 		this.$element.css("min-width", "");
 		this.$element.html(this.html);
 	};

 	// Handles click on the bound element
 	DoubleConfirm.prototype.onClick = function(e) {
 		if(this.countdown !== 0) {
 			e.preventDefault();
 			e.stopPropagation();

 			if(this.countdown === -1) {
 				this.doCountdown();	
 			}
 		}
 	};

 	// Starts the countdown phase
 	DoubleConfirm.prototype.doCountdown = function() {
 		this.countdown = parseInt(this.options["countdown"]);
 		this.disable();
 		this.tick();

		if($.isFunction(this.options["on-countdown"])) {
			this.options["on-countdown"](this);
		}
 	};

 	// Starts the cooldown phase in which the button is normally clickable
 	DoubleConfirm.prototype.doCooldown = function() {
 		var that = this;

 		this.enable();
 		this.cooldownTimeoutId = setTimeout(function() {
			that.countdown = -1;
		}, (parseInt(this.options["cooldown"]) * 1000));

		if($.isFunction(this.options["on-cooldown"])) {
			this.options["on-cooldown"](this);
		}
 	};

 	// The countdown tick that fires every second
 	DoubleConfirm.prototype.tick = function() {
 		var that = this;

 		if(this.countdown > 0) {
 			this.$element.html(this.format());
 			this.countdown--;
 			this.countdownTimeoutId = setTimeout(function() {
 				that.tick();
 			}, 1000);
 		} else {
 			this.doCooldown();
 		}
 	};



 	// The public jQuery method
 	$.fn.doubleConfirm = function(options) {
 		var args = Array.prototype.slice.call(arguments, 1);

 		return $(this).each(function(){
 			var $this = $(this);
 			var instance = $this.data('double-confirm');

 			if(!instance) {
 				instance = new DoubleConfirm( $this, $.extend({}, DoubleConfirm.DEFAULTS, $this.data(), (typeof options === "object" && options)) );
 				$this.data('double-confirm', instance);
 			}

 			if(typeof options === "string" && typeof instance[options] === "function") {
 				instance[options].apply(instance, args);
 			}
 		});
 	};



 	// Add Data-API listener
 	$(document).on("click.double-confirm.data-api", '[data-toggle="double-confirm"]', function(e) {
 		$(this).doubleConfirm('onClick', e);
 	});

 })(window.jQuery)