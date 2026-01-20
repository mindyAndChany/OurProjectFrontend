// vendored from node_modules/dwachss-flexcal-05c361c/jquery.textpopup.js
// See original license in source
// textpopup and hebrew keyboard widgets
// Version: 2.2.3
// dependencies: jQuery UI
// Copyright (c) 2015 Daniel Wachsstock
// MIT license
(function($){
	$.widget('bililite.textpopup', {
		_init: function(){
			var self = this;
			if (this.options.box) this.options.hideOnOutsideClick = false;
			this._hideOnOutsideClick(this.options.hideOnOutsideClick);
			this._position = $.extend({
				of: this.element,
				collision: 'none',
				using: function(to) { $(this).stop(true, false).animate(to, 200) }
			}, this.options.position.my ? this.options.position : position[this.options.position]);
			this._duration = $.isArray(this.options.duration) ? this.options.duration : [this.options.duration];
			var trigger = this.options.trigger;
			if (trigger == 'self') trigger = this.element;
			if (this._triggerElement) $(trigger).unbind('.textpopup');
			if (trigger){
				this._triggerElement = $(trigger);
				this._triggerElement.filter(":focusable").bind('focus.textpopup', self.show.bind(self));
				this._triggerElement.filter(":not(:focusable)").bind('click.textpopup', self.show.bind(self));
			}
		},
		position: function(){
			if (this.options.box) return;
			var display = this._box().css('display');
			this._box().css({display: 'block', visibility: 'hidden'})
				.position(this._position)
				.css({display: display, visibility: 'visible'});
		},
		show: function(){
			var self = this, box = self._box().attr('tabindex', 0);
			if (box.is(':visible, :animated')) return;
			self.position();
			self.options.show.apply(box, this._duration);
			box.queue(function(){ self._trigger('shown'); box.dequeue() });
		},
		hide: function(){
			var self = this, box = self._box().removeAttr('tabindex');
			if (box.is(':hidden')) return;
			self.options.hide.apply(box, this._duration);
			box.queue(function(){ self._trigger('hidden'); box.dequeue() });
		},
		_box: function(){ return this.theBox || this._createBox(); },
		widget: function(){ return this._box(); },
		_createBox: function(){
			var self = this;
			var box = this.options.box ? $(this.options.box) : $('<div/>').appendTo('body').css({position: 'absolute', display: 'none'});
			box.addClass(this.options['class']).keydown(function(e){
				if (e.keyCode == $.ui.keyCode.ESCAPE) {
					self.element.focus();
					if (self.options.hideOnOutsideClick) self.hide();
				}
			});
			this.theBox = box;
			box.data('textpopup', this);
			this._fill(box);
			this._trigger('create', 0, box);
			return box;
		},
		_fill: function(box){},
		_hideOnOutsideClick: function(flag){
			var self = this;
			this._hider = this._hider || function(e){ if(!self._isClickInside(e)) self.hide(); };
			if (flag){ $('body').on ('click', this._hider); } else { $('body').off ('click', this._hider); }
		},
		destroy: function(){
			if (!this.options.box) this._box().remove();
			if (this._triggerElement) this._triggerElement.unbind ('.textpopup');
			$('body').unbind('.textpopup');
			this.theBox = undefined;
		},
		_setOption: function(key, value){
			this._super(key, value);
			if (key == 'trigger' || 'hideOnOutsideClick' || 'position' || 'duration') this._init;
			if (key == 'class') this._box().attr('class', value);
		},
		_isClickInside: function(e){
			var keepers = $([]).add(this._triggerElement).add(this._box()).add(this.element);
			for (var elem = e.target; elem; elem = elem.parentNode) if (keepers.index(elem) > -1) return true;
			return false;
		},
		options: {
			box: undefined,
			show: $.fn.show,
			hide: $.fn.hide,
			duration: 'slow',
			hideOnOutsideClick: true,
			position: 'tl',
			trigger: 'self',
			'class': 'ui-textpopup-box'
		}
	});
	var position = {
		tl: {my: 'left bottom', at: 'left top'},
		tr: {my: 'right bottom ', at: 'right top'},
		bl: {my: 'left top', at: 'left bottom'},
		br: {my: 'right top', at: 'right bottom'},
		lt: {my: 'right top', at: 'left top'},
		rt: {my: 'left top', at: 'right top'},
		lb: {my: 'right bottom', at: 'left bottom'},
		rb: {my: 'left bottom', at: 'right bottom'}
	};
})(jQuery);