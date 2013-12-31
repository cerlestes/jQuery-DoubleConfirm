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
 		"countdownFormat": "Really §? #",
 		"countdownCss": "disabled",
 		"cooldown": 10,
 		"cooldownCss": "",
 		"onCountdown": null,
 		"onCooldown": null
 	};

 	// Returns a string where the replacements in the given format were expanded
 	DoubleConfirm.prototype.format = function(format) {
 		if(typeof format === "undefined") {
 			format = this.options["countdownFormat"];
 		}

 		return (typeof format === "function") ? format(this) : format.replace("§", this.html).replace("#", ((this.countdown > 0) ? "(" + this.countdown + ")" : ""));
 	};

 	// Disables the button
 	DoubleConfirm.prototype.disable = function() {
 		this.$element.toggleClass(this.options["countdownCss"]);
 		this.$element.css("min-width", this.$element.outerWidth() + "px");
 		this.$element.blur();
 	};

 	// Enables the button
 	DoubleConfirm.prototype.enable = function() {
 		this.$element.toggleClass(this.options["countdownCss"]);
 		this.$element.css("min-width", "");
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
 		this.html = this.$element.html();
 		this.countdown = parseInt(this.options["countdown"]);
 		this.disable();
 		this.tick();

		if($.isFunction(this.options["onCountdown"])) {
			this.options["onCountdown"](this);
		}
 	};

 	// Starts the cooldown phase in which the button is normally clickable
 	DoubleConfirm.prototype.doCooldown = function() {
 		this.$element.html(this.format());
 		this.enable();

 		var that = this;
 		this.cooldownTimeoutId = setTimeout(function() {
 			that.$element.html(that.html);
			that.countdown = -1;
		}, (parseInt(this.options["cooldown"]) * 1000));

		if($.isFunction(this.options["onCooldown"])) {
			this.options["onCooldown"](this);
		}
 	};

 	// The countdown tick that fires every second
 	DoubleConfirm.prototype.tick = function() {
 		if(this.countdown > 0) {
 			this.$element.html(this.format());
 			this.countdown--;

 			var that = this;
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



 	// The Data-API listener
 	$(document).on("click.double-confirm.data-api", '[data-toggle="double-confirm"]', function(e) {
 		$(this).doubleConfirm('onClick', e);
 	});

 })(window.jQuery)