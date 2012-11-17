<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    var treeObj;

    $(document).ready(function () {
        jQuery("#sysCodeDetailGrid").jqGrid({
            url:'${ctx}/sysCodeDetail/grid.do',
            datatype: "json",
//            colNames:["标识","代码","编码","名称","叶节点","树形层次","是否系统定义","特殊标记","是否有效","备注","操作"],
            colNames:["ID","代码分类","编码","名称","叶节点","系统定义","特殊标记","是否有效","备注","操作"],
            colModel:[
                {name:'id',index:'id',width:20,align:"center",sortable:false,hidden:true},
                {name:'sysCode.name',index:'sysCode.name',width:80,align:"center",sortable:false},
//                {name:'parent',index:'parent',width:80,align:"center",sortable:false},
                {name:'code',index:'code',width:80,align:"center",sortable:false},
                {name:'name',index:'name',width:80,align:"center",sortable:false},
                {name:'isLeaf',index:'isLeaf',width:30,align:"center",sortable:false, formatter:booleanFormatter},
//                {name:'treeId',index:'treeId',width:80,align:"center",sortable:false},
                {name:'isReserved',index:'isReserved',width:30,align:"center",sortable:false, formatter:booleanFormatter},
                {name:'tag',index:'tag',width:30,align:"center",sortable:false, formatter:booleanFormatter},
                {name:'isValid',index:'isValid',width:30,align:"center",sortable:false, formatter:booleanFormatter},
                {name:'description',index:'description',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysCodeDetailGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "明细代码列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysCodeDetailGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysCodeDetailGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysCodeDetailGrid").jqGrid('navGrid','#pageSysCodeDetailGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysCodeDetailGrid").setGridWidth(width, true);
        };

        var tree = new JOTree({treeId:"sysCodeDetailTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysCode/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });

//        tree.openRoot();

//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysCodeDetailForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        treeObj = $.fn.zTree.getZTreeObj("sysCodeDetailTreeDiv");
    });

    function zTreeOnClick(event, treeId, treeNode) {
        if(treeNode.id != 'root') {
            $("#sysCode_id").val(treeNode.uid);
        } else {
            $("#sysCode_id").val("");
        }

        search('sysCodeDetailGrid','sysCodeDetailForm');
    };

    function getMenu(treeNode){
        if(treeNode.uid == 'root') {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加代码集', click:function(item){doAddCode()}},
                        { line: true },
                        { text: '刷新', click:function(item) {refreshNode()} }
                    ]
            });
        } else {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加代码项', icon:'add', click:function(item){doAdd(treeNode.uid)}},
                        { line: true },
                        { text: '修改代码集', click:function(item){doCodeEdit(treeNode.uid)}},
                        { text: '删除代码集', click:function(item){doCodeDelete(treeNode.uid)}},
                        { text: '查看代码集', click:function(item){doCodeView(treeNode.uid)}},
                        { line: true },
                        { text: '上移', click:function(item){doMoveup(treeNode)}},
                        { text: '下移', click:function(item){doMovedown(treeNode)}},
                        { line: true },
                        { text: '刷新', click:function(item) {refreshNode()} }
                    ]
            });
        }
    }

    function doMoveup(treeNode) {
        treeActions.moveUp(treeNode, treeObj, "com.justonetech.system.domain.SysCode");
    }

    function doMovedown(treeNode) {
        treeActions.moveDown(treeNode, treeObj, "com.justonetech.system.domain.SysCode");
    }

    function doCodeView(id) {
        openWindow("sysCodeDetailWindow", "查看", "${ctx}/sysCode/view.do?id=" + id, true, "sysCodeDetailGrid", 650, 300);
    }

    /**
     *
     * @param id
     */
    function doCodeEdit(id) {
        openWindow("sysCodeDetailWindow", "编辑代码集", "${ctx}/sysCode/init.do?id=" + id, true, "sysCodeDetailGrid", 650, 300, refreshParentNode);
    }

    /**
     * 删除代码集
     *
     * @param id
     */
    function doCodeDelete(id) {
        $.ajax({
            type: 'POST',
            url: "${ctx}/sysCode/delete.do",
            cache: false,
            dataType: 'json',
            data:{id: id},
            success: function(data) {
                if (data.success) {
                    showInfoMsg(data.msg,null);
                    refreshTree("sysCodeDetailTreeDiv", "delete");
                } else {
                    showErrorMsg(data.msg);
                }
            },
            error: function(xmlR, status, e) {
                showErrorMsg("[" + e + "]" + xmlR.responseText);
            }
        });
        <%--doGridDelete("${ctx}/sysCodeDetail/delete.do?id=" + id, "sysCodeDetailGrid");--%>
    }

    /**
     * 增加代码集
     */
    function doAddCode() {
        openWindow("sysCodeDetailWindow", "新增代码集", "${ctx}/sysCode/initAdd.do", true, "sysCodeDetailGrid", 650, 300, refreshNode);
    }

    function doView(id) {
        openWindow("sysCodeDetailWindow", "查看", "${ctx}/sysCodeDetail/view.do?id=" + id, true, "sysCodeDetailGrid", 650, 350);
    }

    function doEdit(id) {
        openWindow("sysCodeDetailWindow", "编辑代码项", "${ctx}/sysCodeDetail/init.do?id=" + id, true, "sysCodeDetailGrid", 650, 350);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysCodeDetail/delete.do?id=" + id, "sysCodeDetailGrid");
    }

    /**
     * 增加代码项
     *
     * @param deptId
     */
    function doAdd(sysCodeId) {
        if(sysCodeId != undefined && sysCodeId != null) {
            openWindow("sysCodeDetailWindow", "新增", "${ctx}/sysCodeDetail/initAdd.do?sysCode=" + sysCodeId, true, "sysCodeDetailGrid", 650, 350);
        } else {
            showInfoMsg("请选择需要增加代码项的代码集!", "info");
        }
    }

    function refreshNode(){
        treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0],"refresh");
    }

    function refreshParentNode(){
        if(treeObj.getSelectedNodes()[0] != null) {
            treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0].getParentNode(), "refresh");
        } else {
            refreshNode();
        }
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="west" split="true" title="系统代码信息" style="width:150px;">
    <div>
        <ul id="sysCodeDetailTreeDiv" class="ztree"></ul>
    </div>
</div>
<div region="center" title="系统代码明细列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
        <div id="effect1">
            <form id="sysCodeDetailForm" action="">
                <input type="hidden" id="sysCode_id" name="sysCode_id" value="" op="eq" entity="t"/>
                <table width="100%">
                    <tr>
                        <td width="8%" nowrap="nowrap" align="left">
                            代码:
                            <input type="text" id="code" name="code" value="" class="title_input"
                                   op="like" entity="t" isCapital="false" dtype="String"/>
                        </td>
                        <td width="8%" nowrap="nowrap" align="left">
                            名称:
                            <input type="text" id="name" name="name" value="" class="title_input"
                                   op="like" entity="t" isCapital="false" dtype="String"/>
                        </td>
                        <td align="left" width="85%">&nbsp;&nbsp;
                            <input type="button" value="查询" class="btn_Search" onClick="javascript:search('sysCodeDetailGrid', 'sysCodeDetailForm');"/>&nbsp;
                            <%--<input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>--%>
                        </td>
                    </tr>
                </table>
                <div style="display: none;height:30px" id="advanced_condition">

                </div>
            </form>
        </div>
    <%--</div>--%>
    <table id="sysCodeDetailGrid"></table>
    <div id="pageSysCodeDetailGrid"></div>
    <div id="sysCodeDetailWindow"></div>
</div>
</body>
</html>