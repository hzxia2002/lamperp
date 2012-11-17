<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#stockGrid").jqGrid({
            url:'${ctx}/stock/grid.do',
            datatype: "json",
            colNames:["ID","产品编码","产品名称","数量"],
            colModel:[
                {name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
                {name:'product.code',index:'product.code',width:80,align:"center",sortable:false},
                {name:'product.name',index:'product.name',width:80,align:"center",sortable:false},
                {name:'count',index:'count',width:80,align:"center",sortable:false}
//				{name:'warehouse',index:'warehouse',width:80,align:"center",sortable:false},
//                {name:'operation',index:'Id',width:80,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageStockGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "库存列表",
            multiselect: true,
            height: 380,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#stockGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
//					var operation = "<a href='#' style='color:#f60' onclick='doView(" + id + ")'>查看</a>&nbsp;";
//                    operation = "<a href='#' style='color:#f60' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
//                    operation += "&nbsp;<a href='#'  style='color:#f60' onclick='doDelete(" + id + ")' >删除</a>";
//                    jQuery("#stockGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#stockGrid").jqGrid('navGrid','#pageStockGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#stockGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#stockForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


    function doView(id) {
        openWindow("stockWindow", "查看", "${ctx}/stock/view.do?id=" + id, true, "stockGrid",800,430);
    }

    function doAdd(parentId) {
        openWindow("stockWindow", "新增", "${ctx}/stock/init.do", true, "stockGrid");
    }


    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("stockWindow", "编辑", "${ctx}/stock/init.do?id=" + id, true, "stockGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/stock/delete.do?id=" + id, "stockGrid");
    }

    function exportAsExcel(region){
        var params = getSearchData(region);
        window.location.href = "${ctx}/stock/exportData.do?condition=" +encodeURIComponent(toJsonString(params));
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="center" title="库存列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <div id="effect1">
        <form id="stockForm" action="">
            <table width="100%">
                <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                <tr>
                    <td width="8%" nowrap="nowrap" align="left">
                        产品编码:
                        <input type="text" id="code" name="product_code" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td width="8%" nowrap="nowrap" align="left">
                        产品名称:
                        <input type="text" id="name" name="product_name" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td>
                        <input type="button" value="查询" class="btn_Search" onclick="javascript:search('stockGrid','stockForm');"/>&nbsp;
                        <%--<input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>--%>
                        <input type="button" value="导出" class="btn_out" onClick="javascript:exportAsExcel('stockForm');"/>
                        <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                    </td>
                </tr>
            </table>
            <div style="display: none;height:30px" id="advanced_condition">

            </div>
        </form>
    </div>
    <table id="stockGrid"></table>
    <div id="pageStockGrid"></div>
    <div id="stockWindow"></div>
</div>
</body>
</html>