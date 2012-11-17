<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    var treeObj;

    $(document).ready(function () {
        jQuery("#sysMenuGrid").jqGrid({
            url:'${ctx}/sysMenu/grid.do',
            datatype: "json",
            colNames:["ID","名称","权限编码","链接地址","事件","叶节点","是否有效","参数","显示图标","目标窗口","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
				{name:'name',index:'name',width:80,align:"center",sortable:false},
				{name:'privilege',index:'privilege',width:80,align:"center",sortable:false},
//				{name:'menuLevel',index:'menuLevel',width:80,align:"center",sortable:false},
				{name:'url',index:'url',width:120,align:"center",sortable:false},
				{name:'jsEvent',index:'jsEvent',width:80,align:"center",sortable:false},
//				{name:'parent',index:'parent',width:80,align:"center",sortable:false},
				{name:'isLeaf',index:'isLeaf',width:40,align:"center",sortable:false, formatter:booleanFormatter},
//				{name:'treeId',index:'treeId',width:80,align:"center",sortable:false},
				{name:'isValid',index:'isValid',width:40,align:"center",sortable:false, formatter:booleanFormatter},
				{name:'param',index:'param',width:80,align:"center",sortable:false},
				{name:'icon',index:'icon',width:80,align:"center",sortable:false},
				{name:'target',index:'target',width:40,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,resizable:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysMenuGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "菜单列表",
            rownumbers:true,
            multiselect: true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysMenuGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation += "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>&nbsp;";
                    operation += "<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysMenuGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysMenuGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysMenuGrid").setGridWidth(width, true);
        };

        var tree = new JOTree({treeId:"sysMenuTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysMenu/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });

//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysMenuForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        treeObj = $.fn.zTree.getZTreeObj("sysMenuTreeDiv");
    });

    function zTreeOnClick(event, treeId, treeNode) {
        $("#treeId").val(treeNode.treeId);
        search('sysMenuGrid','sysMenuForm');
    };
	
    function getMenu(treeNode){
        if(treeNode.uid == 'root') {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
                        { line: true },
                        { text: '刷新', click:function(item){refreshNode();}}
                    ]
            });
        } else {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
                        { text: '修改', click:function(item){doEdit(treeNode.uid)}},
                        { line: true },
                        { text: '上移', click:function(item){doMoveup(treeNode)}},
                        { text: '下移', click:function(item){doMovedown(treeNode)}},
                        { line: true },
                        { text: '刷新', click:function(item){refreshNode();}}
                    ]
            });
        }
    }

    function doMoveup(treeNode) {
        treeActions.moveUp(treeNode, treeObj, "com.justonetech.system.domain.SysMenu");
    }

    function doMovedown(treeNode) {
        treeActions.moveDown(treeNode, treeObj, "com.justonetech.system.domain.SysMenu");
    }

    function doView(id) {
        openWindow("sysMenuWindow", "查看", "${ctx}/sysMenu/view.do?id=" + id, true, "sysMenuGrid");
    }

    /**
     *
     * @param id
     */
    function doEdit(id) {
//        alert(id);
        openWindow("sysMenuWindow", "编辑", "${ctx}/sysMenu/init.do?id=" + id, true, "sysMenuGrid", 650, 420, refreshParentNode);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysMenu/delete.do?id=" + id, "sysMenuGrid", null, refreshNode);
    }

    function doAdd(parentId) {
        if(parentId != undefined && parentId != null && parentId != 'root') {
            openWindow("sysMenuWindow", "新增", "${ctx}/sysMenu/initAdd.do?parent=" + parentId, true, "sysMenuGrid", 650, 420, refreshNode);
        } else {
            openWindow("sysMenuWindow", "新增", "${ctx}/sysMenu/initAdd.do", true, "sysMenuGrid", 650, 420, refreshNode);
        }
    }

    function refreshNode(){
        treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0],"refresh");
        refreshGrid("sysMenuGrid");
    }

    function refreshParentNode(){
        if(treeObj.getSelectedNodes()[0] != null) {
            treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0].getParentNode(), "refresh");
            refreshGrid("sysMenuGrid");
        } else {
            refreshNode();
        }
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="west" split="true" title="系统菜单信息" style="width:200px;">
        <div>
            <ul id="sysMenuTreeDiv" class="ztree"></ul>
        </div>
    </div>
    <div region="center" title="系统菜单列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysMenuForm" action="">
                    <input type="hidden" id="treeId" name="treeId" value="" op="leftLike" entity="t"/>
                    <table width="100%" height="30">
                       <tr>
                            <td nowrap="nowrap" align="right">名称:&nbsp;&nbsp;
                                <input type="text" id="name" name="name" value="" class="title_input" op="like" entity="t" dtype="String" isCapital="false"/>
                            </td>
                            <td align="left" width="85%">&nbsp;&nbsp;
                                <input type="button" value="查询" class="btn_Search" onClick="javascript:search('sysMenuGrid', 'sysMenuForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                            </td>
                      </tr>
                    </table>
                  <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            <%--</div>--%>
        </div>
        <table id="sysMenuGrid"></table>
        <div id="pageSysMenuGrid"></div>
        <div id="sysMenuWindow"></div>
    </div>
</body>
</html>