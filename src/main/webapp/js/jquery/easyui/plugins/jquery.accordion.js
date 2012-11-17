/**
 * accordion - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 panel
 * 
 */
(function($){
	
	function setSize(container){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		var cc = $(container);
		if (opts.fit == true){
			var p = cc.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		
		if (opts.width > 0){
			cc.width($.boxModel==true ? (opts.width-(cc.outerWidth()-cc.width())) : opts.width);
		}
		var panelHeight = 'auto';
		if (opts.height > 0){
			cc.height($.boxModel==true ? (opts.height-(cc.outerHeight()-cc.height())) : opts.height);
			// get the first panel's header height as all the header height
			var headerHeight = panels.length ? panels[0].panel('header').css('height', null).outerHeight() : 'auto';
			var panelHeight = cc.height() - (panels.length-1)*headerHeight;
		}
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			var header = panel.panel('header');
			header.height($.boxModel==true ? (headerHeight-(header.outerHeight()-header.height())) : headerHeight);
			panel.panel('resize', {
				width: cc.width(),
				height: panelHeight
			});
		}
	}
	
	/**
	 * get the current panel DOM element
	 */
	function getCurrent(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			if (panel.panel('options').collapsed == false){
				return panel;
			}
		}
		return null;
	}
	
	/**
	 * get the specified panel, remove it from panel array if removeit setted to true.
	 */
	function getPanel(container, title, removeit){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			if (panel.panel('options').title == title){
				if (removeit){
					panels.splice(i, 1);
				}
				return panel;
			}
		}
		return null;
	}
	
	function wrapAccordion(container){
		var cc = $(container);
		cc.addClass('accordion');
		if (cc.attr('border') == 'false'){
			cc.addClass('accordion-noborder');
		} else {
			cc.removeClass('accordion-noborder');
		}
		
		// if no panel selected set the first one active
		var selected = cc.children('div[selected]');
		cc.children('div').not(selected).attr('collapsed', 'true');
		if (selected.length == 0){
			cc.children('div:first').attr('collapsed', 'false');
		}
		
		var panels = [];
		cc.children('div').each(function(){
			var pp = $(this);
			panels.push(pp);
			createPanel(container, pp, {});
		});
		
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'accordion').options;
			if (opts.fit == true || force){
				setSize(container);
			}
			return false;
		});
		
		return {
			accordion: cc,
			panels: panels
		}
	}
	
	function createPanel(container, pp, options){
		pp.panel($.extend({}, options, {
			collapsible: false,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
//			collapsed: (!pp.get(0).getAttribute('selected')),
//			collapsed: pp.attr('selected') != 'true',
			tools:[{
				iconCls:'accordion-collapse',
				handler:function(){
					var animate = $.data(container, 'accordion').options.animate;
					if (pp.panel('options').collapsed){
						stopAnimate(container);
						pp.panel('expand', animate);
					} else {
						stopAnimate(container);
						pp.panel('collapse', animate);
					}
					
					return false;
				}
			}],
			onBeforeExpand: function(){
				var curr = getCurrent(container);
				if (curr){
					var header = $(curr).panel('header');
					header.removeClass('accordion-header-selected');
					header.find('.accordion-collapse').triggerHandler('click');
				}
				var header = pp.panel('header');
				header.addClass('accordion-header-selected');
				header.find('.accordion-collapse').removeClass('accordion-expand');
			},
			onExpand: function(){
//				pp.panel('body').find('>div').triggerHandler('_resize');
				var opts = $.data(container, 'accordion').options;
				opts.onSelect.call(container, pp.panel('options').title);
			},
			onBeforeCollapse: function(){
				var header = pp.panel('header');
				header.removeClass('accordion-header-selected');
				header.find('.accordion-collapse').addClass('accordion-expand');
			}
		}));
		
		pp.panel('body').addClass('accordion-body');
		pp.panel('header').addClass('accordion-header').click(function(){
			$(this).find('.accordion-collapse').triggerHandler('click');
			return false;
		});
	}
	
	/**
	 * select and set the specified panel active
	 */
	function select(container, title){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		var curr = getCurrent(container);
		if (curr && curr.panel('options').title == title){
			return;
		}
		
		var panel = getPanel(container, title);
		if (panel){
			panel.panel('header').triggerHandler('click');
		} else if (curr){
			curr.panel('header').addClass('accordion-header-selected');
			opts.onSelect.call(container, curr.panel('options').title);
		}
	}
	
	/**
	 * stop the animation of all panels
	 */
	function stopAnimate(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			panels[i].stop(true,true);
		}
	}
	
	function add(container, options){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;

		stopAnimate(container);
		
		options.collapsed = options.selected==undefined ? true : options.selected;
		var pp = $('<div></div>').appendTo(container);
		panels.push(pp);
		createPanel(container, pp, options);
		setSize(container);
		
		opts.onAdd.call(container, options.title);
		
		select(container, options.title);
	}
	
	function remove(container, title){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		stopAnimate(container);
		
		if (opts.onBeforeRemove.call(container, title) == false) return;
		
		var panel = getPanel(container, title, true);
		if (panel){
			panel.panel('destroy');
			if (panels.length){
				setSize(container);
				var curr = getCurrent(container);
				if (!curr){
					select(container, panels[0].panel('options').title);
				}
			}
		}
		
		opts.onRemove.call(container, title);
	}
	
	$.fn.accordion = function(options, param){
		if (typeof options == 'string'){
			return $.fn.accordion.methods[options](this, param);
		}
		
		options = options || {};
		
		return this.each(function(){
			var state = $.data(this, 'accordion');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.opts = opts;
			} else {
				opts = $.extend({}, $.fn.accordion.defaults, $.fn.accordion.parseOptions(this), options);
				var r = wrapAccordion(this);
				$.data(this, 'accordion', {
					options: opts,
					accordion: r.accordion,
					panels: r.panels
				});
			}
			
			setSize(this);
			select(this);
		});
	};
	
	$.fn.accordion.methods = {
		options: function(jq){
			return $.data(jq[0], 'accordion').options;
		},
		panels: function(jq){
			return $.data(jq[0], 'accordion').panels;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		getSelected: function(jq){
			return getCurrent(jq[0]);
		},
		getPanel: function(jq, title){
			return getPanel(jq[0], title);
		},
		select: function(jq, title){
			return jq.each(function(){
				select(this, title);
			});
		},
		add: function(jq, opts){
			return jq.each(function(){
				add(this, opts);
			});
		},
		remove: function(jq, title){
			return jq.each(function(){
				remove(this, title);
			});
		}
	};
	
	$.fn.accordion.parseOptions = function(target){
		var t = $(target);
		return {
			width: (parseInt(target.style.width) || undefined),
			height: (parseInt(target.style.height) || undefined),
			fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
			border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
			animate: (t.attr('animate') ? t.attr('animate') == 'true' : undefined)
		};
	};
	
	$.fn.accordion.defaults = {
		width: 'auto',
		height: 'auto',
		fit: false,
		border: true,
		animate: true,
		
		onSelect: function(title){},
		onAdd: function(title){},
		onBeforeRemove: function(title){},
		onRemove: function(title){}
	};
})(jQuery);