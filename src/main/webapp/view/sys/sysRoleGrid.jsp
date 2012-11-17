<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysRoleGrid").jqGrid({
            url:'${ctx}/sysRole/grid.do',
            datatype: "json",
            colNames:["ID","角色编码","角色名称","描述","创建时间","更新时间","创建人","更新人","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false, hidden:true},
				{name:'code',index:'code',width:80,align:"center",sortable:false},
				{name:'roleName',index:'roleName',width:80,align:"center",sortable:false},
				{name:'description',index:'description',width:80,align:"center",sortable:false},
				{name:'createTime',index:'createTime',width:80,align:"center",sortable:false},
				{name:'updateTime',index:'updateTime',width:80,align:"center",sortable:false},
				{name:'createUser',index:'createUser',width:80,align:"center",sortable:false},
				{name:'updateUser',index:'updateUser',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysRoleGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "单位列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysRoleGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysRoleGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysRoleGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysRoleGrid").setGridWidth(width, true);
        };


//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysRoleForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });

    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("sysRoleWindow", "编辑", "${ctx}/sysRole/init.do?id=" + id, true, "sysRoleGrid", 650, 300);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysRole/delete.do?id=" + id, "sysRoleGrid");
    }

    function doAdd() {
        openWindow("sysRoleWindow", "新增", "${ctx}/sysRole/initAdd.do", true, "sysRoleGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="角色管理列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysRoleForm" action="">
                    <table width="100%">
                        <tr>
                            <td width="25%">
                                角色编码：<input type="text" value="" class="title_input"
                                            id="code" name="code" op="like" entity="t"/>
                            </td>
                            <td width="25%" align="center">
                                角色名称：<input type="text" value="" class="title_input"
                                            id="roleName" name="roleName" op="like" entity="t" dType="Number"/>
                            </td>
                            <td>
                                <input type="button" value="查询" class="btn_Search" onclick="javascript:search('sysRoleGrid','sysRoleForm');"/>&nbsp;
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
        <table id="sysRoleGrid"></table>
        <div id="pageSysRoleGrid"></div>
        <div id="sysRoleWindow"></div>
    </div>
</body>
</html>