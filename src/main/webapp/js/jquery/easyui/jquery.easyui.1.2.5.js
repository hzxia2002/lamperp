/**
 * draggable - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	var isDragging = false;
	function drag(e){
		var opts = $.data(e.data.target, 'draggable').options;
		
		var dragData = e.data;
		var left = dragData.startLeft + e.pageX - dragData.startX;
		var top = dragData.startTop + e.pageY - dragData.startY;
		
		if (opts.deltaX != null && opts.deltaX != undefined){
			left = e.pageX + opts.deltaX;
		}
		if (opts.deltaY != null && opts.deltaY != undefined){
			top = e.pageY + opts.deltaY;
		}
		
		if (e.data.parnet != document.body) {
			if ($.boxModel == true) {
				left += $(e.data.parent).scrollLeft();
				top += $(e.data.parent).scrollTop();
			}
		}
		
		if (opts.axis == 'h') {
			dragData.left = left;
		} else if (opts.axis == 'v') {
			dragData.top = top;
		} else {
			dragData.left = left;
			dragData.top = top;
		}
	}
	
	function applyDrag(e){
		var opts = $.data(e.data.target, 'draggable').options;
		var proxy = $.data(e.data.target, 'draggable').proxy;
		if (proxy){
			proxy.css('cursor', opts.cursor);
		} else {
			proxy = $(e.data.target);
			$.data(e.data.target, 'draggable').handle.css('cursor', opts.cursor);
		}
		proxy.css({
			left:e.data.left,
			top:e.data.top
		});
	}
	
	function doDown(e){
		isDragging = true;
		var opts = $.data(e.data.target, 'draggable').options;
		
		var droppables = $('.droppable').filter(function(){
			return e.data.target != this;
		}).filter(function(){
			var accept = $.data(this, 'droppable').options.accept;
			if (accept){
				return $(accept).filter(function(){
					return this == e.data.target;
				}).length > 0;
			} else {
				return true;
			}
		});
		$.data(e.data.target, 'draggable').droppables = droppables;
		
		var proxy = $.data(e.data.target, 'draggable').proxy;
		if (!proxy){
			if (opts.proxy){
				if (opts.proxy == 'clone'){
					proxy = $(e.data.target).clone().insertAfter(e.data.target);
				} else {
					proxy = opts.proxy.call(e.data.target, e.data.target);
				}
				$.data(e.data.target, 'draggable').proxy = proxy;
			} else {
				proxy = $(e.data.target);
			}
		}
		
		proxy.css('position', 'absolute');
		drag(e);
		applyDrag(e);
		
		opts.onStartDrag.call(e.data.target, e);
		return false;
	}
	
	function doMove(e){
		drag(e);
		if ($.data(e.data.target, 'draggable').options.onDrag.call(e.data.target, e) != false){
			applyDrag(e);
		}
		
		var source = e.data.target;
		$.data(e.data.target, 'draggable').droppables.each(function(){
			var dropObj = $(this);
			var p2 = $(this).offset();
			if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
					&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
				if (!this.entered){
					$(this).trigger('_dragenter', [source]);
					this.entered = true;
				}
				$(this).trigger('_dragover', [source]);
			} else {
				if (this.entered){
					$(this).trigger('_dragleave', [source]);
					this.entered = false;
				}
			}
		});
		
		return false;
	}
	
	function doUp(e){
		isDragging = false;
		drag(e);
		
		var proxy = $.data(e.data.target, 'draggable').proxy;
		var opts = $.data(e.data.target, 'draggable').options;
		if (opts.revert){
			if (checkDrop() == true){
				removeProxy();
				$(e.data.target).css({
					position:e.data.startPosition,
					left:e.data.startLeft,
					top:e.data.startTop
				});
			} else {
				if (proxy){
					proxy.animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						removeProxy();
					});
				} else {
					$(e.data.target).animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						$(e.data.target).css('position', e.data.startPosition);
					});
				}
			}
		} else {
			$(e.data.target).css({
				position:'absolute',
				left:e.data.left,
				top:e.data.top
			});
			removeProxy();
			checkDrop();
		}
		
		opts.onStopDrag.call(e.data.target, e);
		
		$(document).unbind('.draggable');
		setTimeout(function(){
			$('body').css('cursor','auto');
		},100);
		
		function removeProxy(){
			if (proxy){
				proxy.remove();
			}
			$.data(e.data.target, 'draggable').proxy = null;
		}
		
		function checkDrop(){
			var dropped = false;
			$.data(e.data.target, 'draggable').droppables.each(function(){
				var dropObj = $(this);
				var p2 = $(this).offset();
				if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
					if (opts.revert){
						$(e.data.target).css({
							position:e.data.startPosition,
							left:e.data.startLeft,
							top:e.data.startTop
						});
					}
					$(this).trigger('_drop', [e.data.target]);
					dropped = true;
					this.entered = false;
				}
			});
			return dropped;
		}
		
//		$(document).unbind('.draggable');
		return false;
	}
	
	$.fn.draggable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.draggable.methods[options](this, param);
		}
		
		return this.each(function(){
			var opts;
			var state = $.data(this, 'draggable');
			if (state) {
				state.handle.unbind('.draggable');
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.draggable.defaults, options || {});
			}
			
			if (opts.disabled == true) {
				$(this).css('cursor', 'default');
				return;
			}
			
			var handle = null;
            if (typeof opts.handle == 'undefined' || opts.handle == null){
                handle = $(this);
            } else {
                handle = (typeof opts.handle == 'string' ? $(opts.handle, this) : opts.handle);
            }
			$.data(this, 'draggable', {
				options: opts,
				handle: handle
			});
			
			handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
				if (isDragging) return;
				var opts = $.data(e.data.target, 'draggable').options;
				if (checkArea(e)){
					$(this).css('cursor', opts.cursor);
				} else {
					$(this).css('cursor', '');
				}
			}).bind('mouseleave.draggable', {target:this}, function(e){
				$(this).css('cursor', '');
			}).bind('mousedown.draggable', {target:this}, function(e){
				if (checkArea(e) == false) return;

				var position = $(e.data.target).position();
				var data = {
					startPosition: $(e.data.target).css('position'),
					startLeft: position.left,
					startTop: position.top,
					left: position.left,
					top: position.top,
					startX: e.pageX,
					startY: e.pageY,
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				
				$.extend(e.data, data);
				var opts = $.data(e.data.target, 'draggable').options;
				if (opts.onBeforeDrag.call(e.data.target, e) == false) return;
				
				$(document).bind('mousedown.draggable', e.data, doDown);
				$(document).bind('mousemove.draggable', e.data, doMove);
				$(document).bind('mouseup.draggable', e.data, doUp);
				$('body').css('cursor', opts.cursor);
			});
			
			// check if the handle can be dragged
			function checkArea(e) {
				var state = $.data(e.data.target, 'draggable');
				var handle = state.handle;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				
				return Math.min(t,r,b,l) > state.options.edge;
			}
			
		});
	};
	
	$.fn.draggable.methods = {
		options: function(jq){
			return $.data(jq[0], 'draggable').options;
		},
		proxy: function(jq){
			return $.data(jq[0], 'draggable').proxy;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:true});
			});
		}
	};
	
	$.fn.draggable.defaults = {
		proxy:null,	// 'clone' or a function that will create the proxy object, 
					// the function has the source parameter that indicate the source object dragged.
		revert:false,
		cursor:'move',
		deltaX:null,
		deltaY:null,
		handle: null,
		disabled: false,
		edge:0,
		axis:null,	// v or h
		
		onBeforeDrag: function(e){},
		onStartDrag: function(e){},
		onDrag: function(e){},
		onStopDrag: function(e){}
	};
})(jQuery);/**
 * droppable - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	function init(target){
		$(target).addClass('droppable');
		$(target).bind('_dragenter', function(e, source){
			$.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
		});
		$(target).bind('_dragleave', function(e, source){
			$.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
		});
		$(target).bind('_dragover', function(e, source){
			$.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
		});
		$(target).bind('_drop', function(e, source){
			$.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
		});
	}
	
	$.fn.droppable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.droppable.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'droppable');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'droppable', {
					options: $.extend({}, $.fn.droppable.defaults, options)
				});
			}
		});
	};
	
	$.fn.droppable.methods = {
	};
	
	$.fn.droppable.defaults = {
		accept:null,
		onDragEnter:function(e, source){},
		onDragOver:function(e, source){},
		onDragLeave:function(e, source){},
		onDrop:function(e, source){}
	};
})(jQuery);/**
 * resizable - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	var isResizing = false;
	$.fn.resizable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.resizable.methods[options](this, param);
		}
		
		function resize(e){
			var resizeData = e.data;
			var options = $.data(resizeData.target, 'resizable').options;
			if (resizeData.dir.indexOf('e') != -1) {
				var width = resizeData.startWidth + e.pageX - resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
			}
			if (resizeData.dir.indexOf('s') != -1) {
				var height = resizeData.startHeight + e.pageY - resizeData.startY;
				height = Math.min(
						Math.max(height, options.minHeight),
						options.maxHeight
				);
				resizeData.height = height;
			}
			if (resizeData.dir.indexOf('w') != -1) {
				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
				}
			}
			if (resizeData.dir.indexOf('n') != -1) {
				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
				}
			}
		}
		
		function applySize(e){
			var resizeData = e.data;
			var target = resizeData.target;
			if ($.boxModel == true){
				$(target).css({
					width: resizeData.width - resizeData.deltaWidth,
					height: resizeData.height - resizeData.deltaHeight,
					left: resizeData.left,
					top: resizeData.top
				});
			} else {
				$(target).css({
					width: resizeData.width,
					height: resizeData.height,
					left: resizeData.left,
					top: resizeData.top
				});
			}
		}
		
		function doDown(e){
			isResizing = true;
			$.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
			return false;
		}
		
		function doMove(e){
			resize(e);
			if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
				applySize(e)
			}
			return false;
		}
		
		function doUp(e){
			isResizing = false;
			resize(e, true);
			applySize(e);
			$.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
			$(document).unbind('.resizable');
			$('body').css('cursor','auto');
			return false;
		}
		
		return this.each(function(){
			var opts = null;
			var state = $.data(this, 'resizable');
			if (state) {
				$(this).unbind('.resizable');
				opts = $.extend(state.options, options || {});
			} else {
				opts = $.extend({}, $.fn.resizable.defaults, options || {});
				$.data(this, 'resizable', {
					options:opts
				});
			}
			
			if (opts.disabled == true) {
				return;
			}
			
			// bind mouse event using namespace resizable
			$(this).bind('mousemove.resizable', {target:this}, function(e){
				if (isResizing) return;
				var dir = getDirection(e);
				if (dir == '') {
					$(e.data.target).css('cursor', '');
				} else {
					$(e.data.target).css('cursor', dir + '-resize');
				}
			}).bind('mousedown.resizable', {target:this}, function(e){
				var dir = getDirection(e);
				if (dir == '') return;
				
				function getCssValue(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				}
				
				var data = {
					target: e.data.target,
					dir: dir,
					startLeft: getCssValue('left'),
					startTop: getCssValue('top'),
					left: getCssValue('left'),
					top: getCssValue('top'),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind('mousedown.resizable', data, doDown);
				$(document).bind('mousemove.resizable', data, doMove);
				$(document).bind('mouseup.resizable', data, doUp);
				$('body').css('cursor', dir+'-resize');
			}).bind('mouseleave.resizable', {target:this}, function(e){
				$(e.data.target).css('cursor', '');
			});
			
			// get the resize direction
			function getDirection(e) {
				var tt = $(e.data.target);
				var dir = '';
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = opts.edge;
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {
					dir += 'n';
				} else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
					dir += 's';
				}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {
					dir += 'w';
				} else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
					dir += 'e';
				}
				
				var handles = opts.handles.split(',');
				for(var i=0; i<handles.length; i++) {
					var handle = handles[i].replace(/(^\s*)|(\s*$)/g, '');
					if (handle == 'all' || handle == dir) {
						return dir;
					}
				}
				return '';
			}
			
			
		});
	};
	
	$.fn.resizable.methods = {
		options: function(jq){
			return $.data(jq[0], 'resizable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:true});
			});
		}
	};
	
	$.fn.resizable.defaults = {
		disabled:false,
		handles:'n, e, s, w, ne, se, sw, nw, all',
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,//$(document).width(),
		maxHeight: 10000,//$(document).height(),
		edge:5,
		onStartResize: function(e){},
		onResize: function(e){},
		onStopResize: function(e){}
	};
	
})(jQuery);/**
 * linkbutton - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	
	function createButton(target) {
		var opts = $.data(target, 'linkbutton').options;
		
		$(target).empty();
		$(target).addClass('l-btn');
		if (opts.id){
			$(target).attr('id', opts.id);
		} else {
			$.fn.removeProp ? $(target).removeProp('id') : $(target).removeAttr('id'); 
//			$(target).removeAttr('id');
		}
		if (opts.plain){
			$(target).addClass('l-btn-plain');
		} else {
			$(target).removeClass('l-btn-plain');
		}
		
		if (opts.text){
			$(target).html(opts.text).wrapInner(
					'<span class="l-btn-left">' +
					'<span class="l-btn-text">' +
					'</span>' +
					'</span>'
			);
			if (opts.iconCls){
				$(target).find('.l-btn-text').addClass(opts.iconCls).css('padding-left', '20px');
			}
		} else {
			$(target).html('&nbsp;').wrapInner(
					'<span class="l-btn-left">' +
					'<span class="l-btn-text">' +
					'<span class="l-btn-empty"></span>' +
					'</span>' +
					'</span>'
			);
			if (opts.iconCls){
				$(target).find('.l-btn-empty').addClass(opts.iconCls);
			}
		}
		$(target).unbind('.linkbutton').bind('focus.linkbutton',function(){
			if (!opts.disabled){
				$(this).find('span.l-btn-text').addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton',function(){
			$(this).find('span.l-btn-text').removeClass('l-btn-focus');
		});
		
		setDisabled(target, opts.disabled);
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'linkbutton');
		if (disabled){
			state.options.disabled = true;
			var href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
//			var onclick = $(target).attr('onclick');
//			if (onclick) {
//				state.onclick = onclick;
//				$(target).attr('onclick', '');
//			}
			$(target).addClass('l-btn-disabled');
		} else {
			state.options.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
			$(target).removeClass('l-btn-disabled');
		}
	}
	
	$.fn.linkbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.linkbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'linkbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			createButton(this);
		});
	};
	
	$.fn.linkbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'linkbutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		}
	};
	
	$.fn.linkbutton.parseOptions = function(target){
		var t = $(target);
		return {
			id: t.attr('id'),
			disabled: (t.attr('disabled') ? true : undefined),
			plain: (t.attr('plain') ? t.attr('plain') == 'true' : undefined),
			text: $.trim(t.html()),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		};
	};
	
	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		plain: false,
		text: '',
		iconCls: null
	};
	
})(jQuery);
/**
 * progressbar - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 none
 * 
 */
(function($){
	function init(target){
		$(target).addClass('progressbar');
		$(target).html('<div class="progressbar-text"></div><div class="progressbar-value">&nbsp;</div>');
		return $(target);
	}
	
	function setSize(target,width){
		var opts = $.data(target, 'progressbar').options;
		var bar = $.data(target, 'progressbar').bar;
		if (width) opts.width = width;
		if ($.boxModel == true){
			bar.width(opts.width - (bar.outerWidth() - bar.width()));
		} else {
			bar.width(opts.width);
		}
		bar.find('div.progressbar-text').width(bar.width());
	}
	
	$.fn.progressbar = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.progressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'progressbar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'progressbar', {
					options: $.extend({}, $.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), options),
					bar: init(this)
				});
			}
			$(this).progressbar('setValue', state.options.value);
			setSize(this);
		});
	};
	
	$.fn.progressbar.methods = {
		options: function(jq){
			return $.data(jq[0], 'progressbar').options;
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		getValue: function(jq){
			return $.data(jq[0], 'progressbar').options.value;
		},
		setValue: function(jq, value){
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			return jq.each(function(){
				var opts = $.data(this, 'progressbar').options;
				var text = opts.text.replace(/{value}/, value);
				var oldValue = opts.value;
				opts.value = value;
				$(this).find('div.progressbar-value').width(value+'%');
				$(this).find('div.progressbar-text').html(text);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
				}
			});
		}
	};
	
	$.fn.progressbar.parseOptions = function(target){
		var t = $(target);
		return {
			width: (parseInt(target.style.width) || undefined),
			value: (t.attr('value') ? parseInt(t.attr('value')) : undefined),
			text: t.attr('text')
		};
	};
	
	$.fn.progressbar.defaults = {
		width: 'auto',
		value: 0,	// percentage value
		text: '{value}%',
		onChange:function(newValue,oldValue){}
	};
})(jQuery);/**
 * panel - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($){
	function removeNode(node){
		node.each(function(){
			$(this).remove();
			if ($.browser.msie){
				this.outerHTML = '';
			}
		});
	}
	
	function setSize(target, param){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var pheader = panel.children('div.panel-header');
		var pbody = panel.children('div.panel-body');
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		
		if (opts.fit == true){
			var p = panel.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		panel.css({
			left: opts.left,
			top: opts.top
		});
//		panel.css(opts.style);
//		panel.addClass(opts.cls);
//		pheader.addClass(opts.headerCls);
//		pbody.addClass(opts.bodyCls);
		
		if (!isNaN(opts.width)){
			if ($.boxModel == true){
				panel.width(opts.width - (panel.outerWidth() - panel.width()));
			} else {
				panel.width(opts.width);
			}
		} else {
			panel.width('auto');
		}
		if ($.boxModel == true){
			pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
			pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
		} else {
			pheader.width(panel.width());
			pbody.width(panel.width());
		}
		
		if (!isNaN(opts.height)){
			if ($.boxModel == true){
				panel.height(opts.height - (panel.outerHeight() - panel.height()));
				pbody.height(panel.height() - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
			} else {
				panel.height(opts.height);
				pbody.height(panel.height() - pheader.outerHeight());
			}
		} else {
			pbody.height('auto');
		}
		panel.css('height', '');
		
		opts.onResize.apply(target, [opts.width, opts.height]);
		
		panel.find('>div.panel-body>div').triggerHandler('_resize');
	}
	
	function movePanel(target, param){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		if (param){
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		panel.css({
			left: opts.left,
			top: opts.top
		});
		opts.onMove.apply(target, [opts.left, opts.top]);
	}
	
	function wrapPanel(target){
		var panel = $(target).addClass('panel-body').wrap('<div class="panel"></div>').parent();
		panel.bind('_resize', function(){
			var opts = $.data(target, 'panel').options;
			if (opts.fit == true){
				setSize(target);
			}
			return false;
		});
		
		return panel;
	}
	
	function addHeader(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		if (opts.tools && typeof opts.tools == 'string'){
			panel.find('>div.panel-header>div.panel-tool .panel-tool-a').appendTo(opts.tools);
		}
		removeNode(panel.children('div.panel-header'));
		if (opts.title && !opts.noheader){
			var header = $('<div class="panel-header"><div class="panel-title">'+opts.title+'</div></div>').prependTo(panel);
			if (opts.iconCls){
				header.find('.panel-title').addClass('panel-with-icon');
				$('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
			}
			var tool = $('<div class="panel-tool"></div>').appendTo(header);
			if (opts.tools){
				if (typeof opts.tools == 'string'){
					$(opts.tools).children().each(function(){
						$(this).addClass($(this).attr('iconCls')).addClass('panel-tool-a').appendTo(tool);
					});
				} else {
					for(var i=0; i<opts.tools.length; i++){
						var t = $('<a href="javascript:void(0)"></a>').addClass(opts.tools[i].iconCls).appendTo(tool);
						if (opts.tools[i].handler){
							t.bind('click', eval(opts.tools[i].handler));
						}
					}
				}
			}
			if (opts.collapsible){
				$('<a class="panel-tool-collapse" href="javascript:void(0)"></a>').appendTo(tool).bind('click', function(){
					if (opts.collapsed == true){
						expandPanel(target, true);
					} else {
						collapsePanel(target, true);
					}
					return false;
				});
			}
			if (opts.minimizable){
				$('<a class="panel-tool-min" href="javascript:void(0)"></a>').appendTo(tool).bind('click', function(){
					minimizePanel(target);
					return false;
				});
			}
			if (opts.maximizable){
				$('<a class="panel-tool-max" href="javascript:void(0)"></a>').appendTo(tool).bind('click', function(){
					if (opts.maximized == true){
						restorePanel(target);
					} else {
						maximizePanel(target);
					}
					return false;
				});
			}
			if (opts.closable){
				$('<a class="panel-tool-close" href="javascript:void(0)"></a>').appendTo(tool).bind('click',function(){
					closePanel(target);
					return false;
				});
			}
			panel.children('div.panel-body').removeClass('panel-body-noheader');
		} else {
			panel.children('div.panel-body').addClass('panel-body-noheader');
		}
	}
	
	/**
	 * load content from remote site if the href attribute is defined
	 */
	function loadData(target){
		var state = $.data(target, 'panel');
		if (state.options.href && (!state.isLoaded || !state.options.cache)){
			state.isLoaded = false;
			var pbody = state.panel.find('>div.panel-body');
			if (state.options.loadingMessage){
				pbody.html($('<div class="panel-loading"></div>').html(state.options.loadingMessage));
			}
			$.ajax({
				url:state.options.href,
				cache:false,
				success:function(data){
					pbody.html(state.options.extractor.call(target, data));
					if ($.parser){
						$.parser.parse(pbody);
					}
					state.options.onLoad.apply(target, arguments);
					state.isLoaded = true;
				},
                error: function(xmlR, status, e) {
                    var data = xmlR.responseText;

                    if(e === 'Forbidden') {
                        pbody.html(state.options.extractor.call(target, data));
                        if ($.parser){
                            $.parser.parse(pbody);
                        }
                        state.options.onLoad.apply(target, arguments);
                        state.isLoaded = true;
                    } else {
                        alert("Error:[" + e + "|" + xmlR.status + "]" + data);
                    }
                }
			});
//			pbody.load(state.options.href, null, function(){
//				if ($.parser){
//					$.parser.parse(pbody);
//				}
//				state.options.onLoad.apply(target, arguments);
//				state.isLoaded = true;
//			});
		}
	}
	
	function doLayout(target){
		$(target).find('div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible').each(function(){
			$(this).triggerHandler('_resize', [true]);
		});
	}
	
	function openPanel(target, forceOpen){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceOpen != true){
			if (opts.onBeforeOpen.call(target) == false) return;
		}
		panel.show();
		opts.closed = false;
		opts.minimized = false;
		opts.onOpen.call(target);
		
		if (opts.maximized == true) {
			opts.maximized = false;
			maximizePanel(target);
		}
		if (opts.collapsed == true) {
			opts.collapsed = false;
			collapsePanel(target);
		}
		
		if (!opts.collapsed){
			loadData(target);
			doLayout(target);
		}
	}
	
	function closePanel(target, forceClose){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceClose != true){
			if (opts.onBeforeClose.call(target) == false) return;
		}
		panel.hide();
		opts.closed = true;
		opts.onClose.call(target);
	}
	
	function destroyPanel(target, forceDestroy){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceDestroy != true){
			if (opts.onBeforeDestroy.call(target) == false) return;
		}
		removeNode(panel);
		opts.onDestroy.call(target);
	}
	
	function collapsePanel(target, animate){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var body = panel.children('div.panel-body');
		var tool = panel.children('div.panel-header').find('a.panel-tool-collapse');
		
		if (opts.collapsed == true) return;
		
		body.stop(true, true);	// stop animation
		if (opts.onBeforeCollapse.call(target) == false) return;
		
		tool.addClass('panel-tool-expand');
		if (animate == true){
			body.slideUp('normal', function(){
				opts.collapsed = true;
				opts.onCollapse.call(target);
			});
		} else {
			body.hide();
			opts.collapsed = true;
			opts.onCollapse.call(target);
		}
	}
	
	function expandPanel(target, animate){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var body = panel.children('div.panel-body');
		var tool = panel.children('div.panel-header').find('a.panel-tool-collapse');
		
		if (opts.collapsed == false) return;
		
		body.stop(true, true);	// stop animation
		if (opts.onBeforeExpand.call(target) == false) return;
		
		tool.removeClass('panel-tool-expand');
		if (animate == true){
			body.slideDown('normal', function(){
				opts.collapsed = false;
				opts.onExpand.call(target);
				loadData(target);
				doLayout(target);
			});
		} else {
			body.show();
			opts.collapsed = false;
			opts.onExpand.call(target);
			loadData(target);
			doLayout(target);
		}
	}
	
	function maximizePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var tool = panel.children('div.panel-header').find('a.panel-tool-max');
		
		if (opts.maximized == true) return;
		
		tool.addClass('panel-tool-restore');
		
		if (!$.data(target, 'panel').original){
			$.data(target, 'panel').original = {
				width: opts.width,
				height: opts.height,
				left: opts.left,
				top: opts.top,
				fit: opts.fit
			};
		}
		opts.left = 0;
		opts.top = 0;
		opts.fit = true;
		setSize(target);
		opts.minimized = false;
		opts.maximized = true;
		opts.onMaximize.call(target);
	}
	
	function minimizePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		panel.hide();
		opts.minimized = true;
		opts.maximized = false;
		opts.onMinimize.call(target);
	}
	
	function restorePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var tool = panel.children('div.panel-header').find('a.panel-tool-max');
		
		if (opts.maximized == false) return;
		
		panel.show();
		tool.removeClass('panel-tool-restore');
		var original = $.data(target, 'panel').original;
		opts.width = original.width;
		opts.height = original.height;
		opts.left = original.left;
		opts.top = original.top;
		opts.fit = original.fit;
		setSize(target);
		opts.minimized = false;
		opts.maximized = false;
		$.data(target, 'panel').original = null;
		opts.onRestore.call(target);
	}
	
	function setProperties(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		if (opts.border == true){
			panel.children('div.panel-header').removeClass('panel-header-noborder');
			panel.children('div.panel-body').removeClass('panel-body-noborder');
		} else {
			panel.children('div.panel-header').addClass('panel-header-noborder');
			panel.children('div.panel-body').addClass('panel-body-noborder');
		}
		
		panel.css(opts.style);
		panel.addClass(opts.cls);
		panel.children('div.panel-header').addClass(opts.headerCls);
		panel.children('div.panel-body').addClass(opts.bodyCls);
	}
	
	function setTitle(target, title){
		$.data(target, 'panel').options.title = title;
		$(target).panel('header').find('div.panel-title').html(title);
	}
	
//	$(window).unbind('.panel').bind('resize.panel', function(){
//		var layout = $('body.layout');
//		if (layout.length){
//			layout.layout('resize');
//		} else {
//			$('body>div.panel').triggerHandler('_resize');
//		}
//		$('#info').html($('#info').html()+'d')
//	});
	var TO = false;
	var canResize = true;
	$(window).unbind('.panel').bind('resize.panel', function(){
		if (!canResize) return;
		if (TO !== false){
			clearTimeout(TO);
		}
		TO = setTimeout(function(){
			canResize = false;
			var layout = $('body.layout');
			if (layout.length){
				layout.layout('resize');
			} else {
//				$('body>div.panel').triggerHandler('_resize');
				$('body').children('div.panel,div.accordion,div.tabs-container,div.layout').triggerHandler('_resize');
			}
			canResize = true;
			TO = false;
		}, 200);
	});
	
	$.fn.panel = function(options, param){
		if (typeof options == 'string'){
			return $.fn.panel.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'panel');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), options);
				$(this).attr('title', '');
				state = $.data(this, 'panel', {
					options: opts,
					panel: wrapPanel(this),
					isLoaded: false
				});
			}
			
			if (opts.content){
				$(this).html(opts.content);
				if ($.parser){
					$.parser.parse(this);
				}
			}
			
			addHeader(this);
			setProperties(this);
//			loadData(this);
			
			if (opts.doSize == true){
				state.panel.css('display','block');
				setSize(this);
			}
			if (opts.closed == true || opts.minimized == true){
				state.panel.hide();
			} else {
				openPanel(this);
			}
		});
	};
	
	$.fn.panel.methods = {
		options: function(jq){
			return $.data(jq[0], 'panel').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'panel').panel;
		},
		header: function(jq){
			return $.data(jq[0], 'panel').panel.find('>div.panel-header');
		},
		body: function(jq){
			return $.data(jq[0], 'panel').panel.find('>div.panel-body');
		},
		setTitle: function(jq, title){
			return jq.each(function(){
				setTitle(this, title);
			});
		},
		open: function(jq, forceOpen){
			return jq.each(function(){
				openPanel(this, forceOpen);
			});
		},
		close: function(jq, forceClose){
			return jq.each(function(){
				closePanel(this, forceClose);
			});
		},
		destroy: function(jq, forceDestroy){
			return jq.each(function(){
				destroyPanel(this, forceDestroy);
			});
		},
		refresh: function(jq, href){
			return jq.each(function(){
				$.data(this, 'panel').isLoaded = false;
				if (href){
					$.data(this, 'panel').options.href = href;
				}
				loadData(this);
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		move: function(jq, param){
			return jq.each(function(){
				movePanel(this, param);
			});
		},
		maximize: function(jq){
			return jq.each(function(){
				maximizePanel(this);
			});
		},
		minimize: function(jq){
			return jq.each(function(){
				minimizePanel(this);
			});
		},
		restore: function(jq){
			return jq.each(function(){
				restorePanel(this);
			});
		},
		collapse: function(jq, animate){
			return jq.each(function(){
				collapsePanel(this, animate);
			});
		},
		expand: function(jq, animate){
			return jq.each(function(){
				expandPanel(this, animate);
			});
		}
	};
	
	$.fn.panel.parseOptions = function(target){
		var t = $(target);
		return {
			width: (parseInt(target.style.width) || undefined),
			height: (parseInt(target.style.height) || undefined),
			left: (parseInt(target.style.left) || undefined),
			top: (parseInt(target.style.top) || undefined),
			title: (t.attr('title') || undefined),
			iconCls: (t.attr('iconCls') || t.attr('icon')),
			cls: t.attr('cls'),
			headerCls: t.attr('headerCls'),
			bodyCls: t.attr('bodyCls'),
			tools: t.attr('tools'),
			href: t.attr('href'),
			loadingMessage: (t.attr('loadingMessage')!=undefined ? t.attr('loadingMessage') : undefined),
			cache: (t.attr('cache') ? t.attr('cache') == 'true' : undefined),
			fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
			border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
			noheader: (t.attr('noheader') ? t.attr('noheader') == 'true' : undefined),
			collapsible: (t.attr('collapsible') ? t.attr('collapsible') == 'true' : undefined),
			minimizable: (t.attr('minimizable') ? t.attr('minimizable') == 'true' : undefined),
			maximizable: (t.attr('maximizable') ? t.attr('maximizable') == 'true' : undefined),
			closable: (t.attr('closable') ? t.attr('closable') == 'true' : undefined),
			collapsed: (t.attr('collapsed') ? t.attr('collapsed') == 'true' : undefined),
			minimized: (t.attr('minimized') ? t.attr('minimized') == 'true' : undefined),
			maximized: (t.attr('maximized') ? t.attr('maximized') == 'true' : undefined),
			closed: (t.attr('closed') ? t.attr('closed') == 'true' : undefined)
		}
	};
	
	$.fn.panel.defaults = {
		title: null,
		iconCls: null,
		width: 'auto',
		height: 'auto',
		left: null,
		top: null,
		cls: null,
		headerCls: null,
		bodyCls: null,
		style: {},
		href: null,
		cache: true,
		fit: false,
		border: true,
		doSize: true,	// true to set size and do layout
		noheader: false,
		content: null,	// the body content if specified
		
		collapsible: false,
		minimizable: false,
		maximizable: false,
		closable: false,
		collapsed: false,
		minimized: false,
		maximized: false,
		closed: false,
		
		// custom tools, every tool can contain two properties: iconCls and handler
		// iconCls is a icon CSS class
		// handler is a function, which will be run when tool button is clicked
		tools: null,	
		
		href: null,
		loadingMessage: 'Loading...',
		extractor: function(data){	// define how to extract the content from ajax response, return extracted data
			var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var matches = pattern.exec(data);
			if (matches){
				return matches[1];	// only extract body content
			} else {
				return data;
			}
		},
		onLoad: function(){},
		onBeforeOpen: function(){},
		onOpen: function(){},
		onBeforeClose: function(){},
		onClose: function(){},
		onBeforeDestroy: function(){},
		onDestroy: function(){},
		onResize: function(width,height){},
		onMove: function(left,top){},
		onMaximize: function(){},
		onRestore: function(){},
		onMinimize: function(){},
		onBeforeCollapse: function(){},
		onBeforeExpand: function(){},
		onCollapse: function(){},
		onExpand: function(){}
	};
})(jQuery);
/**
 * window - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 panel
 *   draggable
 *   resizable
 * 
 */
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'window').options;
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		$(target).panel('resize', opts);
	}
	
	function moveWindow(target, param){
		var state = $.data(target, 'window');
		if (param){
			if (param.left != null) state.options.left = param.left;
			if (param.top != null) state.options.top = param.top;
		}
		$(target).panel('move', state.options);
		if (state.shadow){
			state.shadow.css({
				left: state.options.left,
				top: state.options.top
			});
		}
	}
	
	function create(target){
		var state = $.data(target, 'window');
		var win = $(target).panel($.extend({}, state.options, {
			border: false,
			doSize: true,	// size the panel, the property undefined in window component
			closed: true,	// close the panel
			cls: 'window',
			headerCls: 'window-header',
			bodyCls: 'window-body ' + (state.options.noheader ? 'window-body-noheader' : ''),
			
			onBeforeDestroy: function(){
				if (state.options.onBeforeDestroy.call(target) == false) return false;
				if (state.shadow) state.shadow.remove();
				if (state.mask) state.mask.remove();
			},
			onClose: function(){
				if (state.shadow) state.shadow.hide();
				if (state.mask) state.mask.hide();
				
				state.options.onClose.call(target);
			},
			onOpen: function(){
				if (state.mask){
					state.mask.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++
					});
				}
				if (state.shadow){
					state.shadow.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++,
						left: state.options.left,
						top: state.options.top,
						width: state.window.outerWidth(),
						height: state.window.outerHeight()
					});
				}
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				state.options.onOpen.call(target);
			},
			onResize: function(width, height){
				var opts = $(target).panel('options');
				state.options.width = opts.width;
				state.options.height = opts.height;
				state.options.left = opts.left;
				state.options.top = opts.top;
				if (state.shadow){
					state.shadow.css({
						left: state.options.left,
						top: state.options.top,
						width: state.window.outerWidth(),
						height: state.window.outerHeight()
					});
				}
				
				state.options.onResize.call(target, width, height);
			},
			onMinimize: function(){
				if (state.shadow) state.shadow.hide();
				if (state.mask) state.mask.hide();
				
				state.options.onMinimize.call(target);
			},
			onBeforeCollapse: function(){
				if (state.options.onBeforeCollapse.call(target) == false) return false;
				if (state.shadow) state.shadow.hide();
			},
			onExpand: function(){
				if (state.shadow) state.shadow.show();
				state.options.onExpand.call(target);
			}
		}));
		
		state.window = win.panel('panel');
		
		// create mask
		if (state.mask) state.mask.remove();
		if (state.options.modal == true){
			state.mask = $('<div class="window-mask"></div>').insertAfter(state.window);
			state.mask.css({
				width: (state.options.inline ? state.mask.parent().width() : getPageArea().width),
				height: (state.options.inline ? state.mask.parent().height() : getPageArea().height),
				display: 'none'
			});
		}
		
		// create shadow
		if (state.shadow) state.shadow.remove();
		if (state.options.shadow == true){
			state.shadow = $('<div class="window-shadow"></div>').insertAfter(state.window);
			state.shadow.css({
				display: 'none'
			});
		}
		
		// if require center the window
		if (state.options.left == null){
			var width = state.options.width;
			if (isNaN(width)){
				width = state.window.outerWidth();
			}
			if (state.options.inline){
				var parent = state.window.parent();
				state.options.left = (parent.width() - width) / 2 + parent.scrollLeft();
			} else {
				state.options.left = ($(window).width() - width) / 2 + $(document).scrollLeft();
			}
		}
		if (state.options.top == null){
			var height = state.window.height;
			if (isNaN(height)){
				height = state.window.outerHeight();
			}
			if (state.options.inline){
				var parent = state.window.parent();
				state.options.top = (parent.height() - height) / 2 + parent.scrollTop();
			} else {
				state.options.top = ($(window).height() - height) / 2 + $(document).scrollTop();
			}
		}
		moveWindow(target);
		
		if (state.options.closed == false){
			win.window('open');	// open the window
		}
	}
	
	
	/**
	 * set window drag and resize property
	 */
	function setProperties(target){
		var state = $.data(target, 'window');
		
		state.window.draggable({
			handle: '>div.panel-header>div.panel-title',
			disabled: state.options.draggable == false,
			onStartDrag: function(e){
				if (state.mask) state.mask.css('z-index', $.fn.window.defaults.zIndex++);
				if (state.shadow) state.shadow.css('z-index', $.fn.window.defaults.zIndex++);
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					display:'none',
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: ($.boxModel==true ? (state.window.outerWidth()-(state.proxy.outerWidth()-state.proxy.width())) : state.window.outerWidth()),
					height: ($.boxModel==true ? (state.window.outerHeight()-(state.proxy.outerHeight()-state.proxy.height())) : state.window.outerHeight())
				});
				setTimeout(function(){
					if (state.proxy) state.proxy.show();
				}, 500);
			},
			onDrag: function(e){
				state.proxy.css({
					display:'block',
					left: e.data.left,
					top: e.data.top
				});
				return false;
			},
			onStopDrag: function(e){
				state.options.left = e.data.left;
				state.options.top = e.data.top;
				$(target).window('move');
				state.proxy.remove();
				state.proxy = null;
			}
		});
		
		state.window.resizable({
			disabled: state.options.resizable == false,
			onStartResize:function(e){
				state.pmask = $('<div class="window-proxy-mask"></div>').insertAfter(state.window);
				state.pmask.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: state.window.outerWidth(),
					height: state.window.outerHeight()
				});
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: ($.boxModel==true ? (e.data.width-(state.proxy.outerWidth()-state.proxy.width())) : e.data.width),
					height: ($.boxModel==true ? (e.data.height-(state.proxy.outerHeight()-state.proxy.height())) : e.data.height)
				});
			},
			onResize: function(e){
				state.proxy.css({
					left: e.data.left,
					top: e.data.top,
					width: ($.boxModel==true ? (e.data.width-(state.proxy.outerWidth()-state.proxy.width())) : e.data.width),
					height: ($.boxModel==true ? (e.data.height-(state.proxy.outerHeight()-state.proxy.height())) : e.data.height)
				});
				return false;
			},
			onStopResize: function(e){
				state.options.left = e.data.left;
				state.options.top = e.data.top;
				state.options.width = e.data.width;
				state.options.height = e.data.height;
				setSize(target);
				state.pmask.remove();
				state.pmask = null;
				state.proxy.remove();
				state.proxy = null;
			}
		});
	}
	
	function getPageArea() {
		if (document.compatMode == 'BackCompat') {
			return {
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)
			}
		} else {
			return {
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}
		}
	}
	
	// when window resize, reset the width and height of the window's mask
	$(window).resize(function(){
		$('body>div.window-mask').css({
			width: $(window).width(),
			height: $(window).height()
		});
		setTimeout(function(){
			$('body>div.window-mask').css({
				width: getPageArea().width,
				height: getPageArea().height
			});
		}, 50);
	});
	
	$.fn.window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.window.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.panel(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'window');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'window', {
					options: $.extend({}, $.fn.window.defaults, $.fn.window.parseOptions(this), options)
				});
				if (!state.options.inline){
					$(this).appendTo('body');
				}
			}
			create(this);
			setProperties(this);
		});
	};
	
	$.fn.window.methods = {
		options: function(jq){
			var popts = jq.panel('options');
			var wopts = $.data(jq[0], 'window').options;
			return $.extend(wopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
		},
		window: function(jq){
			return $.data(jq[0], 'window').window;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		move: function(jq, param){
			return jq.each(function(){
				moveWindow(this, param);
			});
		}
	};
	
	$.fn.window.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.panel.parseOptions(target), {
			draggable: (t.attr('draggable') ? t.attr('draggable') == 'true' : undefined),
			resizable: (t.attr('resizable') ? t.attr('resizable') == 'true' : undefined),
			shadow: (t.attr('shadow') ? t.attr('shadow') == 'true' : undefined),
			modal: (t.attr('modal') ? t.attr('modal') == 'true' : undefined),
			inline: (t.attr('inline') ? t.attr('inline') == 'true' : undefined)
		});
	};
	
	// Inherited from $.fn.panel.defaults
	$.fn.window.defaults = $.extend({}, $.fn.panel.defaults, {
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: true,
		modal: false,
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		
		// window's property which difference from panel
		title: 'New Window',
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false
	});
})(jQuery);/**
 * dialog - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 window
 *   linkbutton
 * 
 */
