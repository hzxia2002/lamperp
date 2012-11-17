<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    var treeObj;
    var grid;

    $(document).ready(function () {
        grid = jQuery("#sysDeptGrid").jqGrid({
            url:'${ctx}/sysDept/grid.do',
            datatype: "json",
            colNames:["ID","单位代码","单位名称","简称","机构代码证","注册地","省市","注册地址","有效","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false,hidden:true},
//				{name:'parent.name',index:'parent.name',width:80,align:"center",sortable:false},
				{name:'code',index:'code',width:80,align:"center",sortable:false},
				{name:'name',index:'name',width:80,align:"center",sortable:false},
				{name:'shortName',index:'shortName',width:80,align:"center",sortable:false},
//				{name:'isLeaf',index:'isLeaf',width:80,align:"center",sortable:false},
//				{name:'treeId',index:'treeId',width:80,align:"center",sortable:false},
				{name:'cardNo',index:'cardNo',width:80,align:"center",sortable:false},
//				{name:'cityCode',index:'cityCode',width:80,align:"center",sortable:false},
				{name:'cityName',index:'cityName',width:80,align:"center",sortable:false},
//				{name:'provinceCode',index:'provinceCode',width:80,align:"center",sortable:false},
				{name:'provinceName',index:'provinceName',width:80,align:"center",sortable:false},
				{name:'address',index:'address',width:80,align:"center",sortable:false},
//				{name:'orderNo',index:'orderNo',width:80,align:"center",sortable:false},
//				{name:'isTag',index:'isTag',width:80,align:"center",sortable:false},
				{name:'isValid',index:'isValid',width:30,align:"center",sortable:false, formatter:booleanFormatter},
//				{name:'memo',index:'memo',width:80,align:"center",sortable:false},
//				{name:'createTime',index:'createTime',width:80,align:"center",sortable:false},
//				{name:'updateTime',index:'updateTime',width:80,align:"center",sortable:false},
//				{name:'createUser',index:'createUser',width:80,align:"center",sortable:false},
//				{name:'updateUser',index:'updateUser',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysDeptGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "单位列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysDeptGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation += "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>&nbsp;";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysDeptGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysDeptGrid',{edit:false,add:false,del:false,search:false,excel:true});

        jQuery('#sysDeptGrid').jqGrid('navButtonAdd','#pageSysDeptGrid',
                {id:'pager_excel', caption:'',title:'导出Excel',onClickButton : function(e){
                    // 拼接导出数据
                    var cols = getColModelAndNameJson(grid[0].p.colModel, grid[0].p.colNames);

                    var params = getSearchData("sysDeptForm");
                    var postData = {condition:toJsonString(params),
                        colModel: cols
                    };
                    grid[0].p.postData = postData;

                    jQuery("#sysDeptGrid").jqGrid('excelExport',
                            {
                                tag: 'excel',
                                url: '${ctx}/sysDept/exportExcel.do'
                            });
                },buttonicon:'ui-icon-newwin'});

        setGridWidth = function (width){
            jQuery("#sysDeptGrid").setGridWidth(width, true);
        };

        var tree = new JOTree({treeId:"sysDeptTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysDept/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });

//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysDeptForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        treeObj = $.fn.zTree.getZTreeObj("sysDeptTreeDiv");
    });

    function zTreeOnClick(event, treeId, treeNode) {
        $("#treeId").val(treeNode.treeId);
        search('sysDeptGrid','sysDeptForm');
    };
	
    function getMenu(treeNode){
        if(treeNode.uid == 'root') {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
//                        { text: '修改', click:function(item){doEdit(treeNode.uid)}},
//                        { text: '查看', icon:'add', click:function(item){doView(treeNode.uid)}}
                        { line: true },
                        { text: '刷新', click:function(item){refreshNode();}}
                    ]
            });
        } else {
            return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                    [
                        { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
                        { text: '修改', click:function(item){doEdit(treeNode.uid)}},
                        { text: '查看', icon:'add', click:function(item){doView(treeNode.uid)}},
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
        treeActions.moveUp(treeNode, treeObj, "com.justonetech.system.domain.SysDept");
    }

    function doMovedown(treeNode) {
        treeActions.moveDown(treeNode, treeObj, "com.justonetech.system.domain.SysDept");
    }

    function doView(id) {
        openWindow("sysDeptWindow", "查看", "${ctx}/sysDept/view.do?id=" + id, true, "sysDeptGrid");
    }

    function doEdit(id) {
        openWindow("sysDeptWindow", "编辑", "${ctx}/sysDept/init.do?id=" + id, true, "sysDeptGrid", 650, 520, refreshParentNode);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysDept/delete.do?id=" + id, "sysDeptGrid", null, refreshNode);
    }

    function doAdd(parentId) {
        if(parentId != undefined && parentId != null && parentId != 'root') {
            openWindow("sysDeptWindow", "新增", "${ctx}/sysDept/initAdd.do?parent=" + parentId, true, "sysDeptGrid", 650, 520, refreshNode);
        } else {
            openWindow("sysDeptWindow", "新增", "${ctx}/sysDept/initAdd.do", true, "sysDeptGrid", 650, 520, refreshNode);
        }
    }

    function refreshNode(){
        treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0],"refresh");
        refreshGrid("sysDeptGrid");
    }

    function refreshParentNode(){
        if(treeObj.getSelectedNodes()[0] != null) {
            treeObj.reAsyncChildNodes(treeObj.getSelectedNodes()[0].getParentNode(), "refresh");
            refreshGrid("sysDeptGrid");
        } else {
            refreshNode();
        }
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="west" split="true" title="单位部门信息" style="width:200px;">
        <div>
            <ul id="sysDeptTreeDiv" class="ztree"></ul>
        </div>
    </div>
    <div region="center" title="单位部门列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysDeptForm" action="">
                    <table width="100%">
                        <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                        <tr>
                            <td width="25%">
                                单位代码：<input type="text" value="" class="title_input"
                                            id="code" name="code" op="like" entity="t"/>
                            </td>
                            <td width="25%" align="center">
                                单位名称：<input type="text" value="" class="title_input"
                                            id="name" name="name" op="like" entity="t" dType="Number"/>
                            </td>
                            <td>
                                <input type="button" value="查询" class="btn_Search" onclick="javascript:search('sysDeptGrid','sysDeptForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                                <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            </div>
        <%--</div>--%>
        <table id="sysDeptGrid"></table>
        <div id="pageSysDeptGrid"></div>
        <div id="sysDeptWindow"></div>
    </div>
</body>
</html>