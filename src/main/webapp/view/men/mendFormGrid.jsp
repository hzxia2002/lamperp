<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#mendFormGrid").jqGrid({
            url:'${ctx}/mendForm/grid.do',
            datatype: "json",
            colNames:["ID","厂商名称","维修编号","记录日期","店号","中文店名","区域","当店保修","维修等级","维修期限","维修员","状态","状态","操作"],
            colModel:[
                {name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
                {name:'firm.name',index:'firm.name',width:80,align:"center",sortable:false},
                {name:'mendNo',index:'mendNo',width:60,align:"center",sortable:false},
                {name:'recordTime',index:'recordTime',width:80,align:"center",sortable:false},
                {name:'storeNo',index:'storeNo',width:40,align:"center",sortable:false},
                {name:'storeName',index:'storeName',width:80,align:"center",sortable:false},
                {name:'area.name',index:'area',width:40,align:"center",sortable:false},
                {name:'isCurshopGuarant',index:'isCurshopGuarant',width:40,align:"center",sortable:false,formatter:booleanFormatter},
                {name:'mendRank.name',index:'mendRank',width:40,align:"center",sortable:false},
                {name:'mendDueLimit.name',index:'mendDueLimit',width:40,align:"center",sortable:false},
                {name:'mender',index:'mender',width:40,align:"center",sortable:false},
                {name:'statusName',index:'statusName',width:80,align:"center",sortable:false},
                {name:'status',index:'status',width:80,align:"center",sortable:false,hidden:true},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageMendFormGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "维修单列表",
            multiselect: true,
            height: 380,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#mendFormGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var udatas = $("#mendFormGrid").jqGrid('getRowData',id);
                    var operation = "";
                    if(udatas["status"]!="2"){
                        operation =  "<a href='#' style='color:#f60' class='button' onclick='doCheck(" + id + ")'>维修完成</a>&nbsp;";
                    }else{
                        operation =  "<a href='#' style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    }
                    if(udatas["status"]=="0"){
                        operation += "<a href='#' style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                        operation += "&nbsp;<a href='#'  class='button' style='color:#f60' onclick='doDelete(" + id + ")' >删除</a>";
                    }
                    jQuery("#mendFormGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#mendFormGrid").jqGrid('navGrid','#pageMendFormGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#mendFormGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#mendFormForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


    function doView(id) {
        openWindow("mendFormWindow", "查看", "${ctx}/mendForm/view.do?id=" + id, true, "mendFormGrid",840,540);
    }

    function doAdd(parentId) {
        openWindow("mendFormWindow", "新增", "${ctx}/mendForm/init.do", true, "mendFormGrid",840,400);
    }


    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("mendFormWindow", "编辑", "${ctx}/mendForm/init.do?id=" + id, true, "mendFormGrid",840,400);
    }

    function doCheck(id) {
        openWindow("mendFormWindow", "编辑", "${ctx}/mendForm/check.do?id=" + id, true, "mendFormGrid",840,540);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/mendForm/delete.do?id=" + id, "mendFormGrid");
    }

    function exportAsExcel(region){
        if(!$("#mender").val()){
            alert("请填写维修人员");
            return;
        }
        if(!$("#startDate").val()||!$("#endDate").val()){
            alert("请填写维修查询日期起始日期");
            return;
        }
        var params = getSearchData(region);
        window.location.href = "${ctx}/mendForm/exportData.do?condition=" +encodeURIComponent(toJsonString(params));
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="center" title="维修单列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <div id="effect1">
        <form id="mendFormForm" action="">
            <table width="100%">
                <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                <tr>
                    <td width="8%" nowrap="nowrap" align="right">
                        厂商名称:
                    </td>
                    <td>
                        <input type="text" id="code" name="firm_name" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td width="8%" nowrap="nowrap" align="right">
                        维修编号:
                    </td>
                    <td>
                        <input type="text" id="name" name="mendNo" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td   width="8%" nowrap="nowrap" align="right">
                        记录日期:
                    </td>
                    <td>
                        <input type="text" name="recordTime" class="Wdate" value="${bean.recordTime}" onFocus="WdatePicker({readOnly:true})" style="width: 100px" op="like" entity="t" isCapital="false" dtype="String"/>&nbsp;
                    </td>
                    <td   width="8%" nowrap="nowrap" align="right">
                        中文店名:
                    </td>
                    <td>
                        <input type="text" name="storeName" value="${bean.storeName}" op="like" entity="t" isCapital="false" dtype="String" class="title_input"/>&nbsp;
                    </td>
                </tr>
                <tr>
                    <td width="8%" nowrap="nowrap" align="right">
                        维修人员:
                    </td>
                    <td>
                        <input type="text" id="mender" name="mender" value="" class="title_input"
                               op="eq" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td width="8%" nowrap="nowrap" align="right">
                        维修日期:
                    </td>
                    <td>
                        <input type="text" id="startDate" name="mendDate" class="Wdate"  onFocus="WdatePicker({readOnly:true})" style="width: 100px"  op="moreAndEq" entity="t" isCapital="false" dtype="date"/>&nbsp;
                        ~
                        <input type="text" id="endDate"  name="mendDate" class="Wdate"  onFocus="WdatePicker({readOnly:true})" style="width: 100px"  op="lessAndEq" entity="t" isCapital="false" dtype="date"/>&nbsp;
                     </td>
                    <td colspan="4" align="center">
                        <input type="button" value="查询" class="btn_Search" onclick="javascript:search('mendFormGrid','mendFormForm');"/>&nbsp;
                        <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>
                        <input type="button" value="导出报销单" class="btn_out_big" onClick="javascript:exportAsExcel('mendFormForm');"/>
                        <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                    </td>
                </tr>
            </table>
            <div style="display: none;height:30px" id="advanced_condition">

            </div>
        </form>
    </div>
    <table id="mendFormGrid"></table>
    <div id="pageMendFormGrid"></div>
    <div id="mendFormWindow"></div>
</div>
</body>
</html>