(function($){
	/**
	 * wrap dialog and return content panel.
	 */
	function wrapDialog(target){
		var t = $(target);
		t.wrapInner('<div class="dialog-content"></div>');
		var contentPanel = t.children('div.dialog-content');
		
		contentPanel.attr('style', t.attr('style'));
		t.removeAttr('style').css('overflow','hidden');
		
		contentPanel.panel({
			border:false,
			doSize:false
		});
		
		return contentPanel;
	}
	
	/**
	 * build the dialog
	 */
	function buildDialog(target){
		var opts = $.data(target, 'dialog').options;
		var contentPanel = $.data(target, 'dialog').contentPanel;
		
//		$(target).find('div.dialog-toolbar').remove();
//		$(target).find('div.dialog-button').remove();
		if (opts.toolbar){
			if (typeof opts.toolbar == 'string'){
				$(opts.toolbar).addClass('dialog-toolbar').prependTo(target);
				$(opts.toolbar).show();
			} else {
				$(target).find('div.dialog-toolbar').remove();
				var toolbar = $('<div class="dialog-toolbar"></div>').prependTo(target);
				for(var i=0; i<opts.toolbar.length; i++){
					var p = opts.toolbar[i];
					if (p == '-'){
						toolbar.append('<div class="dialog-tool-separator"></div>');
					} else {
						var tool = $('<a href="javascript:void(0)"></a>').appendTo(toolbar);
						tool.css('float','left');
						tool[0].onclick = eval(p.handler || function(){});
						tool.linkbutton($.extend({}, p, {
							plain: true
						}));
					}
				}
				toolbar.append('<div style="clear:both"></div>');
			}
		} else {
			$(target).find('div.dialog-toolbar').remove();
		}
		
		if (opts.buttons){
			if (typeof opts.buttons == 'string'){
				$(opts.buttons).addClass('dialog-button').appendTo(target);
				$(opts.buttons).show();
			} else {
				$(target).find('div.dialog-button').remove();
				var buttons = $('<div class="dialog-button"></div>').appendTo(target);
				for(var i=0; i<opts.buttons.length; i++){
					var p = opts.buttons[i];
					var button = $('<a href="javascript:void(0)"></a>').appendTo(buttons);
					if (p.handler) button[0].onclick = p.handler;
					button.linkbutton(p);
				}
			}
		} else {
			$(target).find('div.dialog-button').remove();
		}
		
		var tmpHref = opts.href;
		var tmpContent = opts.content;
		opts.href = null;
		opts.content = null;
		
		contentPanel.panel({
			closed: opts.closed,
			href: tmpHref,
			content: tmpContent,
			onLoad: function(){
				if (opts.height == 'auto'){
					$(target).window('resize');
				}
				opts.onLoad.apply(target, arguments);
			}
		});
		
		$(target).window($.extend({}, opts, {
			onOpen:function(){
				contentPanel.panel('open');
				if (opts.onOpen) opts.onOpen.call(target);
			},
			onResize:function(width, height){
				var wbody = $(target).panel('panel').find('>div.panel-body');
				contentPanel.panel('panel').show();
				contentPanel.panel('resize', {
					width: wbody.width(),
					height: (height=='auto') ? 'auto' :
						wbody.height()
						- wbody.find('>div.dialog-toolbar').outerHeight()
						- wbody.find('>div.dialog-button').outerHeight()
				});
				
				if (opts.onResize) opts.onResize.call(target, width, height);
			}
		}));
		
		opts.href = tmpHref;
		opts.content = tmpContent;
	}
	
	function refresh(target, href){
		var contentPanel = $.data(target, 'dialog').contentPanel;
		contentPanel.panel('refresh', href);
	}
	
	$.fn.dialog = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.dialog.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.window(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'dialog');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'dialog', {
					options: $.extend({}, $.fn.dialog.defaults, $.fn.dialog.parseOptions(this), options),
					contentPanel: wrapDialog(this)
				});
			}
			buildDialog(this);
		});
	};
	
	$.fn.dialog.methods = {
		options: function(jq){
			var dopts = $.data(jq[0], 'dialog').options;
			var popts = jq.panel('options');
			$.extend(dopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
			var contentPanel = $.data(jq[0], 'dialog').contentPanel;
			
			return dopts;
		},
		dialog: function(jq){
			return jq.window('window');
		},
		refresh: function(jq, href){
			return jq.each(function(){
				refresh(this, href);
			});
		}
	};
	
	$.fn.dialog.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.window.parseOptions(target), {
			toolbar: t.attr('toolbar'),
			buttons: t.attr('buttons')
		});
	};
	
	// Inherited from $.fn.window.defaults.
	$.fn.dialog.defaults = $.extend({}, $.fn.window.defaults, {
		title: 'New Dialog',
		collapsible: false,
		minimizable: false,
		maximizable: false,
		resizable: false,
		
		toolbar:null,
		buttons:null
	});
})(jQuery);/**
 * messager - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	linkbutton
 *  window
 *  progressbar
 */
(function($){
	
	/**
	 * show window with animate, after sometime close the window
	 */
	function show(el, type, speed, timeout){
		var win = $(el).window('window');
		if (!win) return;
		
		switch(type){
		case null:
			win.show();
			break;
		case 'slide':
			win.slideDown(speed);
			break;
		case 'fade':
			win.fadeIn(speed);
			break;
		case 'show':
			win.show(speed);
			break;
		}
		
		var timer = null;
		if (timeout > 0){
			timer = setTimeout(function(){
				hide(el, type, speed);
			}, timeout);
		}
		win.hover(
				function(){
					if (timer){
						clearTimeout(timer);
					}
				},
				function(){
					if (timeout > 0){
						timer = setTimeout(function(){
							hide(el, type, speed);
						}, timeout);
					}
				}
		)
		
	}
	
	/**
	 * hide window with animate
	 */
	function hide(el, type, speed){
		if (el.locked == true) return;
		el.locked = true;
		
		var win = $(el).window('window');
		if (!win) return;
		
		switch(type){
		case null:
			win.hide();
			break;
		case 'slide':
			win.slideUp(speed);
			break;
		case 'fade':
			win.fadeOut(speed);
			break;
		case 'show':
			win.hide(speed);
			break;
		}
		
		setTimeout(function(){
			$(el).window('destroy');
		}, speed);
	}
	
	/**
	 * create a dialog, when dialog is closed destroy it
	 */
	function createDialog(title, content, buttons){
		var win = $('<div class="messager-body"></div>').appendTo('body');
		win.append(content);
		if (buttons){
			var tb = $('<div class="messager-button"></div>').appendTo(win);
			for(var label in buttons){
				$('<a></a>').attr('href', 'javascript:void(0)').text(label)
							.css('margin-left', 10)
							.bind('click', eval(buttons[label]))
							.appendTo(tb).linkbutton();
			}
		}
		win.window({
			title: title,
			noheader: (title?false:true),
			width: 300,
			height: 'auto',
			modal: true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			resizable: false,
			onClose: function(){
				setTimeout(function(){
					win.window('destroy');
				}, 100);
			}
		});
		win.window('window').addClass('messager-window');
		win.children('div.messager-button').children('a:first').focus();
		return win;
	}
	
	$.messager = {
		show: function(options){
			var opts = $.extend({
				showType: 'slide',
				showSpeed: 600,
				width: 250,
				height: 100,
				msg: '',
				title: '',
				timeout: 4000
			}, options || {});
			
			var win = $('<div class="messager-body"></div>').html(opts.msg).appendTo('body');
			win.window({
				title: opts.title,
				width: opts.width,
				height: opts.height,
				collapsible: false,
				minimizable: false,
				maximizable: false,
				shadow: false,
				draggable: false,
				resizable: false,
				closed: true,
				onBeforeOpen: function(){
					show(this, opts.showType, opts.showSpeed, opts.timeout);
					return false;
				},
				onBeforeClose: function(){
					hide(this, opts.showType, opts.showSpeed);
					return false;
				}
			});
			
			// set the message window to the right bottom position
			win.window('window').css({
				left: '',
				top: '',
				right: 0,
				zIndex: $.fn.window.defaults.zIndex++,
				bottom: -document.body.scrollTop-document.documentElement.scrollTop
			});
			win.window('open');
		},
		
		alert: function(title, msg, icon, fn) {
			var content = '<div>' + msg + '</div>';
			switch(icon) {
				case 'error':
					content = '<div class="messager-icon messager-error"></div>' + content;
					break;
				case 'info':
					content = '<div class="messager-icon messager-info"></div>' + content;
					break;
				case 'question':
					content = '<div class="messager-icon messager-question"></div>' + content;
					break;
				case 'warning':
					content = '<div class="messager-icon messager-warning"></div>' + content;
					break;
			}
			content += '<div style="clear:both;"/>';
			
			var buttons = {};
			buttons[$.messager.defaults.ok] = function(){
				win.dialog({closed:true});
				if (fn){
					fn();
					return false;
				}
			};
			buttons[$.messager.defaults.ok] = function(){
				win.window('close');
				if (fn){
					fn();
					return false;
				}
			};
			var win = createDialog(title,content,buttons);
		},
		
		confirm: function(title, msg, fn) {
			var content = '<div class="messager-icon messager-question"></div>'
					+ '<div>' + msg + '</div>'
					+ '<div style="clear:both;"/>';
			var buttons = {};
			buttons[$.messager.defaults.ok] = function(){
				win.window('close');
				if (fn){
					fn(true);
					return false;
				}
			};
			buttons[$.messager.defaults.cancel] = function(){
				win.window('close');
				if (fn){
					fn(false);
					return false;
				}
			};
			var win = createDialog(title,content,buttons);
		},
		
		prompt: function(title, msg, fn) {
			var content = '<div class="messager-icon messager-question"></div>'
						+ '<div>' + msg + '</div>'
						+ '<br/>'
						+ '<input class="messager-input" type="text"/>'
						+ '<div style="clear:both;"/>';
			var buttons = {};
			buttons[$.messager.defaults.ok] = function(){
				win.window('close');
				if (fn){
					fn($('.messager-input', win).val());
					return false;
				}
			};
			buttons[$.messager.defaults.cancel] = function(){
				win.window('close');
				if (fn){
					fn();
					return false;
				}
			};
			var win = createDialog(title,content,buttons);
			win.children('input.messager-input').focus();
		},
		
		progress: function(options){
			var opts = $.extend({
				title: '',
				msg: '',	// The message box body text
				text: undefined,	// The text to display in the progress bar
				interval: 300	// The length of time in milliseconds between each progress update
			}, options||{});
			
			var methods = {
				bar: function(){	// get the progress bar object
					return $('body>div.messager-window').find('div.messager-p-bar');
				},
				close: function(){	// close the progress window
					var win = $('body>div.messager-window>div.messager-body');
					if (win.length){
						if (win[0].timer) {
							clearInterval(win[0].timer);
						}
						win.window('close');
					}
				}
			};
			
			if (typeof options == 'string'){
				var method = methods[options];
				return method();
			}
			
			var content = '<div class="messager-progress"><div class="messager-p-msg"></div><div class="messager-p-bar"></div></div>';
			var win = createDialog(opts.title, content, null);
			win.find('div.messager-p-msg').html(opts.msg);
			var bar = win.find('div.messager-p-bar');
			bar.progressbar({
				text: opts.text
			});
			win.window({
				closable:false
			});
			
			if (opts.interval){
				win[0].timer = setInterval(function(){
					var v = bar.progressbar('getValue');
					v += 10;
					if (v > 100) v = 0;
					bar.progressbar('setValue', v);
				}, opts.interval);
			}
		}
	};
	
	$.messager.defaults = {
		ok: 'Ok',
		cancel: 'Cancel'
	};
	
})(jQuery);
/**
 * validatebox - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($){
	
	function init(target){
		$(target).addClass('validatebox-text');
	}
	
	/**
	 * destroy the box, including it's tip object.
	 */
	function destroyBox(target){
		var state = $.data(target, 'validatebox');
		state.validating = false;
		var tip = state.tip;
		if (tip){
			tip.remove();
		}
		$(target).unbind();
		$(target).remove();
	}
	
	function bindEvents(target){
		var box = $(target);
		var state = $.data(target, 'validatebox');
		
		state.validating = false;
		box.unbind('.validatebox').bind('focus.validatebox', function(){
			state.validating = true;
			state.value = undefined;
			(function(){
				if (state.validating){
					if (state.value != box.val()){	// when box value changed, validate it
						state.value = box.val();
						validate(target);
					}
					setTimeout(arguments.callee, 200);
				}
			})();
		}).bind('blur.validatebox', function(){
			state.validating = false;
			hideTip(target);
		}).bind('mouseenter.validatebox', function(){
			if (box.hasClass('validatebox-invalid')){
				showTip(target);
			}
		}).bind('mouseleave.validatebox', function(){
			hideTip(target);
		});
	}
	
	/**
	 * show tip message.
	 */
	function showTip(target){
		var box = $(target);
		var msg = $.data(target, 'validatebox').message;
		var tip = $.data(target, 'validatebox').tip;
		if (!tip){
			tip = $(
				'<div class="validatebox-tip">' +
					'<span class="validatebox-tip-content">' +
					'</span>' +
					'<span class="validatebox-tip-pointer">' +
					'</span>' +
				'</div>'
			).appendTo('body');
			$.data(target, 'validatebox').tip = tip;
		}
		tip.find('.validatebox-tip-content').html(msg);
		tip.css({
			display:'block',
			left:box.offset().left + box.outerWidth(),
			top:box.offset().top
		})
	}
	
	/**
	 * hide tip message.
	 */
	function hideTip(target){
		var tip = $.data(target, 'validatebox').tip;
		if (tip){
			tip.remove();
			$.data(target, 'validatebox').tip = null;
		}
	}
	
	/**
	 * do validate action
	 */
	function validate(target){
		var opts = $.data(target, 'validatebox').options;
		var tip = $.data(target, 'validatebox').tip;
		var box = $(target);
		var value = box.val();
		
		function setTipMessage(msg){
			$.data(target, 'validatebox').message = msg;
		}
		
		// if the box is disabled, skip validate action.
		var disabled = box.attr('disabled');
		if (disabled == true || disabled == 'true'){
			return true;
		}
		
		if (opts.required){
			if (value == ''){
				box.addClass('validatebox-invalid');
				setTipMessage(opts.missingMessage);
				showTip(target);
				return false;
			}
		}
		if (opts.validType){
			var result = /([a-zA-Z_]+)(.*)/.exec(opts.validType);
			var rule = opts.rules[result[1]];
			if (value && rule){
				var param = eval(result[2]);
				if (!rule['validator'](value, param)){
					box.addClass('validatebox-invalid');
					
					var message = rule['message'];
					if (param){
						for(var i=0; i<param.length; i++){
							message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
						}
					}
					setTipMessage(opts.invalidMessage || message);
					showTip(target);
					return false;
				}
			}
		}
		
		box.removeClass('validatebox-invalid');
		hideTip(target);
		return true;
	}
	
	$.fn.validatebox = function(options, param){
		if (typeof options == 'string'){
			return $.fn.validatebox.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'validatebox');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'validatebox', {
					options: $.extend({}, $.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), options)
				});
			}
			
			bindEvents(this);
		});
	};
	
	$.fn.validatebox.methods = {
		destroy: function(jq){
			return jq.each(function(){
				destroyBox(this);
			});
		},
		validate: function(jq){
			return jq.each(function(){
				validate(this);
			});
		},
		isValid: function(jq){
			return validate(jq[0]);
		}
	};
	
	$.fn.validatebox.parseOptions = function(target){
		var t = $(target);
		return {
			required: (t.attr('required') ? (t.attr('required') == 'required' || t.attr('required') == 'true' || t.attr('required') == true) : undefined),
			validType: (t.attr('validType') || undefined),
			missingMessage: (t.attr('missingMessage') || undefined),
			invalidMessage: (t.attr('invalidMessage') || undefined)
		};
	};
	
	$.fn.validatebox.defaults = {
		required: false,
		validType: null,
		missingMessage: 'This field is required.',
		invalidMessage: null,
		
		rules: {
			email:{
				validator: function(value){
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
				},
				message: 'Please enter a valid email address.'
			},
			url: {
				validator: function(value){
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
				},
				message: 'Please enter a valid URL.'
			},
			length: {
				validator: function(value, param){
					var len = $.trim(value).length;
					return len >= param[0] && len <= param[1]
				},
				message: 'Please enter a value between {0} and {1}.'
			},
			remote: {
				validator: function(value, param){
					var data = {};
					data[param[1]] = value;
					var response = $.ajax({
						url:param[0],
						dataType:'json',
						data:data,
						async:false,
						cache:false,
						type:'post'
					}).responseText;
					return response == 'true';
				},
				message: 'Please fix this field.'
			} ,
            mobile: {
                validator: function (value) {
                    return /^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/.test(value)|| /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(value);
                },
                message: '号码不正确'
            },
            loginName: {
                validator: function (value) {
                    return /^[\u0391-\uFFE5\w]+$/.test(value);
                },
                message: '登录名称只允许汉字、英文字母、数字及下划线。'
            },
            safepass: {
                validator: function (value) {
                    return safePassword(value);
                },
                message: '密码由字母和数字组成，至少6位'
            },
            equalTo: {
                validator: function (value, param) {
                    return value == $(param[0]).val();
                },
                message: '两次输入的字符不一致'
            },
            number: {
                validator: function (value, param) {
                    var reg = new RegExp("^\\d+"+(param?".?\\d{0,"+param+"}":".?\\d{0,6}")+"$");
                    return reg.test(value);
                },
                message: '请输入有效数字'
            },
            idcard: {
                validator: function (value) {
                    return idCard(value);
                },
                message:'请输入正确的身份证号码'
            },
            zip: {
                validator: function (value, param) {
                    return /^[1-9]\d{5}$/.test(value);
                },
                message: '邮政编码不存在'
            }
		}
	};
})(jQuery);/**
 * tree - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 draggable
 *   droppable
 *   
 * Node is a javascript object which contains following properties:
 * 1 id: An identity value bind to the node.
 * 2 text: Text to be showed.
 * 3 checked: Indicate whether the node is checked selected.
 * 3 attributes: Custom attributes bind to the node.
 * 4 target: Target DOM object.
 */
(function($){
	/**
	 * wrap the <ul> tag as a tree and then return it.
	 */
	function wrapTree(target){
		var tree = $(target);
		tree.addClass('tree');
		return tree;
	}
	
	function parseTreeData(target){
		var data = [];
		
		getData(data, $(target));
		
		function getData(aa, tree){
			tree.children('li').each(function(){
				var node = $(this);
				var item = {};
				item.text = node.children('span').html();
				if (!item.text){
					item.text = node.html();
				}
				item.id = node.attr('id');
				item.iconCls = node.attr('iconCls') || node.attr('icon');
				item.checked = node.attr('checked') == 'true';
				item.state = node.attr('state') || 'open';
				
				var subTree = node.children('ul');
				if (subTree.length){
					item.children = [];
					getData(item.children, subTree);
				}
				aa.push(item);
			});
		}
		return data;
	}
	
	function bindTreeEvents(target){
		var opts = $.data(target, 'tree').options;
		var tree = $.data(target, 'tree').tree;
		
		$('div.tree-node', tree).unbind('.tree').bind('dblclick.tree', function(){
			selectNode(target, this);
			opts.onDblClick.call(target, getSelectedNode(target));
		}).bind('click.tree', function(){
			selectNode(target, this);
			opts.onClick.call(target, getSelectedNode(target));
		}).bind('mouseenter.tree', function(){
			$(this).addClass('tree-node-hover');
			return false;
		}).bind('mouseleave.tree', function(){
			$(this).removeClass('tree-node-hover');
			return false;
		}).bind('contextmenu.tree', function(e){
			opts.onContextMenu.call(target, e, getNode(target, this));
		});
		
		$('span.tree-hit', tree).unbind('.tree').bind('click.tree', function(){
			var node = $(this).parent();
			toggleNode(target, node[0]);
			return false;
		}).bind('mouseenter.tree', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).addClass('tree-expanded-hover');
			} else {
				$(this).addClass('tree-collapsed-hover');
			}
		}).bind('mouseleave.tree', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).removeClass('tree-expanded-hover');
			} else {
				$(this).removeClass('tree-collapsed-hover');
			}
		}).bind('mousedown.tree', function(){
			return false;
		});
		
		$('span.tree-checkbox', tree).unbind('.tree').bind('click.tree', function(){
			var node = $(this).parent();
			checkNode(target, node[0], !$(this).hasClass('tree-checkbox1'));
			return false;
		}).bind('mousedown.tree', function(){
			return false;
		});
	}
	
	function disableDnd(target){
		var nodes = $(target).find('div.tree-node');
		nodes.draggable('disable');
		nodes.css('cursor', 'pointer');
	}
	
	function enableDnd(target){
		var opts = $.data(target, 'tree').options;
		var tree = $.data(target, 'tree').tree;
		
		tree.find('div.tree-node').draggable({
			disabled: false,
			revert: true,
			cursor: 'pointer',
			proxy: function(source){
				var p = $('<div class="tree-node-proxy tree-dnd-no"></div>').appendTo('body');
				p.html($(source).find('.tree-title').html());
				p.hide();
				return p;
			},
			deltaX: 15,
			deltaY: 15,
			onBeforeDrag: function(e){
				if (e.which != 1) return false;
				$(this).next('ul').find('div.tree-node').droppable({accept:'no-accept'});	// the child node can't be dropped
			},
			onStartDrag: function(){
				$(this).draggable('proxy').css({
					left:-10000,
					top:-10000
				});
			},
			onDrag: function(e){
				var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
				var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				if (d>3){	// when drag a little distance, show the proxy object
					$(this).draggable('proxy').show();
				}
				this.pageY = e.pageY;
			},
			onStopDrag: function(){
				$(this).next('ul').find('div.tree-node').droppable({accept:'div.tree-node'}); // restore the accept property of child nodes
			}
		}).droppable({
			accept:'div.tree-node',
			onDragOver: function(e, source){
				var pageY = source.pageY;
				var top = $(this).offset().top;
				var bottom = top + $(this).outerHeight();
				
				$(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
				if (pageY > top + (bottom - top) / 2){
					if (bottom - pageY < 5){
						$(this).addClass('tree-node-bottom');
					} else {
						$(this).addClass('tree-node-append');
					}
				} else {
					if (pageY - top < 5){
						$(this).addClass('tree-node-top');
					} else {
						$(this).addClass('tree-node-append');
					}
				}
			},
			onDragLeave: function(e, source){
				$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
			},
			onDrop: function(e, source){
				var dest = this;
				var action, point;
				if ($(this).hasClass('tree-node-append')){
					action = append;
				} else {
					action = insert;
					point = $(this).hasClass('tree-node-top') ? 'top' : 'bottom';
				}
				
				setTimeout(function(){
					action(source, dest, point);
				}, 0);
				
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
			}
		});
		
		function append(source, dest){
			if (getNode(target, dest).state == 'closed'){
				expandNode(target, dest, function(){
					doAppend();
				});
			} else {
				doAppend();
			}
			
			function doAppend(){
				var node = $(target).tree('pop', source);
				$(target).tree('append', {
					parent: dest,
					data: [node]
				});
				opts.onDrop.call(target, dest, node, 'append');
			}
		}
		
		function insert(source, dest, point){
			var param = {};
			if (point == 'top'){
				param.before = dest;
			} else {
				param.after = dest;
			}
			
			var node = $(target).tree('pop', source);
			param.data = node;
			$(target).tree('insert', param);
			opts.onDrop.call(target, dest, node, point);
		}
	}
	
	function checkNode(target, nodeEl, checked){
		var opts = $.data(target, 'tree').options;
		if (!opts.checkbox) return;
		var node = $(nodeEl);
		var ck = node.find('.tree-checkbox');
		ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
		if (checked){
			ck.addClass('tree-checkbox1');
		} else {
			ck.addClass('tree-checkbox0');
		}
		if (opts.cascadeCheck){
			setParentCheckbox(node);
			setChildCheckbox(node);
		}
		
		var nodedata = getNode(target, nodeEl);
		opts.onCheck.call(target, nodedata, checked);
		
		function setChildCheckbox(node){
			var childck = node.next().find('.tree-checkbox');
			childck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
			if (node.find('.tree-checkbox').hasClass('tree-checkbox1')){
				childck.addClass('tree-checkbox1');
			} else {
				childck.addClass('tree-checkbox0');
			}
		}
		
		function setParentCheckbox(node){
			var pnode = getParentNode(target, node[0]);
			if (pnode){
				var ck = $(pnode.target).find('.tree-checkbox');
				ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
				if (isAllSelected(node)){
					ck.addClass('tree-checkbox1');
				} else if (isAllNull(node)){
					ck.addClass('tree-checkbox0');
				} else {
					ck.addClass('tree-checkbox2');
				}
				setParentCheckbox($(pnode.target));
			}
			
			function isAllSelected(n){
				var ck = n.find('.tree-checkbox');
				if (ck.hasClass('tree-checkbox0') || ck.hasClass('tree-checkbox2')) return false;
				var b = true;
				n.parent().siblings().each(function(){
					if (!$(this).children('div.tree-node').children('.tree-checkbox').hasClass('tree-checkbox1')){
						b = false;
					}
				});
				return b;
			}
			function isAllNull(n){
				var ck = n.find('.tree-checkbox');
				if (ck.hasClass('tree-checkbox1') || ck.hasClass('tree-checkbox2')) return false;
				var b = true;
				n.parent().siblings().each(function(){
					if (!$(this).children('div.tree-node').children('.tree-checkbox').hasClass('tree-checkbox0')){
						b = false;
					}
				});
				return b;
			}
		}
	}
	
	/**
	 * when append or remove node, adjust its parent node check status.
	 */
	function adjustCheck(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = $(nodeEl);
		if (isLeaf(target, nodeEl)){
			var ck = node.find('.tree-checkbox');
			if (ck.length){
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else {
					checkNode(target, nodeEl, false);
				}
			} else if (opts.onlyLeafCheck){
				$('<span class="tree-checkbox tree-checkbox0"></span>').insertBefore(node.find('.tree-title'));
				bindTreeEvents(target);
			}
		} else {
			var ck = node.find('.tree-checkbox');
			if (opts.onlyLeafCheck){
				ck.remove();
			} else {
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else if (ck.hasClass('tree-checkbox2')){
					var allchecked = true;
					var allunchecked = true;
					var children = getChildren(target, nodeEl);
					for(var i=0; i<children.length; i++){
						if (children[i].checked){
							allunchecked = false;
						} else {
							allchecked = false;
						}
					}
					if (allchecked){
						checkNode(target, nodeEl, true);
					}
					if (allunchecked){
						checkNode(target, nodeEl, false);
					}
				}
			}
		}
	}
	
	/**
	 * load tree data to <ul> tag
	 * ul: the <ul> dom element
	 * data: array, the tree node data
	 * append: defines if to append data
	 */
	function loadData(target, ul, data, append){
		var opts = $.data(target, 'tree').options;
		
		if (!append){
			$(ul).empty();
		}
		
		var checkedNodes = [];
		var depth = $(ul).prev('div.tree-node').find('span.tree-indent, span.tree-hit').length;
		appendNodes(ul, data, depth);
		bindTreeEvents(target);
		if (opts.dnd){
			enableDnd(target);
		} else {
			disableDnd(target);
		}
//		makeDnD(target);
		
		for(var i=0; i<checkedNodes.length; i++){
			checkNode(target, checkedNodes[i], true);
		}
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}
		opts.onLoadSuccess.call(target, nodedata, data);
		
		function appendNodes(ul, children, depth){
			for(var i=0; i<children.length; i++){
				var li = $('<li></li>').appendTo(ul);
				var item = children[i];
				
				// the node state has only 'open' or 'closed' attribute
				if (item.state != 'open' && item.state != 'closed'){
					item.state = 'open';
				}
				
				var node = $('<div class="tree-node"></div>').appendTo(li);
				node.attr('node-id', item.id);
				
				// store node attributes
				$.data(node[0], 'tree-node', {
					id: item.id,
					text: item.text,
					iconCls: item.iconCls,
					attributes: item.attributes
				});
				
				$('<span class="tree-title"></span>').html(item.text).appendTo(node);
				
				if (opts.checkbox){
					if (opts.onlyLeafCheck){
						if (item.state == 'open' && (!item.children || !item.children.length)){
							if (item.checked){
								$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
							} else {
								$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
							}
						}
					} else {
						if (item.checked){
							$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
							checkedNodes.push(node[0]);
						} else {
							$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
						}
					}
				}
				
				if (item.children && item.children.length){
					var subul = $('<ul></ul>').appendTo(li);
					if (item.state == 'open'){
						$('<span class="tree-icon tree-folder tree-folder-open"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-expanded"></span>').prependTo(node);
					} else {
						$('<span class="tree-icon tree-folder"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
						subul.css('display','none');
					}
					appendNodes(subul, item.children, depth+1);
				} else {
					if (item.state == 'closed'){
						$('<span class="tree-icon tree-folder"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
					} else {
						$('<span class="tree-icon tree-file"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-indent"></span>').prependTo(node);
					}
				}
				for(var j=0; j<depth; j++){
					$('<span class="tree-indent"></span>').prependTo(node);
				}
			}
		}
	}
	
	/**
	 * request remote data and then load nodes in the <ul> tag.
	 * ul: the <ul> dom element
	 * param: request parameter
	 */
	function request(target, ul, param, callback){
		var opts = $.data(target, 'tree').options;
		
		param = param || {};
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}

		if (opts.onBeforeLoad.call(target, nodedata, param) == false) return;
		if (!opts.url) return;
		
		var folder = $(ul).prev().children('span.tree-folder');
		folder.addClass('tree-loading');
		$.ajax({
			type: opts.method,
			url: opts.url,
			data: param,
			dataType: 'json',
			success: function(data){
				folder.removeClass('tree-loading');
				loadData(target, ul, data);
				if (callback){
					callback();
				}
			},
			error: function(){
				folder.removeClass('tree-loading');
				opts.onLoadError.apply(target, arguments);
				if (callback){
					callback();
				}
			}
		});
	}
	
	function expandNode(target, nodeEl, callback){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeExpand.call(target, node) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (ul.length){
			if (opts.animate){
				ul.slideDown('normal', function(){
					opts.onExpand.call(target, node);
					if (callback) callback();
				});
			} else {
				ul.css('display','block');
				opts.onExpand.call(target, node);
				if (callback) callback();
			}
		} else {
			var subul = $('<ul style="display:none"></ul>').insertAfter(nodeEl);
			// request children nodes data
			request(target, subul[0], {id:node.id}, function(){
				if (opts.animate){
					subul.slideDown('normal', function(){
						opts.onExpand.call(target, node);
						if (callback) callback();
					});
				} else {
					subul.css('display','block');
					opts.onExpand.call(target, node);
					if (callback) callback();
				}
			});
		}
	}
	
	function collapseNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeCollapse.call(target, node) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (opts.animate){
			ul.slideUp('normal', function(){
				opts.onCollapse.call(target, node);
			});
		} else {
			ul.css('display','none');
			opts.onCollapse.call(target, node);
		}
	}
	
	function toggleNode(target, nodeEl){
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		
		if (hit.hasClass('tree-expanded')){
			collapseNode(target, nodeEl);
		} else {
			expandNode(target, nodeEl);
		}
	}
	
	function expandAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function expandToNode(target, nodeEl){
		var nodes = [];
		var p = getParentNode(target, nodeEl);
		while(p){
			nodes.unshift(p);
			p = getParentNode(target, p.target);
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function collapseAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			collapseNode(target, nodes[i].target);
		}
	}
	
	/**
	 * get the first root node, if no root node exists, return null.
	 */
	function getRootNode(target){
		var roots = getRootNodes(target);
		if (roots.length){
			return roots[0];
		} else {
			return null;
		}
	}
	
	/**
	 * get the root nodes.
	 */
	function getRootNodes(target){
		var roots = [];
		$(target).children('li').each(function(){
			var node = $(this).children('div.tree-node');
			roots.push(getNode(target, node[0]));
		});
		return roots;
	}
	
	/**
	 * get all child nodes corresponding to specified node
	 * nodeEl: the node DOM element
	 */
	function getChildren(target, nodeEl){
		var nodes = [];
		if (nodeEl){
			getNodes($(nodeEl));
		} else {
			var roots = getRootNodes(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes($(roots[i].target));
			}
		}
		function getNodes(node){
			node.next().find('div.tree-node').each(function(){
				nodes.push(getNode(target, this));
			});
		}
		return nodes;
	}
	
	/**
	 * get the parent node
	 * nodeEl: DOM object, from which to search it's parent node 
	 */
	function getParentNode(target, nodeEl){
		var ul = $(nodeEl).parent().parent();
		if (ul[0] == target){
			return null;
		} else {
			return getNode(target, ul.prev()[0]);
		}
	}
	
	function getCheckedNode(target){
		var nodes = [];
		$(target).find('.tree-checkbox1').each(function(){
			var node = $(this).parent();
			nodes.push(getNode(target, node[0]));
		});
		return nodes;
	}
	
	/**
	 * Get the selected node data which contains following properties: id,text,attributes,target
	 */
	function getSelectedNode(target){
		var node = $(target).find('div.tree-node-selected');
		if (node.length){
			return getNode(target, node[0]);
		} else {
			return null;
		}
	}
	
	/**
	 * Append nodes to tree.
	 * The param parameter has two properties:
	 * 1 parent: DOM object, the parent node to append to.
	 * 2 data: array, the nodes data.
	 */
	function appendNodes(target, param){
		var node = $(param.parent);
		
		var ul;
		if (node.length == 0){
			ul = $(target);
		} else {
			ul = node.next();
			if (ul.length == 0){
				ul = $('<ul></ul>').insertAfter(node);
			}
		}
		
		// ensure the node is a folder node
		if (param.data && param.data.length){
			var nodeIcon = node.find('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		
		loadData(target, ul[0], param.data, true);
		
		adjustCheck(target, ul.prev());
	}
	
	/**
	 * insert node to before or after specified node
	 * param has the following properties:
	 * before: DOM object, the node to insert before
	 * after: DOM object, the node to insert after
	 * data: object, the node data 
	 */
	function insertNode(target, param){
		var ref = param.before || param.after;
		var pnode = getParentNode(target, ref);
		var li;
		if (pnode){
			appendNodes(target, {
				parent: pnode.target,
				data: [param.data]
			});
			li = $(pnode.target).next().children('li:last');
		} else {
			appendNodes(target, {
				parent: null,
				data: [param.data]
			});
			li = $(target).children('li:last');
		}
		if (param.before){
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	
	/**
	 * Remove node from tree. 
	 * param: DOM object, indicate the node to be removed.
	 */
	function removeNode(target, nodeEl){
		var parent = getParentNode(target, nodeEl);
		var node = $(nodeEl);
		var li = node.parent();
		var ul = li.parent();
		li.remove();
		if (ul.children('li').length == 0){
			var node = ul.prev();
			
			node.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
			node.find('.tree-hit').remove();
			$('<span class="tree-indent"></span>').prependTo(node);
			if (ul[0] != target){
				ul.remove();
			}
		}
		if (parent){
			adjustCheck(target, parent.target);
		}
	}
	
	/**
	 * get specified node data, include its children data
	 */
	function getData(target, nodeEl){
		/**
		 * retrieve all children data which is stored in specified array
		 */
		function retrieveChildData(aa, ul){
			ul.children('li').each(function(){
				var node = $(this).children('div.tree-node');
				var nodedata = getNode(target, node[0]);
				var sub = $(this).children('ul');
				if (sub.length){
					nodedata.children = [];
					getData(nodedata.children, sub);
				}
				aa.push(nodedata);
			});
		}
		
		if (nodeEl){
			var nodedata = getNode(target, nodeEl);
			nodedata.children = [];
			retrieveChildData(nodedata.children, $(nodeEl).next());
			return nodedata;
		} else {
			return null;
		}
	}
	
	function updateNode(target, param){
		var node = $(param.target);
		var data = $.data(param.target, 'tree-node');
		
		if (data.iconCls){
			node.find('.tree-icon').removeClass(data.iconCls);
		}
		$.extend(data, param);
		$.data(param.target, 'tree-node', data);
		
		node.attr('node-id', data.id);
		node.find('.tree-title').html(data.text);
		if (data.iconCls){
			node.find('.tree-icon').addClass(data.iconCls);
		}
		var ck = node.find('.tree-checkbox');
		ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
		if (data.checked){
//			ck.addClass('tree-checkbox1');
			checkNode(target, param.target, true);
		} else {
//			ck.addClass('tree-checkbox0');
			checkNode(target, param.target, false);
		}
	}
	
	/**
	 * get the specified node
	 */
	function getNode(target, nodeEl){
		var node = $.extend({}, $.data(nodeEl, 'tree-node'), {
			target: nodeEl,
			checked: $(nodeEl).find('.tree-checkbox').hasClass('tree-checkbox1')
		});
		if (!isLeaf(target, nodeEl)){
			node.state = $(nodeEl).find('.tree-hit').hasClass('tree-expanded') ? 'open' : 'closed';
		}
		return node;
	}
	
	function findNode(target, id){
		var node = $(target).find('div.tree-node[node-id=' + id + ']');
		if (node.length){
			return getNode(target, node[0]);
		} else {
			return null;
		}
	}
	
	/**
	 * select the specified node.
	 * nodeEl: DOM object, indicate the node to be selected.
	 */
	function selectNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeSelect.call(target, node) == false) return;
		
		$('div.tree-node-selected', target).removeClass('tree-node-selected');
		$(nodeEl).addClass('tree-node-selected');
		opts.onSelect.call(target, node);
	}
	
	/**
	 * Check if the specified node is leaf.
	 * nodeEl: DOM object, indicate the node to be checked.
	 */
	function isLeaf(target, nodeEl){
		var node = $(nodeEl);
		var hit = node.children('span.tree-hit');
		return hit.length == 0;
	}
	
	function beginEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeEdit.call(target, node) == false) return;
		
		$(nodeEl).css('position', 'relative');
		var nt = $(nodeEl).find('.tree-title');
		var width = nt.outerWidth();
		nt.empty();
		var editor = $('<input class="tree-editor">').appendTo(nt);
		editor.val(node.text).focus();
		editor.width(width + 20);
		editor.height(document.compatMode=='CSS1Compat' ? (18-(editor.outerHeight()-editor.height())) : 18);
		editor.bind('click', function(e){
			return false;
		}).bind('mousedown', function(e){
			e.stopPropagation();
		}).bind('mousemove', function(e){
			e.stopPropagation();
		}).bind('keydown', function(e){
			if (e.keyCode == 13){	// enter
				endEdit(target, nodeEl);
				return false;
			} else if (e.keyCode == 27){	// esc
				cancelEdit(target, nodeEl);
				return false;
			}
		}).bind('blur', function(e){
			e.stopPropagation();
			endEdit(target, nodeEl);
		});
	}
	
	function endEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		var editor = $(nodeEl).find('input.tree-editor');
		var val = editor.val();
		editor.remove();
		var node = getNode(target, nodeEl);
		node.text = val;
		updateNode(target, node);
		opts.onAfterEdit.call(target, node);
	}
	
	function cancelEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		$(nodeEl).find('input.tree-editor').remove();
		var node = getNode(target, nodeEl);
		updateNode(target, node);
		opts.onCancelEdit.call(target, node);
	}
	
	$.fn.tree = function(options, param){
		if (typeof options == 'string'){
			return $.fn.tree.methods[options](this, param);
		}
		
		var options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tree');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.fn.tree.defaults, $.fn.tree.parseOptions(this), options);
				$.data(this, 'tree', {
					options: opts,
					tree: wrapTree(this)
				});
				var data = parseTreeData(this);
				if (data.length && !opts.data){
					opts.data = data
				}
//				loadData(this, this, data);
			}
			
			if (opts.data){
				loadData(this, this, opts.data);
			} else {
				if (opts.dnd){
					enableDnd(this);
				} else {
					disableDnd(this);
				}
			}
			if (opts.url){
				request(this, this);
			}
		});
	};
	
	$.fn.tree.methods = {
		options: function(jq){
			return $.data(jq[0], 'tree').options;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, this, data);
			});
		},
		getNode: function(jq, nodeEl){	// get the single node
			return getNode(jq[0], nodeEl);
		},
		getData: function(jq, nodeEl){	// get the specified node data, include its children
			return getData(jq[0], nodeEl);
		},
		reload: function(jq, nodeEl){
			return jq.each(function(){
				if (nodeEl){
					var node = $(nodeEl);
					var hit = node.children('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					node.next().remove();
					expandNode(this, nodeEl);
				} else {
					$(this).empty();
					request(this, this);
				}
			});
		},
		getRoot: function(jq){
			return getRootNode(jq[0]);
		},
		getRoots: function(jq){
			return getRootNodes(jq[0]);
		},
		getParent: function(jq, nodeEl){
			return getParentNode(jq[0], nodeEl);
		},
		getChildren: function(jq, nodeEl){
			return getChildren(jq[0], nodeEl);
		},
		getChecked: function(jq){
			return getCheckedNode(jq[0]);
		},
		getSelected: function(jq){
			return getSelectedNode(jq[0]);
		},
		isLeaf: function(jq, nodeEl){
			return isLeaf(jq[0], nodeEl);
		},
		find: function(jq, id){
			return findNode(jq[0], id);
		},
		select: function(jq, nodeEl){
			return jq.each(function(){
				selectNode(this, nodeEl);
			});
		},
		check: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, true);
			});
		},
		uncheck: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, false);
			});
		},
		collapse: function(jq, nodeEl){
			return jq.each(function(){
				collapseNode(this, nodeEl);
			});
		},
		expand: function(jq, nodeEl){
			return jq.each(function(){
				expandNode(this, nodeEl);
			});
		},
		collapseAll: function(jq, nodeEl){
			return jq.each(function(){
				collapseAllNode(this, nodeEl);
			});
		},
		expandAll: function(jq, nodeEl){
			return jq.each(function(){
				expandAllNode(this, nodeEl);
			});
		},
		expandTo: function(jq, nodeEl){
			return jq.each(function(){
				expandToNode(this, nodeEl);
			});
		},
		toggle: function(jq, nodeEl){
			return jq.each(function(){
				toggleNode(this, nodeEl);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				appendNodes(this, param);
			});
		},
		insert: function(jq, param){
			return jq.each(function(){
				insertNode(this, param);
			});
		},
		remove: function(jq, nodeEl){
			return jq.each(function(){
				removeNode(this, nodeEl);
			});
		},
		pop: function(jq, nodeEl){
			var node = jq.tree('getData', nodeEl);
			jq.tree('remove', nodeEl);
			return node;
		},
		update: function(jq, param){
			return jq.each(function(){
				updateNode(this, param);
			});
		},
		enableDnd: function(jq){
			return jq.each(function(){
				enableDnd(this);
			});
		},
		disableDnd: function(jq){
			return jq.each(function(){
				disableDnd(this);
			});
		},
		beginEdit: function(jq, nodeEl){
			return jq.each(function(){
				beginEdit(this, nodeEl);
			});
		},
		endEdit: function(jq, nodeEl){
			return jq.each(function(){
				endEdit(this, nodeEl);
			});
		},
		cancelEdit: function(jq, nodeEl){
			return jq.each(function(){
				cancelEdit(this, nodeEl);
			});
		}
	};
	
	$.fn.tree.parseOptions = function(target){
		var t = $(target);
		return {
			url:t.attr('url'),
			method:(t.attr('method') ? t.attr('method') : undefined),
			checkbox:(t.attr('checkbox') ? t.attr('checkbox') == 'true' : undefined),
			cascadeCheck:(t.attr('cascadeCheck') ? t.attr('cascadeCheck') == 'true' : undefined),
			onlyLeafCheck:(t.attr('onlyLeafCheck') ? t.attr('onlyLeafCheck') == 'true' : undefined),
			animate:(t.attr('animate') ? t.attr('animate') == 'true' : undefined),
			dnd:(t.attr('dnd') ? t.attr('dnd') == 'true' : undefined)
		};
	};
	
	$.fn.tree.defaults = {
		url: null,
		method: 'post',
		animate: false,
		checkbox: false,
		cascadeCheck: true,
		onlyLeafCheck: false,
		dnd: false,
		data: null,
		
		onBeforeLoad: function(node, param){},
		onLoadSuccess: function(node, data){},
		onLoadError: function(){},
		onClick: function(node){},	// node: id,text,checked,attributes,target
		onDblClick: function(node){},	// node: id,text,checked,attributes,target
		onBeforeExpand: function(node){},
		onExpand: function(node){},
		onBeforeCollapse: function(node){},
		onCollapse: function(node){},
		onCheck: function(node, checked){},
		onBeforeSelect: function(node){},
		onSelect: function(node){},
		onContextMenu: function(e, node){},
		onDrop: function(target, source, point){},	// point:'append','top','bottom'
		onBeforeEdit: function(node){},
		onAfterEdit: function(node){},
		onCancelEdit: function(node){}
	};
})(jQuery);
/**
 * pagination - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	linkbutton
 * 
 */
