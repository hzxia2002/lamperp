/**
 **/
JOTree = function(options){
    this.options ={
        showMenuMethod:null
    };
    this.options = $.extend(this.options,options||{});
    this.init();
};

JOTree.prototype = {
    init:function(){
        this.addMethods();
        var treeObj;
        var options = this.options;

        this.setting = {
            async:{
                enable:true,
                autoParam:["id","uid","type"],
                url:this.options.url
            }, callback:{
                onAsyncSuccess:function (event, treeId, treeNode, msg) {
                    if (options.openRoot) {
                        var allNodes = treeObj.getNodes();

                        if (allNodes && allNodes.length > 0) {
                            treeObj.openRoot = false;
                            treeObj.expandNode(treeObj.getNodes()[0], true);
                        }
                    }
                }
            }
        };
        var onAsyncSuccess ;
        if(this.options.callback.onAsyncSuccess){
            onAsyncSuccess = this.options.callback.onAsyncSuccess;
        }
        $.extend(this.options.callback,this.setting.callback || {});
        if(onAsyncSuccess){
            this.options.callback.onAsyncSuccess = onAsyncSuccess;
        }
        this.setting = $.extend(this.setting,this.options||{});

//        debugger;

        if(this.options.menu){
            this.setting.callback.onRightClick = this.OnRightClick;
        }
        if(this.options.check){
            this.setting.check = {
                enable: true,
                chkStyle:"checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            }
        }

        this.initRoot();
        treeObj = this.tree = $.fn.zTree.init($("#"+this.options.treeId), this.setting, this.root);
    },
    initRoot:function(){
        this.root = this.options.root
    },
    addMethods:function(){
        var treeObj = this;
        this.OnRightClick = function(event, treeId, treeNode){
            if(treeObj.setting.menu){
                treeObj.addMenu(treeNode,event);
            }
        }
    },
    addMenu:function(treeNode,event){
        this.tree.selectNode(treeNode);
        this.showRMenu(treeNode,event);
    },
    showRMenu:function(treeNode,e){
        if(this.menu){
            //销毁先前menu
            this.menu.hide();
            this.menu = null;
            delete this.menu;
        }
        this.menu  = this.setting.menu.call(this,treeNode);
        this.menu.show({ top: e.pageY, left: e.pageX });
        return false;
    }
};

var treeActions = {
    //刷新节点
    refreshNode:function (treeNode, zTree) {
        treeNode = treeNode || zTree.getSelectedNodes()[0];
        zTree.reAsyncChildNodes(treeNode, "refresh");
    },
    //刷新父节点
    refreshParentNode:function (treeNode, zTree) {
        treeNode = treeNode || zTree.getSelectedNodes()[0];
        zTree.reAsyncChildNodes(treeNode.getParentNode(), "refresh");
    },
    moveUp:function (treeNode, zTree, className) {
        if (!isVaildTreeId(treeNode)) return;
        className = className || clazz;
        $.get(CONTEXT_NAME + "/commonPage/moveUp.do?id=" + treeNode.uid + "&clazz=" + className, function () {
            treeActions.refreshParentNode(treeNode, zTree);
        });
    },
    moveDown:function (treeNode, zTree, className) {
        if (!isVaildTreeId(treeNode)) return;
        className = className || clazz;
        $.get(CONTEXT_NAME + "/commonPage/moveDown.do?id=" + treeNode.uid + "&clazz=" + className, function () {
            treeActions.refreshParentNode(treeNode, zTree);
        });
    }
//    curdAction:function (treeNode, zTree, title, url) {
//        treeNode.url = url;
//        openWindow(title, url);
//    }
};

function isVaildTreeId(treeNode) {
    return treeNode && treeNode.uid && $.isNumeric(treeNode.uid);
}

/**
 * 增删改情况下刷新树节点
 */
function refreshTree(treeId, type) {
    if (treeId) {
        var zTreeId = $.fn.zTree.getZTreeObj(treeId);
        var treeNode = zTreeId.getSelectedNodes()[0];
        if (!treeNode) {
            return;
        }

        if (type) {
            if (type == 'add') {      //添加情况
                //当当前节点不是父节点且在上面添加子节点时，刷新当前节点则无刷新，所以刷新父节点，因为刷新节点没有回调函数，所以不展开当前节点
                if (!treeNode.isParent) {
                    treeActions.refreshParentNode(treeNode, zTreeId);
                } else {
                    treeActions.refreshNode(treeNode, zTreeId);
                }
            } else if (type == 'delete') {    //删除情况
                var parentNode = treeNode.getParentNode();
                //当当前节点为唯一子节点且被删除时，刷新它的祖父节点，否则父节点左边图标无法刷新
                if (treeNode.isFirstNode && treeNode.isLastNode && parentNode) {
                    treeActions.refreshParentNode(parentNode, zTreeId)
                } else {
                    treeActions.refreshParentNode(treeNode, zTreeId);
                }
            } else {   //修改情况
                treeActions.refreshParentNode(treeNode, zTreeId);
            }
        } else {
            treeActions.refreshParentNode(treeNode, zTreeId);
        }
    }
}


