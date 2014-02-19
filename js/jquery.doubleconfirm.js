/*!
 * jQuery DoubleConfirm Plugin 1.0.0
 * https://github.com/cerlestes/jQuery-DoubleConfirm
 *
 * Copyright 2013, Kevin Fischer
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

 (function($, window) {

 	'use strict';



 	// The constructor function
 	var DoubleConfirm = function($element, options) {
 		this.$element = $element;
 		this.options = options;

 		this.countdown = -1;
 		this.countdownTimeoutId = 0;
 		this.cooldownTimeoutId = 0;
 		this.original = "";

 		// Add click eventhandler
 		var that = this;
 		this.$element.on('click.double-confirm', function(e){
 			that.onClick(e);
 		});
 	};

 	// The default config
 	DoubleConfirm.DEFAULTS = {
 		"countdown": 2,
 		"countdownFormat": "Really ${original}? ${counterp}",
 		"countdownCss": "disabled",
 		"cooldown": 10,
 		"cooldownCss": "",
 		"onCountdown": null,
 		"onCooldown": null,
 		"onReset": null
 	};

 	// Returns a string where the replacements in the given format were expanded
 	DoubleConfirm.prototype.format = function(format) {
 		if(typeof format === "undefined") {
 			format = this.options["countdownFormat"];
 		}

 		return (typeof format === "function") ? format(this) : format.replace("${original}", this.original).replace("${counter}", this.countdown).replace("${counterp}", ((this.countdown > 0) ? "(" + this.countdown + ")" : ""));
 	};

 	// Handles click on the bound element
 	DoubleConfirm.prototype.onClick = function(e) {
 		// Counter is 0 when cooling down
 		if(this.countdown !== 0) {
 			e.preventDefault();
 			e.stopPropagation();

 			// Counter is -1 when in normal state
 			if(this.countdown === -1) {
 				this.doCountdown();	
 			}
 		}
 	};

 	// Starts the countdown phase
 	DoubleConfirm.prototype.doCountdown = function() {
 		// Save original contents and set counter
 		this.original = $.trim(this.$element.html());
 		this.countdown = parseInt(this.options["countdown"]);

 		// Make button display the disabled countdown state
 		this.$element.toggleClass(this.options["countdownCss"]);
 		this.$element.blur();

 		// Start ticking
 		this.tick();

 		// Call onCountdown handler
		if($.isFunction(this.options["onCountdown"])) {
			this.options["onCountdown"](this);
		}
 	};

 	// Starts the cooldown phase in which the button is normally clickable
 	DoubleConfirm.prototype.doCooldown = function() {
 		// Make button display cooldown state
 		this.$element.html(this.format());
 		this.$element.toggleClass(this.options["countdownCss"]);
 		this.$element.toggleClass(this.options["cooldownCss"]);

 		// Start cooling down
 		this.cooldown();

 		// Call onCooldown handler
		if($.isFunction(this.options["onCooldown"])) {
			this.options["onCooldown"](this);
		}
 	};

 	// Resets the button to it's normal state again
 	DoubleConfirm.prototype.doReset = function() {
 		// Reset counter
 		this.countdown = -1;

 		// Make button display normal state
 		this.$element.html(this.original);
 		this.$element.toggleClass(this.options["cooldownCss"]);

 		// Call onReset handler
		if($.isFunction(this.options["onReset"])) {
			this.options["onReset"](this);
		}
 	};

 	// The countdown tick that fires every second
 	DoubleConfirm.prototype.tick = function() {
 		if(this.countdown > 0) {
 			// Update button and counter
 			this.$element.html(this.format());
 			this.countdown--;

 			// Tick again in one second
 			var that = this;
 			this.countdownTimeoutId = setTimeout(function() {
 				that.tick();
 			}, 1000);
 		} else {
 			this.doCooldown()
 		}
 	};

 	// Handles the cooldown timeout
 	DoubleConfirm.prototype.cooldown = function() {
 		if(this.countdown === 0) {
 			// Reset button after the defined cooldown time
			var that = this;
	 		this.cooldownTimeoutId = setTimeout(function() {
	 			that.doReset();
			}, (parseInt(this.options["cooldown"]) * 1000));
	 	}
 	};



 	// The jQuery prototype method
 	$.fn.doubleConfirm = function(options) {
 		var args = Array.prototype.slice.call(arguments, 1);

 		return $(this).each(function() {
 			var $this = $(this);
 			var instance = $this.data('double-confirm');

 			if(!instance) {
 				instance = new DoubleConfirm( $this, $.extend({}, DoubleConfirm.DEFAULTS, $this.data(), options) );
 				$this.data('double-confirm', instance);
 			}

 			if(typeof options === "string" && typeof instance[options] === "function") {
 				instance[options].apply(instance, args);
 			}
 		});
 	};

 	// The static jQuery method
 	$.doubleConfirm = function(method, arg1, arg2) {
 		switch(method) {
 			case "setDefault":
 				if(typeof arg1 === "object") {
 					$.extend(DoubleConfirm.DEFAULTS, arg1);
 				} else if(typeof arg1 === "string") {
 					DoubleConfirm.DEFAULTS[arg1] = arg2;
 				}
 				break;
 		}
 	};

 	// The Data-API listener
 	$(document).on("click.double-confirm.data-api", '[data-toggle="double-confirm"]', function(e) {
 		$(this).doubleConfirm('onClick', e);
 	});

 })(window.jQuery, window)