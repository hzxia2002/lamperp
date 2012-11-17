/**
 */
(function($){
    JODialog = function(options) {
        this.options = {icon: 'warning',
                fixed: true,
                lock: true,
                ok: true,
                path: '../',
                type:'warning'};

        this.options = $.extend(this.options, options || {});

        this.options.init = function() {
            alert('aaaa');
        }

        artDialog.call(this, this.options);
    }

    JODialog = $.fn.extend(JODialog, artDialog, {
        init : function() {
            debugger;

            artDialog.fn._init.call(this, this.options);

            if(this.options.type == 'notice') {

                api = this;
                aConfig = api.config;
                wrap = api.DOM.wrap;
                top = parseInt(wrap[0].style.top);
                hide = top + wrap[0].offsetHeight;

                wrap.css('top', hide + 'px')
                    .animate({top: top + 'px'}, duration, function () {
                        opt.init && opt.init.call(api, here);
                    });

            }
        }
    });
})(jQuery);