(function($){
	function buildToolbar(target){
		var opts = $.data(target, 'pagination').options;
		
		var pager = $(target).addClass('pagination').empty();
		var t = $('<table cellspacing="0" cellpadding="0" border="0"><tr></tr></table>').appendTo(pager);
		var tr = $('tr', t);
		
		if (opts.showPageList){
			var ps = $('<select class="pagination-page-list"></select>');
			for(var i=0; i<opts.pageList.length; i++) {
				var option = $('<option></option>')
						.text(opts.pageList[i])
//						.attr('selected', opts.pageList[i]==opts.pageSize ? 'selected' : '')
						.appendTo(ps);
				if (opts.pageList[i] == opts.pageSize){
					option.attr('selected','selected');
				}
			}
			$('<td></td>').append(ps).appendTo(tr);
			
			opts.pageSize = parseInt(ps.val());
			
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
		}
		
		$('<td><a href="javascript:void(0)" icon="pagination-first"></a></td>').appendTo(tr);
		$('<td><a href="javascript:void(0)" icon="pagination-prev"></a></td>').appendTo(tr);
		$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
		
		$('<span style="padding-left:6px;"></span>')
				.html(opts.beforePageText)
				.wrap('<td></td>')
				.parent().appendTo(tr);
		$('<td><input class="pagination-num" type="text" value="1" size="2"></td>').appendTo(tr);
		$('<span style="padding-right:6px;"></span>')
//				.html(opts.afterPageText)
				.wrap('<td></td>')
				.parent().appendTo(tr);
		
		$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
		$('<td><a href="javascript:void(0)" icon="pagination-next"></a></td>').appendTo(tr);
		$('<td><a href="javascript:void(0)" icon="pagination-last"></a></td>').appendTo(tr);
		
		if (opts.showRefresh){
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			$('<td><a href="javascript:void(0)" icon="pagination-load"></a></td>').appendTo(tr);
			
//			if (opts.loading) {
//				$('<td><a class="pagination-refresh" href="javascript:void(0)" icon="pagination-loading"></a></td>').appendTo(tr);
//			} else {
//				$('<td><a class="pagination-refresh" href="javascript:void(0)" icon="pagination-load"></a></td>').appendTo(tr);
//			}
		}
		
		if (opts.buttons){
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			for(var i=0; i<opts.buttons.length; i++){
				var btn = opts.buttons[i];
				if (btn == '-') {
					$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
				} else {
					var td = $('<td></td>').appendTo(tr);
					$('<a href="javascript:void(0)"></a>')
							.addClass('l-btn')
							.css('float', 'left')
							.text(btn.text || '')
							.attr('icon', btn.iconCls || '')
							.bind('click', eval(btn.handler || function(){}))
							.appendTo(td)
							.linkbutton({plain:true});
				}
			}
		}
		
		$('<div class="pagination-info"></div>').appendTo(pager);
		$('<div style="clear:both;"></div>').appendTo(pager);
		
		
		$('a[icon^=pagination]', pager).linkbutton({plain:true});
		
		pager.find('a[icon=pagination-first]').unbind('.pagination').bind('click.pagination', function(){
			if (opts.pageNumber > 1) selectPage(target, 1);
		});
		pager.find('a[icon=pagination-prev]').unbind('.pagination').bind('click.pagination', function(){
			if (opts.pageNumber > 1) selectPage(target, opts.pageNumber - 1);
		});
		pager.find('a[icon=pagination-next]').unbind('.pagination').bind('click.pagination', function(){
			var pageCount = Math.ceil(opts.total/opts.pageSize);
			if (opts.pageNumber < pageCount) selectPage(target, opts.pageNumber + 1);
		});
		pager.find('a[icon=pagination-last]').unbind('.pagination').bind('click.pagination', function(){
			var pageCount = Math.ceil(opts.total/opts.pageSize);
			if (opts.pageNumber < pageCount) selectPage(target, pageCount);
		});
		pager.find('a[icon=pagination-load]').unbind('.pagination').bind('click.pagination', function(){
			if (opts.onBeforeRefresh.call(target, opts.pageNumber, opts.pageSize) != false){
				selectPage(target, opts.pageNumber);
				opts.onRefresh.call(target, opts.pageNumber, opts.pageSize);
			}
		});
		pager.find('input.pagination-num').unbind('.pagination').bind('keydown.pagination', function(e){
			if (e.keyCode == 13){
				var pageNumber = parseInt($(this).val()) || 1;
				selectPage(target, pageNumber);
			}
		});
		pager.find('.pagination-page-list').unbind('.pagination').bind('change.pagination', function(){
			opts.pageSize = $(this).val();
			opts.onChangePageSize.call(target, opts.pageSize);
			
			var pageCount = Math.ceil(opts.total/opts.pageSize);
			selectPage(target, opts.pageNumber);
		});
	}
	
	function selectPage(target, page){
		var opts = $.data(target, 'pagination').options;
		var pageCount = Math.ceil(opts.total/opts.pageSize) || 1;
		var pageNumber = page;
		if (page < 1) pageNumber = 1;
		if (page > pageCount) pageNumber = pageCount;
		opts.pageNumber = pageNumber;
		opts.onSelectPage.call(target, pageNumber, opts.pageSize);
		showInfo(target);
	}
	
	function showInfo(target){
		var opts = $.data(target, 'pagination').options;
		
		var pageCount = Math.ceil(opts.total/opts.pageSize) || 1;
		var num = $(target).find('input.pagination-num');
		num.val(opts.pageNumber);
		num.parent().next().find('span').html(opts.afterPageText.replace(/{pages}/, pageCount));
		
		var pinfo = opts.displayMsg;
		pinfo = pinfo.replace(/{from}/, opts.pageSize*(opts.pageNumber-1)+1);
		pinfo = pinfo.replace(/{to}/, Math.min(opts.pageSize*(opts.pageNumber), opts.total));
		pinfo = pinfo.replace(/{total}/, opts.total);
		
		$(target).find('.pagination-info').html(pinfo);
		
		$('a[icon=pagination-first],a[icon=pagination-prev]', target).linkbutton({
			disabled: (opts.pageNumber == 1)
		});
		$('a[icon=pagination-next],a[icon=pagination-last]', target).linkbutton({
			disabled: (opts.pageNumber == pageCount)
		});
		
		if (opts.loading){
			$(target).find('a[icon=pagination-load]').find('.pagination-load').addClass('pagination-loading');
		} else {
			$(target).find('a[icon=pagination-load]').find('.pagination-load').removeClass('pagination-loading');
		}
	}
	
	function setLoadStatus(target, loading){
		var opts = $.data(target, 'pagination').options;
		opts.loading = loading;
		if (opts.loading){
			$(target).find('a[icon=pagination-load]').find('.pagination-load').addClass('pagination-loading');
		} else {
			$(target).find('a[icon=pagination-load]').find('.pagination-load').removeClass('pagination-loading');
		}
	}
	
	$.fn.pagination = function(options, param) {
		if (typeof options == 'string'){
			return $.fn.pagination.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var opts;
			var state = $.data(this, 'pagination');
			if (state) {
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.pagination.defaults, options);
				$.data(this, 'pagination', {
					options: opts
				});
			}
			
			buildToolbar(this);
			showInfo(this);
			
		});
	};
	
	$.fn.pagination.methods = {
		options: function(jq){
			return $.data(jq[0], 'pagination').options;
		},
		loading: function(jq){
			return jq.each(function(){
				setLoadStatus(this, true);
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				setLoadStatus(this, false);
			});
		}
	};
	
	$.fn.pagination.defaults = {
		total: 1,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10,20,30,50],
		loading: false,
		buttons: null,
		showPageList: true,
		showRefresh: true,
		
		onSelectPage: function(pageNumber, pageSize){},
		onBeforeRefresh: function(pageNumber, pageSize){},
		onRefresh: function(pageNumber, pageSize){},
		onChangePageSize: function(pageSize){},
		
		beforePageText: 'Page',
		afterPageText: 'of {pages}',
		displayMsg: 'Displaying {from} to {to} of {total} items'
	};
})(jQuery);/**
 * datagrid - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *  panel
 * 	resizable
 * 	linkbutton
 * 	pagination
 * 
 */
