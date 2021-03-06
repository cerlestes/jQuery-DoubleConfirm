jQuery DoubleConfirm Plugin
===========================

A jQuery plugin that allows buttons to transform into a confirmation mode when clicked initially, so that they need to be clicked a second time to confirm the user's choice.
This is useful for buttons with severe consequences like deletion and where an "Are you sure?" kind of popup is not wanted.

![Demo](http://i.imgur.com/aIH4weT.png)



How to use?
-----------

DoubleConfirm offers implementation via data-attributes and the jQuery API ($.fn.doubleConfirm).

A very basic example using the data-toggle attribute:
```html
<a href="//example.com" class="btn btn-primary" data-toggle="double-confirm">Go to example.com</a>
```

The same button, but initialized by JS-code:
```html
<a href="//example.com" class="btn btn-primary" id="js-double-confirm">Go to example.com</a>
<script>
	$(function(){
		$("#js-double-confirm").doubleConfirm();
	});
</script>
```

Change the plugin's setting on a single button via data attributes:
```html
<a href="//example.com" class="btn btn-primary" data-toggle="double-confirm" data-countdown="5" data-cooldown-css="btn-ladda">Go to example.com</a>
```

...or via an options object (note the key's camelCase):
```html
<a href="//example.com" class="btn btn-primary" id="js-double-confirm">Go to example.com</a>
<script>
	$(function(){
		$("#js-double-confirm").doubleConfirm({
			"countdown": 5,
			"cooldownCss": "btn-ladda"
		});
	});
</script>
```

Change options globally if you need them this way for every button (useful for localization):
```javascript
$.doubleConfirm("setDefault", {
	"format": "Wirklich ##original##? ##counterp##"
});
```

![DogeConfirm](http://i.imgur.com/fQ9dw0E.jpg "Doge Confirm")



Options
-------

Options can be provided via global default values, the data-attributes and an options object. Default values are overwritten by provided data-attributes, which again are overwritten by an options object's provided values.

* **format** (String or Function, default: "Really ##original##? ##counterp##")  
  The text to display while the countdown is running. If a function is given, it's return value is used. Use **##original##** as a replacement-token for the button's original HTML-content, **##counter##** for the countdown and **##counterp##** for a countdown wrapped in parentheses that is only shown when t > 0
* **countdown** (Number, default: 2)  
  The number of seconds before the button becomes clickable
* **countdownCss** (String, optional, default: "disabled")  
  CSS-classes to toggle when button is entering countdown-state and again when leaving to cooldown. Use this to visually disable the button.
* **cooldown** (Number, default: 10)  
  The number of seconds before the button resets to its original state again
* **cooldownCss** (String, optional)  
  CSS-classes to toggle when button is entering cooldown-state and again when resetting. Use this to add additional functionality via delegated click-handlers, e.g. [Ladda](http://lab.hakim.se/ladda/) buttons.
* **onCountdown** (Function, optional)  
  A handler function that is executed after the button has entered countdown-mode and is not clickable.
* **onCooldown** (Function, optional)  
  A handler function that is executed after the button has left countdown-mode, entered cooldown-mode and is going to execute its real function when clicked.
* **onReset** (Function, optional)  
  A handler function that is executed after the button has left cooldown-mode and is disarmed.



Requirements
------------

The plugin's only requirement is [jQuery v1.6](http://jquery.com/) or newer.



License
-------

The DoubleConfirm plugin is released under the [MIT license](http://www.opensource.org/licenses/MIT).