<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#productGrid").jqGrid({
            url:'${ctx}/product/grid.do',
            datatype: "json",
            colNames:["ID","名称","编号","备注","操作"],
            colModel:[
                {name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
                {name:'name',index:'name',width:80,align:"center",sortable:false},
                {name:'code',index:'code',width:80,align:"center",sortable:false},
                {name:'attr1',index:'attr1',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageProductGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "产品列表",
            multiselect: true,
            height: 380,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#productGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#' style='color:#f60' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation = "<a href='#' style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  class='button' style='color:#f60' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#productGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#productGrid").jqGrid('navGrid','#pageProductGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#productGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#productForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


    function doView(id) {
        openWindow("productWindow", "查看", "${ctx}/product/view.do?id=" + id, true, "productGrid",800,330);
    }

    function doAdd(parentId) {
        openWindow("productWindow", "新增", "${ctx}/product/init.do", true, "productGrid",800,330);
    }


    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("productWindow", "编辑", "${ctx}/product/init.do?id=" + id, true, "productGrid",800,330);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/product/delete.do?id=" + id, "productGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="center" title="产品列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <div id="effect1">
        <form id="productForm" action="">
            <table width="100%">
                <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                <tr>
                    <td width="8%" nowrap="nowrap" align="left">
                        产品编码:
                        <input type="text" id="code" name="code" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td width="8%" nowrap="nowrap" align="left">
                        产品名称:
                        <input type="text" id="name" name="name" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td>
                        <input type="button" value="查询" class="btn_Search" onclick="javascript:search('productGrid','productForm');"/>&nbsp;
                        <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                        <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                    </td>
                </tr>
            </table>
            <div style="display: none;height:30px" id="advanced_condition">

            </div>
        </form>
    </div>
    <table id="productGrid"></table>
    <div id="pageProductGrid"></div>
    <div id="productWindow"></div>
</div>
</body>
</html>