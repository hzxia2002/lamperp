<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#outFormDetailsGrid").jqGrid({
            url:'${ctx}/outFormDetails/grid.do',
            datatype: "json",
            colNames:["ID","材料ID","出库单ID","出库数量","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false},
				{name:'product',index:'product',width:80,align:"center",sortable:false},
				{name:'outStorage',index:'outStorage',width:80,align:"center",sortable:false},
				{name:'count',index:'count',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageOutFormDetailsGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
            caption: "出库单明细列表",
            multiselect: true,
            height: 442,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#outFormDetailsGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
					var operation = "<a href='#' style='color:#f60' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation = "<a href='#' style='color:#f60' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#outFormDetailsGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#outFormDetailsGrid").jqGrid('navGrid','#pageOutFormDetailsGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#outFormDetailsGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#outFormDetailsForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


	function doView(id) {
        openWindow("outFormDetailsWindow", "查看", "${ctx}/outFormDetails/view.do?id=" + id, true, "outFormDetailsGrid",800,430);
    }

	function doAdd(parentId) {
        openWindow("outFormDetailsWindow", "新增", "${ctx}/outFormDetails/init.do", true, "outFormDetailsGrid");
    }


    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("outFormDetailsWindow", "编辑", "${ctx}/outFormDetails/init.do?id=" + id, true, "outFormDetailsGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/outFormDetails/delete.do?id=" + id, "outFormDetailsGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="出库单明细列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">
            <div id="effect1">
                <form id="outFormDetailsForm" action="">
                    <table width="100%">
                        <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>  
						<tr>
						    <td>
                                <input type="button" value="查询" class="btn_Search" onclick="javascript:search('outFormDetailsGrid','outFormDetailsForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                                <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                            </td>
						</tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            </div>
        </div>
        <table id="outFormDetailsGrid"></table>
        <div id="pageOutFormDetailsGrid"></div>
        <div id="outFormDetailsWindow"></div>
    </div>
</body>
</html>