(function($){
	/**
	 * Get the index of array item, return -1 when the item is not found.
	 */
	function indexOfArray(a,o){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i] == o) return i;
		}
		return -1;
	}
	/**
	 * Remove array item, 'o' parameter can be item object or id field name.
	 * When 'o' parameter is the id field name, the 'id' parameter is valid.
	 */
	function removeArrayItem(a,o,id){
		if (typeof o == 'string'){
			for(var i=0,len=a.length; i<len; i++){
				if (a[i][o] == id){
					a.splice(i, 1);
					return;
				}
			}
		} else {
			var index = indexOfArray(a,o);
			if (index != -1){
				a.splice(index, 1);
			}
		}
	}
	
	function setSize(target, param) {
		var opts = $.data(target, 'datagrid').options;
		var panel = $.data(target, 'datagrid').panel;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		
		if (opts.fit == true){
			var p = panel.panel('panel').parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		
		panel.panel('resize', {
			width: opts.width,
			height: opts.height
		});
	}
	
	function setBodySize(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var wrap = $.data(target, 'datagrid').panel;
		var innerWidth = wrap.width();
		var innerHeight = wrap.height();
		
		var view = dc.view;
		var view1 = dc.view1;
		var view2 = dc.view2;
		var header1 = view1.children('div.datagrid-header');
		var header2 = view2.children('div.datagrid-header');
		var table1 = header1.find('table');
		var table2 = header2.find('table');
		
		// set view width
		view.width(innerWidth);
		var headerInner = header1.children('div.datagrid-header-inner').show();
		view1.width(headerInner.find('table').width());
		if (!opts.showHeader) headerInner.hide();
		view2.width(innerWidth - view1.outerWidth());
		view1.children('div.datagrid-header,div.datagrid-body,div.datagrid-footer').width(view1.width());
		view2.children('div.datagrid-header,div.datagrid-body,div.datagrid-footer').width(view2.width());
		
		// set header height
		var hh;
		header1.css('height', '');
		header2.css('height', '');
		table1.css('height', '');
		table2.css('height', '');
		hh = Math.max(table1.height(), table2.height());
		table1.height(hh);
		table2.height(hh);
		if ($.boxModel == true){
			header1.height(hh - (header1.outerHeight()-header1.height()));
			header2.height(hh - (header2.outerHeight()-header2.height()));
		} else {
			header1.height(hh);
			header2.height(hh);
		}
		
		// set body height
		if (opts.height != 'auto') {
			var height = innerHeight
					- view2.children('div.datagrid-header').outerHeight(true)
					- view2.children('div.datagrid-footer').outerHeight(true)
					- wrap.children('div.datagrid-toolbar').outerHeight(true)
					- wrap.children('div.datagrid-pager').outerHeight(true);
			view1.children('div.datagrid-body').height(height);
			view2.children('div.datagrid-body').height(height);
		}
		
		view.height(view2.height());
		view2.css('left', view1.outerWidth());
	}
	
	/**
	 * make the load message display on center of panel.
	 */
	function centerLoadingMsg(target){
		var panel = $(target).datagrid('getPanel');
		var mask = panel.children('div.datagrid-mask');
		if (mask.length){
			mask.css({
				width: panel.width(),
				height: panel.height()
			});
			var msg = panel.children('div.datagrid-mask-msg');
			msg.css({
				left: (panel.width() - msg.outerWidth()) / 2,
				top: (panel.height() - msg.outerHeight()) / 2
			});
		}
	}
	
	function fixRowHeight(target, index){
		var rows = $.data(target, 'datagrid').data.rows;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		if (!dc.body1.is(':empty')){
			if (index >= 0){
				setHeight(index);
			} else {
				for(var i=0; i<rows.length; i++){
					setHeight(i);
				}
				if (opts.showFooter){
					var footRows = $(target).datagrid('getFooterRows') || [];
					for(var i=0; i<footRows.length; i++){
						setHeight(i, 'footer');
					}
					setBodySize(target);
				}
			}
		}
		if (opts.height == 'auto'){
			var body1 = dc.body1.parent();
			var body2 = dc.body2;
			var height = 0;
			var width = 0;
			body2.children().each(function(){
				var c = $(this);
				if (c.is(':visible')){
					height += c.outerHeight();
					if (width < c.outerWidth()){
						width = c.outerWidth();
					}
				}
			});
			if (width > body2.width()){
				height += 18;	// add the horizontal scroll height
			}
			body1.height(height);
			body2.height(height);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler('scroll');
		
		// set body row or footer row height
		function setHeight(index, type){
			type = type || 'body';
			var tr1 = opts.finder.getTr(target, index, type, 1);
			var tr2 = opts.finder.getTr(target, index, type, 2);
			tr1.css('height', '');
			tr2.css('height', '');
			var height = Math.max(tr1.height(), tr2.height());
			tr1.css('height', height);
			tr2.css('height', height);
		}
	}
	
	/**
	 * wrap and return the grid object, fields and columns
	 */
	function wrapGrid(target, rownumbers) {
		function getColumns(thead){
			var columns = [];
			$('tr', thead).each(function(){
				var cols = [];
				$('th', this).each(function(){
					var th = $(this);
					var col = {
						title: th.html(),
						align: th.attr('align') || 'left',
						sortable: th.attr('sortable')=='true' || false,
						checkbox: th.attr('checkbox')=='true' || false
					};
					if (th.attr('field')) {
						col.field = th.attr('field');
					}
					if (th.attr('formatter')){
						col.formatter = eval(th.attr('formatter'));
					}
					if (th.attr('styler')){
						col.styler = eval(th.attr('styler'));
					}
					if (th.attr('editor')){
						var s = $.trim(th.attr('editor'));
						if (s.substr(0,1) == '{'){
							col.editor = eval('(' + s + ')');
						} else {
							col.editor = s;
						}
					}
					if (th.attr('rowspan')) col.rowspan = parseInt(th.attr('rowspan'));
					if (th.attr('colspan')) col.colspan = parseInt(th.attr('colspan'));
					if (th.attr('width')) col.width = parseInt(th.attr('width')) || 100;
					if (th.attr('hidden')) col.hidden = true;
					if (th.attr('resizable')) col.resizable = th.attr('resizable') == 'true';
					
					cols.push(col);
				});
				columns.push(cols);
			});
			
			return columns;
		}
		
		var panel = $(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner"></div>' +
							'</div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body"></div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-resize-proxy"></div>' +
					'</div>' +
				'</div>'
		).insertAfter(target);
		
		panel.panel({
			doSize:false
		});
		panel.panel('panel').addClass('datagrid').bind('_resize', function(e, force){
			var opts = $.data(target, 'datagrid').options;
			if (opts.fit == true || force){
				setSize(target);
				setTimeout(function(){
					if ($.data(target, 'datagrid')){
						fixColumnSize(target);
					}
				}, 0);
			}
			return false;
		});
		
		$(target).hide().appendTo(panel.children('div.datagrid-view'));
		
		var frozenColumns = getColumns($('thead[frozen=true]', target));
		var columns = getColumns($('thead[frozen!=true]', target));
		var view = panel.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		
		return {
			panel: panel,
			frozenColumns: frozenColumns,
			columns: columns,
			dc: {	// some data container
				view: view,
				view1: view1,
				view2: view2,
				body1: view1.children('div.datagrid-body').children('div.datagrid-body-inner'),
				body2: view2.children('div.datagrid-body'),
				footer1: view1.children('div.datagrid-footer').children('div.datagrid-footer-inner'),
				footer2: view2.children('div.datagrid-footer').children('div.datagrid-footer-inner')
			}
		};
	}
	
	function parseGridData(target){
		var data = {
			total:0,
			rows:[]
		};
		var fields = getColumnFields(target,true).concat(getColumnFields(target,false));
		$(target).find('tbody tr').each(function(){
			data.total++;
			var col = {};
			for(var i=0; i<fields.length; i++){
				col[fields[i]] = $('td:eq('+i+')', this).html();
			}
			data.rows.push(col);
		});
		return data;
	}
	
	function buildGrid(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var panel = $.data(target, 'datagrid').panel;
		
		panel.panel($.extend({}, opts, {
			doSize: false,
			onResize: function(width, height){
				centerLoadingMsg(target);
				setTimeout(function(){
					if ($.data(target, 'datagrid')){
						setBodySize(target);
						fitColumns(target);
						opts.onResize.call(panel, width, height);
					}
				}, 0);
			},
			onExpand: function(){
				setBodySize(target);
				fixRowHeight(target);
				opts.onExpand.call(panel);
			}
		}));
		
		var view1 = dc.view1;
		var view2 = dc.view2;
		var header1 = view1.children('div.datagrid-header').children('div.datagrid-header-inner');
		var header2 = view2.children('div.datagrid-header').children('div.datagrid-header-inner');
		
		createColumnHeader(header1, opts.frozenColumns, true);
		createColumnHeader(header2, opts.columns, false);
		
		header1.css('display', opts.showHeader ? 'block' : 'none');
		header2.css('display', opts.showHeader ? 'block' : 'none');
		view1.find('div.datagrid-footer-inner').css('display', opts.showFooter ? 'block' : 'none');
		view2.find('div.datagrid-footer-inner').css('display', opts.showFooter ? 'block' : 'none');
		
		if (opts.toolbar) {
			if (typeof opts.toolbar == 'string'){
				$(opts.toolbar).addClass('datagrid-toolbar').prependTo(panel);
				$(opts.toolbar).show();
			} else {
				$('div.datagrid-toolbar', panel).remove();
				var tb = $('<div class="datagrid-toolbar"></div>').prependTo(panel);
				for(var i=0; i<opts.toolbar.length; i++) {
					var btn = opts.toolbar[i];
					if (btn == '-') {
						$('<div class="datagrid-btn-separator"></div>').appendTo(tb);
					} else {
						var tool = $('<a href="javascript:void(0)"></a>');
						tool[0].onclick = eval(btn.handler || function(){});
						tool.css('float', 'left').appendTo(tb).linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			}
		} else {
			$('div.datagrid-toolbar', panel).remove();
		}
		
		$('div.datagrid-pager', panel).remove();
		if (opts.pagination) {
			var pager = $('<div class="datagrid-pager"></div>').appendTo(panel);
			pager.pagination({
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
		
		function createColumnHeader(container, columns, frozen){
			if (!columns) return;
			$(container).show();
			$(container).empty();
			var t = $('<table border="0" cellspacing="0" cellpadding="0"><tbody></tbody></table>').appendTo(container);
			for(var i=0; i<columns.length; i++) {
				var tr = $('<tr></tr>').appendTo($('tbody', t));
				var cols = columns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					
					var attr = '';
					if (col.rowspan) attr += 'rowspan="' + col.rowspan + '" ';
					if (col.colspan) attr += 'colspan="' + col.colspan + '" ';
					var td = $('<td ' + attr + '></td>').appendTo(tr);
					
					if (col.checkbox){
						td.attr('field', col.field);
						$('<div class="datagrid-header-check"></div>').html('<input type="checkbox"/>').appendTo(td);
					} else if (col.field){
						td.attr('field', col.field);
						td.append('<div class="datagrid-cell"><span></span><span class="datagrid-sort-icon"></span></div>');
						$('span', td).html(col.title);
						$('span.datagrid-sort-icon', td).html('&nbsp;');
						var cell = td.find('div.datagrid-cell');
						if (col.resizable == false) cell.attr('resizable', 'false');
						col.boxWidth = $.boxModel ? (col.width - (cell.outerWidth() - cell.width())) : col.width;
						cell.width(col.boxWidth);
						cell.css('text-align', (col.align || 'left'));
					} else {
						$('<div class="datagrid-cell-group"></div>').html(col.title).appendTo(td);
					}
					
					if (col.hidden){
						td.hide();
					}
				}
				
			}
			if (frozen && opts.rownumbers){
				var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-rownumber"></div></td>');
				if ($('tr',t).length == 0){
					td.wrap('<tr></tr>').parent().appendTo($('tbody',t));
				} else {
					td.prependTo($('tr:first', t));
				}
			}
		}
	}
	
	/**
	 * bind datagrid row events
	 */
	function bindRowEvents(target){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		
		// get all rows
		var tr = opts.finder.getTr(target, '', 'allbody');
		tr.unbind('.datagrid').bind('mouseenter.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			opts.finder.getTr(target, index).addClass('datagrid-row-over');
		}).bind('mouseleave.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			opts.finder.getTr(target, index).removeClass('datagrid-row-over');
		}).bind('click.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			if (opts.singleSelect == true){
				clearSelections(target);
				selectRow(target, index);
			} else {
				if ($(this).hasClass('datagrid-row-selected')){
					unselectRow(target, index);
				} else {
					selectRow(target, index);
				}
			}
			if (opts.onClickRow){
				opts.onClickRow.call(target, index, data.rows[index]);
			}
		}).bind('dblclick.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			if (opts.onDblClickRow){
				opts.onDblClickRow.call(target, index, data.rows[index]);
			}
		}).bind('contextmenu.datagrid', function(e){
			var index = $(this).attr('datagrid-row-index');
			if (opts.onRowContextMenu){
				opts.onRowContextMenu.call(target, e, index, data.rows[index]);
			}
		});
		
		tr.find('td[field]').unbind('.datagrid').bind('click.datagrid', function(){
			var index = $(this).parent().attr('datagrid-row-index');
			var field = $(this).attr('field');
			var value = data.rows[index][field];
			opts.onClickCell.call(target, index, field, value);
		}).bind('dblclick.datagrid', function(){
			var index = $(this).parent().attr('datagrid-row-index');
			var field = $(this).attr('field');
			var value = data.rows[index][field];
			opts.onDblClickCell.call(target, index, field, value);
		});
		
		tr.find('div.datagrid-cell-check input[type=checkbox]').unbind('.datagrid').bind('click.datagrid', function(e){
			var index = $(this).parent().parent().parent().attr('datagrid-row-index');
			if (opts.singleSelect){
				clearSelections(target);
				selectRow(target, index);
			} else {
				if ($(this).is(':checked')){
					selectRow(target, index);
				} else {
					unselectRow(target, index);
				}
			}
			e.stopPropagation();
		});
	}
	
	/**
	 * bind the datagrid events
	 */
	function bindEvents(target) {
		var panel = $.data(target, 'datagrid').panel;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		var header = dc.view.find('div.datagrid-header');
		header.find('td:has(div.datagrid-cell)').unbind('.datagrid').bind('mouseenter.datagrid', function(){
			$(this).addClass('datagrid-header-over');
		}).bind('mouseleave.datagrid', function(){
			$(this).removeClass('datagrid-header-over');
		}).bind('contextmenu.datagrid', function(e){
			var field = $(this).attr('field');
			opts.onHeaderContextMenu.call(target, e, field);
		});
		header.find('input[type=checkbox]').unbind('.datagrid').bind('click.datagrid', function(){
			if (opts.singleSelect) return false;
			if ($(this).is(':checked')){
				selectAll(target);
			} else {
				unselectAll(target);
			}
		});
		
		dc.body2.unbind('.datagrid').bind('scroll.datagrid', function(){
			dc.view1.children('div.datagrid-body').scrollTop($(this).scrollTop());
			dc.view2.children('div.datagrid-header').scrollLeft($(this).scrollLeft());
			dc.view2.children('div.datagrid-footer').scrollLeft($(this).scrollLeft());
		});
		
		function setSorting(headerCell, enabled){
			headerCell.unbind('.datagrid');
			if (!enabled) return;
			headerCell.bind('click.datagrid', function(e){
				var field = $(this).parent().attr('field');
				var opt = getColumnOption(target, field);
				if (!opt.sortable) return;
				
				opts.sortName = field;
				opts.sortOrder = 'asc';
				
				var c = 'datagrid-sort-asc';
				if ($(this).hasClass('datagrid-sort-asc')){
					c = 'datagrid-sort-desc';
					opts.sortOrder = 'desc';
				}
				header.find('div.datagrid-cell').removeClass('datagrid-sort-asc datagrid-sort-desc');
				$(this).addClass(c);
				
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $.data(target, 'datagrid').data;
					loadData(target, data);
				}
				
				if (opts.onSortColumn){
					opts.onSortColumn.call(target, opts.sortName, opts.sortOrder);
				}
			});
		}
		
		setSorting(header.find('div.datagrid-cell'), true);
		header.find('div.datagrid-cell').each(function(){
			$(this).resizable({
				handles:'e',
				disabled:($(this).attr('resizable') ? $(this).attr('resizable')=='false' : false),
				minWidth:25,
				onStartResize: function(e){
					header.css('cursor', 'e-resize');
					dc.view.children('div.datagrid-resize-proxy').css({
						left:e.pageX - $(panel).offset().left - 1,
						display:'block'
					});
					setSorting($(this), false);	// disable the column sorting
				},
				onResize: function(e){
					dc.view.children('div.datagrid-resize-proxy').css({
						display:'block',
						left:e.pageX - $(panel).offset().left - 1
					});
					return false;
				},
				onStopResize: function(e){
					header.css('cursor', '');
					var field = $(this).parent().attr('field');
					var col = getColumnOption(target, field);
					col.width = $(this).outerWidth();
					col.boxWidth = $.boxModel == true ? $(this).width() : $(this).outerWidth();
					fixColumnSize(target, field);
					fitColumns(target);
					setTimeout(function(){
						setSorting($(e.data.target), true);	// enable the column sorting
					},0);
					
					dc.view2.children('div.datagrid-header').scrollLeft(dc.body2.scrollLeft());
					dc.view.children('div.datagrid-resize-proxy').css('display', 'none');
					opts.onResizeColumn.call(target, field, col.width);
				}
			});
		});
		
		dc.view1.children('div.datagrid-header').find('div.datagrid-cell').resizable({
			onStopResize: function(e){
				header.css('cursor', '');
				var field = $(this).parent().attr('field');
				var col = getColumnOption(target, field);
				col.width = $(this).outerWidth();
				col.boxWidth = $.boxModel == true ? $(this).width() : $(this).outerWidth();
				fixColumnSize(target, field);
				
				dc.view2.children('div.datagrid-header').scrollLeft(dc.body2.scrollLeft());
				dc.view.children('div.datagrid-resize-proxy').css('display', 'none');
				setBodySize(target);
				fitColumns(target);
				setTimeout(function(){
					setSorting($(e.data.target), true);	// enable the column sorting
				},0);
				opts.onResizeColumn.call(target, field, col.width);
			}
		});
	}
	
	/**
	 * expand the columns to fit the grid width
	 */
	function fitColumns(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		if (!opts.fitColumns){
			return;
		}
		var header = dc.view2.children('div.datagrid-header');
		var fieldWidths = 0;
		var lastColumn;
		var fields = getColumnFields(target, false);
		for(var i=0; i<fields.length; i++){
			var col = getColumnOption(target, fields[i]);
			if (!col.hidden && !col.checkbox){
				fieldWidths += col.width;
				lastColumn = col;
			}
		}
		var headerInner = header.children('div.datagrid-header-inner').show();
		var leftWidth = header.width() - header.find('table').width() - opts.scrollbarSize;
		var rate = leftWidth / fieldWidths;
		if (!opts.showHeader) headerInner.hide();
		for(var i=0; i<fields.length; i++){
			var col = getColumnOption(target, fields[i]);
			if (!col.hidden && !col.checkbox){
				var width = Math.floor(col.width * rate);
				addHeaderWidth(col, width);
				leftWidth -= width;
			}
		}
		fixColumnSize(target);
		
		if (leftWidth){
			addHeaderWidth(lastColumn,leftWidth);
			fixColumnSize(target, lastColumn.field);
		}
		
		function addHeaderWidth(col,width){
			col.width += width;
			col.boxWidth += width;
			header.find('td[field="' + col.field + '"] div.datagrid-cell').width(col.boxWidth);
		}
	}
	
	/**
	 * fix column size with the specified field
	 */
	function fixColumnSize(target, field) {
		var panel = $.data(target, 'datagrid').panel;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		if (field) {
			fix(field);
		} else {
			var header = dc.view1.children('div.datagrid-header').add(dc.view2.children('div.datagrid-header'));
			header.find('td[field]').each(function(){
				fix($(this).attr('field'));
			});
		}
		fixMergedSize(target);
		
		setTimeout(function(){
			fixRowHeight(target);
			fixEditableSize(target);
		}, 0);
		
		function fix(field){
			var col = getColumnOption(target, field);
			var bf = opts.finder.getTr(target,'','allbody').add(opts.finder.getTr(target,'','allfooter'));
			bf.find('td[field="' + field + '"]').each(function(){
				var td = $(this);
				var colspan = td.attr('colspan') || 1;
				if (colspan == 1){
					td.find('div.datagrid-cell').width(col.boxWidth);
					td.find('div.datagrid-editable').width(col.width);
				}
			});
		}
	}
	
	function fixMergedSize(target){
		var panel = $.data(target, 'datagrid').panel;
		var dc = $.data(target, 'datagrid').dc;
		var header = dc.view1.children('div.datagrid-header').add(dc.view2.children('div.datagrid-header'));
		panel.find('div.datagrid-body td.datagrid-td-merged').each(function(){
			var td = $(this);
			var colspan = td.attr('colspan') || 1;
			var field = td.attr('field');
			var header_td = header.find('td[field="' + field + '"]');
			var width = header_td.width();
			for(var i=1; i<colspan; i++){
				header_td = header_td.next();
				width += header_td.outerWidth();
			}
			
			var cell = td.children('div.datagrid-cell');
			if ($.boxModel == true){
				cell.width(width - (cell.outerWidth() - cell.width()));
			} else {
				cell.width(width);
			}
		});
	}
	
	function fixEditableSize(target){
		var panel = $.data(target, 'datagrid').panel;
		panel.find('div.datagrid-editable').each(function(){
			var ed = $.data(this, 'datagrid.editor');
			if (ed.actions.resize) {
				ed.actions.resize(ed.target, $(this).width());
			}
		});
	}
	
	function getColumnOption(target, field){
		var opts = $.data(target, 'datagrid').options;
		if (opts.columns){
			for(var i=0; i<opts.columns.length; i++){
				var cols = opts.columns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					if (col.field == field){
						return col;
					}
				}
			}
		}
		if (opts.frozenColumns){
			for(var i=0; i<opts.frozenColumns.length; i++){
				var cols = opts.frozenColumns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					if (col.field == field){
						return col;
					}
				}
			}
		}
		return null;
	}
	
	/**
	 * get column fields which will be show in row
	 */
	function getColumnFields(target, frozen){
		var opts = $.data(target, 'datagrid').options;
		var columns = (frozen==true) ? (opts.frozenColumns || [[]]) : opts.columns;
		if (columns.length == 0) return [];
		
		var fields = [];
		
		function getColumnIndex(count){
			var c = 0;
			var i = 0;
			while(true){
				if (fields[i] == undefined){
					if (c == count){
						return i;
					}
					c ++;
				}
				i++;
			}
		}
		
		function getFields(r){
			var ff = [];
			var c = 0;
			for(var i=0; i<columns[r].length; i++){
				var col = columns[r][i];
				if (col.field){
					ff.push([c, col.field]);	// store the field index and name
				}
				c += parseInt(col.colspan || '1');
			}
			for(var i=0; i<ff.length; i++){
				ff[i][0] = getColumnIndex(ff[i][0]);	// calculate the real index in fields array
			}
			for(var i=0; i<ff.length; i++){
				var f = ff[i];
				fields[f[0]] = f[1];	// update the field name
			}
		}
		
		for(var i=0; i<columns.length; i++){
			getFields(i);
		}
		
		return fields;
	}
	
	/**
	 * load data to the grid
	 */
	function loadData(target, data){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var wrap = $.data(target, 'datagrid').panel;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		data = opts.loadFilter.call(target, data);
		var rows = data.rows;
		$.data(target, 'datagrid').data = data;
		if (data.footer){
			$.data(target, 'datagrid').footer = data.footer;
		}
		
		if (!opts.remoteSort){
			var opt = getColumnOption(target, opts.sortName);
			if (opt){
				var sortFunc = opt.sorter || function(a,b){
					return (a>b?1:-1);
				};
				data.rows.sort(function(r1,r2){
					return sortFunc(r1[opts.sortName], r2[opts.sortName])*(opts.sortOrder=='asc'?1:-1);
				});
			}
		}
		
		// render datagrid view
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, rows);
		}
		opts.view.render.call(opts.view, target, dc.body2, false);
		opts.view.render.call(opts.view, target, dc.body1, true);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		opts.onLoadSuccess.call(target, data);
		
		var pager = wrap.children('div.datagrid-pager');
		if (pager.length){
			if (pager.pagination('options').total != data.total){
				pager.pagination({total:data.total});
			}
		}
		
		fixRowHeight(target);
		bindRowEvents(target);
		dc.body2.triggerHandler('scroll');
		
		if (opts.idField){
			for(var i=0; i<rows.length; i++){
				if (isSelected(rows[i])){
					selectRecord(target, rows[i][opts.idField]);
				}
			}
		}
		
		function isSelected(row){
			for(var i=0; i<selectedRows.length; i++){
				if (selectedRows[i][opts.idField] == row[opts.idField]){
					selectedRows[i] = row;
					return true;
				}
			}
			return false;
		}
	}
	
	/**
	 * Return the index of specified row or -1 if not found.
	 * row: id value or row record
	 */
	function getRowIndex(target, row){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').data.rows;
		if (typeof row == 'object'){
			return indexOfArray(rows, row);
		} else {
			for(var i=0; i<rows.length; i++){
				if (rows[i][opts.idField] == row){
					return i;
				}
			}
			return -1;
		}
	}
	
	function getSelectedRows(target){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		
		if (opts.idField){
			return $.data(target, 'datagrid').selectedRows;
		} else {
			var rows = [];
			opts.finder.getTr(target, '', 'selected', 2).each(function(){
				var index = parseInt($(this).attr('datagrid-row-index'));
				rows.push(data.rows[index]);
			});
			return rows;
		}
	}
	
	/**
	 * clear all the selection records
	 */
	function clearSelections(target){
		unselectAll(target);
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		selectedRows.splice(0, selectedRows.length);
	}
	
	/**
	 * Select all rows of current page.
	 */
	function selectAll(target){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').data.rows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		// get all rows
		var tr = opts.finder.getTr(target, '', 'allbody').addClass('datagrid-row-selected');
		var allck = tr.find('div.datagrid-cell-check input[type=checkbox]');
		$.fn.prop ? allck.prop('checked',true) : allck.attr('checked',true);
		for(var index=0; index<rows.length; index++){
			if (opts.idField){
				(function(){
					var row = rows[index];
					for(var i=0; i<selectedRows.length; i++){
						if (selectedRows[i][opts.idField] == row[opts.idField]){
							return;
						}
					}
					selectedRows.push(row);
				})();
			}
		}
		opts.onSelectAll.call(target, rows);
	}
	
	function unselectAll(target){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		// get all selected rows
		var tr = opts.finder.getTr(target, '', 'selected').removeClass('datagrid-row-selected');
		var allck = tr.find('div.datagrid-cell-check input[type=checkbox]');
		$.fn.prop ? allck.prop('checked', false) : allck.attr('checked', false);
		if (opts.idField){
			for(var index=0; index<data.rows.length; index++){
				removeArrayItem(selectedRows, opts.idField, data.rows[index][opts.idField]);
			}
		}
		opts.onUnselectAll.call(target, data.rows);
	}
	
	/**
	 * select a row with specified row index which start with 0.
	 */
	function selectRow(target, index){
		var dc = $.data(target, 'datagrid').dc;
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (index < 0 || index >= data.rows.length){
			return;
		}
		
		if (opts.singleSelect == true){
			clearSelections(target);
		}
		var tr = opts.finder.getTr(target, index);
		if (!tr.hasClass('datagrid-row-selected')){
			tr.addClass('datagrid-row-selected');
			var ck = $('div.datagrid-cell-check input[type=checkbox]',tr);
			$.fn.prop ? ck.prop('checked', true) : ck.attr('checked', true);
			if (opts.idField){
				var row = data.rows[index];
				(function(){
					for(var i=0; i<selectedRows.length; i++){
						if (selectedRows[i][opts.idField] == row[opts.idField]){
							return;
						}
					}
					selectedRows.push(row);
				})();
			}
		}
		opts.onSelect.call(target, index, data.rows[index]);
		
		var headerHeight = dc.view2.children('div.datagrid-header').outerHeight();
		var body2 = dc.body2;
		var top = tr.position().top - headerHeight;
		if (top <= 0){
			body2.scrollTop(body2.scrollTop() + top);
		} else if (top + tr.outerHeight() > body2.height() - 18){
			body2.scrollTop(body2.scrollTop() + top + tr.outerHeight() - body2.height() + 18);
		}
		
	}
	
	/**
	 * select record by idField.
	 */
	function selectRecord(target, idValue){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		if (opts.idField){
			var index = -1;
			for(var i=0; i<data.rows.length; i++){
				if (data.rows[i][opts.idField] == idValue){
					index = i;
					break;
				}
			}
			if (index >= 0){
				selectRow(target, index);
			}
		}
	}
	
	/**
	 * unselect a row.
	 */
	function unselectRow(target, index){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var data = $.data(target, 'datagrid').data;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (index < 0 || index >= data.rows.length){
			return;
		}
		
		var tr = opts.finder.getTr(target, index);
		var ck = tr.find('div.datagrid-cell-check input[type=checkbox]');
		tr.removeClass('datagrid-row-selected');
		$.fn.prop ? ck.prop('checked', false) : ck.attr('checked', false);
		
		var row = data.rows[index];
		if (opts.idField){
			removeArrayItem(selectedRows, opts.idField, row[opts.idField]);
		}
		opts.onUnselect.call(target, index, row);
	}
	
	/**
	 * Begin edit a row
	 */
	function beginEdit(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (tr.hasClass('datagrid-row-editing')) return;
		if (opts.onBeforeEdit.call(target, index, row) == false) return;
		
		tr.addClass('datagrid-row-editing');
		createEditor(target, index);
		fixEditableSize(target);
		
		tr.find('div.datagrid-editable').each(function(){
			var field = $(this).parent().attr('field');
			var ed = $.data(this, 'datagrid.editor');
			ed.actions.setValue(ed.target, row[field]);
		});
		validateRow(target, index);	// validate the row data
	}
	
	/**
	 * Stop edit a row.
	 * index: the row index.
	 * cancel: if true, restore the row data.
	 */
	function endEdit(target, index, cancel){
		var opts = $.data(target, 'datagrid').options;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (!tr.hasClass('datagrid-row-editing')) {
			return;
		}
		
		if (!cancel){
			if (!validateRow(target, index)) return;	// invalid row data
			
			var changed = false;
			var changes = {};
			tr.find('div.datagrid-editable').each(function(){
				var field = $(this).parent().attr('field');
				var ed = $.data(this, 'datagrid.editor');
				var value = ed.actions.getValue(ed.target);
				if (row[field] != value){
					row[field] = value;
					changed = true;
					changes[field] = value;
				}
			});
			if (changed){
				if (indexOfArray(insertedRows, row) == -1){
					if (indexOfArray(updatedRows, row) == -1){
						updatedRows.push(row);
					}
				}
			}
		}
		
		tr.removeClass('datagrid-row-editing');
		
		destroyEditor(target, index);
		$(target).datagrid('refreshRow', index);
		
		if (!cancel){
			opts.onAfterEdit.call(target, index, row, changes);
		} else {
			opts.onCancelEdit.call(target, index, row);
		}
	}
	
	/**
	 * get the specified row editors
	 */
	function getEditors(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var editors = [];
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				editors.push(ed);
			}
		});
		return editors;
	}
	
	/**
	 * get the cell editor
	 * param contains two parameters: index and field
	 */
	function getEditor(target, param){
		var editors = getEditors(target, param.index);
		for(var i=0; i<editors.length; i++){
			if (editors[i].field == param.field){
				return editors[i];
			}
		}
		return null;
	}
	
	/**
	 * create the row editor and adjust the row height.
	 */
	function createEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-cell');
			var field = $(this).attr('field');
			
			var col = getColumnOption(target, field);
			if (col && col.editor){
				// get edit type and options
				var edittype,editoptions;
				if (typeof col.editor == 'string'){
					edittype = col.editor;
				} else {
					edittype = col.editor.type;
					editoptions = col.editor.options;
				}
				
				// get the specified editor
				var editor = opts.editors[edittype];
				if (editor){
					var oldHtml = cell.html();
					var width = cell.outerWidth();
					cell.addClass('datagrid-editable');
					if ($.boxModel == true){
						cell.width(width - (cell.outerWidth() - cell.width()));
					}
					cell.html('<table border="0" cellspacing="0" cellpadding="1"><tr><td></td></tr></table>');
					cell.children('table').attr('align', col.align);
//					cell.children('table').click(function(e){
//						e.stopPropagation();
//					});
					cell.children('table').bind('click dblclick contextmenu',function(e){
						e.stopPropagation();
					});
					$.data(cell[0], 'datagrid.editor', {
						actions: editor,
						target: editor.init(cell.find('td'), editoptions),
						field: field,
						type: edittype,
						oldHtml: oldHtml
					});
				}
			}
		});
		fixRowHeight(target, index);
	}
	
	/**
	 * destroy the row editor and restore the row height.
	 */
	function destroyEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], 'datagrid.editor');
				
				var width = cell.outerWidth();
				cell.removeClass('datagrid-editable');
				if ($.boxModel == true){
					cell.width(width - (cell.outerWidth() - cell.width()));
				}
			}
		});
	}
	
	/**
	 * Validate while editing, if valid return true.
	 */
	function validateRow(target, index){
		var tr = $.data(target, 'datagrid').options.finder.getTr(target, index);
		if (!tr.hasClass('datagrid-row-editing')){
			return true;
		}
		
		var vbox = tr.find('.validatebox-text');
		vbox.validatebox('validate');
		vbox.trigger('mouseleave');
		var invalidbox = tr.find('.validatebox-invalid');
		return invalidbox.length == 0;
	}
	
	/**
	 * Get changed rows, if state parameter is not assigned, return all changed.
	 * state: inserted,deleted,updated
	 */
	function getChanges(target, state){
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		
		if (!state){
			var rows = [];
			rows = rows.concat(insertedRows);
			rows = rows.concat(deletedRows);
			rows = rows.concat(updatedRows);
			return rows;
		} else if (state == 'inserted'){
			return insertedRows;
		} else if (state == 'deleted'){
			return deletedRows;
		} else if (state == 'updated'){
			return updatedRows;
		}
		
		return [];
	}
	
	function deleteRow(target, index){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		$(target).datagrid('cancelEdit', index);
		
		var row = data.rows[index];
		if (indexOfArray(insertedRows, row) >= 0){
			removeArrayItem(insertedRows, row);
		} else {
			deletedRows.push(row);
		}
		removeArrayItem(selectedRows, opts.idField, data.rows[index][opts.idField]);
		
		opts.view.deleteRow.call(opts.view, target, index);
		if (opts.height == 'auto'){
			fixRowHeight(target);	// adjust the row height
		}
	}
	
	function insertRow(target, param){
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, param.index, param.row);
		bindRowEvents(target);
		insertedRows.push(param.row);
	}
	
	function appendRow(target, row){
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, null, row);
		bindRowEvents(target);
		insertedRows.push(row);
	}
	
	function initChanges(target){
		var data = $.data(target, 'datagrid').data;
		var rows = data.rows;
		var originalRows = [];
		for(var i=0; i<rows.length; i++){
			originalRows.push($.extend({}, rows[i]));
		}
		$.data(target, 'datagrid').originalRows = originalRows;
		$.data(target, 'datagrid').updatedRows = [];
		$.data(target, 'datagrid').insertedRows = [];
		$.data(target, 'datagrid').deletedRows = [];
	}
	
	function acceptChanges(target){
		var data = $.data(target, 'datagrid').data;
		var ok = true;
		for(var i=0,len=data.rows.length; i<len; i++){
			if (validateRow(target, i)){
				endEdit(target, i, false);
			} else {
				ok = false;
			}
		}
		if (ok){
			initChanges(target);
		}
	}
	
	function rejectChanges(target){
		var opts = $.data(target, 'datagrid').options;
		var originalRows = $.data(target, 'datagrid').originalRows;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		var data = $.data(target, 'datagrid').data;
		
		for(var i=0; i<data.rows.length; i++) endEdit(target, i, true);
		
		var selectedIds = [];
		for(var i=0; i<selectedRows.length; i++){
			selectedIds.push(selectedRows[i][opts.idField]);
		}
		selectedRows.splice(0, selectedRows.length);
		
		data.total += deletedRows.length - insertedRows.length;
		data.rows = originalRows
		loadData(target, data);
		for(var i=0; i<selectedIds.length; i++){
			selectRecord(target, selectedIds[i]);
		}
		
		initChanges(target);
	}
	
	/**
	 * request remote data
	 */
	function request(target, params){
		var opts = $.data(target, 'datagrid').options;
		
		if (params) opts.queryParams = params;
		if (!opts.url) return;
		
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		if (opts.onBeforeLoad.call(target, param) == false) return;
		
		$(target).datagrid('loading');
		setTimeout(function(){
			doRequest();
		}, 0);
		
		function doRequest(){
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					setTimeout(function(){
						$(target).datagrid('loaded');
					}, 0);
					loadData(target, data);
					setTimeout(function(){
						initChanges(target);
					}, 0);
				},
				error: function(){
					setTimeout(function(){
						$(target).datagrid('loaded');
					}, 0);
					if (opts.onLoadError){
						opts.onLoadError.apply(target, arguments);
					}
				}
			});
		}
	}
	
	function mergeCells(target, param){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').data.rows;
		
		param.rowspan = param.rowspan || 1;
		param.colspan = param.colspan || 1;
		
		if (param.index < 0 || param.index >= rows.length) return;
		if (param.rowspan == 1 && param.colspan == 1) return;
		
		var value = rows[param.index][param.field];	// the cell value
		
		var tr = opts.finder.getTr(target, param.index);
		var td = tr.find('td[field="'+param.field+'"]');
		td.attr('rowspan', param.rowspan).attr('colspan', param.colspan);
		td.addClass('datagrid-td-merged');
		
		for(var i=1; i<param.colspan; i++){
			td = td.next();
			td.hide();
			rows[param.index][td.attr('field')] = value;
		}
		for(var i=1; i<param.rowspan; i++){
			tr = tr.next();
			var td = tr.find('td[field="'+param.field+'"]').hide();
			rows[param.index + i][td.attr('field')] = value;
			for(var j=1; j<param.colspan; j++){
				td = td.next();
				td.hide();
				rows[param.index + i][td.attr('field')] = value;
			}
		}
		
		setTimeout(function(){
			fixMergedSize(target);
		}, 0);
	}
	
	$.fn.datagrid = function(options, param){
		if (typeof options == 'string'){
			return $.fn.datagrid.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datagrid');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.extend({},$.fn.datagrid.defaults,{queryParams:{}}), $.fn.datagrid.parseOptions(this), options);
				$(this).css('width', '').css('height', '');
				
				var wrapResult = wrapGrid(this, opts.rownumbers);
				if (!opts.columns) opts.columns = wrapResult.columns;
				if (!opts.frozenColumns) opts.frozenColumns = wrapResult.frozenColumns;
				$.data(this, 'datagrid', {
					options: opts,
					panel: wrapResult.panel,
					dc: wrapResult.dc,
					selectedRows: [],
					data: {total:0,rows:[]},
					originalRows: [],
					updatedRows: [],
					insertedRows: [],
					deletedRows: []
				});
			}
			
			buildGrid(this);
			
			if (!state) {
				var data = parseGridData(this);
				if (data.total > 0){
					loadData(this, data);
					initChanges(this);
				}
//				fixColumnSize(this);
			}
			setSize(this);
			
			if (opts.url) {
				request(this);
			}
			
			bindEvents(this);
				
		});
	};
	
	var editors = {
		text: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		textarea: {
			init: function(container, options){
				var input = $('<textarea class="datagrid-editable-input"></textarea>').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		checkbox: {
			init: function(container, options){
				var input = $('<input type="checkbox">').appendTo(container);
				input.val(options.on);
				input.attr('offval', options.off);
				return input;
			},
			getValue: function(target){
				if ($(target).is(':checked')){
					return $(target).val();
				} else {
					return $(target).attr('offval');
				}
			},
			setValue: function(target, value){
				var checked = false;
				if ($(target).val() == value){
					checked = true;
				}
				$.fn.prop ? $(target).prop('checked', checked) : $(target).attr('checked', checked);
			}
		},
		numberbox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.numberbox(options);
				return input;
			},
			destroy: function(target){
				$(target).numberbox('destroy');
			},
			getValue: function(target){
				return $(target).numberbox('getValue');
			},
			setValue: function(target, value){
				$(target).numberbox('setValue', value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		validatebox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.validatebox(options);
				return input;
			},
			destroy: function(target){
				$(target).validatebox('destroy');
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		datebox: {
			init: function(container, options){
				var input = $('<input type="text">').appendTo(container);
				input.datebox(options);
				return input;
			},
			destroy: function(target){
				$(target).datebox('destroy');
			},
			getValue: function(target){
				return $(target).datebox('getValue');
			},
			setValue: function(target, value){
				$(target).datebox('setValue', value);
			},
			resize: function(target, width){
				$(target).datebox('resize', width);
			}
		},
		combobox: {
			init: function(container, options){
				var combo = $('<input type="text">').appendTo(container);
				combo.combobox(options || {});
				return combo;
			},
			destroy: function(target){
				$(target).combobox('destroy');
			},
			getValue: function(target){
				return $(target).combobox('getValue');
			},
			setValue: function(target, value){
				$(target).combobox('setValue', value);
			},
			resize: function(target, width){
				$(target).combobox('resize', width)
			}
		},
		combotree: {
			init: function(container, options){
				var combo = $('<input type="text">').appendTo(container);
				combo.combotree(options);
				return combo;
			},
			destroy: function(target){
				$(target).combotree('destroy');
			},
			getValue: function(target){
				return $(target).combotree('getValue');
			},
			setValue: function(target, value){
				$(target).combotree('setValue', value);
			},
			resize: function(target, width){
				$(target).combotree('resize', width)
			}
		}
	};
	
	$.fn.datagrid.methods = {
		options: function(jq){
			var gopts = $.data(jq[0], 'datagrid').options;
			var popts = $.data(jq[0], 'datagrid').panel.panel('options');
			var opts = $.extend(gopts, {
				width: popts.width,
				height: popts.height,
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
			var pager = jq.datagrid('getPager');
			if (pager.length){
				var pagerOpts = pager.pagination('options');
				$.extend(opts, {
					pageNumber: pagerOpts.pageNumber,
					pageSize: pagerOpts.pageSize
				});
			}
			return opts;
		},
		getPanel: function(jq){
			return $.data(jq[0], 'datagrid').panel;
		},
		getPager: function(jq){
			return $.data(jq[0], 'datagrid').panel.find('div.datagrid-pager');
		},
		getColumnFields: function(jq, frozen){
			return getColumnFields(jq[0], frozen);
		},
		getColumnOption: function(jq, field){
			return getColumnOption(jq[0], field);
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		load: function(jq, params){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				opts.pageNumber = 1;
				var pager = $(this).datagrid('getPager');
				pager.pagination({pageNumber:1});
				request(this, params);
			});
		},
		reload: function(jq, params){
			return jq.each(function(){
				request(this, params);
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				var view = $(this).datagrid('getPanel').children('div.datagrid-view');
				var view1 = view.children('div.datagrid-view1');
				var view2 = view.children('div.datagrid-view2');
				if (footer){
					$.data(this, 'datagrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, view2.find('div.datagrid-footer-inner'), false);
					opts.view.renderFooter.call(opts.view, this, view1.find('div.datagrid-footer-inner'), true);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).datagrid('fixRowHeight');
				}
			});
		},
		loading: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				$(this).datagrid('getPager').pagination('loading');
				if (opts.loadMsg){
					var panel = $(this).datagrid('getPanel');
					$('<div class="datagrid-mask" style="display:block"></div>').appendTo(panel);
					$('<div class="datagrid-mask-msg" style="display:block"></div>').html(opts.loadMsg).appendTo(panel);
					centerLoadingMsg(this);
				}
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				$(this).datagrid('getPager').pagination('loaded');
				var panel = $(this).datagrid('getPanel');
				panel.children('div.datagrid-mask-msg').remove();
				panel.children('div.datagrid-mask').remove();
			});
		},
		fitColumns: function(jq){
			return jq.each(function(){
				fitColumns(this);
			});
		},
		fixColumnSize: function(jq){
			return jq.each(function(){
				fixColumnSize(this);
			});
		},
		fixRowHeight: function(jq, index){
			return jq.each(function(){
				fixRowHeight(this, index);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
				initChanges(this);
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'datagrid').data;
		},
		getRows: function(jq){
			return $.data(jq[0], 'datagrid').data.rows;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'datagrid').footer;
		},
		getRowIndex: function(jq, id){	// id or row record
			return getRowIndex(jq[0], id);
		},
		getSelected: function(jq){
			var rows = getSelectedRows(jq[0]);
			return rows.length>0 ? rows[0] : null;
		},
		getSelections: function(jq){
			return getSelectedRows(jq[0]);
		},
		clearSelections: function(jq){
			return jq.each(function(){
				clearSelections(this);
			});
		},
		selectAll: function(jq){
			return jq.each(function(){
				selectAll(this);
			});
		},
		unselectAll: function(jq){
			return jq.each(function(){
				unselectAll(this);
			});
		},
		selectRow: function(jq, index){
			return jq.each(function(){
				selectRow(this, index);
			});
		},
		selectRecord: function(jq, id){
			return jq.each(function(){
				selectRecord(this, id);
			});
		},
		unselectRow: function(jq, index){
			return jq.each(function(){
				unselectRow(this, index);
			});
		},
		beginEdit: function(jq, index){
			return jq.each(function(){
				beginEdit(this, index);
			});
		},
		endEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, false);
			});
		},
		cancelEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, true);
			});
		},
		getEditors: function(jq, index){
			return getEditors(jq[0], index);
		},
		getEditor: function(jq, param){	// param: {index:0, field:'name'}
			return getEditor(jq[0], param);
		},
		refreshRow: function(jq, index){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.refreshRow.call(opts.view, this, index);
			});
		},
		validateRow: function(jq, index){
			return validateRow(jq[0], index);
//			return jq.each(function(){
//				validateRow(this, index);
//			});
		},
		updateRow: function(jq, param){	// param: {index:1,row:{code:'code1',name:'name1'}}
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.updateRow.call(opts.view, this, param.index, param.row);
			});
		},
		appendRow: function(jq, row){
			return jq.each(function(){
				appendRow(this, row);
			});
		},
		insertRow: function(jq, param){
			return jq.each(function(){
				insertRow(this, param);
			});
		},
		deleteRow: function(jq, index){
			return jq.each(function(){
				deleteRow(this, index);
			});
		},
		getChanges: function(jq, state){
			return getChanges(jq[0], state);	// state: inserted,deleted,updated
		},
		acceptChanges: function(jq){
			return jq.each(function(){
				acceptChanges(this);
			});
		},
		rejectChanges: function(jq){
			return jq.each(function(){
				rejectChanges(this);
			});
		},
		mergeCells: function(jq, param){
			return jq.each(function(){
				mergeCells(this, param);
			});
		},
		showColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').show();
				$(this).datagrid('getColumnOption', field).hidden = false;
				$(this).datagrid('fitColumns');
			});
		},
		hideColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').hide();
				$(this).datagrid('getColumnOption', field).hidden = true;
				$(this).datagrid('fitColumns');
			});
		}
	};
	
	$.fn.datagrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.panel.parseOptions(target), {
			fitColumns: (t.attr('fitColumns') ? t.attr('fitColumns') == 'true' : undefined),
			striped: (t.attr('striped') ? t.attr('striped') == 'true' : undefined),
			nowrap: (t.attr('nowrap') ? t.attr('nowrap') == 'true' : undefined),
			rownumbers: (t.attr('rownumbers') ? t.attr('rownumbers') == 'true' : undefined),
			singleSelect: (t.attr('singleSelect') ? t.attr('singleSelect') == 'true' : undefined),
			pagination: (t.attr('pagination') ? t.attr('pagination') == 'true' : undefined),
			pageSize: (t.attr('pageSize') ? parseInt(t.attr('pageSize')) : undefined),
			pageNumber: (t.attr('pageNumber') ? parseInt(t.attr('pageNumber')) : undefined),
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined),
			remoteSort: (t.attr('remoteSort') ? t.attr('remoteSort') == 'true' : undefined),
			sortName: t.attr('sortName'),
			sortOrder: t.attr('sortOrder'),
			showHeader: (t.attr('showHeader') ? t.attr('showHeader') == 'true' : undefined),
			showFooter: (t.attr('showFooter') ? t.attr('showFooter') == 'true' : undefined),
			scrollbarSize: (t.attr('scrollbarSize') ? parseInt(t.attr('scrollbarSize')) : undefined),
			loadMsg: (t.attr('loadMsg')!=undefined ? t.attr('loadMsg') : undefined),
			idField: t.attr('idField'),
			toolbar: t.attr('toolbar'),
			url: t.attr('url'),
			rowStyler: (t.attr('rowStyler') ? eval(t.attr('rowStyler')) : undefined)
		});
	};
	
	var defaultView = {
		render: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			if (frozen){
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
					return;
				}
			}
			
			var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
			for(var i=0; i<rows.length; i++) {
				// get the class and style attributes for this row
				var cls = (i % 2 && opts.striped) ? 'class="datagrid-row-alt"' : '';
				var styleValue = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : '';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				
				table.push('<tr datagrid-row-index="' + i + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			table.push('</tbody></table>');
			
			$(container).html(table.join(''));
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				table.push('<tr datagrid-row-index="' + i + '">');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, rowIndex, rowData){
			var opts = $.data(target, 'datagrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				var rownumber = rowIndex + 1;
				if (opts.pagination){
					rownumber += (opts.pageNumber-1)*opts.pageSize;
				}
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					// get the cell style attribute
					var styleValue = col.styler ? (col.styler(rowData[field], rowData, rowIndex)||'') : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + style + '>');
					
					var style = 'width:' + (col.boxWidth) + 'px;';
					style += 'text-align:' + (col.align || 'left') + ';';
					style += opts.nowrap == false ? 'white-space:normal;' : '';
					
					cc.push('<div style="' + style + '" ');
					if (col.checkbox){
						cc.push('class="datagrid-cell-check ');
					} else {
						cc.push('class="datagrid-cell ');
					}
					cc.push('">');
					
					if (col.checkbox){
						cc.push('<input type="checkbox"/>');
					} else if (col.formatter){
						cc.push(col.formatter(rowData[field], rowData, rowIndex));
					} else {
						cc.push(rowData[field]);
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, rowIndex){
			var row = {};
			var fields = $(target).datagrid('getColumnFields',true).concat($(target).datagrid('getColumnFields',false));
			for(var i=0; i<fields.length; i++){
				row[fields[i]] = undefined;
			}
			var rows = $(target).datagrid('getRows');
			$.extend(row, rows[rowIndex]);
			this.updateRow.call(this, target, rowIndex, row);
		},
		
		updateRow: function(target, rowIndex, row){
			var opts = $.data(target, 'datagrid').options;
			var rows = $(target).datagrid('getRows');
			
			var tr = opts.finder.getTr(target, rowIndex);
			for(var field in row){
				rows[rowIndex][field] = row[field];
				var td = tr.children('td[field="' + field + '"]');
				var cell = td.find('div.datagrid-cell');
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var styleValue = col.styler ? col.styler(rows[rowIndex][field], rows[rowIndex], rowIndex) : '';
					td.attr('style', styleValue || '');
					if (col.hidden){
						td.hide();
					}
					
					if (col.formatter){
						cell.html(col.formatter(rows[rowIndex][field], rows[rowIndex], rowIndex));
					} else {
						cell.html(rows[rowIndex][field]);
					}
				}
			}
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : '';
			tr.attr('style', styleValue || '');
			$(target).datagrid('fixRowHeight', rowIndex);
		},
		
		insertRow: function(target, index, row){
			var opts = $.data(target, 'datagrid').options;
			var dc = $.data(target, 'datagrid').dc;
			var data = $.data(target, 'datagrid').data;
			
			if (index == undefined || index == null) index = data.rows.length;
			if (index > data.rows.length) index = data.rows.length;
			
			for(var i=data.rows.length-1; i>=index; i--){
				opts.finder.getTr(target, i, 'body', 2).attr('datagrid-row-index', i+1);
				var tr = opts.finder.getTr(target, i, 'body', 1).attr('datagrid-row-index', i+1);
				if (opts.rownumbers){
					tr.find('div.datagrid-cell-rownumber').html(i+2);
				}
			}
			
			var fields1 = $(target).datagrid('getColumnFields', true);
			var fields2 = $(target).datagrid('getColumnFields', false);
			var tr1 = '<tr datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields1, true, index, row) + '</tr>';
			var tr2 = '<tr datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields2, false, index, row) + '</tr>';
			if (index >= data.rows.length){	// append new row
				if (data.rows.length){	// not empty
					opts.finder.getTr(target, '', 'last', 1).after(tr1);
					opts.finder.getTr(target, '', 'last', 2).after(tr2);
				} else {
					dc.body1.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr1 + '</tbody></table>');
					dc.body2.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr2 + '</tbody></table>');
				}
			} else {	// insert new row
				opts.finder.getTr(target, index+1, 'body', 1).before(tr1);
				opts.finder.getTr(target, index+1, 'body', 2).before(tr2);
			}
			
			data.total += 1;
			data.rows.splice(index, 0, row);
			
			this.refreshRow.call(this, target, index);
		},
		
		deleteRow: function(target, index){
			var opts = $.data(target, 'datagrid').options;
			var data = $.data(target, 'datagrid').data;
			
			opts.finder.getTr(target, index).remove();
			for(var i=index+1; i<data.rows.length; i++){
				opts.finder.getTr(target, i, 'body', 2).attr('datagrid-row-index', i-1);
				var tr1 = opts.finder.getTr(target, i, 'body', 1).attr('datagrid-row-index', i-1);
				if (opts.rownumbers){
					tr1.find('div.datagrid-cell-rownumber').html(i);
				}
			}
			
			data.total -= 1;
			data.rows.splice(index,1);
		},
		
		onBeforeRender: function(target, rows){},
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			if (opts.showFooter){
				var footer = $(target).datagrid('getPanel').find('div.datagrid-footer');
				footer.find('div.datagrid-cell-rownumber,div.datagrid-cell-check').css('visibility', 'hidden');
			}
		}
	};
	
	$.fn.datagrid.defaults = $.extend({}, $.fn.panel.defaults, {
		frozenColumns: null,
		columns: null,
		fitColumns: false,
		toolbar: null,
		striped: false,
		method: 'post',
		nowrap: true,
		idField: null,
		url: null,
		loadMsg: 'Processing, please wait ...',
		rownumbers: false,
		singleSelect: false,
		pagination: false,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10,20,30,40,50],
		queryParams: {},
		sortName: null,
		sortOrder: 'asc',
		remoteSort: true,
		showHeader: true,
		showFooter: false,
		scrollbarSize: 18,
		rowStyler: function(rowIndex, rowData){},	// return style such as 'background:red'
		loadFilter: function(data){
			if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
				return {
					total: data.length,
					rows: data
				};
			} else {
				return data;
			}
		},
		
		editors: editors,
		finder:{
			getTr:function(target, index, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var dc = $.data(target, 'datagrid').dc;	// data container
				var opts = $.data(target, 'datagrid').options;
				if (serno == 0){
					var tr1 = opts.finder.getTr(target, index, type, 1);
					var tr2 = opts.finder.getTr(target, index, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index='+index+']');
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index='+index+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-selected');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr:last[datagrid-row-index]');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index]');
					}
				}
			},
			getRow:function(target, index){
				return $.data(target, 'datagrid').data.rows[index];
			}
		},
		view: defaultView,
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onClickRow: function(rowIndex, rowData){},
		onDblClickRow: function(rowIndex, rowData){},
		onClickCell: function(rowIndex, field, value){},
		onDblClickCell: function(rowIndex, field, value){},
		onSortColumn: function(sort, order){},
		onResizeColumn: function(field, width){},
		onSelect: function(rowIndex, rowData){},
		onUnselect: function(rowIndex, rowData){},
		onSelectAll: function(rows){},
		onUnselectAll: function(rows){},
		onBeforeEdit: function(rowIndex, rowData){},
		onAfterEdit: function(rowIndex, rowData, changes){},
		onCancelEdit: function(rowIndex, rowData){},
		onHeaderContextMenu: function(e, field){},
		onRowContextMenu: function(e, rowIndex, rowData){}
	});
})(jQuery);/**
 * treegrid - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	/**
	 * Get the index of array item, return -1 when the item is not found.
	 */
	function indexOfArray(a,o){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i] == o) return i;
		}
		return -1;
	}
	/**
	 * Remove array item, 'o' parameter can be item object or id field name.
	 * When 'o' parameter is the id field name, the 'id' parameter is valid.
	 */
	function removeArrayItem(a,o){
		var index = indexOfArray(a,o);
		if (index != -1){
			a.splice(index, 1);
		}
	}
	
	function buildGrid(target){
		var opts = $.data(target, 'treegrid').options;
		$(target).datagrid($.extend({}, opts, {
			url: null,
			onLoadSuccess: function(){},
			onResizeColumn: function(field, width){
				setRowHeight(target);
				opts.onResizeColumn.call(target, field, width);
			},
			onSortColumn: function(sort,order){
				opts.sortName = sort;
				opts.sortOrder = order;
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $(target).treegrid('getData');
					loadData(target, 0, data);
				}
				opts.onSortColumn.call(target, sort, order);
			},
			onBeforeEdit: function(index, row){
				if (opts.onBeforeEdit.call(target, row) == false) return false;
			},
			onAfterEdit:function(index,row,changes){
				bindEvents(target);
				opts.onAfterEdit.call(target, row, changes);
			},
			onCancelEdit:function(index,row){
				bindEvents(target);
				opts.onCancelEdit.call(target, row);
			}
		}));
		if (opts.pagination){
			var pager = $(target).datagrid('getPager');
			pager.pagination({
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
	}
	
	function setRowHeight(target, idValue){
		var opts = $.data(target, 'datagrid').options;
		var panel = $.data(target, 'datagrid').panel;
		
		var view = panel.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		if (opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length>0)){
			if (idValue){
				setHeight(idValue);
				view2.find('tr[node-id=' + idValue + ']').next('tr.treegrid-tr-tree').find('tr[node-id]').each(function(){
					setHeight($(this).attr('node-id'));
				});
			} else {
				view2.find('tr[node-id]').each(function(){
					setHeight($(this).attr('node-id'));
				});
				if (opts.showFooter){
					var footRows = $.data(target, 'datagrid').footer || [];
					for(var i=0; i<footRows.length; i++){
						setHeight(footRows[i][opts.idField]);
					}
					$(target).datagrid('resize');
				}
			}
		}
		if (opts.height == 'auto'){
			var body1 = view1.children('div.datagrid-body');
			var body2 = view2.children('div.datagrid-body');
			var height = 0;
			var width = 0;
			body2.children().each(function(){
				var c = $(this);
				if (c.is(':visible')){
					height += c.outerHeight();
					if (width < c.outerWidth()){
						width = c.outerWidth();
					}
				}
			});
			if (width > body2.width()){
				height += 18;	// add the horizontal scroll height
			}
			body1.height(height);
			body2.height(height);
			view.height(view2.height());
		}
		view2.children('div.datagrid-body').triggerHandler('scroll');
		
		function setHeight(idValue){
			var tr1 = view1.find('tr[node-id='+idValue+']');
			var tr2 = view2.find('tr[node-id='+idValue+']');
			tr1.css('height', '');
			tr2.css('height', '');
			var height = Math.max(tr1.height(), tr2.height());
			tr1.css('height', height);
			tr2.css('height', height);
		}
	}
	
	function setRowNumbers(target){
		var opts = $.data(target, 'treegrid').options;
		if (!opts.rownumbers) return;
		$(target).datagrid('getPanel').find('div.datagrid-view1 div.datagrid-body div.datagrid-cell-rownumber').each(function(i){
			var rownumber = i + 1;
//			if (opts.pagination){
//				rownumber += (opts.pageNumber-1)*opts.pageSize;
//			}
			$(this).html(rownumber);
		});
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'treegrid').options;
		var panel = $(target).datagrid('getPanel');
		var body = panel.find('div.datagrid-body');
		body.find('span.tree-hit').unbind('.treegrid').bind('click.treegrid', function(){
			var tr = $(this).parent().parent().parent();
			var id = tr.attr('node-id');
			toggle(target, id);
			return false;
		}).bind('mouseenter.treegrid', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).addClass('tree-expanded-hover');
			} else {
				$(this).addClass('tree-collapsed-hover');
			}
		}).bind('mouseleave.treegrid', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).removeClass('tree-expanded-hover');
			} else {
				$(this).removeClass('tree-collapsed-hover');
			}
		});
		
		body.find('tr[node-id]').unbind('.treegrid').bind('mouseenter.treegrid', function(){
			var id = $(this).attr('node-id');
			body.find('tr[node-id=' + id + ']').addClass('datagrid-row-over');
		}).bind('mouseleave.treegrid', function(){
			var id = $(this).attr('node-id');
			body.find('tr[node-id=' + id + ']').removeClass('datagrid-row-over');
		}).bind('click.treegrid', function(){
			var id = $(this).attr('node-id');
			if (opts.singleSelect){
				unselectAll(target);
				select(target, id);
			} else {
				if ($(this).hasClass('datagrid-row-selected')){
					unselect(target, id);
				} else {
					select(target, id);
				}
			}
			opts.onClickRow.call(target, find(target, id));
		}).bind('dblclick.treegrid', function(){
			var id = $(this).attr('node-id');
			opts.onDblClickRow.call(target, find(target, id));
		}).bind('contextmenu.treegrid', function(e){
			var id = $(this).attr('node-id');
			opts.onContextMenu.call(target, e, find(target, id));
		});
		
		body.find('div.datagrid-cell-check input[type=checkbox]').unbind('.treegrid').bind('click.treegrid', function(e){
			var id = $(this).parent().parent().parent().attr('node-id');
			if (opts.singleSelect){
				unselectAll(target);
				select(target, id);
			} else {
				if ($(this).attr('checked')){
					select(target, id);
				} else {
					unselect(target, id);
				}
			}
			e.stopPropagation();
		});
		
		var header = panel.find('div.datagrid-header');
		header.find('input[type=checkbox]').unbind().bind('click.treegrid', function(){
			if (opts.singleSelect) return false;
			if ($(this).attr('checked')){
				selectAll(target);
			} else {
				unselectAll(target);
			}
		});
	}
	
	/**
	 * create sub tree
	 * parentId: the node id value
	 */
	function createSubTree(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var view = $(target).datagrid('getPanel').children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		var tr1 = view1.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
		var tr2 = view2.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
		var colspan1 = $(target).datagrid('getColumnFields', true).length + (opts.rownumbers?1:0);
		var colspan2 = $(target).datagrid('getColumnFields', false).length;

		_create(tr1, colspan1);
		_create(tr2, colspan2);
		
		function _create(tr, colspan){
			$('<tr class="treegrid-tr-tree">' +
					'<td style="border:0px" colspan="' + colspan + '">' +
					'<div></div>' +
					'</td>' +
				'</tr>').insertAfter(tr);
		}
	}
	
	/**
	 * load data to specified node.
	 */
	function loadData(target, parentId, data, append){
		var opts = $.data(target, 'treegrid').options;
		data = opts.loadFilter.call(target, data, parentId);
		
		var wrap = $.data(target, 'datagrid').panel;
		var view = wrap.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		
		var node = find(target, parentId);
		if (node){
			var node1 = view1.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
			var node2 = view2.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
			var cc1 = node1.next('tr.treegrid-tr-tree').children('td').children('div');
			var cc2 = node2.next('tr.treegrid-tr-tree').children('td').children('div');
		} else {
			var cc1 = view1.children('div.datagrid-body').children('div.datagrid-body-inner');
			var cc2 = view2.children('div.datagrid-body');
		}
		if (!append){
			$.data(target, 'treegrid').data = [];
			cc1.empty();
			cc2.empty();
		}
		
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, parentId, data);
		}
		opts.view.render.call(opts.view, target, cc1, true);
		opts.view.render.call(opts.view, target, cc2, false);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, view1.find('div.datagrid-footer-inner'), true);
			opts.view.renderFooter.call(opts.view, target, view2.find('div.datagrid-footer-inner'), false);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		opts.onLoadSuccess.call(target, node, data);
		
		// reset the pagination
		if (!parentId && opts.pagination){
			var total = $.data(target, 'treegrid').total;
			var pager = $(target).datagrid('getPager');
			if (pager.pagination('options').total != total){
				pager.pagination({total:total});
			}
		}
		
		setRowHeight(target);
		setRowNumbers(target);
		setCheckboxColumn();
		bindEvents(target);
		
		
		function setCheckboxColumn(){
			var header = view.find('div.datagrid-header');
			var body = view.find('div.datagrid-body');
			var headerCheck = header.find('div.datagrid-header-check');
			if (headerCheck.length){
				var ck = body.find('div.datagrid-cell-check');
				if ($.boxModel){
					ck.width(headerCheck.width());
					ck.height(headerCheck.height());
				} else {
					ck.width(headerCheck.outerWidth());
					ck.height(headerCheck.outerHeight());
				}
			}
		}
	}
	
	function request(target, parentId, params, append, callback){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		
		if (params) opts.queryParams = params;
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		var row = find(target, parentId);
		
		if (opts.onBeforeLoad.call(target, row, param) == false) return;
		if (!opts.url) return;
		
		var folder = body.find('tr[node-id=' + parentId + '] span.tree-folder');
		folder.addClass('tree-loading');
		$(target).treegrid('loading');
		$.ajax({
			type: opts.method,
			url: opts.url,
			data: param,
			dataType: 'json',
			success: function(data){
				folder.removeClass('tree-loading');
				$(target).treegrid('loaded');
				loadData(target, parentId, data, append);
				if (callback) {
					callback();
				}
			},
			error: function(){
				folder.removeClass('tree-loading');
				$(target).treegrid('loaded');
				opts.onLoadError.apply(target, arguments);
				if (callback){
					callback();
				}
			}
		});
	}
	
	function getRoot(target){
		var rows = getRoots(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getRoots(target){
		return $.data(target, 'treegrid').data;
	}
	
	function getParent(target, idValue){
		var row = find(target, idValue);
		if (row._parentId){
			return find(target, row._parentId);
		} else {
			return null;
		}
	}
	
	function getChildren(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-view2 div.datagrid-body');
		var nodes = [];
		if (parentId){
			getNodes(parentId);
		} else {
			var roots = getRoots(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes(roots[i][opts.idField]);
			}
		}
		
		function getNodes(parentId){
			var pnode = find(target, parentId);
			if (pnode && pnode.children){
				for(var i=0,len=pnode.children.length; i<len; i++){
					var cnode = pnode.children[i];
					nodes.push(cnode);
					getNodes(cnode[opts.idField]);
				}
			}
		}
		
		return nodes;
	}
	
	function getSelected(target){
		var rows = getSelections(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getSelections(target){
		var rows = [];
		var panel = $(target).datagrid('getPanel');
		panel.find('div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected').each(function(){
			var id = $(this).attr('node-id');
			rows.push(find(target, id));
		});
		return rows;
	}
	
	function getLevel(target, idValue){
		if (!idValue) return 0;
		var opts = $.data(target, 'treegrid').options;
		var view = $(target).datagrid('getPanel').children('div.datagrid-view');
		var node = view.find('div.datagrid-body tr[node-id=' + idValue + ']').children('td[field=' + opts.treeField + ']');
		return node.find('span.tree-indent,span.tree-hit').length;
	}
	
	function find(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var data = $.data(target, 'treegrid').data;
		var cc = [data];
		while(cc.length){
			var c = cc.shift();
			for(var i=0; i<c.length; i++){
				var node = c[i];
				if (node[opts.idField] == idValue){
					return node;
				} else if (node['children']){
					cc.push(node['children']);
				}
			}
		}
		return null;
	}
	
	function select(target, idValue){
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		tr.addClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', true);
	}
	
	function unselect(target, idValue){
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		tr.removeClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', false);
	}
	
	function selectAll(target){
		var tr = $(target).datagrid('getPanel').find('div.datagrid-body tr[node-id]');
		tr.addClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', true);
	}
	
	function unselectAll(target){
		var tr = $(target).datagrid('getPanel').find('div.datagrid-body tr[node-id]');
		tr.removeClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', false);
	}
	
	function collapse(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var row = find(target, idValue);
		var tr = body.find('tr[node-id=' + idValue + ']');
		var hit = tr.find('span.tree-hit');
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		if (opts.onBeforeCollapse.call(target, row) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		row.state = 'closed';
		tr = tr.next('tr.treegrid-tr-tree');
		var cc = tr.children('td').children('div');
		if (opts.animate){
			cc.slideUp('normal', function(){
				setRowHeight(target, idValue);
				opts.onCollapse.call(target, row);
			});
		} else {
			cc.hide();
			setRowHeight(target, idValue);
			opts.onCollapse.call(target, row);
		}
	}
	
	function expand(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		var hit = tr.find('span.tree-hit');
		var row = find(target, idValue);
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		if (opts.onBeforeExpand.call(target, row) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var subtree = tr.next('tr.treegrid-tr-tree');
		if (subtree.length){
			var cc = subtree.children('td').children('div');
			_expand(cc);
		} else {
			createSubTree(target, row[opts.idField]);
			var subtree = tr.next('tr.treegrid-tr-tree');
			var cc = subtree.children('td').children('div');
			cc.hide();
			request(target, row[opts.idField], {id:row[opts.idField]}, true, function(){
				_expand(cc);
			});
		}
		
		function _expand(cc){
			row.state = 'open';
			if (opts.animate){
				cc.slideDown('normal', function(){
					setRowHeight(target, idValue);
					opts.onExpand.call(target, row);
				});
			} else {
				cc.show();
				setRowHeight(target, idValue);
				opts.onExpand.call(target, row);
			}
		}
	}
	
	function toggle(target, idValue){
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		var hit = tr.find('span.tree-hit');
		if (hit.hasClass('tree-expanded')){
			collapse(target, idValue);
		} else {
			expand(target, idValue);
		}
	}
	
	function collapseAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			collapse(target, nodes[i][opts.idField]);
		}
	}
	
	function expandAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			expand(target, nodes[i][opts.idField]);
		}
	}
	
	function expandTo(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var ids = [];
		var p = getParent(target, idValue);
		while(p){
			var id = p[opts.idField];
			ids.unshift(id);
			p = getParent(target, id);
		}
		for(var i=0; i<ids.length; i++){
			expand(target, ids[i]);
		}
	}
	
	function append(target, param){
		var opts = $.data(target, 'treegrid').options;
		if (param.parent){
			var body = $(target).datagrid('getPanel').find('div.datagrid-body');
			var tr = body.find('tr[node-id=' + param.parent + ']');
			if (tr.next('tr.treegrid-tr-tree').length == 0){
				createSubTree(target, param.parent);
			}
			var cell = tr.children('td[field=' + opts.treeField + ']').children('div.datagrid-cell');
			var nodeIcon = cell.children('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		loadData(target, param.parent, param.data, true);
	}
	
	/**
	 * remove the specified node
	 */
	function remove(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		tr.next('tr.treegrid-tr-tree').remove();
		tr.remove();
		
		var pnode = del(idValue);
		if (pnode){
			if (pnode.children.length == 0){
				tr = body.find('tr[node-id=' + pnode[opts.treeField] + ']');
				var cell = tr.children('td[field=' + opts.treeField + ']').children('div.datagrid-cell');
				cell.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
				cell.find('.tree-hit').remove();
				$('<span class="tree-indent"></span>').prependTo(cell);
			}
		}
		
		setRowNumbers(target);
		
		/**
		 * delete the specified node, return its parent node
		 */
		function del(id){
			var cc;
			var pnode = getParent(target, idValue);
			if (pnode){
				cc = pnode.children;
			} else {
				cc = $(target).treegrid('getData');
			}
			for(var i=0; i<cc.length; i++){
				if (cc[i][opts.treeField] == id){
					cc.splice(i, 1);
					break;
				}
			}
			return pnode;
		}
	}
	
	
	$.fn.treegrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.treegrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
//			return $.fn.treegrid.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'treegrid');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'treegrid', {
					options: $.extend({}, $.fn.treegrid.defaults, $.fn.treegrid.parseOptions(this), options),
					data:[]
				});
			}
			
			buildGrid(this);
			request(this);
		});
	};
	
	$.fn.treegrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'treegrid').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				$(this).datagrid('resize', param);
			});
		},
		fixRowHeight: function(jq, idValue){
			return jq.each(function(){
				setRowHeight(this, idValue);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, null, data);
			});
		},
		reload: function(jq, id){
			return jq.each(function(){
				if (id){
					var node = $(this).treegrid('find', id);
					if (node.children){
						node.children.splice(0, node.children.length);
					}
					var body = $(this).datagrid('getPanel').find('div.datagrid-body');
					var tr = body.find('tr[node-id=' + id + ']');
					tr.next('tr.treegrid-tr-tree').remove();
					var hit = tr.find('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					expand(this, id);
				} else {
					request(this, null, {});
//					request(this);
				}
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				var view = $(this).datagrid('getPanel').children('div.datagrid-view');
				var view1 = view.children('div.datagrid-view1');
				var view2 = view.children('div.datagrid-view2');
				if (footer){
					$.data(this, 'treegrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, view1.find('div.datagrid-footer-inner'), true);
					opts.view.renderFooter.call(opts.view, this, view2.find('div.datagrid-footer-inner'), false);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).treegrid('fixRowHeight');
				}
			});
		},
		loading: function(jq){
			return jq.each(function(){
				$(this).datagrid('loading');
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				$(this).datagrid('loaded');
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'treegrid').data;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'treegrid').footer;
		},
		getRoot: function(jq){
			return getRoot(jq[0]);
		},
		getRoots: function(jq){
			return getRoots(jq[0]);
		},
		getParent: function(jq, id){
			return getParent(jq[0], id);
		},
		getChildren: function(jq, id){
			return getChildren(jq[0], id);
		},
		getSelected: function(jq){
			return getSelected(jq[0]);
		},
		getSelections: function(jq){
			return getSelections(jq[0]);
		},
		getLevel: function(jq, id){
			return getLevel(jq[0], id);
		},
		find: function(jq, id){
			return find(jq[0], id);
		},
		isLeaf: function(jq, id){
			var opts = $.data(jq[0], 'treegrid').options;
			var tr = opts.finder.getTr(jq[0], id);
			var hit = tr.find('span.tree-hit');
			return hit.length == 0;
		},
		select: function(jq, id){
			return jq.each(function(){
				select(this, id);
			});
		},
		unselect: function(jq, id){
			return jq.each(function(){
				unselect(this, id);
			});
		},
		selectAll: function(jq){
			return jq.each(function(){
				selectAll(this);
			});
		},
		unselectAll: function(jq){
			return jq.each(function(){
				unselectAll(this);
			});
		},
		collapse: function(jq, id){
			return jq.each(function(){
				collapse(this, id);
			});
		},
		expand: function(jq, id){
			return jq.each(function(){
				expand(this, id);
			});
		},
		toggle: function(jq, id){
			return jq.each(function(){
				toggle(this, id);
			});
		},
		collapseAll: function(jq, id){
			return jq.each(function(){
				collapseAll(this, id);
			});
		},
		expandAll: function(jq, id){
			return jq.each(function(){
				expandAll(this, id);
			});
		},
		expandTo: function(jq, id){
			return jq.each(function(){
				expandTo(this, id);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				append(this, param);
			});
		},
		remove: function(jq, id){
			return jq.each(function(){
				remove(this, id);
			});
		},
		refresh: function(jq, id){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				opts.view.refreshRow.call(opts.view, this, id);
			});
		},
		beginEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('beginEdit', id);
				$(this).treegrid('fixRowHeight', id);
			});
		},
		endEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('endEdit', id);
			});
		},
		cancelEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('cancelEdit', id);
			});
		}
	};
	
	$.fn.treegrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datagrid.parseOptions(target), {
			treeField:t.attr('treeField'),
			animate:(t.attr('animate') ? t.attr('animate') == 'true' : undefined)
		});
	};
	
	var defaultView = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			var view = this;
			var table = getTreeData(frozen, this.treeLevel, this.treeNodes);
			$(container).append(table.join(''));
			
			function getTreeData(frozen, depth, children){
				var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
				for(var i=0; i<children.length; i++){
					var row = children[i];
					if (row.state != 'open' && row.state != 'closed'){
						row.state = 'open';
					}
					
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					table.push('<tr node-id=' + row[opts.idField] + ' ' + style + '>');
					table = table.concat(view.renderRow.call(view, target, fields, frozen, depth, row));
					table.push('</tr>');
					
					if (row.children && row.children.length){
						var tt = getTreeData(frozen, depth+1, row.children);
						var v = row.state == 'closed' ? 'none' : 'block';
						
						table.push('<tr class="treegrid-tr-tree"><td style="border:0px" colspan=' + (fields.length + (opts.rownumbers?1:0)) + '><div style="display:' + v + '">');
						table = table.concat(tt);
						table.push('</div></td></tr>');
					}
				}
				table.push('</tbody></table>');
				return table;
			}
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var rows = $.data(target, 'treegrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				row[opts.idField] = row[opts.idField] || ('foot-row-id'+i);
				
				table.push('<tr node-id=' + row[opts.idField] + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, 0, row));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, depth, row){
			var opts = $.data(target, 'treegrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">0</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					// get the cell style attribute
					var styleValue = col.styler ? (col.styler(row[field], row)||'') : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + style + '>');
					
					var style = 'width:' + (col.boxWidth) + 'px;';
					style += 'text-align:' + (col.align || 'left') + ';';
					style += opts.nowrap == false ? 'white-space:normal;' : '';
					
					cc.push('<div style="' + style + '" ');
					if (col.checkbox){
						cc.push('class="datagrid-cell-check ');
					} else {
						cc.push('class="datagrid-cell ');
					}
					cc.push('">');
					
					if (col.checkbox){
						if (row.checked){
							cc.push('<input type="checkbox" checked="checked"/>');
						} else {
							cc.push('<input type="checkbox"/>');
						}
					} else {
						var val = null;
						if (col.formatter){
							val = col.formatter(row[field], row);
						} else {
							val = row[field] || '&nbsp;';
						}
						if (field == opts.treeField){
							for(var j=0; j<depth; j++){
								cc.push('<span class="tree-indent"></span>');
							}
							if (row.state == 'closed'){
								cc.push('<span class="tree-hit tree-collapsed"></span>');
								cc.push('<span class="tree-icon tree-folder ' + (row.iconCls?row.iconCls:'') + '"></span>');
							} else {
								if (row.children && row.children.length){
									cc.push('<span class="tree-hit tree-expanded"></span>');
									cc.push('<span class="tree-icon tree-folder tree-folder-open ' + (row.iconCls?row.iconCls:'') + '"></span>');
								} else {
									cc.push('<span class="tree-indent"></span>');
									cc.push('<span class="tree-icon tree-file ' + (row.iconCls?row.iconCls:'') + '"></span>');
								}
							}
							cc.push('<span class="tree-title">' + val + '</span>');
						} else {
							cc.push(val);
						}
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, id){
			var row = $(target).treegrid('find', id);
			var opts = $.data(target, 'treegrid').options;
			var body = $(target).datagrid('getPanel').find('div.datagrid-body');
			
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
			var style = styleValue ? styleValue : '';
//			var style = styleValue ? 'style="' + styleValue + '"' : '';
			var tr = body.find('tr[node-id=' + id + ']');
			tr.attr('style', style);
			tr.children('td').each(function(){
				var cell = $(this).find('div.datagrid-cell');
				var field = $(this).attr('field');
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var styleValue = col.styler ? (col.styler(row[field], row)||'') : '';
					var style = col.hidden ? 'display:none;' + styleValue : (styleValue ? styleValue : '');
//					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					$(this).attr('style', style);
					
					var val = null;
					if (col.formatter){
						val = col.formatter(row[field], row);
					} else {
						val = row[field] || '&nbsp;';
					}
					if (field == opts.treeField){
						cell.children('span.tree-title').html(val);
						var cls = 'tree-icon';
						var icon = cell.children('span.tree-icon');
						if (icon.hasClass('tree-folder')) cls += ' tree-folder';
						if (icon.hasClass('tree-folder-open')) cls += ' tree-folder-open';
						if (icon.hasClass('tree-file')) cls += ' tree-file';
						if (row.iconCls) cls += ' ' + row.iconCls;
						icon.attr('class', cls);
					} else {
						cell.html(val);
					}
				}
			});
			$(target).treegrid('fixRowHeight', id);
		},
		
		onBeforeRender: function(target, parentId, data){
			if (!data) return false;
			var opts = $.data(target, 'treegrid').options;
			if (data.length == undefined){
				if (data.footer){
					$.data(target, 'treegrid').footer = data.footer;
				}
				if (data.total){
					$.data(target, 'treegrid').total = data.total;
				}
				data = this.transfer(target, parentId, data.rows);
			} else {
				function setParent(children, parentId){
					for(var i=0; i<children.length; i++){
						var row = children[i];
						row._parentId = parentId;
						if (row.children && row.children.length){
							setParent(row.children, row[opts.idField]);
						}
					}
				}
				setParent(data, parentId);
			}
			
			var node = find(target, parentId);
			if (node){
				if (node.children){
					node.children = node.children.concat(data);
				} else {
					node.children = data;
				}
			} else {
				$.data(target, 'treegrid').data = $.data(target, 'treegrid').data.concat(data);
			}
			if (!opts.remoteSort){
				this.sort(target, data);
			}
			
			this.treeNodes = data;
			this.treeLevel = $(target).treegrid('getLevel', parentId);
		},
		
		sort: function(target, data){
			var opts = $.data(target, 'treegrid').options;
			var opt = $(target).treegrid('getColumnOption', opts.sortName);
			if (opt){
				var sortFunc = opt.sorter || function(a,b){
					return (a>b?1:-1);
				};
				_sort(data);
			}
			function _sort(rows){
				rows.sort(function(r1,r2){
					return sortFunc(r1[opts.sortName], r2[opts.sortName])*(opts.sortOrder=='asc'?1:-1);
				});
				for(var i=0; i<rows.length; i++){
					var children = rows[i].children;
					if (children && children.length){
						_sort(children);
					}
				}
			}
		},
		
		transfer: function(target, parentId, data){
			var opts = $.data(target, 'treegrid').options;
			
			// clone the original data rows
			var rows = [];
			for(var i=0; i<data.length; i++){
				rows.push(data[i]);
			}
			
			var nodes = [];
			// get the top level nodes
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				if (!parentId){
					if (!row._parentId){
						nodes.push(row);
//						rows.remove(row);
						removeArrayItem(rows,row);
						i--;
					}
				} else {
					if (row._parentId == parentId){
						nodes.push(row);
//						rows.remove(row);
						removeArrayItem(rows,row);
						i--;
					}
				}
			}
			
			var toDo = [];
			for(var i=0; i<nodes.length; i++){
				toDo.push(nodes[i]);
			}
			while(toDo.length){
				var node = toDo.shift();	// the parent node
				// get the children nodes
				for(var i=0; i<rows.length; i++){
					var row = rows[i];
					if (row._parentId == node[opts.idField]){
						if (node.children){
							node.children.push(row);
						} else {
							node.children = [row];
						}
						toDo.push(row);
//						rows.remove(row);
						removeArrayItem(rows,row);
						i--;
					}
				}
			}
			return nodes;
		}
	});
	
	$.fn.treegrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		treeField:null,
		animate: false,
		singleSelect: true,
		view: defaultView,
		loadFilter: function(data, parentId){
			return data;
		},
		finder:{
			getTr:function(target, id, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var dc = $.data(target, 'datagrid').dc;	// data container
				if (serno == 0){
					var opts = $.data(target, 'treegrid').options;
					var tr1 = opts.finder.getTr(target, id, type, 1);
					var tr2 = opts.finder.getTr(target, id, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						return (serno==1?dc.body1:dc.body2).find('tr[node-id='+id+']');
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id='+id+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-selected');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('tr:last[node-id]');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('tr[node-id]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id]');
					}
				}
			},
			getRow:function(target, id){
				return $(target).treegrid('find', id);
			}
		},
		
		onBeforeLoad: function(row, param){},
		onLoadSuccess: function(row, data){},
		onLoadError: function(){},
		onBeforeCollapse: function(row){},
		onCollapse: function(row){},
		onBeforeExpand: function(row){},
		onExpand: function(row){},
		onClickRow: function(row){},
		onDblClickRow: function(row){},
		onContextMenu: function(e, row){},
		onBeforeEdit: function(row){},
		onAfterEdit: function(row, changes){},
		onCancelEdit: function(row){}
	});
})(jQuery);/**
 * propertygrid - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	function buildGrid(target){
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			view:(opts.showGroup ? groupview : undefined),
			onClickRow:function(index, row){
				if (opts.editIndex != index){
					var col = $(this).datagrid('getColumnOption', "value");
					col.editor = row.editor;
					leaveRow(opts.editIndex);
					$(this).datagrid('beginEdit', index);
					$(this).datagrid('getEditors', index)[0].target.focus();
					opts.editIndex = index;
				}
				opts.onClickRow.call(target, index, row);
			}
		}));
		$(target).datagrid('getPanel').panel('panel').addClass('propertygrid');
		$(target).datagrid('getPanel').find('div.datagrid-body').unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
			e.stopPropagation();
		});
		$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(){
			leaveRow(opts.editIndex);
			opts.editIndex = undefined;
		});
		
		function leaveRow(index){
			if (index == undefined) return;
			var t = $(target);
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		}
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'propertygrid', {
					options: $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options)
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datagrid.parseOptions(target), {
			showGroup:(t.attr('showGroup') ? t.attr('showGroup')=='true' : undefined)
		});
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			var index = 0;
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				
				table.push('<div class="datagrid-group" group-index=' + i + '>');
				table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
				table.push('<tr>');
				table.push('<td style="border:0;">');
				if (!frozen){
					table.push('<span>');
					table.push(opts.groupFormatter.call(target, group.fvalue, group.rows));
					table.push('</span>');
				}
				table.push('</td>');
				table.push('</tr>');
				table.push('</tbody></table>');
				table.push('</div>');
				
				table.push('<table cellspacing="0" cellpadding="0" border="0"><tbody>');
				for(var j=0; j<group.rows.length; j++) {
					// get the class and style attributes for this row
					var cls = (index % 2 && opts.striped) ? 'class="datagrid-row-alt"' : '';
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					
					table.push('<tr datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
					table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
					table.push('</tr>');
					index++;
				}
				table.push('</tbody></table>');
			}
			
			$(container).html(table.join(''));
		},
		
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			var view = $(target).datagrid('getPanel').find('div.datagrid-view');
			var view1 = view.children('div.datagrid-view1');
			var view2 = view.children('div.datagrid-view2');
			
			$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
			
			if (opts.rownumbers || opts.frozenColumns.length){
				var group = view1.find('div.datagrid-group');
			} else {
				var group = view2.find('div.datagrid-group');
			}
			$('<td style="border:0"><div class="datagrid-row-expander datagrid-row-collapse" style="width:25px;height:16px;cursor:pointer"></div></td>').insertBefore(group.find('td'));
			
			view.find('div.datagrid-group').each(function(){
				var groupIndex = $(this).attr('group-index');
				$(this).find('div.datagrid-row-expander').bind('click', {groupIndex:groupIndex}, function(e){
					var group = view.find('div.datagrid-group[group-index=' + e.data.groupIndex + ']');
					if ($(this).hasClass('datagrid-row-collapse')){
						$(this).removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
						group.next('table').hide();
					} else {
						$(this).removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
						group.next('table').show();
					}
					$(target).datagrid('fixRowHeight');
				});
			});
		},
		
		onBeforeRender: function(target, rows){
			var opts = $.data(target, 'datagrid').options;
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						fvalue: row[opts.groupField],
						rows: [row],
						startRow: i
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			function getGroup(fvalue){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.fvalue == fvalue){
						return group;
					}
				}
				return null;
			}
			
			this.groups = groups;
			
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				for(var j=0; j<group.rows.length; j++){
					newRows.push(group.rows[j]);
				}
			}
			$.data(target, 'datagrid').data.rows = newRows;
		}
	});
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupField:'group',
		groupFormatter:function(fvalue){return fvalue}
	});
	/*
	$.extend($.fn.propertygrid.defaults.editors, {
		'boolean':{
			init:function(container,options){
				var s = $('<select><option>true</option><option>false</option></select>').appendTo(container);
				return s;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value+'');
			},
			resize:function(target,width){
				$(target).width(width);
			}
		}
	});
	*/
})(jQuery);/**
 * layout - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   resizable
 *   panel
 */
