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
			},
            mobile: {
                validator: function (value) {
                    return /^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/.test(value);
                },
                message: '手机号码不正确'
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
                    var reg = new RegExp("^\\d+"+(param?".?\\d{0,"+param+"}":"")+"$");
                    return reg.test(value);
                },
                message: '请输入有效数字'
            },
            ip:{
                validator: function (value) {
                    return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value);
                },
                message: '请输入正确的ip'
            },
            idcard: {
                validator: function (value, param) {
                    return idCard(value);
                },
                message:'请输入正确的身份证号码'
            }

		}
	};
})(jQuery);