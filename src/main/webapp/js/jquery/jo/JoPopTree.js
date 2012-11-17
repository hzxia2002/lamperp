/**
 **/
PopTree = function(options){
    this.options ={
        targetValueId:null,
        targetId:null,
        targetType:null,
        onlyLeaf:true
    };
    this.options = $.extend(this.options,options||{});
    this.init();
    this.show();
};

PopTree.prototype.init = function(){
    this.treeId = "_treeId_"+parseInt(Math.random()*1000+1);
    var pop = this;
    var treeId = this.treeId;
    this.window =  art.dialog({
        style:"background-color:#9ACCFB",
        padding:0,
        title: pop.options.title||"弹出树",
        content: '<div class="ztree" id="'+treeId+'" style="width:'+(this.options.width||280)+'px;height:'+(this.options.height||320)+'px;overflow-y:auto;">',
        width:this.options.width||280,
        height:this.options.height||320,
        drag:true,
        lock:false,
        scroll:true,
        init:function(){
            pop.initTree(treeId);
        }
    });
    this.window.button(
        { name: '确定',
            callback: function () {
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

            },focus: true},
        {
            name: '关闭',
            callback: function () {
                this.close();
            }
        });

};

PopTree.prototype.initTree = function(treeWrapId){
    this.setting = {
        view: {fontCss: getFont},
        async:{
            enable:true,
            autoParam:["id","uid","type"],
            url:this.options.url
        }, callback:{

        }
    };

    if(this.options.check){
        this.setting.check = {
            enable: true,
            chkStyle:"checkbox",
            chkboxType: { "Y": "ps", "N": "ps" }
        }
    }

    this.initRoot();
    this.tree =  $.fn.zTree.init($("#"+this.treeId), this.setting, this.root);
};

PopTree.prototype.initRoot = function(){
    this.root = this.options.root|| null;
}

PopTree.prototype.show = function(){
    this.window.show();
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

PopTree.prototype.setMultiValue = function(id,value){
    if(this.options.targetValueId){
        $("#"+this.options.targetValueId).append("<option id='"+id+"'>"+value+"</options>");
    }
};

function getFont(treeId, node) {
    return node.font ? node.font : {};
}