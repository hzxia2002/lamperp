<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    var treeObj;

    $(document).ready(function () {
        var grid = jQuery("#sysPrivilegeGrid").jqGrid({
            url:'${ctx}/sysPrivilege/grid.do',
            datatype: "json",
//            colNames:["标识","父节点","权限类型","权限编码","权限名称","TAG","页面地址","定义","描述","是否叶节点","树形层次","操作"],
            colNames:["ID","权限编码","权限名称","权限类型","TAG","页面地址","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false, hidden:true},
//				{name:'parent',index:'parent',width:80,align:"center",sortable:false},
				{name:'code',index:'code',width:80,align:"center",sortable:false},
				{name:'name',index:'name',width:80,align:"center",sortable:false},
                {name:'type.name',index:'type.name',width:80,align:"center",sortable:false},
				{name:'tag',index:'tag',width:80,align:"center",sortable:false},
				{name:'url',index:'url',width:80,align:"center",sortable:false},
//				{name:'definition',index:'definition',width:80,align:"center",sortable:false},
//				{name:'description',index:'description',width:80,align:"center",sortable:false},
//				{name:'isLeaf',index:'isLeaf',width:80,align:"center",sortable:false},
//				{name:'treeId',index:'treeId',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysPrivilegeGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "授权资源列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysPrivilegeGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation += "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysPrivilegeGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysPrivilegeGrid").jqGrid('navGrid','#pageSysPrivilegeGrid',{edit:false,add:false,del:false,search:false});

        jQuery('#sysPrivilegeGrid').jqGrid('navButtonAdd','#pageSysPrivilegeGrid',
                {id:'pager_excel', caption:'',title:'导出Excel',onClickButton : function(e){
                    // 拼接导出数据
                    var cols = getColModelAndNameJson(grid[0].p.colModel, grid[0].p.colNames);

                    var params = getSearchData("sysPrivilegeForm");
                    var postData = {condition:toJsonString(params),
                        colModel: cols
                    };
                    grid[0].p.postData = postData;

                    jQuery("#sysPrivilegeGrid").jqGrid('excelExport',
                            {
                                tag: 'excel',
                                url: '${ctx}/sysPrivilege/exportExcel.do'
                            });
                },buttonicon:'ui-icon-newwin'});

        jQuery('#sysPrivilegeGrid').jqGrid('navButtonAdd','#pageSysPrivilegeGrid',
                {id:'pager_pdf', caption:'',title:'导出Pdf',onClickButton : function(e){
                    // 拼接导出数据
                    var cols = getColModelAndNameJson(grid[0].p.colModel, grid[0].p.colNames);

                    var params = getSearchData("sysPrivilegeForm");
                    var postData = {condition:toJsonString(params),
                        colModel: cols
                    };
                    grid[0].p.postData = postData;

                    jQuery("#sysPrivilegeGrid").jqGrid('excelExport',
                            {
                                tag: 'pdf',
                                url: '${ctx}/sysPrivilege/exportPdf.do'
                            });
                },buttonicon:'ui-icon-print'});

        setGridWidth = function (width){
            jQuery("#sysPrivilegeGrid").setGridWidth(width, true);
        };

        var tree = new JOTree({treeId:"sysPrivilegeTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysPrivilege/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });

//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysPrivilegeForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        treeObj = $.fn.zTree.getZTreeObj("sysPrivilegeTreeDiv");
    });

    function zTreeOnClick(event, treeId, treeNode) {
        $("#treeId").val(treeNode.treeId);
        search('sysPrivilegeGrid','sysPrivilegeForm');
    };
	
    function getMenu(treeNode){
        if(treeNode.uid == 'root') {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
                        { line: true },
                        { text: '刷新', click:function(item){refreshNode()}}
                    ]
            });
        } else {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
                        { text: '修改', click:function(item){doEdit(treeNode.uid)}},
                        { line: true },
                        { text: '刷新', click:function(item){refreshNode()}}
                    ]
            });
        }
    }

    function doView(id) {
        openWindow("sysPrivilegeWindow", "查看", "${ctx}/sysPrivilege/view.do?id=" + id, true, "sysPrivilegeGrid");
    }

    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("sysPrivilegeWindow", "编辑", "${ctx}/sysPrivilege/init.do?id=" + id, true, "sysPrivilegeGrid", 650, 400, refreshParentNode);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysPrivilege/delete.do?id=" + id, "sysPrivilegeGrid", null, refreshParentNode);
    }

    function doAdd(parentId) {
        if(parentId != undefined && parentId != null && parentId != 'root') {
            openWindow("sysPrivilegeWindow", "新增", "${ctx}/sysPrivilege/initAdd.do?parent=" + parentId, true, "sysPrivilegeGrid",650, 400, refreshNode);
        } else {
            openWindow("sysPrivilegeWindow", "新增", "${ctx}/sysPrivilege/initAdd.do", true, "sysPrivilegeGrid", 650, 400, refreshNode);
        }
    }

    function refreshNode(){
        treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0],"refresh");
        refreshGrid("sysPrivilegeGrid");
    }

    function refreshParentNode(){
        if(treeObj.getSelectedNodes()[0] != null) {
            treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0].getParentNode(), "refresh");
            refreshGrid("sysPrivilegeGrid");
        } else {
            refreshNode();
        }
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="west" split="true" title="权限管理信息" style="width:200px;">
        <div>
            <ul id="sysPrivilegeTreeDiv" class="ztree"></ul>
        </div>
    </div>
    <div region="center" title="权限管理列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysPrivilegeForm" action="">
                    <input type="hidden" id="treeId" name="treeId" value="" op="leftLike" entity="t"/>
                    <table width="100%">
                        <tr>
                            <td width="25%">
                                权限编码：<input type="text" value="" class="title_input"
                                            id="code" name="code" op="like" entity="t" isCapital="false"/>
                            </td>
                            <td width="25%" align="center">
                                权限名称：<input type="text" value="" class="title_input"
                                            id="name" name="name" op="like" entity="t" dType="String" isCapital="false"/>
                            </td>
                            <td>
                                <input type="button" value="查询" class="btn_Search" onclick="javascript:search('sysPrivilegeGrid','sysPrivilegeForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                                <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            <%--</div>--%>
        </div>
        <table id="sysPrivilegeGrid"></table>
        <div id="pageSysPrivilegeGrid"></div>
        <div id="sysPrivilegeWindow"></div>
    </div>
</body>
</html>