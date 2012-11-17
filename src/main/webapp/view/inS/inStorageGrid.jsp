<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#inStorageGrid").jqGrid({
            url:'${ctx}/inStorage/grid.do',
            datatype: "json",
            colNames:["ID","入库单编号","产品编码","产品名称","数量","单价","入库时间","操作人","备注","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
				{name:'code',index:'code',width:60,align:"center",sortable:false},
                {name:'product.code',index:'product.code',width:80,align:"center",sortable:false},
				{name:'product.name',index:'product.name',width:80,align:"center",sortable:false},
				{name:'count',index:'count',width:40,align:"center",sortable:false},
				{name:'price',index:'price',width:40,align:"center",sortable:false},
				{name:'createTime',index:'createTime',width:80,align:"center",sortable:false},
				{name:'createUser',index:'createUser',width:40,align:"center",sortable:false},
				{name:'description',index:'description',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:40,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageInStorageGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "入库列表",
            multiselect: true,
            height: 380,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#inStorageGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
					var operation = "<a href='#' style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation += "<a href='#' style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#inStorageGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#inStorageGrid").jqGrid('navGrid','#pageInStorageGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#inStorageGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#inStorageForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


	function doView(id) {
        openWindow("inStorageWindow", "查看", "${ctx}/inStorage/view.do?id=" + id, true, "inStorageGrid",800,300);
    }

	function doAdd(parentId) {
        openWindow("inStorageWindow", "新增", "${ctx}/inStorage/init.do", true, "inStorageGrid",800,300);
    }


    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("inStorageWindow", "编辑", "${ctx}/inStorage/init.do?id=" + id, true, "inStorageGrid",800,300);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/inStorage/delete.do?id=" + id, "inStorageGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="入库列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
            <div id="effect1">
                <form id="inStorageForm" action="">
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
                                <input type="button" value="查询" class="btn_Search" onclick="javascript:search('inStorageGrid','inStorageForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                                <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                            </td>
						</tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
        </div>
        <table id="inStorageGrid"></table>
        <div id="pageInStorageGrid"></div>
        <div id="inStorageWindow"></div>
    </div>
</body>
</html>