var  setGridWidth ;

(function($){
	var resizing = false;	// indicate if the region panel is resizing


	function setSize(container){
		var opts = $.data(container, 'layout').options;
		var panels = $.data(container, 'layout').panels;

		var cc = $(container);
		
		if (opts.fit == true){
			var p = cc.parent();
			cc.width(p.width()).height(p.height());
		}
		var cpos = {
			top:0,
			left:0,
			width:cc.width(),
			height:cc.height()
		};

		// set north panel size
		function setNorthSize(pp){
			if (pp.length == 0) return;
			pp.panel('resize', {
				width: cc.width(),
				height: pp.panel('options').height,
				left: 0,
				top: 0
			});
			cpos.top += pp.panel('options').height;
			cpos.height -= pp.panel('options').height;
		}
		if (isVisible(panels.expandNorth)){
			setNorthSize(panels.expandNorth);
		} else {
			setNorthSize(panels.north);
		}
		
		// set south panel size
		function setSouthSize(pp){
			if (pp.length == 0) return;
			pp.panel('resize', {
				width: cc.width(),
				height: pp.panel('options').height,
				left: 0,
				top: cc.height() - pp.panel('options').height
			});
			cpos.height -= pp.panel('options').height;
		}
		if (isVisible(panels.expandSouth)){
			setSouthSize(panels.expandSouth);
		} else {
			setSouthSize(panels.south);
		}
		
		// set east panel size
		function setEastSize(pp){
			if (pp.length == 0) return;
			pp.panel('resize', {
				width: pp.panel('options').width,
				height: cpos.height,
				left: cc.width() - pp.panel('options').width,
				top: cpos.top
			});
			cpos.width -= pp.panel('options').width;
		}
		if (isVisible(panels.expandEast)){
			setEastSize(panels.expandEast);
		} else {
			setEastSize(panels.east);
		}
		
		// set west panel size
		function setWestSize(pp){
			if (pp.length == 0) return;
			pp.panel('resize', {
				width: pp.panel('options').width,
				height: cpos.height,
				left: 0,
				top: cpos.top
			});
			cpos.left += pp.panel('options').width;
			cpos.width -= pp.panel('options').width;
		}
		if (isVisible(panels.expandWest)){
			setWestSize(panels.expandWest);
		} else {
			setWestSize(panels.west);
		}
        if(setGridWidth){
           setGridWidth.call(this,cpos.width||0);
        }
		panels.center.panel('resize', cpos);
	}
	
	/**
	 * initialize and wrap the layout
	 */
	function init(container){
		var cc = $(container);
		
		if (cc[0].tagName == 'BODY'){
			$('html').css({
				height: '100%',
				overflow: 'hidden'
			});
			$('body').css({
				height: '100%',
				overflow: 'hidden',
				border: 'none'
			});
		}
		cc.addClass('layout');
		cc.css({
			margin:0,
			padding:0
		});
		
		
		function createPanel(dir){
			var pp = $('>div[region='+dir+']', container).addClass('layout-body');
			
			var toolCls = null;
			if (dir == 'north'){
				toolCls = 'layout-button-up';
			} else if (dir == 'south'){
				toolCls = 'layout-button-down';
			} else if (dir == 'east'){
				toolCls = 'layout-button-right';
			} else if (dir == 'west'){
				toolCls = 'layout-button-left';
			}
			
			var cls = 'layout-panel layout-panel-' + dir;
			if (pp.attr('split') == 'true'){
				cls += ' layout-split-' + dir;
			}
			pp.panel({
				cls: cls,
				doSize: false,
				border: (pp.attr('border') == 'false' ? false : true),
				width: (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : 'auto'),
				height: (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : 'auto'),
				tools: [{
					iconCls: toolCls, 
					handler: function(){
						collapsePanel(container, dir);
					}
				}]
			});
			
			if (pp.attr('split') == 'true'){
				var panel = pp.panel('panel');
				
				var handles = '';
				if (dir == 'north') handles = 's';
				if (dir == 'south') handles = 'n';
				if (dir == 'east') handles = 'w';
				if (dir == 'west') handles = 'e';
				
				panel.resizable({
					handles:handles,
					onStartResize: function(e){
						resizing = true;
						if (dir == 'north' || dir == 'south'){
							var proxy = $('>div.layout-split-proxy-v', container);
						} else {
							var proxy = $('>div.layout-split-proxy-h', container);
						}
						var top=0,left=0,width=0,height=0;
						var pos = {display: 'block'};
						if (dir == 'north'){
							pos.top = parseInt(panel.css('top')) + panel.outerHeight() - proxy.height();
							pos.left = parseInt(panel.css('left'));
							pos.width = panel.outerWidth();
							pos.height = proxy.height();
						} else if (dir == 'south'){
							pos.top = parseInt(panel.css('top'));
							pos.left = parseInt(panel.css('left'));
							pos.width = panel.outerWidth();
							pos.height = proxy.height();
						} else if (dir == 'east'){
							pos.top = parseInt(panel.css('top')) || 0;
							pos.left = parseInt(panel.css('left')) || 0;
							pos.width = proxy.width();
							pos.height = panel.outerHeight();
						} else if (dir == 'west'){
							pos.top = parseInt(panel.css('top')) || 0;
							pos.left = panel.outerWidth() - proxy.width();
							pos.width = proxy.width();
							pos.height = panel.outerHeight();
						}
						proxy.css(pos);
						
						$('<div class="layout-mask"></div>').css({
							left:0,
							top:0,
							width:cc.width(),
							height:cc.height()
						}).appendTo(cc);
					},
					onResize: function(e){
						if (dir == 'north' || dir == 'south'){
							var proxy = $('>div.layout-split-proxy-v', container);
							proxy.css('top', e.pageY - $(container).offset().top - proxy.height()/2);
						} else {
							var proxy = $('>div.layout-split-proxy-h', container);
							proxy.css('left', e.pageX - $(container).offset().left - proxy.width()/2);
						}
						return false;
					},
					onStopResize: function(){
						$('>div.layout-split-proxy-v', container).css('display','none');
						$('>div.layout-split-proxy-h', container).css('display','none');
						var opts = pp.panel('options');
						opts.width = panel.outerWidth();
						opts.height = panel.outerHeight();
						opts.left = panel.css('left');
						opts.top = panel.css('top');
						pp.panel('resize');
						setSize(container);
						resizing = false;
						
						cc.find('>div.layout-mask').remove();
					}
				});
			}
			return pp;
		}
		
		
		$('<div class="layout-split-proxy-h"></div>').appendTo(cc);
		$('<div class="layout-split-proxy-v"></div>').appendTo(cc);
		
		var panels = {
			center: createPanel('center')
		};
		
		panels.north = createPanel('north');
		panels.south = createPanel('south');
		panels.east = createPanel('east');
		panels.west = createPanel('west');
		
		$(container).bind('_resize', function(e,force){
			var opts = $.data(container, 'layout').options;
			if (opts.fit == true || force){
				setSize(container);
			}
			return false;
		});
//		$(window).resize(function(){
//			setSize(container);
//		});
		
		return panels;
	}
	
	function collapsePanel(container, region){
		var panels = $.data(container, 'layout').panels;
		var cc = $(container);

		function createExpandPanel(dir){
			var icon;
			if (dir == 'east') icon = 'layout-button-left'
				else if (dir == 'west') icon = 'layout-button-right'
					else if (dir == 'north') icon = 'layout-button-down'
						else if (dir == 'south') icon = 'layout-button-up';
			
			var p = $('<div></div>').appendTo(cc).panel({
				cls: 'layout-expand',
				title: '&nbsp;',
				closed: true,
				doSize: false,
				tools: [{
					iconCls: icon,
					handler:function(){
						expandPanel(container, region);
					}
				}]
			});
			p.panel('panel').hover(
				function(){$(this).addClass('layout-expand-over');},
				function(){$(this).removeClass('layout-expand-over');}
			);
			return p;
		}

		if (region == 'east'){
			if (panels.east.panel('options').onBeforeCollapse.call(panels.east) == false) return;

			panels.center.panel('resize', {
				width: panels.center.panel('options').width + panels.east.panel('options').width - 28
			});
			panels.east.panel('panel').animate({left:cc.width()}, function(){
				panels.east.panel('close');
				panels.expandEast.panel('open').panel('resize', {
					top: panels.east.panel('options').top,
					left: cc.width() - 28,
					width: 28,
					height: panels.east.panel('options').height
				});
				panels.east.panel('options').onCollapse.call(panels.east);
			});
			if (!panels.expandEast) {
				panels.expandEast = createExpandPanel('east');
				panels.expandEast.panel('panel').click(function(){
					panels.east.panel('open').panel('resize', {left:cc.width()});
					panels.east.panel('panel').animate({
						left: cc.width() - panels.east.panel('options').width
					});
					return false;
				});
			}
		} else if (region == 'west'){
			if (panels.west.panel('options').onBeforeCollapse.call(panels.west) == false) return;
			
			panels.center.panel('resize', {
				width: panels.center.panel('options').width + panels.west.panel('options').width - 28,
				left: 28
			});
			panels.west.panel('panel').animate({left:-panels.west.panel('options').width}, function(){
				panels.west.panel('close');
				panels.expandWest.panel('open').panel('resize', {
					top: panels.west.panel('options').top,
					left: 0,
					width: 28,
					height: panels.west.panel('options').height
				});
				panels.west.panel('options').onCollapse.call(panels.west);
			});
			if (!panels.expandWest) {
				panels.expandWest = createExpandPanel('west');
				panels.expandWest.panel('panel').click(function(){
					panels.west.panel('open').panel('resize', {left: -panels.west.panel('options').width});
					panels.west.panel('panel').animate({
						left: 0
					});
					return false;
				});
			}
		} else if (region == 'north'){
			if (panels.north.panel('options').onBeforeCollapse.call(panels.north) == false) return;
			
			var hh = cc.height() - 28;
			if (isVisible(panels.expandSouth)){
				hh -= panels.expandSouth.panel('options').height;
			} else if (isVisible(panels.south)){
				hh -= panels.south.panel('options').height;
			}
			panels.center.panel('resize', {top:28, height:hh});
			panels.east.panel('resize', {top:28, height:hh});
			panels.west.panel('resize', {top:28, height:hh});
			if (isVisible(panels.expandEast)) panels.expandEast.panel('resize', {top:28, height:hh});
			if (isVisible(panels.expandWest)) panels.expandWest.panel('resize', {top:28, height:hh});
			
			panels.north.panel('panel').animate({top:-panels.north.panel('options').height}, function(){
				panels.north.panel('close');
				panels.expandNorth.panel('open').panel('resize', {
					top: 0,
					left: 0,
					width: cc.width(),
					height: 28
				});
				panels.north.panel('options').onCollapse.call(panels.north);
			});
			if (!panels.expandNorth) {
				panels.expandNorth = createExpandPanel('north');
				panels.expandNorth.panel('panel').click(function(){
					panels.north.panel('open').panel('resize', {top:-panels.north.panel('options').height});
					panels.north.panel('panel').animate({top:0});
					return false;
				});
			}
		} else if (region == 'south'){
			if (panels.south.panel('options').onBeforeCollapse.call(panels.south) == false) return;
			
			var hh = cc.height() - 28;
			if (isVisible(panels.expandNorth)){
				hh -= panels.expandNorth.panel('options').height;
			} else if (isVisible(panels.north)){
				hh -= panels.north.panel('options').height;
			}
			panels.center.panel('resize', {height:hh});
			panels.east.panel('resize', {height:hh});
			panels.west.panel('resize', {height:hh});
			if (isVisible(panels.expandEast)) panels.expandEast.panel('resize', {height:hh});
			if (isVisible(panels.expandWest)) panels.expandWest.panel('resize', {height:hh});
			
			panels.south.panel('panel').animate({top:cc.height()}, function(){
				panels.south.panel('close');
				panels.expandSouth.panel('open').panel('resize', {
					top: cc.height() - 28,
					left: 0,
					width: cc.width(),
					height: 28
				});
				panels.south.panel('options').onCollapse.call(panels.south);
			});
			if (!panels.expandSouth) {
				panels.expandSouth = createExpandPanel('south');
				panels.expandSouth.panel('panel').click(function(){
					panels.south.panel('open').panel('resize', {top:cc.height()});
					panels.south.panel('panel').animate({top:cc.height()-panels.south.panel('options').height});
					return false;
				});
			}
		}

        if(setGridWidth){
            setGridWidth.call(this,cc.width()-28);
        }
	}
	
	function expandPanel(container, region){
		var panels = $.data(container, 'layout').panels;
		var cc = $(container);

		if (region == 'east' && panels.expandEast){
			if (panels.east.panel('options').onBeforeExpand.call(panels.east) == false) return;
			panels.expandEast.panel('close');
			panels.east.panel('panel').stop(true,true);
			panels.east.panel('open').panel('resize', {left:cc.width()});
			panels.east.panel('panel').animate({
				left: cc.width() - panels.east.panel('options').width
			}, function(){
				setSize(container);
				panels.east.panel('options').onExpand.call(panels.east);
			});
		} else if (region == 'west' && panels.expandWest){
			if (panels.west.panel('options').onBeforeExpand.call(panels.west) == false) return;
			
			panels.expandWest.panel('close');
			panels.west.panel('panel').stop(true,true);
			panels.west.panel('open').panel('resize', {left: -panels.west.panel('options').width});
			panels.west.panel('panel').animate({
				left: 0
			}, function(){
				setSize(container);
				panels.west.panel('options').onExpand.call(panels.west);
			});
		} else if (region == 'north' && panels.expandNorth){
			if (panels.north.panel('options').onBeforeExpand.call(panels.north) == false) return;
			
			panels.expandNorth.panel('close');
			panels.north.panel('panel').stop(true,true);
			panels.north.panel('open').panel('resize', {top:-panels.north.panel('options').height});
			panels.north.panel('panel').animate({top:0}, function(){
				setSize(container);
				panels.north.panel('options').onExpand.call(panels.north);
			});
		} else if (region == 'south' && panels.expandSouth){
			if (panels.south.panel('options').onBeforeExpand.call(panels.south) == false) return;
			
			panels.expandSouth.panel('close');
			panels.south.panel('panel').stop(true,true);
			panels.south.panel('open').panel('resize', {top:cc.height()});
			panels.south.panel('panel').animate({top:cc.height()-panels.south.panel('options').height}, function(){
				setSize(container);
				panels.south.panel('options').onExpand.call(panels.south);
			});
		}
	}
	
	function bindEvents(container){
		var panels = $.data(container, 'layout').panels;
		var cc = $(container);
		
		// bind east panel events
		if (panels.east.length){
			panels.east.panel('panel').bind('mouseover','east',collapsePanel);
		}
		
		// bind west panel events
		if (panels.west.length){
			panels.west.panel('panel').bind('mouseover','west',collapsePanel);
		}
		
		// bind north panel events
		if (panels.north.length){
			panels.north.panel('panel').bind('mouseover','north',collapsePanel);
		}
		
		// bind south panel events
		if (panels.south.length){
			panels.south.panel('panel').bind('mouseover','south',collapsePanel);
		}
		
		panels.center.panel('panel').bind('mouseover','center',collapsePanel);
		
		function collapsePanel(e){
			if (resizing == true) return;
			
			if (e.data != 'east' && isVisible(panels.east) && isVisible(panels.expandEast)){
				panels.east.panel('panel').animate({left:cc.width()}, function(){
					panels.east.panel('close');
				});
			}
			if (e.data != 'west' && isVisible(panels.west) && isVisible(panels.expandWest)){
				panels.west.panel('panel').animate({left:-panels.west.panel('options').width}, function(){
					panels.west.panel('close');
				});
			}
			if (e.data != 'north' && isVisible(panels.north) && isVisible(panels.expandNorth)){
				panels.north.panel('panel').animate({top:-panels.north.panel('options').height}, function(){
					panels.north.panel('close');
				});
			}
			if (e.data != 'south' && isVisible(panels.south) && isVisible(panels.expandSouth)){
				panels.south.panel('panel').animate({top:cc.height()}, function(){
					panels.south.panel('close');
				});
			}
			return false;
		}
		
	}
	
	function isVisible(pp){
		if (!pp) return false;
		if (pp.length){
			return pp.panel('panel').is(':visible');
		} else {
			return false;
		}
	}
	
	$.fn.layout = function(options, param){
		if (typeof options == 'string'){
			return $.fn.layout.methods[options](this, param);
		}
		
		return this.each(function(){
			var state = $.data(this, 'layout');
			if (!state){
				var opts = $.extend({}, {
					fit: $(this).attr('fit') == 'true'
				});
				$.data(this, 'layout', {
					options: opts,
					panels: init(this)
				});
				bindEvents(this);
			}
			setSize(this);
		});
	};
	
	$.fn.layout.methods = {
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		panel: function(jq, region){
			return $.data(jq[0], 'layout').panels[region];
		},
		collapse: function(jq, region){
			return jq.each(function(){
				collapsePanel(this, region);
			});
		},
		expand: function(jq, region){
			return jq.each(function(){
				expandPanel(this, region);
			});
		}
	};
})(jQuery);
/**
 * form - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	/**
	 * submit the form
	 */
	function ajaxSubmit(target, options){
		options = options || {};
		
		if (options.onSubmit){
			if (options.onSubmit.call(target) == false) {
				return;
			}
		}
		
		var form = $(target);
		if (options.url){
			form.attr('action', options.url);
		}
		var frameId = 'easyui_frame_' + (new Date().getTime());
		var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>')
				.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank')
				.css({
					position:'absolute',
					top:-1000,
					left:-1000
				});
		var t = form.attr('target'), a = form.attr('action');
		form.attr('target', frameId);
		try {
			frame.appendTo('body');
			frame.bind('load', cb);
			form[0].submit();
		} finally {
			form.attr('action', a);
			t ? form.attr('target', t) : form.removeAttr('target');
		}
		
		var checkCount = 10;
		function cb(){
			frame.unbind();
			var body = $('#'+frameId).contents().find('body');
			var data = body.html();
			if (data == ''){
				if (--checkCount){
					setTimeout(cb, 100);
					return;
				}
				return;
			}
			var ta = body.find('>textarea');
			if (ta.length){
				data = ta.val();
			} else {
				var pre = body.find('>pre');
				if (pre.length){
					data = pre.html();
				}
			}
			if (options.success){
				options.success(data);
			}
//			try{
//				eval('data='+data);
//				if (options.success){
//					options.success(data);
//				}
//			} catch(e) {
//				if (options.failure){
//					options.failure(data);
//				}
//			}
			setTimeout(function(){
				frame.unbind();
				frame.remove();
			}, 100);
		}
	}
	
	/**
	 * load form data
	 * if data is a URL string type load from remote site, 
	 * otherwise load from local data object. 
	 */
	function load(target, data){
		if (!$.data(target, 'form')){
			$.data(target, 'form', {
				options: $.extend({}, $.fn.form.defaults)
			});
		}
		var opts = $.data(target, 'form').options;
		
		if (typeof data == 'string'){
			var param = {};
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$.ajax({
				url: data,
				data: param,
				dataType: 'json',
				success: function(data){
					_load(data);
				},
				error: function(){
					opts.onLoadError.apply(target, arguments);
				}
			});
		} else {
			_load(data);
		}
		
		function _load(data){
			var form = $(target);
			for(var name in data){
				var val = data[name];
				var rr = _checkField(name, val);
				if (!rr.length){
					var f = form.find('input[numberboxName="'+name+'"]');
					if (f.length){
						f.numberbox('setValue', val);	// set numberbox value
					} else {
						$('input[name="'+name+'"]', form).val(val);
						$('textarea[name="'+name+'"]', form).val(val);
						$('select[name="'+name+'"]', form).val(val);
					}
				}
				_loadCombo(name, val);
			}
			opts.onLoadSuccess.call(target, data);
			validate(target);
		}
		
		/**
		 * check the checkbox and radio fields
		 */
		function _checkField(name, val){
			var form = $(target);
			var rr = $('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]', form);
			$.fn.prop ? rr.prop('checked',false) : rr.attr('checked',false);
			rr.each(function(){
				var f = $(this);
				if (f.val() == val){
					$.fn.prop ? f.prop('checked',true) : f.attr('checked',true);
				}
			});
			return rr;
		}
		
		function _loadCombo(name, val){
			var form = $(target);
			var cc = ['combobox','combotree','combogrid','datetimebox','datebox','combo'];
			var c = form.find('[comboName="' + name + '"]');
			if (c.length){
				for(var i=0; i<cc.length; i++){
					var type = cc[i];
					if (c.hasClass(type+'-f')){
						if (c[type]('options').multiple){
							c[type]('setValues', val);
						} else {
							c[type]('setValue', val);
						}
						return;
					}
				}
			}
		}
	}
	
	/**
	 * clear the form fields
	 */
	function clear(target){
		$('input,select,textarea', target).each(function(){
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
				this.value = '';
			} else if (t == 'file'){
				var file = $(this);
				file.after(file.clone().val(''));
				file.remove();
			} else if (t == 'checkbox' || t == 'radio'){
				this.checked = false;
			} else if (tag == 'select'){
				this.selectedIndex = -1;
			}
			
		});
		if ($.fn.combo) $('.combo-f', target).combo('clear');
		if ($.fn.combobox) $('.combobox-f', target).combobox('clear');
		if ($.fn.combotree) $('.combotree-f', target).combotree('clear');
		if ($.fn.combogrid) $('.combogrid-f', target).combogrid('clear');
		validate(target);
	}
	
	/**
	 * set the form to make it can submit with ajax.
	 */
	function setForm(target){
		var options = $.data(target, 'form').options;
		var form = $(target);
		form.unbind('.form').bind('submit.form', function(){
			setTimeout(function(){
				ajaxSubmit(target, options);
			}, 0);
			return false;
		});
	}
	
	function validate(target){
		if ($.fn.validatebox){
			var box = $('.validatebox-text', target);
			if (box.length){
				box.validatebox('validate');
				box.trigger('focus');
				box.trigger('blur');
				var invalidbox = $('.validatebox-invalid:first', target).focus();
				return invalidbox.length == 0;
			}
		}
		return true;
	}
	
	$.fn.form = function(options, param){
		if (typeof options == 'string'){
			return $.fn.form.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			if (!$.data(this, 'form')){
				$.data(this, 'form', {
					options: $.extend({}, $.fn.form.defaults, options)
				});
			}
			setForm(this);
		});
	};
	
	$.fn.form.methods = {
		submit: function(jq, options){
			return jq.each(function(){
				ajaxSubmit(this, $.extend({}, $.fn.form.defaults, options||{}));
			});
		},
		load: function(jq, data){
			return jq.each(function(){
				load(this, data);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		validate: function(jq){
			return validate(jq[0]);
		}
	};
	
	$.fn.form.defaults = {
		url: null,
		onSubmit: function(){return $(this).form('validate');},
		success: function(data){},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(data){},
		onLoadError: function(){}
	};
})(jQuery);/**
 * menu - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	
	/**
	 * initialize the target menu, the function can be invoked only once
	 */
	function init(target){
		$(target).appendTo('body');
		$(target).addClass('menu-top');	// the top menu
		
		var menus = [];
		adjust($(target));

		var time = null;
		for(var i=0; i<menus.length; i++){
			var menu = menus[i];
			wrapMenu(menu);
			menu.children('div.menu-item').each(function(){
				bindMenuItemEvent(target, $(this));
			});
			
			menu.bind('mouseenter', function(){
				if (time){
					clearTimeout(time);
					time = null;
				}
			}).bind('mouseleave', function(){
				time = setTimeout(function(){
					hideAll(target);
				}, 100);
			});
		}
		
		
		function adjust(menu){
			menus.push(menu);
			menu.find('>div').each(function(){
				var item = $(this);
				var submenu = item.find('>div');
				if (submenu.length){
					submenu.insertAfter(target);
					item[0].submenu = submenu;
					adjust(submenu);
				}
			});
		}
		
		
		/**
		 * wrap a menu and set it's status to hidden
		 * the menu not include sub menus
		 */
		function wrapMenu(menu){
			menu.addClass('menu').find('>div').each(function(){
				var item = $(this);
				if (item.hasClass('menu-sep')){
					item.html('&nbsp;');
				} else {
					var text = item.addClass('menu-item').html();
					item.empty().append($('<div class="menu-text"></div>').html(text));
					var iconCls = item.attr('iconCls') || item.attr('icon');
					if (iconCls){
						$('<div class="menu-icon"></div>').addClass(iconCls).appendTo(item);
					}
					if (item[0].submenu){
						$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
					}
					
					if ($.boxModel == true){
						var height = item.height();
						item.height(height - (item.outerHeight() - item.height()));
					}
				}
			});
			menu.hide();
		}
	}
	
	/**
	 * bind menu item event
	 */
	function bindMenuItemEvent(target, item){
		item.unbind('.menu');
		item.bind('mousedown.menu', function(){
			return false;	// skip the mousedown event that has been used for document to hide the menu
		}).bind('click.menu', function(){
			if ($(this).hasClass('menu-item-disabled')){
				return;
			}
			// only the sub menu clicked can hide all menus
			if (!this.submenu){
				hideAll(target);
				var href = $(this).attr('href');
				if (href){
					location.href = href;
				}
			}
			var item = $(target).menu('getItem', this);
			$.data(target, 'menu').options.onClick.call(target, item);
		}).bind('mouseenter.menu', function(e){
			// hide other menu
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			
			if ($(this).hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			
			var submenu = item[0].submenu;
			if (submenu){
				var left = item.offset().left + item.outerWidth() - 2;
				if (left + submenu.outerWidth() + 5 > $(window).width() + $(document).scrollLeft()){
					left = item.offset().left - submenu.outerWidth() + 2;
				}
				var top = item.offset().top - 3;
				if (top + submenu.outerHeight() > $(window).height() + $(document).scrollTop()){
					top = $(window).height() + $(document).scrollTop() - submenu.outerHeight() - 5;
				}
				showMenu(submenu, {
					left: left,
					top: top
				});
			}
		}).bind('mouseleave.menu', function(e){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
				
			} else {
				item.removeClass('menu-active');
			}
		});
	}
	
	/**
	 * hide top menu and it's all sub menus
	 */
	function hideAll(target){
		var opts = $.data(target, 'menu').options;
		hideMenu($(target));
		$(document).unbind('.menu');
		opts.onHide.call(target);
		return false;
	}
	
	/**
	 * show the top menu
	 */
	function showTopMenu(target, pos){
		var opts = $.data(target, 'menu').options;
		if (pos){
			opts.left = pos.left;
			opts.top = pos.top;
			if (opts.left + $(target).outerWidth() > $(window).width() + $(document).scrollLeft()){
				opts.left = $(window).width() + $(document).scrollLeft() - $(target).outerWidth() - 5;
			}
			if (opts.top + $(target).outerHeight() > $(window).height() + $(document).scrollTop()){
				opts.top -= $(target).outerHeight();
			}
		}
		showMenu($(target), {left:opts.left,top:opts.top}, function(){
			$(document).unbind('.menu').bind('mousedown.menu', function(){
				hideAll(target);
				$(document).unbind('.menu');
				return false;
			});
			opts.onShow.call(target);
		});
	}
	
	function showMenu(menu, pos, callback){
		if (!menu) return;
		
		if (pos){
			menu.css(pos);
		}
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:'block',
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			
			if (callback){
				callback();
			}
		});
	}
	
	function hideMenu(menu){
		if (!menu) return;
		
		hideit(menu);
		menu.find('div.menu-item').each(function(){
			if (this.submenu){
				hideMenu(this.submenu);
			}
			$(this).removeClass('menu-active');
		});
		
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		
		if (disabled){
			t.addClass('menu-item-disabled');
			if (itemEl.onclick){
				itemEl.onclick1 = itemEl.onclick;
				itemEl.onclick = null;
			}
		} else {
			t.removeClass('menu-item-disabled');
			if (itemEl.onclick1){
				itemEl.onclick = itemEl.onclick1;
				itemEl.onclick1 = null;
			}
		}
	}
	
	function appendItem(target, param){
		var menu = $(target);
		if (param.parent){
			menu = param.parent.submenu;
		}
		var item = $('<div class="menu-item"></div>').appendTo(menu);
		$('<div class="menu-text"></div>').html(param.text).appendTo(item);
		if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
		if (param.id) item.attr('id', param.id);
		if (param.href) item.attr('href', param.href);
//		if (param.onclick) item.attr('onclick', param.onclick);
		if (param.onclick){
			if (typeof param.onclick == 'string'){
				item.attr('onclick', param.onclick);
			} else {
				item[0].onclick = eval(param.onclick);
			}
		}
		if (param.handler) item[0].onclick = eval(param.handler);
		
		bindMenuItemEvent(target, item);
	}
	
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		removeit(itemEl);
	}
	
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	
	$.fn.menu.methods = {
		show: function(jq, pos){
			return jq.each(function(){
				showTopMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		/**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
		setText: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		/**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
		setIcon: function(jq, param){
			return jq.each(function(){
				var item = $(this).menu('getItem', param.target);
				if (item.iconCls){
					$(item.target).children('div.menu-icon').removeClass(item.iconCls).addClass(param.iconCls);
				} else {
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		/**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
		getItem: function(jq, itemEl){
			var item = {
				target: itemEl,
				id: $(itemEl).attr('id'),
				text: $.trim($(itemEl).children('div.menu-text').html()),
				disabled: $(itemEl).hasClass('menu-item-disabled'),
				href: $(itemEl).attr('href'),
				onclick: itemEl.onclick
			}
			var icon = $(itemEl).children('div.menu-icon');
			if (icon.length){
				var cc = [];
				var aa = icon.attr('class').split(' ');
				for(var i=0; i<aa.length; i++){
					if (aa[i] != 'menu-icon'){
						cc.push(aa[i]);
					}
				}
				item.iconCls = cc.join(' ');
			}
			return item;
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		/**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		}
	};
	
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);
/**
 * tabs - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 *
 * Dependencies:
 * 	 panel
 *   linkbutton
 * 
 */
(function($){
	
	/**
	 * get the max tabs scroll width(scope)
	 */
	function getMaxScrollWidth(container) {
		var header = $(container).children('div.tabs-header');
		var tabsWidth = 0;	// all tabs width
		$('ul.tabs li', header).each(function(){
			tabsWidth += $(this).outerWidth(true);
		});
		var wrapWidth = header.children('div.tabs-wrap').width();
		var padding = parseInt(header.find('ul.tabs').css('padding-left'));
		
		return tabsWidth - wrapWidth + padding;
	}
	
	/**
	 * set the tabs scrollers to show or not,
	 * dependent on the tabs count and width
	 */
	function setScrollers(container) {
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap');
		
		// set the tool height
		var toolHeight = ($.boxModel==true ? (header.outerHeight()-(tool.outerHeight()-tool.height())) : header.outerHeight());
		if (opts.plain){
			toolHeight -= 2;
		}
		tool.height(toolHeight);
		
		var tabsWidth = 0;
		$('ul.tabs li', header).each(function(){
			tabsWidth += $(this).outerWidth(true);
		});
		var cWidth = header.width() - tool.outerWidth();
		
		if (tabsWidth > cWidth) {
			sLeft.show();
			sRight.show();
			tool.css('right', sRight.outerWidth());
			wrap.css({
				marginLeft: sLeft.outerWidth(),
				marginRight: sRight.outerWidth() + tool.outerWidth(),
				left: 0,
				width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
			});
		} else {
			sLeft.hide();
			sRight.hide();
			tool.css('right', 0);
			wrap.css({
				marginLeft:0,
				marginRight:tool.outerWidth(),
				left: 0,
				width: cWidth
			});
			wrap.scrollLeft(0);
		}
	}
	
	function addTools(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
//		var tools = header.children('div.tabs-tool');
//		tools.remove();
		if (opts.tools) {
			if (typeof opts.tools == 'string'){
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else {
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"></div>').appendTo(header);
				for(var i=0; i<opts.tools.length; i++){
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(tools);
					tool[0].onclick = eval(opts.tools[i].handler || function(){});
					tool.linkbutton($.extend({}, opts.tools[i], {
						plain: true
					}));
				}
			}
		} else {
			header.children('div.tabs-tool').remove();
		}
	}
	
	function setSize(container) {
		var opts = $.data(container, 'tabs').options;
		var cc = $(container);
		if (opts.fit == true){
			var p = cc.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		cc.width(opts.width).height(opts.height);
		
		var header = $(container).children('div.tabs-header');
		if ($.boxModel == true) {
			header.width(opts.width - (header.outerWidth() - header.width()));
		} else {
			header.width(opts.width);
		}
		
		setScrollers(container);
		
		var panels = $(container).children('div.tabs-panels');
		var height = opts.height;
		if (!isNaN(height)) {
			if ($.boxModel == true) {
				var delta = panels.outerHeight() - panels.height();
				panels.css('height', (height - header.outerHeight() - delta) || 'auto');
			} else {
				panels.css('height', height - header.outerHeight());
			}
		} else {
			panels.height('auto');
		}
		var width = opts.width;
		if (!isNaN(width)){
			if ($.boxModel == true) {
				panels.width(width - (panels.outerWidth() - panels.width()));
			} else {
				panels.width(width);
			}
		} else {
			panels.width('auto');
		}
	}
	
	/**
	 * set selected tab panel size
	 */
	function setSelectedSize(container){
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab){
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width=='auto' ? 'auto' : panels.width();
			var height = opts.height=='auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	
	/**
	 * wrap the tabs header and body
	 */
	function wrapTabs(container) {
		var cc = $(container);
		cc.addClass('tabs-container');
		cc.wrapInner('<div class="tabs-panels"/>');
		$('<div class="tabs-header">'
				+ '<div class="tabs-scroller-left"></div>'
				+ '<div class="tabs-scroller-right"></div>'
				+ '<div class="tabs-wrap">'
				+ '<ul class="tabs"></ul>'
				+ '</div>'
				+ '</div>').prependTo(container);
		
		var tabs = [];
		var tp = cc.children('div.tabs-panels');
		tp.children('div[selected]').attr('toselect', 'true');
		tp.children('div').each(function(){
			var pp = $(this);
			tabs.push(pp);
			createTab(container, pp);
		});
		
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(
			function(){$(this).addClass('tabs-scroller-over');},
			function(){$(this).removeClass('tabs-scroller-over');}
		);
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'tabs').options;
			if (opts.fit == true || force){
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
		
		return tabs;
	}
	
	function setProperties(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		if (opts.plain == true) {
			header.addClass('tabs-header-plain');
		} else {
			header.removeClass('tabs-header-plain');
		}
		if (opts.border == true){
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else {
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
		
		$('.tabs-scroller-left', header).unbind('.tabs').bind('click.tabs', function(){
			var wrap = $('.tabs-wrap', header);
			var pos = wrap.scrollLeft() - opts.scrollIncrement;
			wrap.animate({scrollLeft:pos}, opts.scrollDuration);
		});
		
		$('.tabs-scroller-right', header).unbind('.tabs').bind('click.tabs', function(){
			var wrap = $('.tabs-wrap', header);
			var pos = Math.min(
					wrap.scrollLeft() + opts.scrollIncrement,
					getMaxScrollWidth(container)
			);
			wrap.animate({scrollLeft:pos}, opts.scrollDuration);
		});
		
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0,len=tabs.length; i<len; i++){
			var panel = tabs[i];
			var tab = panel.panel('options').tab;
			tab.unbind('.tabs').bind('click.tabs', {p:panel}, function(e){
				selectTab(container, getTabIndex(container, e.data.p))
			}).bind('contextmenu.tabs', {p:panel}, function(e){
				opts.onContextMenu.call(container, e, e.data.p.panel('options').title);
			});
			tab.find('a.tabs-close').unbind('.tabs').bind('click.tabs', {p:panel}, function(e){
				closeTab(container, getTabIndex(container, e.data.p));
				return false;
			});
		}
	}
	
	function createTab(container, pp, options) {
		options = options || {};
		
		// create panel
		pp.panel($.extend({}, options, {
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				$.data(container, 'tabs').options.onLoad.call(container, pp);
			}
		}));
		
		var opts = pp.panel('options');
		
		var header = $(container).children('div.tabs-header');
		var tabs = $('ul.tabs', header);
		
		var tab = $('<li></li>').appendTo(tabs);
		var a_inner = $('<a href="javascript:void(0)" class="tabs-inner"></a>').appendTo(tab);
		var s_title = $('<span class="tabs-title"></span>').html(opts.title).appendTo(a_inner);
		var s_icon = $('<span class="tabs-icon"></span>').appendTo(a_inner);
		
		
		if (opts.closable){
			s_title.addClass('tabs-closable');
			$('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
		}
		if (opts.iconCls){
			s_title.addClass('tabs-with-icon');
			s_icon.addClass(opts.iconCls);
		}
		
		if (opts.tools){
			var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(a_inner);
			if (typeof opts.tools == 'string'){
				$(opts.tools).children().appendTo(p_tool);
			} else {
				for(var i=0; i<opts.tools.length; i++){
					var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
					t.addClass(opts.tools[i].iconCls);
					if (opts.tools[i].handler){
						t.bind('click', eval(opts.tools[i].handler));
					}
				}
			}
			var pr = p_tool.children().length * 12;
			if (opts.closable) {
				pr += 8;
			} else {
				pr -= 3;
				p_tool.css('right','5px');
			}
			s_title.css('padding-right', pr+'px');
		}
		
		opts.tab = tab;	// set the tab object in panel options
	}
	
	function addTab(container, options) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		
		var pp = $('<div></div>').appendTo($(container).children('div.tabs-panels'));
		tabs.push(pp);
		createTab(container, pp, options);
		
		opts.onAdd.call(container, options.title);
		
		setScrollers(container);
		setProperties(container);
		selectTab(container, tabs.length-1);	// select the added tab panel
	}
	
	/**
	 * update tab panel, param has following properties:
	 * tab: the tab panel to be updated
	 * options: the tab panel options
	 */
	function updateTab(container, param){
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab;	// the tab panel
		var oldTitle = pp.panel('options').title; 
		pp.panel($.extend({}, param.options, {
			iconCls: (param.options.icon ? param.options.icon : undefined)
		}));
		
		var opts = pp.panel('options');	// get the tab panel options
		var tab = opts.tab;
		
		tab.find('span.tabs-icon').attr('class', 'tabs-icon');
		tab.find('a.tabs-close').remove();
		tab.find('span.tabs-title').html(opts.title);
		
		if (opts.closable){
			tab.find('span.tabs-title').addClass('tabs-closable');
			$('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
		} else{
			tab.find('span.tabs-title').removeClass('tabs-closable');
		}
		if (opts.iconCls){
			tab.find('span.tabs-title').addClass('tabs-with-icon');
			tab.find('span.tabs-icon').addClass(opts.iconCls);
		} else {
			tab.find('span.tabs-title').removeClass('tabs-with-icon');
		}
		
		if (oldTitle != opts.title){
			for(var i=0; i<selectHis.length; i++){
				if (selectHis[i] == oldTitle){
					selectHis[i] = opts.title;
				}
			}
		}
		
		setProperties(container);
		
		$.data(container, 'tabs').options.onUpdate.call(container, opts.title);
	}
	
	/**
	 * close a tab with specified index or title
	 */
	function closeTab(container, which) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (!exists(container, which)) return;
		
		var tab = getTab(container, which);
		var title = tab.panel('options').title;
		
		if (opts.onBeforeClose.call(container, title) == false) return;
		
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		
		opts.onClose.call(container, title);
		
		setScrollers(container);
		
		// remove the select history item
		for(var i=0; i<selectHis.length; i++){
			if (selectHis[i] == title){
				selectHis.splice(i, 1);
				i --;
			}
		}
		
		// select the nearest tab panel
		var hisTitle = selectHis.pop();
		if (hisTitle){
			selectTab(container, hisTitle);
		} else if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	/**
	 * get the specified tab panel
	 */
	function getTab(container, which, removeit){
		var tabs = $.data(container, 'tabs').tabs;
		if (typeof which == 'number'){
			if (which < 0 || which >= tabs.length){
				return null;
			} else {
				var tab = tabs[which];
				if (removeit) {
					tabs.splice(which, 1);
				}
				return tab;
			}
		}
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').title == which){
				if (removeit){
					tabs.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	}
	
	function getTabIndex(container, tab){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i][0] == $(tab)[0]){
				return i;
			}
		}
		return -1;
	}
	
	function getSelectedTab(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').closed == false){
				return tab;
			}
		}
		return null;
	}
	
	/**
	 * do first select action, if no tab is setted the first tab will be selected.
	 */
	function doFirstSelect(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i].attr('toselect') == 'true'){
				selectTab(container, i);
				return;
			}
		}
		if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	function selectTab(container, which){
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (tabs.length == 0) return;
		
		var panel = getTab(container, which); // get the panel to be activated
		if (!panel) return;
		
		var selected = getSelectedTab(container);
		if (selected){
			selected.panel('close');
			selected.panel('options').tab.removeClass('tabs-selected');
		}
		
		panel.panel('open');
		var title = panel.panel('options').title;	// the panel title
		selectHis.push(title);	// push select history
		
		var tab = panel.panel('options').tab;	// get the tab object
		tab.addClass('tabs-selected');
		
		// scroll the tab to center position if required.
		var wrap = $(container).find('>div.tabs-header div.tabs-wrap');
		var leftPos = tab.position().left + wrap.scrollLeft();
		var left = leftPos - wrap.scrollLeft();
		var right = left + tab.outerWidth();
		if (left < 0 || right > wrap.innerWidth()) {
			var pos = Math.min(
					leftPos - (wrap.width()-tab.width()) / 2,
					getMaxScrollWidth(container)
			);
			wrap.animate({scrollLeft:pos}, opts.scrollDuration);
		} else {
			var pos = Math.min(
					wrap.scrollLeft(),
					getMaxScrollWidth(container)
			);
			wrap.animate({scrollLeft:pos}, opts.scrollDuration);
		}
		
		setSelectedSize(container);
		
		opts.onSelect.call(container, title);
	}
	
	function exists(container, which){
		return getTab(container, which) != null;
	}
	
	
	$.fn.tabs = function(options, param){
		if (typeof options == 'string') {
			return $.fn.tabs.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tabs');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				$.data(this, 'tabs', {
					options: $.extend({},$.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: wrapTabs(this),
					selectHis: []
				});
			}
			
			addTools(this);
			setProperties(this);
			setSize(this);
			
			doFirstSelect(this);
		});
	};
	
	$.fn.tabs.methods = {
		options: function(jq){
			return $.data(jq[0], 'tabs').options;
		},
		tabs: function(jq){
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
				setSelectedSize(this);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			});
		},
		close: function(jq, which){
			return jq.each(function(){
				closeTab(this, which);
			});
		},
		getTab: function(jq, which){
			return getTab(jq[0], which);
		},
		getTabIndex: function(jq, tab){
			return getTabIndex(jq[0], tab);
		},
		getSelected: function(jq){
			return getSelectedTab(jq[0]);
		},
		select: function(jq, which){
			return jq.each(function(){
				selectTab(this, which);
			});
		},
		exists: function(jq, which){
			return exists(jq[0], which);
		},
		update: function(jq, options){
			return jq.each(function(){
				updateTab(this, options);
			});
		}
	};
	
	$.fn.tabs.parseOptions = function(target){
		var t = $(target);
		return {
			width: (parseInt(target.style.width) || undefined),
			height: (parseInt(target.style.height) || undefined),
			fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
			border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
			plain: (t.attr('plain') ? t.attr('plain') == 'true' : undefined),
			tools: t.attr('tools')
		};
	};
	
	$.fn.tabs.defaults = {
		width: 'auto',
		height: 'auto',
		plain: false,
		fit: false,
		border: true,
		tools: null,
		scrollIncrement: 100,
		scrollDuration: 400,
		onLoad: function(panel){},
		onSelect: function(title){},
		onBeforeClose: function(title){},
		onClose: function(title){},
		onAdd: function(title){},
		onUpdate: function(title){},
		onContextMenu: function(e, title){}
	};
})(jQuery);/**
 * splitbutton - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   linkbutton
 *   menu
 */
