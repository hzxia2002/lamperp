/**
 **/
PopTree = function(options){
    this.options ={
        targetValueId:null,
        targetId:null,
        targetType:null,
        onlyLeaf:true,
        confirmClick:null,
        target:null
    };
    this.options = $.extend(this.options,options||{});
    this.init();
//    this.show();
};

PopTree.prototype.init = function(){
    this.treeId = "_treeId_"+(new Date()).getTime();
    this.dialogId = "_dialog_"+(new Date()).getTime();
    var pop = this;
    var treeId = this.treeId;
    if(!$("#"+this.dialogId)[0]){
        this.contentDiv = '<div id="'+ this.dialogId+'"><div class="ztree" id="'+treeId+'" style="width:'+(this.options.width||300)+'px;height:'+(this.options.height||320)+'px;overflow-y:auto;">';
        if(this.options.target){
            $(this.options.target).append($(this.contentDiv)) ;
        }else{
            $(document.body).append((this.contentDiv)) ;
        }
    }
    this.window = $('#'+this.dialogId).dialog({
        title: pop.options.title||"弹出树",
        modal:  pop.options.modal||false,
        buttons:[{
            text:'确定',
            iconCls:'icon-ok',
            handler:function(){
                if(pop.options.confirmClick){
                    pop.options.confirmClick.call(this,pop.tree.getSelectedNodes());
                    pop.close();
                    return false;
                }
                var selectNodes = pop.tree.getSelectedNodes();
                var checkNodes = pop.tree.getCheckedNodes();
                if(selectNodes.length>0&&!pop.options.check){
                    if(pop.options.onlyLeaf&&selectNodes[0].isParent){
                        alert("请选择叶子节点");
                        return false;
                    }
                    pop.setValue(selectNodes[0].name);
                    pop.setId(selectNodes[0].uid);
                    pop.setType(selectNodes[0].type);
                }else if(checkNodes.length>0){
                    $.each(checkNodes,function(){
                        if(!this.childs){
                            pop.setMultiValue(this.uid,this.name);
                        }
                    })
                }
                pop.close();
            }
        },{
            text:'清空',
            iconCls:'icon-undo',
            handler:function(){
                if(!pop.options.check){
                    pop.setValue("");
                    pop.setId("");
                    pop.setType("");
                }else{
                    pop.delMultiValue();
                }
                pop.close();
            }
        },{
            text:'取消',
            iconCls:'icon-cancel',
            handler:function(){
                pop.close();
            }
        }]
    });
    pop.initTree();
};

PopTree.prototype.initTree = function(treeWrapId){
    var treeObj;
    var options = this.options;

    this.setting = {
        view: {fontCss: getFont},
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

    this.options.callback = $.extend(this.options.callback,this.setting.callback || {});
    this.setting = $.extend(this.setting,this.options||{});

    if(this.options.check){
        this.setting.check = {
            enable: true,
            chkStyle:"checkbox",
            chkboxType: { "Y": "ps", "N": "ps" }
        }
    }

    this.initRoot();
    treeObj = this.tree =  $.fn.zTree.init($("#"+this.treeId), this.setting, this.root);
};

PopTree.prototype.initRoot = function(){
    this.root = this.options.root|| null;
}

PopTree.prototype.show = function(){
    $('#'+this.dialogId).dialog('open');

};

PopTree.prototype.setValue = function(value){
    if(this.options.targetValueId){
        $("#"+this.options.targetValueId).val(value);
    }
};

PopTree.prototype.setId = function(value){
    if(this.options.targetId){
        $("#"+this.options.targetId).val(value);
    }
};

PopTree.prototype.setType = function(value){
    if(this.options.targetType){
        $("#"+this.options.targetType).val(value);
    }
};

PopTree.prototype.close = function(){
    $('#'+this.dialogId).dialog('close');
};

PopTree.prototype.destroy = function(){
    this.win = null;
    this.tree = null;
    delete this.win;
    delete this.tree;
};

PopTree.prototype.setMultiValue = function(id,value){
    if(this.options.targetValueId){
        $("#"+this.options.targetValueId).append("<option id='"+id+"'>"+value+"</options>");
    }
};

PopTree.prototype.delMultiValue = function(){
    if(this.options.targetValueId){
        $("#"+this.options.targetValueId).get(0).options.length = 0;
    }
};


function getFont(treeId, node) {
    return node.font ? node.font : {};
}