<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysUserRoleGrid").jqGrid({
            url:'${ctx}/sysUserRole/grid.do',
            datatype: "json",
            colNames:["标识","用户标识","角色标识","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false},
				{name:'user',index:'user',width:80,align:"center",sortable:false},
				{name:'role',index:'role',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageSysUserRoleGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
            caption: "单位列表",
            multiselect: true,
            rownumbers:true,
            height: 442,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysUserRoleGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysUserRoleGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysUserRoleGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysUserRoleGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysUserRoleForm input').each(function () {
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
        openWindow("sysDeptWindow", "编辑", "${ctx}/sysUserRole/init.do?id=" + id, true, "sysUserRoleGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysUserRole/delete.do?id=" + id, "sysUserRoleGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="角色与用户关联列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">
            <div id="effect1">
                <form id="sysDeptForm" action="">
                    <table width="100%">
                       
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            </div>
        </div>
        <table id="sysUserRoleGrid"></table>
        <div id="pageSysUserRoleGrid"></div>
        <div id="sysUserRoleWindow"></div>
    </div>
</body>
</html>