(function($){
	
	function init(target){
		var opts = $.data(target, 'splitbutton').options;
		
		var btn = $(target);
		btn.removeClass('s-btn-active s-btn-plain-active');
//		btn.linkbutton(opts);
		btn.linkbutton($.extend({}, opts, {
			text: opts.text + '<span class="s-btn-downarrow">&nbsp;</span>'
		}));
		
		if (opts.menu){
			$(opts.menu).menu({
				onShow: function(){
					btn.addClass((opts.plain==true) ? 's-btn-plain-active' : 's-btn-active');
				},
				onHide: function(){
					btn.removeClass((opts.plain==true) ? 's-btn-plain-active' : 's-btn-active');
				}
			});
		}
		
		setDisabled(target, opts.disabled);
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'splitbutton').options;
		opts.disabled = disabled;
		
		var btn = $(target);
		var menubtn = btn.find('.s-btn-downarrow');
		if (disabled){
			btn.linkbutton('disable');
			menubtn.unbind('.splitbutton');
		} else {
			btn.linkbutton('enable');
			menubtn.unbind('.splitbutton');
			menubtn.bind('click.splitbutton', function(){
				showMenu();
				return false;
			});
			var timeout = null;
			menubtn.bind('mouseenter.splitbutton', function(){
				timeout = setTimeout(function(){
					showMenu();
				}, opts.duration);
				return false;
			}).bind('mouseleave.splitbutton', function(){
				if (timeout){
					clearTimeout(timeout);
				}
			});
		}
		
		function showMenu(){
			if (!opts.menu) return;
			
			var left = btn.offset().left;
			if (left + $(opts.menu).outerWidth() + 5 > $(window).width()){
				left = $(window).width() - $(opts.menu).outerWidth() - 5;
			}
			
			$('body>div.menu-top').menu('hide');
			$(opts.menu).menu('show', {
				left: left,
				top: btn.offset().top + btn.outerHeight()
			});
			btn.blur();
		}
	}
	
	$.fn.splitbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.splitbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'splitbutton');
			if (state){
				$.extend(state.options, options);
			} else {
//				$(this).append('<span class="s-btn-downarrow">&nbsp;</span>');
				$.data(this, 'splitbutton', {
					options: $.extend({}, $.fn.splitbutton.defaults, $.fn.splitbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			init(this);
		});
	};
	
	$.fn.splitbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'splitbutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		}
	};
	
	$.fn.splitbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.linkbutton.parseOptions(target), {
			menu: t.attr('menu'),
			duration: t.attr('duration')
		});
	};
	
	$.fn.splitbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain: true,
		menu: null,
		duration: 100
	});
})(jQuery);/**
 * menubutton - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   linkbutton
 *   menu
 */
