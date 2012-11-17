<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#outStorageGrid").jqGrid({
            url:'${ctx}/outStorage/grid.do',
            datatype: "json",
            colNames:["ID","出库单编号","申领人","出库日期","操作"],
            colModel:[
                {name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
                {name:'outNo',index:'outNo',width:80,align:"center",sortable:false},
                {name:'drawer',index:'drawer',width:80,align:"center",sortable:false},
                {name:'outDate',index:'outDate',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageOutStorageGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
            multiselect: true,
            height: 380,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#outStorageGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#' style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
//                    operation = "<a href='#' style='color:#f60' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#outStorageGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#outStorageGrid").jqGrid('navGrid','#pageOutStorageGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#outStorageGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#outStorageForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


    function doView(id) {
        openWindow("outStorageWindow", "查看", "${ctx}/outStorage/view.do?id=" + id, true, "outStorageGrid",800,540);
    }

    function doAdd(parentId) {
        openWindow("outStorageWindow", "新增", "${ctx}/outStorage/init.do", true, "outStorageGrid",800,540);
    }


    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("outStorageWindow", "编辑", "${ctx}/outStorage/init.do?id=" + id, true, "outStorageGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/outStorage/delete.do?id=" + id, "outStorageGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="center" title="出库单列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <div id="effect1">
        <form id="outStorageForm" action="">
            <table width="100%">
                <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                <tr>
                    <td width="8%" nowrap="nowrap" align="left">
                        维修编号:
                        <input type="text" id="name" name="mendForm_mendNo" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td width="8%" nowrap="nowrap" align="left">
                        出库单编号:
                        <input type="text" id="outNo" name="outNo" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td width="8%" nowrap="nowrap" align="left">
                        申领人:
                        <input type="text" id="drawer" name="drawer" value="" class="title_input"
                               op="eq" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td>
                        <input type="button" value="查询" class="btn_Search" onclick="javascript:search('outStorageGrid','outStorageForm');"/>&nbsp;
                        <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                        <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                    </td>
                </tr>
            </table>
            <div style="display: none;height:30px" id="advanced_condition">

            </div>
        </form>
    </div>
    <table id="outStorageGrid"></table>
    <div id="pageOutStorageGrid"></div>
    <div id="outStorageWindow"></div>
</div>
</body>
</html>