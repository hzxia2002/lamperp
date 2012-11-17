(function($){
    $.fn.Search = function(options){
        var $searchInput = this;
        //关闭浏览器提供给输入框的自动完成
        this.attr('autocomplete','off');
        //创建自动完成的下拉列表，用于显示服务器返回的数据,插入在搜索按钮的后面，等显示的时候再调整位置
        var $autocomplete = $('<div class="autocomplete"></div>').hide().insertAfter(this);
        var clear = function(){
            $autocomplete.empty().hide();
        };
        //注册事件，当输入框失去焦点的时候清空下拉列表并隐藏
        $searchInput.blur(function(){ setTimeout(clear,500);});
        //下拉列表中高亮的项目的索引，当显示下拉列表项的时候，移动鼠标或者键盘的上下键就会移动高亮的项目，想百度搜索那样
        var selectedItem = null;
        //timeout的ID
        var timeoutid = null;
        //设置下拉项的高亮背景
        var setSelectedItem = function(item){
            //更新索引变量
            selectedItem = item ;
            //按上下键是循环显示的，小于0就置成最大的值，大于最大值就置成0
            if(selectedItem < 0){
                selectedItem =  $autocomplete.find('li').length - 1;
            } else if(selectedItem > $autocomplete.find('li').length-1 ) {
                selectedItem = 0;
            }
            //首先移除其他列表项的高亮背景，然后再高亮当前索引的背景
            $autocomplete.find('li').removeClass('highlight') .eq(selectedItem).addClass('highlight');
        };

        var ajax_request = function(){
            //ajax服务端通信
            $.ajax({
                'url':options.url, //服务器的地址
                'data':{'filter':$searchInput.val()},
                'dataType':'json',
                'type':'POST',
                'success':function(data){
                    if(data.length) {
                        //遍历data，添加到自动完成区
                        $.each(data, function(index,term) {
                            //创建li标签,添加到下拉列表中
                            $("<li/>").text(term).addClass('clickable').appendTo($autocomplete)
                                    .hover(function(){
                                //下拉列表每一项的事件，鼠标移进去的操作
                                $(this).siblings().removeClass('highlight');
                                $(this).addClass('highlight');
                                selectedItem = index;
                            },function(){
                                //下拉列表每一项的事件，鼠标离开的操作
                                $(this).removeClass('highlight');
                                //当鼠标离开时索引置-1，当作标记
                                selectedItem = -1;
                            }).click(function(){
                                //列表为空或者鼠标离开导致当前没有索引值
                                if($autocomplete.find('li').length == 0 || selectedItem == -1) {
                                    return;
                                }
                                $searchInput.val($autocomplete.find('li').eq(selectedItem).text());
                                $autocomplete.empty().hide();
                            });

                        });

                        //事件注册完毕
                        //设置下拉列表的位置，然后显示下拉列表
                        var ypos = $searchInput.position().top;
                        var xpos = $searchInput.position().left;
                        var height = ($searchInput.height()||16)+4;
                        $autocomplete.css('width',$searchInput.css('width'));
                        $autocomplete.css({'position':'absolute','left':xpos + "px",'top':(ypos+height) +"px"});
                        setSelectedItem(0);
                        //显示下拉列表
                        $autocomplete.show();
                    }
                }
            });

        };

        //对输入框进行事件注册
        $searchInput.keyup(function(event) {
            //字母数字，退格，空格
            if(event.keyCode > 40 ||
                    event.keyCode == 8 || event.keyCode ==32) {
                //首先删除下拉列表中的信息
                clear();
                clearTimeout(timeoutid);
                timeoutid =  setTimeout(ajax_request,100);
            }
            else if(event.keyCode == 38){                                 //上
                //selectedItem = -1 代表鼠标离开
                if(selectedItem == -1){
                    setSelectedItem($autocomplete.find('li').length-1);
                }
                else {
                    //索引减1
                    setSelectedItem(selectedItem - 1);
                }
                event.preventDefault();
            }
            else if(event.keyCode == 40) {
                //selectedItem = -1 代表鼠标离开
                if(selectedItem == -1){
                    setSelectedItem(0);
                }
                else {
                    //索引加1
                    setSelectedItem(selectedItem + 1);
                }
                event.preventDefault();
            }

        }).keypress(function(event){
            //enter键
            if(event.keyCode == 13) {
                //列表为空或者鼠标离开导致当前没有索引值
                if($autocomplete.find('li').length == 0 || selectedItem == -1) {
                    return;
                }
                $searchInput.val($autocomplete.find('li').eq(selectedItem).text());
                $autocomplete.empty().hide();
                event.preventDefault();
            }
        }).keydown(function(event){
            //esc键
            if(event.keyCode == 27 ) {
                $autocomplete.empty().hide();
                event.preventDefault();
            }
        });
        //注册窗口大小改变的事件，重新调整下拉列表的位置
        $(window).resize(function() {
            var ypos = $searchInput.position().top;
            var xpos =  $searchInput.position().left;
            var height = ($searchInput.height()||16)+4;
            $autocomplete.css('width',$searchInput.css('width'));
            $autocomplete.css({'position':'absolute','left':xpos + "px",'top':(ypos+height) +"px"});
        });
    };

    artDialog.notice = function (options) {
        var opt = options || {},
                api, aConfig, hide, wrap, top,
                duration = 800;

        var config = {
            id: 'Notice',
            left: '100%',
            top: '100%',
            fixed: true,
            drag: false,
            resize: false,
            follow: null,
            lock: false,
            path: '../',
            init: function(here){
                api = this;
                aConfig = api.config;
                wrap = api.DOM.wrap;
                top = parseInt(wrap[0].style.top);
                hide = top + wrap[0].offsetHeight;

                wrap.css('top', hide + 'px')
                        .animate({top: top + 'px'}, duration, function () {
                    opt.init && opt.init.call(api, here);
                });
            },
            close: function(here){
                wrap.animate({top: hide + 'px'}, duration, function () {
                    opt.close && opt.close.call(this, here);
                    aConfig.close = $.noop;
                    api.close();
                });

                return false;
            }
        };

        for (var i in opt) {
            if (config[i] === undefined) config[i] = opt[i];
        };

        return artDialog(config);
    };

    /**
     * 警告
     * @param	{String}	消息内容
     */
    artDialog.alert = function (content) {
        return artDialog({
            icon: 'warning',
            fixed: true,
            lock: true,
            content: content,
            ok: true,
            path: '../'
        });
    };


    /**
     * 确认
     * @param	{String}	消息内容
     * @param	{Function}	确定按钮回调函数
     * @param	{Function}	取消按钮回调函数
     */
    artDialog.confirm = function (content, yes, no) {
        return artDialog({
            id: 'Confirm',
            icon: 'question',
            fixed: true,
            lock: true,
            opacity: .1,
            content: content,
            path: '../',
            ok: function (here) {
                return yes.call(this, here);
            },
            cancel: function (here) {
                return no && no.call(this, here);
            }
        });
    };


    /**
     * 提问
     * @param	{String}	提问内容
     * @param	{Function}	回调函数. 接收参数：输入值
     * @param	{String}	默认值
     */
    artDialog.prompt = function (content, yes, value) {
        value = value || '';
        var input;

        return artDialog({
            id: 'Prompt',
            icon: 'question',
            fixed: true,
            lock: true,
            opacity: .1,
            path: '../',
            content: [
                '<div style="margin-bottom:5px;font-size:12px">',
                content,
                '</div>',
                '<div>',
                '<input value="',
                value,
                '" style="width:18em;padding:6px 4px" />',
                '</div>'
            ].join(''),
            init: function () {
                input = this.DOM.content.find('input')[0];
                input.select();
                input.focus();
            },
            ok: function (here) {
                return yes && yes.call(this, input.value, here);
            },
            cancel: true
        });
    };


    /**
     * 短暂提示
     * @param	{String}	提示内容
     * @param	{Number}	显示时间 (默认1.5秒)
     */
    artDialog.tips = function (content, time) {
        return artDialog({
            title: false,
            cancel: false,
            fixed: true,
            path: '../',
            lock: false
        }) .content('<div style="padding: 0 1px;">' + content + '</div>') .time(time || 1);
    };

})(jQuery);