(function($){
	
	function init(target){
		var opts = $.data(target, 'menubutton').options;
		var btn = $(target);
		btn.removeClass('m-btn-active m-btn-plain-active');
//		btn.linkbutton(opts);
		btn.linkbutton($.extend({}, opts, {
			text: opts.text + '<span class="m-btn-downarrow">&nbsp;</span>'
		}));
		
		if (opts.menu){
			$(opts.menu).menu({
				onShow: function(){
					btn.addClass((opts.plain==true) ? 'm-btn-plain-active' : 'm-btn-active');
				},
				onHide: function(){
					btn.removeClass((opts.plain==true) ? 'm-btn-plain-active' : 'm-btn-active');
				}
			});
		}
		setDisabled(target, opts.disabled);
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'menubutton').options;
		opts.disabled = disabled;
		
		var btn = $(target);
		if (disabled){
			btn.linkbutton('disable');
			btn.unbind('.menubutton');
		} else {
			btn.linkbutton('enable');
			btn.unbind('.menubutton');
			btn.bind('click.menubutton', function(){
				showMenu();
				return false;
			});
			var timeout = null;
			btn.bind('mouseenter.menubutton', function(){
				timeout = setTimeout(function(){
					showMenu();
				}, opts.duration);
				return false;
			}).bind('mouseleave.menubutton', function(){
				if (timeout){
					clearTimeout(timeout);
				}
			});
		}
		
		function showMenu(){
			if (!opts.menu) return;
			
			var left = btn.offset().left;
			if (left + $(opts.menu).outerWidth() + 5 > $(window).width()){
				left = $(window).width() - $(opts.menu).outerWidth() - 5;
			}
			
			$('body>div.menu-top').menu('hide');
			$(opts.menu).menu('show', {
				left: left,
				top: btn.offset().top + btn.outerHeight()
			});
			btn.blur();
		}
	}
	
	$.fn.menubutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menubutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menubutton');
			if (state){
				$.extend(state.options, options);
			} else {
//				$(this).append('<span class="m-btn-downarrow">&nbsp;</span>');
				$.data(this, 'menubutton', {
					options: $.extend({}, $.fn.menubutton.defaults, $.fn.menubutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			init(this);
		});
	};
	
	$.fn.menubutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'menubutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		}
	};
	
	$.fn.menubutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.linkbutton.parseOptions(target), {
			menu: t.attr('menu'),
			duration: t.attr('duration')
		});
	};
	
	$.fn.menubutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain: true,
		menu: null,
		duration: 100
	});
})(jQuery);
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
})(jQuery);/**
 * calendar - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($){
	
	function setSize(target){
		var opts = $.data(target, 'calendar').options;
		var t = $(target);
		if (opts.fit == true){
			var p = t.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		var header = t.find('.calendar-header');
		if ($.boxModel == true){
			t.width(opts.width - (t.outerWidth() - t.width()));
			t.height(opts.height - (t.outerHeight() - t.height()));
		} else {
			t.width(opts.width);
			t.height(opts.height);
		}
		var body = t.find('.calendar-body');
		var height = t.height() - header.outerHeight();
		if ($.boxModel == true){
			body.height(height - (body.outerHeight() - body.height()));
		} else {
			body.height(height);
		}
		
	}
	
	function init(target){
		$(target).addClass('calendar').wrapInner(
				'<div class="calendar-header">' +
					'<div class="calendar-prevmonth"></div>' +
					'<div class="calendar-nextmonth"></div>' +
					'<div class="calendar-prevyear"></div>' +
					'<div class="calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span>Aprial 2010</span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
		);
		
		$(target).find('.calendar-title span').hover(
			function(){$(this).addClass('calendar-menu-hover');},
			function(){$(this).removeClass('calendar-menu-hover');}
		).click(function(){
			var menu = $(target).find('.calendar-menu');
			if (menu.is(':visible')){
				menu.hide();
			} else {
				showSelectMenus(target);
			}
		});
		
		$('.calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear', target).hover(
			function(){$(this).addClass('calendar-nav-hover');},
			function(){$(this).removeClass('calendar-nav-hover');}
		);
		$(target).find('.calendar-nextmonth').click(function(){
			showMonth(target, 1);
		});
		$(target).find('.calendar-prevmonth').click(function(){
			showMonth(target, -1);
		});
		$(target).find('.calendar-nextyear').click(function(){
			showYear(target, 1);
		});
		$(target).find('.calendar-prevyear').click(function(){
			showYear(target, -1);
		});
		
		$(target).bind('_resize', function(){
			var opts = $.data(target, 'calendar').options;
			if (opts.fit == true){
				setSize(target);
			}
			return false;
		});
	}
	
	/**
	 * show the calendar corresponding to the current month.
	 */
	function showMonth(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.month += delta;
		if (opts.month > 12){
			opts.year++;
			opts.month = 1;
		} else if (opts.month < 1){
			opts.year--;
			opts.month = 12;
		}
		show(target);
		
		var menu = $(target).find('.calendar-menu-month-inner');
		menu.find('td.calendar-selected').removeClass('calendar-selected');
		menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
	}
	
	/**
	 * show the calendar corresponding to the current year.
	 */
	function showYear(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.year += delta;
		show(target);
		
		var menu = $(target).find('.calendar-menu-year');
		menu.val(opts.year);
	}
	
	/**
	 * show the select menu that can change year or month, if the menu is not be created then create it.
	 */
	function showSelectMenus(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-menu').show();
		
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			
			$(target).find('.calendar-menu-prev,.calendar-menu-next').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			);
			$(target).find('.calendar-menu-next').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val()) + 1);
				}
			});
			$(target).find('.calendar-menu-prev').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val() - 1));
				}
			});
			
			$(target).find('.calendar-menu-year').keypress(function(e){
				if (e.keyCode == 13){
					setDate();
				}
			});
			
			$(target).find('.calendar-menu-month').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			).click(function(){
				var menu = $(target).find('.calendar-menu');
				menu.find('.calendar-selected').removeClass('calendar-selected');
				$(this).addClass('calendar-selected');
				setDate();
			});
		}
		
		function setDate(){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			menu.hide();
		}
		
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		
		if ($.boxModel == true){
			sele.width(body.outerWidth() - (sele.outerWidth() - sele.width()));
			sele.height(body.outerHeight() - (sele.outerHeight() - sele.height()));
			seleMonth.height(sele.height() - (seleMonth.outerHeight() - seleMonth.height()) - seleYear.outerHeight());
		} else {
			sele.width(body.outerWidth());
			sele.height(body.outerHeight());
			seleMonth.height(sele.height() - seleYear.outerHeight());
		}
	}
	
	/**
	 * get weeks data.
	 */
	function getWeeks(year, month){
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		
		// group date by week
		var weeks = [], week = [];
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			if (new Date(date[0],date[1]-1,date[2]).getDay() == 6){
				weeks.push(week);
				week = [];
			}
		}
		if (week.length){
			weeks.push(week);
		}
		
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		
		return weeks;
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		
		var body = $(target).find('div.calendar-body');
		body.find('>table').remove();
		
		var t = $('<table cellspacing="0" cellpadding="0" border="0"><thead></thead><tbody></tbody></table>').prependTo(body);
		var tr = $('<tr></tr>').appendTo(t.find('thead'));
		for(var i=0; i<opts.weeks.length; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		var weeks = getWeeks(opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var tr = $('<tr></tr>').appendTo(t.find('tbody'));
			for(var j=0; j<week.length; j++){
				var day = week[j];
				$('<td class="calendar-day calendar-other-month"></td>').attr('abbr',day[0]+','+day[1]+','+day[2]).html(day[2]).appendTo(tr);
			}
		}
//		t.find('td[abbr^='+opts.year+','+opts.month+']').removeClass('calendar-other-month');
		t.find('td[abbr^="'+opts.year+','+opts.month+'"]').removeClass('calendar-other-month');
		
		var now = new Date();
		var today = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
//		t.find('td[abbr='+today+']').addClass('calendar-today');
		t.find('td[abbr="'+today+'"]').addClass('calendar-today');
		
		if (opts.current){
			t.find('.calendar-selected').removeClass('calendar-selected');
			var current = opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate();
//			t.find('td[abbr='+current+']').addClass('calendar-selected');
			t.find('td[abbr="'+current+'"]').addClass('calendar-selected');
		}
		
		t.find('tr').find('td:first').addClass('calendar-sunday');
		t.find('tr').find('td:last').addClass('calendar-saturday');
		
		t.find('td').hover(
			function(){$(this).addClass('calendar-hover');},
			function(){$(this).removeClass('calendar-hover');}
		).click(function(){
			t.find('.calendar-selected').removeClass('calendar-selected');
			$(this).addClass('calendar-selected');
			var parts = $(this).attr('abbr').split(',');
			opts.current = new Date(parts[0], parseInt(parts[1])-1, parts[2]);
			opts.onSelect.call(target, opts.current);
		});
	}
	
	$.fn.calendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.calendar.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'calendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'calendar', {
					options:$.extend({}, $.fn.calendar.defaults, $.fn.calendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('calendar-noborder');
			}
			setSize(this);
			show(this);
			$(this).find('div.calendar-menu').hide();	// hide the calendar menu
		});
	};
	
	$.fn.calendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'calendar').options;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				$(this).calendar({
					year: date.getFullYear(),
					month: date.getMonth()+1,
					current: date
				});
			});
		}
	};
	
	$.fn.calendar.parseOptions = function(target){
		var t = $(target);
		return {
			width: (parseInt(target.style.width) || undefined),
			height: (parseInt(target.style.height) || undefined),
			fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
			border: (t.attr('border') ? t.attr('border') == 'true' : undefined)
		};
	};
	
	$.fn.calendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		weeks:['S','M','T','W','T','F','S'],
		months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:new Date(),
		
		onSelect: function(date){}
	};
})(jQuery);/**
 * combo - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   panel
 *   validatebox
 * 
 */
(function($){
	function setSize(target, width){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if (width) opts.width = width;
		
		combo.appendTo('body');
		
		if (isNaN(opts.width)){
			opts.width = combo.find('input.combo-text').outerWidth();
		}
		var arrowWidth = 0;
		if (opts.hasDownArrow){
			arrowWidth = combo.find('.combo-arrow').outerWidth();
		}
		var width = opts.width - arrowWidth;
		if ($.boxModel == true){
			width -= combo.outerWidth() - combo.width();
		}
		combo.find('input.combo-text').width(width);
		
		panel.panel('resize', {
			width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
			height: opts.panelHeight
		});
		
		combo.insertAfter(target);
	}
	
	function setDownArrow(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		if (opts.hasDownArrow){
			combo.find('.combo-arrow').show();
		} else {
			combo.find('.combo-arrow').hide();
		}
	}
	
	/**
	 * create the combo component.
	 */
	function init(target){
		$(target).addClass('combo-f').hide();
		
		var span = $('<span class="combo"></span>').insertAfter(target);
		var input = $('<input type="text" class="combo-text">').appendTo(span);
		$('<span><span class="combo-arrow"></span></span>').appendTo(span);
		$('<input type="hidden" class="combo-value">').appendTo(span);
		var panel = $('<div class="combo-panel"></div>').appendTo('body');
		panel.panel({
			doSize:false,
			closed:true,
			style:{
				position:'absolute',
				zIndex:10
			},
			onOpen:function(){
				$(this).panel('resize');
			}
		});
		
		var name = $(target).attr('name');
		if (name){
			span.find('input.combo-value').attr('name', name);
			$(target).removeAttr('name').attr('comboName', name);
		}
		input.attr('autocomplete', 'off');
		
		return {
			combo: span,
			panel: panel
		};
	}
	
	function destroy(target){
		var input = $.data(target, 'combo').combo.find('input.combo-text');
		input.validatebox('destroy');
		$.data(target, 'combo').panel.panel('destroy');
		$.data(target, 'combo').combo.remove();
		$(target).remove();
	}
	
	function bindEvents(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		var input = combo.find('.combo-text');
		var arrow = combo.find('.combo-arrow');
		
		$(document).unbind('.combo').bind('mousedown.combo', function(e){
			$('div.combo-panel').panel('close');
		});
		
		combo.unbind('.combo');
		panel.unbind('.combo');
		input.unbind('.combo');
		arrow.unbind('.combo');
		
		if (!opts.disabled){
			panel.bind('mousedown.combo', function(e){
				return false;
			});
			
			input.bind('mousedown.combo', function(e){
				e.stopPropagation();
			}).bind('keydown.combo', function(e){
				switch(e.keyCode){
					case 38:	// up
						opts.keyHandler.up.call(target);
						break;
					case 40:	// down
						opts.keyHandler.down.call(target);
						break;
					case 13:	// enter
						e.preventDefault();
						opts.keyHandler.enter.call(target);
						return false;
					case 9:		// tab
					case 27:	// esc
						hidePanel(target);
						break;
					default:
						if (opts.editable){
							if (state.timer){
								clearTimeout(state.timer);
							}
							state.timer = setTimeout(function(){
								var q = input.val();
								if (state.previousValue != q){
									state.previousValue = q;
									showPanel(target);
									opts.keyHandler.query.call(target, input.val());
									validate(target, true);
								}
							}, opts.delay);
//							setTimeout(function(){
//								var q = input.val();
//								if ($.data(target, 'combo').previousValue != q){
//									$.data(target, 'combo').previousValue = q;
//									showPanel(target);
//									opts.keyHandler.query.call(target, input.val());
//									validate(target, true);
//								}
//							}, 10);
						}
				}
			});
			
			arrow.bind('click.combo', function(){
				if (panel.is(':visible')){
					hidePanel(target);
				} else {
					$('div.combo-panel').panel('close');
					showPanel(target);
				}
				input.focus();
			}).bind('mouseenter.combo', function(){
				$(this).addClass('combo-arrow-hover');
			}).bind('mouseleave.combo', function(){
				$(this).removeClass('combo-arrow-hover');
			}).bind('mousedown.combo', function(){
				return false;
			});
		}
	}
	
	/**
	 * show the drop down panel.
	 */
	function showPanel(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if ($.fn.window){
			panel.panel('panel').css('z-index', $.fn.window.defaults.zIndex++);
		}
		
		panel.panel('move', {
			left:combo.offset().left,
			top:getTop()
		});
		panel.panel('open');
		opts.onShowPanel.call(target);
		
		(function(){
			if (panel.is(':visible')){
				panel.panel('move', {
					left:getLeft(),
					top:getTop()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		
		function getLeft(){
			var left = combo.offset().left;
			if (left + panel.outerWidth() > $(window).width() + $(document).scrollLeft()){
				left = $(window).width() + $(document).scrollLeft() - panel.outerWidth();
			}
			if (left < 0){
				left = 0;
			}
			return left;
		}
		function getTop(){
			var top = combo.offset().top + combo.outerHeight();
			if (top + panel.outerHeight() > $(window).height() + $(document).scrollTop()){
				top = combo.offset().top - panel.outerHeight();
			}
			if (top < $(document).scrollTop()){
				top = combo.offset().top + combo.outerHeight();
			}
			return top;
		}
	}
	
	/**
	 * hide the drop down panel.
	 */
	function hidePanel(target){
		var opts = $.data(target, 'combo').options;
		var panel = $.data(target, 'combo').panel;
		panel.panel('close');
		opts.onHidePanel.call(target);
	}
	
	function validate(target, doit){
		var opts = $.data(target, 'combo').options;
		var input = $.data(target, 'combo').combo.find('input.combo-text');
		input.validatebox(opts);
		if (doit){
			input.validatebox('validate');
			input.trigger('mouseleave');
		}
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
			combo.find('.combo-value').attr('disabled', true);
			combo.find('.combo-text').attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
			combo.find('.combo-value').removeAttr('disabled');
			combo.find('.combo-text').removeAttr('disabled');
		}
	}
	
	function clear(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		if (opts.multiple){
			combo.find('input.combo-value').remove();
		} else {
			combo.find('input.combo-value').val('');
		}
		combo.find('input.combo-text').val('');
	}
	
	function getText(target){
		var combo = $.data(target, 'combo').combo;
		return combo.find('input.combo-text').val();
	}
	
	function setText(target, text){
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-text').val(text);
		validate(target, true);
		$.data(target, 'combo').previousValue = text;
	}
	
	function getValues(target){
		var values = [];
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').each(function(){
			values.push($(this).val());
		});
		return values;
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combo').options;
		var oldValues = getValues(target);
		
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').remove();
		var name = $(target).attr('comboName');
		for(var i=0; i<values.length; i++){
			var input = $('<input type="hidden" class="combo-value">').appendTo(combo);
			if (name) input.attr('name', name);
			input.val(values[i]);
		}
		
		var tmp = [];
		for(var i=0; i<oldValues.length; i++){
			tmp[i] = oldValues[i];
		}
		var aa = [];
		for(var i=0; i<values.length; i++){
			for(var j=0; j<tmp.length; j++){
				if (values[i] == tmp[j]){
					aa.push(values[i]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		
		if (aa.length != values.length || values.length != oldValues.length){
			if (opts.multiple){
				opts.onChange.call(target, values, oldValues);
			} else {
				opts.onChange.call(target, values[0], oldValues[0]);
			}
		}
	}
	
	function getValue(target){
		var values = getValues(target);
		return values[0];
	}
	
	function setValue(target, value){
		setValues(target, [value]);
	}
	
	/**
	 * set the initialized value
	 */
	function initValue(target){
		var opts = $.data(target, 'combo').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		if (opts.multiple){
			if (opts.value){
				if (typeof opts.value == 'object'){
					setValues(target, opts.value);
				} else {
					setValue(target, opts.value);
				}
			} else {
				setValues(target, []);
			}
		} else {
			setValue(target, opts.value);	// set initialize value
		}
		opts.onChange = fn;
	}
	
	$.fn.combo = function(options, param){
		if (typeof options == 'string'){
			return $.fn.combo.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combo');
			if (state){
				$.extend(state.options, options);
			} else {
				var r = init(this);
				state = $.data(this, 'combo', {
					options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options),
					combo: r.combo,
					panel: r.panel,
					previousValue: null
				});
				$(this).removeAttr('disabled');
			}
			$('input.combo-text', state.combo).attr('readonly', !state.options.editable);
			setDownArrow(this);
			setDisabled(this, state.options.disabled);
			setSize(this);
			bindEvents(this);
			validate(this);
			initValue(this);
		});
	};
	
	$.fn.combo.methods = {
		options: function(jq){
			return $.data(jq[0], 'combo').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'combo').panel;
		},
		textbox: function(jq){
			return $.data(jq[0], 'combo').combo.find('input.combo-text');
		},
		destroy: function(jq){
			return jq.each(function(){
				destroy(this);
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		showPanel: function(jq){
			return jq.each(function(){
				showPanel(this);
			});
		},
		hidePanel: function(jq){
			return jq.each(function(){
				hidePanel(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
				bindEvents(this);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
				bindEvents(this);
			});
		},
		validate: function(jq){
			return jq.each(function(){
				validate(this, true);
			});
		},
		isValid: function(jq){
			var input = $.data(jq[0], 'combo').combo.find('input.combo-text');
			return input.validatebox('isValid');
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		getText: function(jq){
			return getText(jq[0]);
		},
		setText: function(jq, text){
			return jq.each(function(){
				setText(this, text);
			});
		},
		getValues: function(jq){
			return getValues(jq[0]);
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		getValue: function(jq){
			return getValue(jq[0]);
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		}
	};
	
	$.fn.combo.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), {
			width: (parseInt(target.style.width) || undefined),
			panelWidth: (parseInt(t.attr('panelWidth')) || undefined),
			panelHeight: (t.attr('panelHeight')=='auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
			separator: (t.attr('separator') || undefined),
			multiple: (t.attr('multiple') ? (t.attr('multiple') == 'true' || t.attr('multiple') == true || t.attr('multiple') == 'multiple') : undefined),
			editable: (t.attr('editable') ? t.attr('editable') == 'true' : undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			hasDownArrow: (t.attr('hasDownArrow') ? t.attr('hasDownArrow') == 'true' : undefined),
			value: (t.val() || undefined),
			delay: (t.attr('delay') ? parseInt(t.attr('delay')) : undefined)
		});
	};
	
	// Inherited from $.fn.validatebox.defaults
	$.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width: 'auto',
		panelWidth: null,
		panelHeight: 200,
		multiple: false,
		separator: ',',
		editable: true,
		disabled: false,
		hasDownArrow: true,
		value: '',
		delay: 200,	// delay to do searching from the last key input event.
		
		keyHandler: {
			up: function(){},
			down: function(){},
			enter: function(){},
			query: function(q){}
		},
		
		onShowPanel: function(){},
		onHidePanel: function(){},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);
/**
 * combobox - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   combo
 * 
 */
(function($){
	/**
	 * scroll panel to display the specified item
	 */
	function scrollTo(target, value){
		var panel = $(target).combo('panel');
		var item = panel.find('div.combobox-item[value=' + value + ']');
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	}
	
	/**
	 * select previous item
	 */
	function selectPrev(target){
		var panel = $(target).combo('panel');
		var values = $(target).combo('getValues');
		var item = panel.find('div.combobox-item[value=' + values.pop() + ']');
		if (item.length){
			var prev = item.prev(':visible');
			if (prev.length){
				item = prev;
			}
		} else {
			item = panel.find('div.combobox-item:visible:last');
		}
		var value = item.attr('value');
		select(target, value);
//		setValues(target, [value]);
		scrollTo(target, value);
	}
	
	/**
	 * select next item
	 */
	function selectNext(target){
		var panel = $(target).combo('panel');
		var values = $(target).combo('getValues');
		var item = panel.find('div.combobox-item[value=' + values.pop() + ']');
		if (item.length){
			var next = item.next(':visible');
			if (next.length){
				item = next;
			}
		} else {
			item = panel.find('div.combobox-item:visible:first');
		}
		var value = item.attr('value');
		select(target, value);
//		setValues(target, [value]);
		scrollTo(target, value);
	}
	
	/**
	 * select the specified value
	 */
	function select(target, value){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		
		if (opts.multiple){
			var values = $(target).combo('getValues');
			for(var i=0; i<values.length; i++){
				if (values[i] == value) return;
			}
			values.push(value);
			setValues(target, values);
		} else {
			setValues(target, [value]);
		}
		
		for(var i=0; i<data.length; i++){
			if (data[i][opts.valueField] == value){
				opts.onSelect.call(target, data[i]);
				return;
			}
		}
	}
	
	/**
	 * unselect the specified value
	 */
	function unselect(target, value){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		var values = $(target).combo('getValues');
		for(var i=0; i<values.length; i++){
			if (values[i] == value){
				values.splice(i, 1);
				setValues(target, values);
				break;
			}
		}
		for(var i=0; i<data.length; i++){
			if (data[i][opts.valueField] == value){
				opts.onUnselect.call(target, data[i]);
				return;
			}
		}
	}
	
	/**
	 * set values
	 */
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		var panel = $(target).combo('panel');
		
		panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			for(var j=0; j<data.length; j++){
				if (data[j][opts.valueField] == v){
					s = data[j][opts.textField];
					break;
				}
			}
			vv.push(v);
			ss.push(s);
			panel.find('div.combobox-item[value=' + v + ']').addClass('combobox-item-selected');
		}
		
		$(target).combo('setValues', vv);
		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
	}
	
	function transformData(target){
		var opts = $.data(target, 'combobox').options;
		var data = [];
		$('>option', target).each(function(){
			var item = {};
			item[opts.valueField] = $(this).attr('value')!=undefined ? $(this).attr('value') : $(this).html();
//			item[opts.valueField] = $(this).attr('value') || $(this).html();
			item[opts.textField] = $(this).html();
			item['selected'] = $(this).attr('selected');
			data.push(item);
		});
		return data;
	}
	
	/**
	 * load data, the old list items will be removed.
	 */
	function loadData(target, data, remainText){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		
		$.data(target, 'combobox').data = data;
		
		var selected = $(target).combobox('getValues');
		panel.empty();	// clear old data
		for(var i=0; i<data.length; i++){
			var v = data[i][opts.valueField];
			var s = data[i][opts.textField];
			var item = $('<div class="combobox-item"></div>').appendTo(panel);
			item.attr('value', v);
			if (opts.formatter){
				item.html(opts.formatter.call(target, data[i]));
			} else {
				item.html(s);
			}
			if (data[i]['selected']){
				(function(){
					for(var i=0; i<selected.length; i++){
						if (v == selected[i]) return;
					}
					selected.push(v);
				})();
			}
		}
		if (opts.multiple){
			setValues(target, selected, remainText);
		} else {
			if (selected.length){
				setValues(target, [selected[selected.length-1]], remainText);
			} else {
				setValues(target, [], remainText);
			}
		}
		
		opts.onLoadSuccess.call(target, data);
		
		$('.combobox-item', panel).hover(
			function(){$(this).addClass('combobox-item-hover');},
			function(){$(this).removeClass('combobox-item-hover');}
		).click(function(){
			var item = $(this);
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					unselect(target, item.attr('value'));
				} else {
					select(target, item.attr('value'));
				}
			} else {
				select(target, item.attr('value'));
				$(target).combo('hidePanel');
			}
		});
	}
	
	/**
	 * request remote data if the url property is setted.
	 */
	function request(target, url, param, remainText){
		var opts = $.data(target, 'combobox').options;
		if (url){
			opts.url = url;
		}
		if (!opts.url) return;
		param = param || {};

		$.ajax({
			type:opts.method,
			url:opts.url,
			dataType:'json',
			data:param,
			success:function(data){
				loadData(target, data, remainText);
			},
			error:function(){
				opts.onLoadError.apply(this, arguments);
			}
		})
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var opts = $.data(target, 'combobox').options;
		
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		
		if (opts.mode == 'remote'){
			request(target, null, {q:q}, true);
		} else {
			var panel = $(target).combo('panel');
			panel.find('div.combobox-item').hide();
			var data = $.data(target, 'combobox').data;
			for(var i=0; i<data.length; i++){
				if (opts.filter.call(target, q, data[i])){
					var v = data[i][opts.valueField];
					var s = data[i][opts.textField];
					var item = panel.find('div.combobox-item[value=' + v + ']');
					item.show();
					if (s == q){
						setValues(target, [v], true);
						item.addClass('combobox-item-selected');
					}
				}
			}
		}
	}
	
	/**
	 * create the component
	 */
	function create(target){
		var opts = $.data(target, 'combobox').options;
		$(target).addClass('combobox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel: function(){
				$(target).combo('panel').find('div.combobox-item').show();
				scrollTo(target, $(target).combobox('getValue'));
				opts.onShowPanel.call(target);
			}
		}));
	}
	
	$.fn.combobox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combobox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combobox');
			if (state){
				$.extend(state.options, options);
				create(this);
			} else {
				state = $.data(this, 'combobox', {
					options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options)
				});
				create(this);
				loadData(this, transformData(this));
			}
			if (state.options.data){
				loadData(this, state.options.data);
			}
			request(this);
		});
	};
	
	
	$.fn.combobox.methods = {
		options: function(jq){
			return $.data(jq[0], 'combobox').options;
		},
		getData: function(jq){
			return $.data(jq[0], 'combobox').data;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combo('clear');
				var panel = $(this).combo('panel');
				panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				request(this, url);
			});
		},
		select: function(jq, value){
			return jq.each(function(){
				select(this, value);
			});
		},
		unselect: function(jq, value){
			return jq.each(function(){
				unselect(this, value);
			});
		}
	};
	
	$.fn.combobox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), {
			valueField: t.attr('valueField'),
			textField: t.attr('textField'),
			mode: t.attr('mode'),
			method: (t.attr('method') ? t.attr('method') : undefined),
			url: t.attr('url')
		});
	};
	
	$.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		
		keyHandler: {
			up: function(){selectPrev(this);},
			down: function(){selectNext(this);},
			enter: function(){
				var values = $(this).combobox('getValues');
				$(this).combobox('setValues', values);
				$(this).combobox('hidePanel');
			},
			query: function(q){doQuery(this, q);}
		},
		filter: function(q, row){
			var opts = $(this).combobox('options');
			return row[opts.textField].indexOf(q) == 0;
		},
		formatter: function(row){
			var opts = $(this).combobox('options');
			return row[opts.textField];
		},
		
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){}
	});
})(jQuery);/**
 * combotree - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   combo
 * 	 tree
 * 
 */
(function($){
	/**
	 * create the combotree component.
	 */
	function create(target){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		
		$(target).addClass('combotree-f');
		$(target).combo(opts);
		var panel = $(target).combo('panel');
		if (!tree){
			tree = $('<ul></ul>').appendTo(panel);
			$.data(target, 'combotree').tree = tree;
		}
		
		tree.tree($.extend({}, opts, {
			checkbox: opts.multiple,
			onLoadSuccess: function(node, data){
				var values = $(target).combotree('getValues');
				if (opts.multiple){
					var nodes = tree.tree('getChecked');
					for(var i=0; i<nodes.length; i++){
						var id = nodes[i].id;
						(function(){
							for(var i=0; i<values.length; i++){
								if (id == values[i]) return;
							}
							values.push(id);
						})();
					}
				}
				$(target).combotree('setValues', values);
				opts.onLoadSuccess.call(this, node, data);
			},
			onClick: function(node){
				retrieveValues(target);
				$(target).combo('hidePanel');
				opts.onClick.call(this, node);
			},
			onCheck: function(node, checked){
				retrieveValues(target);
				opts.onCheck.call(this, node, checked);
			}
		}));
	}
	
	/**
	 * retrieve values from tree panel.
	 */
	function retrieveValues(target){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		var vv = [], ss = [];
		if (opts.multiple){
			var nodes = tree.tree('getChecked');
			for(var i=0; i<nodes.length; i++){
				vv.push(nodes[i].id);
				ss.push(nodes[i].text);
			}
		} else {
			var node = tree.tree('getSelected');
			if (node){
				vv.push(node.id);
				ss.push(node.text);
			}
		}
		$(target).combo('setValues', vv).combo('setText', ss.join(opts.separator));
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		tree.find('span.tree-checkbox').addClass('tree-checkbox0').removeClass('tree-checkbox1 tree-checkbox2');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			var node = tree.tree('find', v);
			if (node){
				s = node.text;
				tree.tree('check', node.target);
				tree.tree('select', node.target);
			}
			vv.push(v);
			ss.push(s);
		}
		$(target).combo('setValues', vv).combo('setText', ss.join(opts.separator));
	}
	
	$.fn.combotree = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combotree.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combotree');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'combotree', {
					options: $.extend({}, $.fn.combotree.defaults, $.fn.combotree.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	
	$.fn.combotree.methods = {
		options: function(jq){
			return $.data(jq[0], 'combotree').options;
		},
		tree: function(jq){
			return $.data(jq[0], 'combotree').tree;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				opts.data = data;
				var tree = $.data(this, 'combotree').tree;
				tree.tree('loadData', data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				var tree = $.data(this, 'combotree').tree;
				if (url) opts.url = url;
				tree.tree({url:opts.url});
			});
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var tree = $.data(this, 'combotree').tree;
				tree.find('div.tree-node-selected').removeClass('tree-node-selected');
				$(this).combo('clear');
			});
		}
	};
	
	$.fn.combotree.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.tree.parseOptions(target));
	};
	
	$.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, $.fn.tree.defaults, {
		editable: false
	});
})(jQuery);/**
 * combogrid - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   combo
 *   datagrid
 * 
 */
(function($){
	/**
	 * create this component.
	 */
	function create(target){
		var opts = $.data(target, 'combogrid').options;
		var grid = $.data(target, 'combogrid').grid;
		
		$(target).addClass('combogrid-f');
		$(target).combo(opts);
		var panel = $(target).combo('panel');
		if (!grid){
			grid = $('<table></table>').appendTo(panel);
			$.data(target, 'combogrid').grid = grid;
		}
		grid.datagrid($.extend({}, opts, {
			border: false,
			fit: true,
			singleSelect: (!opts.multiple),
			onLoadSuccess: function(data){
				var remainText = $.data(target, 'combogrid').remainText;
				var values = $(target).combo('getValues');
				setValues(target, values, remainText);
//				$.data(target, 'combogrid').remainText = false;
					
				opts.onLoadSuccess.apply(target, arguments);
			},
			onClickRow: onClickRow,
			onSelect: function(index, row){retrieveValues(); opts.onSelect.call(this, index, row);},
			onUnselect: function(index, row){retrieveValues(); opts.onUnselect.call(this, index, row);},
			onSelectAll: function(rows){retrieveValues(); opts.onSelectAll.call(this, rows);},
			onUnselectAll: function(rows){
				if (opts.multiple) retrieveValues(); 
				opts.onUnselectAll.call(this, rows);
			}
		}));
		
		function onClickRow(index, row){
			$.data(target, 'combogrid').remainText = false;
			retrieveValues();
			if (!opts.multiple){
				$(target).combo('hidePanel');
			}
			opts.onClickRow.call(this, index, row);
		}
		
		/**
		 * retrieve values from datagrid panel.
		 */
		function retrieveValues(){
			var remainText = $.data(target, 'combogrid').remainText;
			var rows = grid.datagrid('getSelections');
			var vv = [],ss = [];
			for(var i=0; i<rows.length; i++){
				vv.push(rows[i][opts.idField]);
				ss.push(rows[i][opts.textField]);
			}
			if (!opts.multiple){
				$(target).combo('setValues', (vv.length ? vv : ['']));
			} else {
				$(target).combo('setValues', vv);
			}
//			$(target).combo('setValues', vv);
//			if (!vv.length && !opts.multiple){
//				$(target).combo('setValues', ['']);
//			}
			if (!remainText){
				$(target).combo('setText', ss.join(opts.separator));
			}
		}
	}
	
	
	/**
	 * select the specified row via step value,
	 */
	function selectRow(target, step){
		var opts = $.data(target, 'combogrid').options;
		var grid = $.data(target, 'combogrid').grid;
		var rowCount = grid.datagrid('getRows').length;
		$.data(target, 'combogrid').remainText = false;
		
		var index;
		var selections = grid.datagrid('getSelections');
		if (selections.length){
			index = grid.datagrid('getRowIndex', selections[selections.length-1][opts.idField]);
			index += step;
			if (index < 0) index = 0;
			if (index >= rowCount) index = rowCount - 1;
		} else if (step > 0){
			index = 0;
		} else if (step < 0){
			index = rowCount - 1;
		} else {
			index = -1;
		}
		if (index >= 0){
			grid.datagrid('clearSelections');
			grid.datagrid('selectRow', index);
		}
	}
	
	/**
	 * set combogrid values
	 */
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combogrid').options;
		var grid = $.data(target, 'combogrid').grid;
		var rows = grid.datagrid('getRows');
		var ss = [];
//		grid.datagrid('clearSelections');
		for(var i=0; i<values.length; i++){
			var index = grid.datagrid('getRowIndex', values[i]);
			if (index >= 0){
				grid.datagrid('selectRow', index);
				ss.push(rows[index][opts.textField]);
			} else {
				ss.push(values[i]);
			}
		}
		if ($(target).combo('getValues').join(',') == values.join(',')){
			return;
		}
		$(target).combo('setValues', values);
		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var opts = $.data(target, 'combogrid').options;
		var grid = $.data(target, 'combogrid').grid;
		$.data(target, 'combogrid').remainText = true;
		
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		
		if (opts.mode == 'remote'){
			grid.datagrid('clearSelections');
			grid.datagrid('load', {q:q});
		} else {
			if (!q) return;
			var rows = grid.datagrid('getRows');
			for(var i=0; i<rows.length; i++){
				if (opts.filter.call(target, q, rows[i])){
					grid.datagrid('clearSelections');
					grid.datagrid('selectRow', i);
					return;
				}
			}
		}
	}
	
	$.fn.combogrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combogrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return $.fn.combo.methods[options](this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combogrid');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'combogrid', {
					options: $.extend({}, $.fn.combogrid.defaults, $.fn.combogrid.parseOptions(this), options)
				});
			}
			
			create(this);
		});
	};
	
	$.fn.combogrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'combogrid').options;
		},
		// get the datagrid object.
		grid: function(jq){
			return $.data(jq[0], 'combogrid').grid;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combogrid('grid').datagrid('clearSelections');
				$(this).combo('clear');
			});
		}
	};
	
	$.fn.combogrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.datagrid.parseOptions(target), {
			idField: (t.attr('idField') || undefined),
			textField: (t.attr('textField') || undefined),
			mode: t.attr('mode')
		});
	};
	
	$.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults, $.fn.datagrid.defaults, {
		loadMsg: null,
		idField: null,
		textField: null,	// the text field to display.
		mode: 'local',	// or 'remote'
		
		keyHandler: {
			up: function(){selectRow(this, -1);},
			down: function(){selectRow(this, 1);},
			enter: function(){selectRow(this, 0);$(this).combo('hidePanel');},
			query: function(q){doQuery(this, q);}
		},
		filter: function(q, row){
			var opts = $(this).combogrid('options');
			return row[opts.textField].indexOf(q) == 0;
		}
	});
})(jQuery);
/**
 * numberbox - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 validatebox
 * 
 */
(function($){
	/**
	 * init the component and return its value field object;
	 */
	function init(target){
		var v = $('<input type="hidden">').insertAfter(target);
		var name = $(target).attr('name');
		if (name){
			v.attr('name', name);
			$(target).removeAttr('name').attr('numberboxName', name);
		}
		return v;
	}
	
	/**
	 * set the initialized value
	 */
	function initValue(target){
		var opts = $.data(target, 'numberbox').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValue(target, opts.parser.call(target, opts.value));
		opts.onChange = fn;
	}
	
	function getValue(target){
		return $.data(target, 'numberbox').field.val();
	}
	
	function setValue(target, value){
		var state = $.data(target, 'numberbox');
		var opts = state.options;
		var oldValue = getValue(target);
		value = opts.parser.call(target, value);
		opts.value = value;
		state.field.val(value);
		$(target).val(opts.formatter.call(target, value));
//		$(target).numberbox('validate');
		if (oldValue != value){
			opts.onChange.call(target, value, oldValue);
		}
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'numberbox').options;
		
		$(target).unbind('.numberbox').bind('keypress.numberbox', function(e){
			if (e.which == 45){	//-
				return true;
			} if (e.which == 46) {	//.
				return true;
			}
			else if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
				return true;
			} else if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
				return true;
			} else {
				return false;
			}
		}).bind('paste.numberbox', function(){
			if (window.clipboardData) {
				var s = clipboardData.getData('text');
				if (! /\D/.test(s)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}).bind('dragenter.numberbox', function(){
			return false;
		}).bind('blur.numberbox', function(){
			setValue(target, $(this).val());
			$(this).val(opts.formatter.call(target, getValue(target)));
		}).bind('focus.numberbox', function(){
			var vv = getValue(target);
			if ($(this).val() != vv){
				$(this).val(vv);
			}
		});
	}
	
	/**
	 * do the validate if necessary.
	 */
	function validate(target){
		if ($.fn.validatebox){
			var opts = $.data(target, 'numberbox').options;
			$(target).validatebox(opts);
		}
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'numberbox').options;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
		}
	}
	
	$.fn.numberbox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.numberbox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.validatebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'numberbox');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'numberbox', {
					options: $.extend({}, $.fn.numberbox.defaults, $.fn.numberbox.parseOptions(this), options),
					field: init(this)
				});
				$(this).removeAttr('disabled');
				$(this).css({imeMode:"disabled"});
			}
			
			setDisabled(this, state.options.disabled);
			bindEvents(this);
			validate(this);
			initValue(this);
		});
	};
	
	$.fn.numberbox.methods = {
		options: function(jq){
			return $.data(jq[0], 'numberbox').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'numberbox').field.remove();
				$(this).validatebox('destroy');
				$(this).remove();
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		fix: function(jq){
			return jq.each(function(){
				setValue(this, $(this).val());
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		getValue: function(jq){
			return getValue(jq[0]);
		},
		clear: function(jq){
			return jq.each(function(){
				var state = $.data(this, 'numberbox');
				state.field.val('');
				$(this).val('');
//				$(this).numberbox('validate');
			});
		}
	};
	
	$.fn.numberbox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), {
			disabled: (t.attr('disabled') ? true : undefined),
			value: (t.val() || undefined),
			min: (t.attr('min')=='0' ? 0 : parseFloat(t.attr('min')) || undefined),
			max: (t.attr('max')=='0' ? 0 : parseFloat(t.attr('max')) || undefined),
			precision: (parseInt(t.attr('precision')) || undefined),
			decimalSeparator: (t.attr('decimalSeparator') ? t.attr('decimalSeparator') : undefined),
			groupSeparator: (t.attr('groupSeparator') ? t.attr('groupSeparator') : undefined),
			prefix: (t.attr('prefix') ? t.attr('prefix') : undefined),
			suffix: (t.attr('suffix') ? t.attr('suffix') : undefined)
		});
	};
	
	// Inherited from $.fn.validatebox.defaults
	$.fn.numberbox.defaults = $.extend({}, $.fn.validatebox.defaults, {
		disabled: false,
		value: '',
		min: null,
		max: null,
		precision: 0,
		decimalSeparator: '.',
		groupSeparator: '',
		prefix: '',
		suffix: '',
		
		formatter: function(value){
			if (!value) return value;
			
			value = value + '';
			var opts = $(this).numberbox('options');
			var s1 = value, s2 = '';
			var dpos = value.indexOf('.');
			if (dpos >= 0){
				s1 = value.substring(0, dpos);
				s2 = value.substring(dpos+1, value.length);
			}
			if (opts.groupSeparator){
				var p = /(\d+)(\d{3})/;
				while(p.test(s1)){
					s1 = s1.replace(p, '$1' + opts.groupSeparator + '$2');
				}
			}
			if (s2){
				return opts.prefix + s1 + opts.decimalSeparator + s2 + opts.suffix;
			} else {
				return opts.prefix + s1 + opts.suffix;
			}
		},
		parser: function(s){
			s = s + '';
			var opts = $(this).numberbox('options');
			if (opts.groupSeparator) s = s.replace(new RegExp('\\'+opts.groupSeparator,'g'), '');
			if (opts.decimalSeparator) s = s.replace(new RegExp('\\'+opts.decimalSeparator,'g'), '.');
			if (opts.prefix) s = s.replace(new RegExp('\\'+$.trim(opts.prefix),'g'), '');
			if (opts.suffix) s = s.replace(new RegExp('\\'+$.trim(opts.suffix),'g'), '');
			s = s.replace(/\s/g,'');
			
			var val = parseFloat(s).toFixed(opts.precision);
			if (isNaN(val)) {
				val = '';
			} else if (typeof(opts.min) == 'number' && val < opts.min) {
				val = opts.min.toFixed(opts.precision);
			} else if (typeof(opts.max) == 'number' && val > opts.max) {
				val = opts.max.toFixed(opts.precision);
			}
			return val;
		},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);/**
 * searchbox - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	menubutton
 * 
 */
(function($){
	function init(target){
		$(target).hide();
		var span = $('<span class="searchbox"></span>').insertAfter(target);
		var input = $('<input type="text" class="searchbox-text">').appendTo(span);
		$('<span><span class="searchbox-button"></span></span>').appendTo(span);
		
		var name = $(target).attr('name');
		if (name){
			input.attr('name', name);
			$(target).removeAttr('name').attr('searchboxName', name);
		}
		
		return span;
	}
	
	function setSize(target){
		var opts = $.data(target, 'searchbox').options;
		var sb = $.data(target, 'searchbox').searchbox;
		if (width) opts.width = width;
		sb.appendTo('body');
		
		if (isNaN(opts.width)){
			opts.width = sb.outerWidth();
		}
		var width = opts.width - sb.find('a.searchbox-menu').outerWidth() - sb.find('span.searchbox-button').outerWidth();
		if ($.boxModel == true){
			width -= sb.outerWidth() - sb.width();
		}
		sb.find('input.searchbox-text').width(width);
		
		sb.insertAfter(target);
	}
	
	function buildMenu(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		
		if (opts.menu){
			state.menu = $(opts.menu).menu({
				onClick:function(item){
					attachMenu(item);
				}
			});
			var selected = state.menu.children('div.menu-item:first[selected]');
			if (!selected.length){
				selected = state.menu.children('div.menu-item:first');
			}
			selected.triggerHandler('click');
			
//			var item = state.menu.menu('getItem', state.menu.children('div.menu-item')[0]);
//			state.menu.children('div.menu-item').triggerHandler('click');
		} else {
			state.searchbox.find('a.searchbox-menu').remove();
			state.menu = null;
		}
		
		function attachMenu(item){
			state.searchbox.find('a.searchbox-menu').remove();
			var mb = $('<a class="searchbox-menu" href="javascript:void(0)"></a>').html(item.text);
			mb.prependTo(state.searchbox).menubutton({
				menu:state.menu,
				iconCls:item.iconCls
			});
			state.searchbox.find('input.searchbox-text').attr('name', $(item.target).attr('name') || item.text);
			setSize(target);
		}
	}
	
	function bindEvents(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		var input = state.searchbox.find('input.searchbox-text');
		var button = state.searchbox.find('.searchbox-button');
		input.unbind('.searchbox').bind('blur.searchbox', function(e){
			opts.value = $(this).val();
			if (opts.value == ''){
				$(this).val(opts.prompt);
				$(this).addClass('searchbox-prompt');
			} else {
				$(this).removeClass('searchbox-prompt');
			}
		}).bind('focus.searchbox', function(e){
			if ($(this).val() != opts.value){
				$(this).val(opts.value);
			}
			$(this).removeClass('searchbox-prompt');
		}).bind('keydown.searchbox', function(e){
			if (e.keyCode == 13){
				e.preventDefault();
				var name = $.fn.prop ? input.prop('name') : input.attr('name');
				opts.value = $(this).val();
				opts.searcher.call(target, opts.value, name);
				return false;
			}
		});
		
		button.unbind('.searchbox').bind('click.searchbox', function(){
			var name = $.fn.prop ? input.prop('name') : input.attr('name');
			opts.searcher.call(target, opts.value, name);
		}).bind('mouseenter.searchbox', function(){
			$(this).addClass('searchbox-button-hover');
		}).bind('mouseleave.searchbox', function(){
			$(this).removeClass('searchbox-button-hover');
		});
	}
	
	function initValue(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		var input = state.searchbox.find('input.searchbox-text');
		if (opts.value == ''){
			input.val(opts.prompt);
			input.addClass('searchbox-prompt');
		} else { 
			input.val(opts.value);
			input.removeClass('searchbox-prompt');
		}
	}
	
	$.fn.searchbox = function(options, param){
		if (typeof options == 'string'){
			return $.fn.searchbox.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'searchbox');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'searchbox', {
					options: $.extend({}, $.fn.searchbox.defaults, $.fn.searchbox.parseOptions(this), options),
					searchbox: init(this)
				});
			}
			buildMenu(this);
			initValue(this);
			bindEvents(this);
			setSize(this);
		});
	}
	
	$.fn.searchbox.methods = {
		options: function(jq){
			return $.data(jq[0], 'searchbox').options;
		},
		menu: function(jq){
			return $.data(jq[0], 'searchbox').menu;
		},
		textbox: function(jq){
			return $.data(jq[0], 'searchbox').searchbox.find('input.searchbox-text');
		},
		getValue: function(jq){
			return $.data(jq[0], 'searchbox').options.value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				$(this).searchbox('options').value = value;
				$(this).searchbox('textbox').val(value);
				$(this).searchbox('textbox').blur();
			});
		},
		getName: function(jq){
			return $.data(jq[0], 'searchbox').searchbox.find('input.searchbox-text').attr('name');
		},
		selectName: function(jq, name){
			return jq.each(function(){
				var menu = $.data(this, 'searchbox').menu;
				if (menu){
					menu.children('div.menu-item[name="'+name+'"]').triggerHandler('click');
				}
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var menu = $(this).searchbox('menu');
				if (menu){
					menu.menu('destroy');
				}
				$.data(this, 'searchbox').searchbox.remove();
				$(this).remove();
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		}
	};
	
	$.fn.searchbox.parseOptions = function(target){
		var t = $(target);
		return {
			width: (parseInt(target.style.width) || undefined),
			prompt: t.attr('prompt'),
			value: t.val(),
			menu: t.attr('menu'),
			searcher: (t.attr('searcher') ? eval(t.attr('searcher')) : undefined)
		};
	};
	
	$.fn.searchbox.defaults = {
		width:'auto',
		prompt:'',
		value:'',
		menu:null,
		searcher:function(value,name){}
	};
})(jQuery);/**
 * datebox - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 calendar
 *   combo
 * 
 */
(function($){
	/**
	 * create date box
	 */
	function createBox(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		
		$(target).addClass('datebox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel:function(){
				state.calendar.calendar('resize');
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('textbox').parent().addClass('datebox');
		
		/**
		 * if the calendar isn't created, create it.
		 */
		if (!state.calendar){
			createCalendar();
		}
		
		function createCalendar(){
			var panel = $(target).combo('panel');
			state.calendar = $('<div></div>').appendTo(panel).wrap('<div class="datebox-calendar-inner"></div>');
			state.calendar.calendar({
				fit:true,
				border:false,
				onSelect:function(date){
					var value = opts.formatter(date);
					setValue(target, value);
					$(target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
			setValue(target, opts.value);
			
			var button = $('<div class="datebox-button"></div>').appendTo(panel);
			$('<a href="javascript:void(0)" class="datebox-current"></a>').html(opts.currentText).appendTo(button);
			$('<a href="javascript:void(0)" class="datebox-close"></a>').html(opts.closeText).appendTo(button);
			button.find('.datebox-current,.datebox-close').hover(
					function(){$(this).addClass('datebox-button-hover');},
					function(){$(this).removeClass('datebox-button-hover');}
			);
			button.find('.datebox-current').click(function(){
				state.calendar.calendar({
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1,
					current:new Date()
				});
			});
			button.find('.datebox-close').click(function(){
				$(target).combo('hidePanel');
			});
		}
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var opts = $.data(target, 'datebox').options;
		var c = $.data(target, 'datebox').calendar;
		var value = opts.formatter(c.calendar('options').current);
		setValue(target, value);
		$(target).combo('hidePanel');
	}
	
	function setValue(target, value){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		$(target).combo('setValue', value).combo('setText', value);
		state.calendar.calendar('moveTo', opts.parser(value));
	}
	
	$.fn.datebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datebox', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.datebox.methods = {
		options: function(jq){
			return $.data(jq[0], 'datebox').options;
		},
		calendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'datebox').calendar;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		}
	};
	
	$.fn.datebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), {
		});
	};
	
	$.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		
		keyHandler: {
			up:function(){},
			down:function(){},
			enter:function(){doEnter(this);},
			query:function(q){doQuery(this, q);}
		},
		
		currentText:'Today',
		closeText:'Close',
		okText:'Ok',
		
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return m+'/'+d+'/'+y;
		},
		parser:function(s){
			var t = Date.parse(s);
			if (!isNaN(t)){
				return new Date(t);
			} else {
				return new Date();
			}
		},
		
		onSelect:function(date){}
	});
})(jQuery);
/**
 * datetimebox - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 datebox
 *   timespinner
 * 
 */
(function($){
	function createBox(target){
		var state = $.data(target, 'datetimebox');
		var opts = state.options;
		
		$(target).datebox($.extend({}, opts, {
			onShowPanel:function(){
				var value = $(target).datetimebox('getValue');
				setValue(target, value, true);
				opts.onShowPanel.call(target);
			}
		}));
		$(target).removeClass('datebox-f').addClass('datetimebox-f');
		
		// override the calendar onSelect event, don't close panel when selected
		$(target).datebox('calendar').calendar({
			onSelect:function(date){
				opts.onSelect.call(target, date);
			}
		});
		
		var panel = $(target).datebox('panel');
		if (!state.spinner){
			var p = $('<div style="padding:2px"><input style="width:80px"></div>').insertAfter(panel.children('div.datebox-calendar-inner'));
			state.spinner = p.children('input');
			state.spinner.timespinner({
				showSeconds: true
			}).bind('mousedown',function(e){
				e.stopPropagation();
			});
			setValue(target, opts.value);
			
			var button = panel.children('div.datebox-button');
			var ok = $('<a href="javascript:void(0)" class="datebox-ok"></a>').html(opts.okText).appendTo(button);
			ok.hover(
				function(){$(this).addClass('datebox-button-hover');},
				function(){$(this).removeClass('datebox-button-hover');}
			).click(function(){
				doEnter(target);
			});
		}
	}
	
	/**
	 * get current date, including time
	 */
	function getCurrentDate(target){
		var c = $(target).datetimebox('calendar');
		var t = $(target).datetimebox('spinner');
		var date = c.calendar('options').current;
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), t.timespinner('getHours'), t.timespinner('getMinutes'), t.timespinner('getSeconds'));
	}
	
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q, true);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var opts = $.data(target, 'datetimebox').options;
		var date = getCurrentDate(target);
		setValue(target, opts.formatter(date));
		$(target).combo('hidePanel');
	}
	
	/**
	 * set value, if remainText is assigned, don't change the text value
	 */
	function setValue(target, value, remainText){
		var opts = $.data(target, 'datetimebox').options;
		
		$(target).combo('setValue', value);
		if (!remainText){
			if (value){
				var date = opts.parser(value);
				$(target).combo('setValue', opts.formatter(date));
				$(target).combo('setText', opts.formatter(date));
			} else {
				$(target).combo('setText', value);
			}
		}
		var date = opts.parser(value);
		$(target).datetimebox('calendar').calendar('moveTo', opts.parser(value));
		$(target).datetimebox('spinner').timespinner('setValue', getTimeS(date));
		
		/**
		 * get the time formatted string such as '03:48:02'
		 */
		function getTimeS(date){
			function formatNumber(value){
				return (value < 10 ? '0' : '') + value;
			}
			
			var tt = [formatNumber(date.getHours()), formatNumber(date.getMinutes())];
			if (opts.showSeconds){
				tt.push(formatNumber(date.getSeconds()));
			}
			return tt.join($(target).datetimebox('spinner').timespinner('options').separator);
		}
	}
	
	$.fn.datetimebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datetimebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datetimebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datetimebox', {
					options: $.extend({}, $.fn.datetimebox.defaults, $.fn.datetimebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	}
	
	$.fn.datetimebox.methods = {
		options: function(jq){
			return $.data(jq[0], 'datetimebox').options;
		},
		spinner: function(jq){
			return $.data(jq[0], 'datetimebox').spinner;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		}
	};
	
	$.fn.datetimebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datebox.parseOptions(target), {
		});
	};
	
	$.fn.datetimebox.defaults = $.extend({}, $.fn.datebox.defaults, {
		showSeconds:true,
		
		keyHandler: {
			up:function(){},
			down:function(){},
			enter:function(){doEnter(this);},
			query:function(q){doQuery(this, q);}
		},
		
		formatter:function(date){
			var h = date.getHours();
			var M = date.getMinutes();
			var s = date.getSeconds();
			function formatNumber(value){
				return (value < 10 ? '0' : '') + value;
			}
			return $.fn.datebox.defaults.formatter(date) + ' ' + formatNumber(h)+':'+formatNumber(M)+':'+formatNumber(s);
		},
		parser:function(s){
			if ($.trim(s) == ''){
				return new Date();
			}
			var dt = s.split(' ');
			var d = $.fn.datebox.defaults.parser(dt[0]);
			var tt = dt[1].split(':');
			var hour = parseInt(tt[0], 10);
			var minute = parseInt(tt[1], 10);
			var second = parseInt(tt[2], 10);
			return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, second);
		}
	});
})(jQuery);
/**
 * spinner - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   validatebox
 * 
 */
(function($){
	/**
	 * initialize the spinner.
	 */
	function init(target){
		var spinner = $(
				'<span class="spinner">' +
				'<span class="spinner-arrow">' +
				'<span class="spinner-arrow-up"></span>' +
				'<span class="spinner-arrow-down"></span>' +
				'</span>' +
				'</span>'
				).insertAfter(target);
		$(target).addClass('spinner-text').prependTo(spinner);
		return spinner;
	}
	
	function setSize(target, width){
		var opts = $.data(target, 'spinner').options;
		var spinner = $.data(target, 'spinner').spinner;
		if (width) opts.width = width;
		
		var spacer = $('<div style="display:none"></div>').insertBefore(spinner);
		spinner.appendTo('body');
		
		if (isNaN(opts.width)){
			opts.width = $(target).outerWidth();
		}
		var arrowWidth = spinner.find('.spinner-arrow').outerWidth();
		var width = opts.width - arrowWidth;
		if ($.boxModel == true){
			width -= spinner.outerWidth() - spinner.width();
		}
		$(target).width(width);
		
		spinner.insertAfter(spacer);
		spacer.remove();
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'spinner').options;
		var spinner = $.data(target, 'spinner').spinner;
		
		spinner.find('.spinner-arrow-up,.spinner-arrow-down').unbind('.spinner');
		if (!opts.disabled){
			spinner.find('.spinner-arrow-up').bind('mouseenter.spinner', function(){
				$(this).addClass('spinner-arrow-hover');
			}).bind('mouseleave.spinner', function(){
				$(this).removeClass('spinner-arrow-hover');
			}).bind('click.spinner', function(){
				opts.spin.call(target, false);
				opts.onSpinUp.call(target);
				$(target).validatebox('validate');
			});
			
			spinner.find('.spinner-arrow-down').bind('mouseenter.spinner', function(){
				$(this).addClass('spinner-arrow-hover');
			}).bind('mouseleave.spinner', function(){
				$(this).removeClass('spinner-arrow-hover');
			}).bind('click.spinner', function(){
				opts.spin.call(target, true);
				opts.onSpinDown.call(target);
				$(target).validatebox('validate');
			});
		}
	}
	
	/**
	 * enable or disable the spinner.
	 */
	function setDisabled(target, disabled){
		var opts = $.data(target, 'spinner').options;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
		}
	}
	
	$.fn.spinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.spinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.validatebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'spinner');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'spinner', {
					options: $.extend({}, $.fn.spinner.defaults, $.fn.spinner.parseOptions(this), options),
					spinner: init(this)
				});
				$(this).removeAttr('disabled');
			}
			$(this).val(state.options.value);
			$(this).attr('readonly', !state.options.editable);
			setDisabled(this, state.options.disabled);
			setSize(this);
			$(this).validatebox(state.options);
			bindEvents(this);
		});
	};
	
	$.fn.spinner.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'spinner').options;
			return $.extend(opts, {
				value: jq.val()
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var spinner = $.data(this, 'spinner').spinner;
				$(this).validatebox('destroy');
				spinner.remove();
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
				bindEvents(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
				bindEvents(this);
			});
		},
		getValue: function(jq){
			return jq.val();
		},
		setValue: function(jq, value){
			return jq.each(function(){
				var opts = $.data(this, 'spinner').options;
				opts.value = value;
				$(this).val(value);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'spinner').options;
				opts.value = '';
				$(this).val('');
			});
		}
	};
	
	$.fn.spinner.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), {
			width: (parseInt(target.style.width) || undefined),
			value: (t.val() || undefined),
			min: t.attr('min'),
			max: t.attr('max'),
			increment: (parseFloat(t.attr('increment')) || undefined),
			editable: (t.attr('editable') ? t.attr('editable') == 'true' : undefined),
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.spinner.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width: 'auto',
		value: '',
		min: null,
		max: null,
		increment: 1,
		editable: true,
		disabled: false,
		
		spin: function(down){},	// the function to implement the spin button click
		
		onSpinUp: function(){},
		onSpinDown: function(){}
	});
})(jQuery);/**
 * numberspinner - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 spinner
 * 	 numberbox
 */
(function($){
	function create(target){
		var opts = $.data(target, 'numberspinner').options;
		$(target).spinner(opts).numberbox(opts);
	}
	
	function doSpin(target, down){
		var opts = $.data(target, 'numberspinner').options;
		
		var v = parseFloat($(target).numberbox('getValue') || opts.value) || 0;
//		var v = parseFloat($(target).val() || opts.value) || 0;
		if (down == true){
			v -= opts.increment;
		} else {
			v += opts.increment;
		}
//		$(target).val(v).numberbox('fix');
		$(target).numberbox('setValue', v);
	}
	
	$.fn.numberspinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.numberspinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.spinner(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'numberspinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'numberspinner', {
					options: $.extend({}, $.fn.numberspinner.defaults, $.fn.numberspinner.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	$.fn.numberspinner.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'numberspinner').options;
			return $.extend(opts, {
				value: jq.numberbox('getValue')
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				$(this).numberbox('setValue', value);
			});
		},
		getValue: function(jq){
			return jq.numberbox('getValue');
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).spinner('clear');
				$(this).numberbox('clear');
			});
		}
	};
	
	$.fn.numberspinner.parseOptions = function(target){
		return $.extend({}, $.fn.spinner.parseOptions(target), $.fn.numberbox.parseOptions(target), {
		});
	};
	
	$.fn.numberspinner.defaults = $.extend({}, $.fn.spinner.defaults, $.fn.numberbox.defaults, {
		spin: function(down){doSpin(this, down);}
	});
})(jQuery);/**
 * timespinner - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   spinner
 * 
 */
(function($){
	function create(target){
		var opts = $.data(target, 'timespinner').options;
		$(target).spinner(opts);
		
		$(target).unbind('.timespinner');
		$(target).bind('click.timespinner', function(){
			var start = 0;
			if (this.selectionStart != null){
				start = this.selectionStart;
			} else if (this.createTextRange){
				var range = target.createTextRange();
				var s = document.selection.createRange();
				s.setEndPoint("StartToStart", range);
				start = s.text.length;
			}
			if (start >= 0 && start <= 2){
				opts.highlight = 0;
			} else if (start >= 3 && start <= 5){
				opts.highlight = 1;
			} else if (start >= 6 && start <= 8){
				opts.highlight = 2;
			}
			highlight(target);
		}).bind('blur.timespinner', function(){
			fixValue(target);
		});
	}
	
	/**
	 * highlight the hours or minutes or seconds.
	 */
	function highlight(target){
		var opts = $.data(target, 'timespinner').options;
		var start = 0, end = 0;
		if (opts.highlight == 0){
			start = 0;
			end = 2;
		} else if (opts.highlight == 1){
			start = 3;
			end = 5;
		} else if (opts.highlight == 2){
			start = 6;
			end = 8;
		}
		if (target.selectionStart != null){
			target.setSelectionRange(start, end);
		} else if (target.createTextRange){
			var range = target.createTextRange();
			range.collapse();
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
		$(target).focus();
	}
	
	/**
	 * parse the time and return it or return null if the format is invalid
	 */
	function parseTime(target, value){
		var opts = $.data(target, 'timespinner').options;
		if (!value) return null;
		var vv = value.split(opts.separator);
		for(var i=0; i<vv.length; i++){
			if (isNaN(vv[i])) return null;
		}
		while(vv.length < 3){
			vv.push(0);
		}
		return new Date(1900, 0, 0, vv[0], vv[1], vv[2]);
	}
	
	function fixValue(target){
		var opts = $.data(target, 'timespinner').options;
		var value = $(target).val();
		var time = parseTime(target, value);
		if (!time){
			time = parseTime(target, opts.value);
		}
		if (!time){
			opts.value = '';
			$(target).val('');
			return;
		}
		
		var minTime = parseTime(target, opts.min);
		var maxTime = parseTime(target, opts.max);
		if (minTime && minTime > time) time = minTime;
		if (maxTime && maxTime < time) time = maxTime;
		
		var tt = [formatNumber(time.getHours()), formatNumber(time.getMinutes())];
		if (opts.showSeconds){
			tt.push(formatNumber(time.getSeconds()));
		}
		var val = tt.join(opts.separator);
		opts.value = val;
		$(target).val(val);
		
//		highlight(target);
		
		function formatNumber(value){
			return (value < 10 ? '0' : '') + value;
		}
	}
	
	function doSpin(target, down){
		var opts = $.data(target, 'timespinner').options;
		var val = $(target).val();
		if (val == ''){
			val = [0,0,0].join(opts.separator);
		}
		var vv = val.split(opts.separator);
		for(var i=0; i<vv.length; i++){
			vv[i] = parseInt(vv[i], 10);
		}
		if (down == true){
			vv[opts.highlight] -= opts.increment;
		} else {
			vv[opts.highlight] += opts.increment;
		}
		$(target).val(vv.join(opts.separator));
		fixValue(target);
		highlight(target);
	}
	
	
	$.fn.timespinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.timespinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.spinner(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'timespinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'timespinner', {
					options: $.extend({}, $.fn.timespinner.defaults, $.fn.timespinner.parseOptions(this), options)
				});
				create(this);
			}
		});
	};
	
	$.fn.timespinner.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			return $.extend(opts, {
				value: jq.val()
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				$(this).val(value);
				fixValue(this);
			});
		},
		getHours: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.val().split(opts.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.val().split(opts.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.val().split(opts.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	
	$.fn.timespinner.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.spinner.parseOptions(target), {
			separator: t.attr('separator'),
			showSeconds: (t.attr('showSeconds') ? t.attr('showSeconds') == 'true' : undefined),
			highlight: (parseInt(t.attr('highlight')) || undefined)
		});
	};
	
	$.fn.timespinner.defaults = $.extend({}, $.fn.spinner.defaults, {
		separator: ':',
		showSeconds: false,
		highlight: 0,	// The field to highlight initially, 0 = hours, 1 = minutes, ...
		spin: function(down){doSpin(this, down);}
	});
})(jQuery);/**
 * parser - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 */

(function($){
	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['linkbutton','menu','menubutton','splitbutton','progressbar',
				 'tree','combobox','combotree','numberbox','validatebox','searchbox',
				 'numberspinner','timespinner','calendar','datebox','datetimebox',
				 'layout','panel','datagrid','propertygrid','treegrid','tabs','accordion','window','dialog'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.easyui-' + name, context);
				if (r.length){
					if (r[name]){
						r[name]();
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq[name]();
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		}
	};
	$(function(){
		if (!window.easyloader && $.parser.auto){
			$.parser.parse();
		}
	});
})(jQuery);