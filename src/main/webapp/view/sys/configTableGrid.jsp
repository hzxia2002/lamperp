<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#configTableGrid").jqGrid({
            url:'${ctx}/configTable/grid.do',
            datatype: "json",
            colNames:["ID","表名","Class名","扩展XML","记录日志","创建时间","创建人","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false, hidden:true},
				{name:'tableName',index:'tableName',width:40,align:"center",sortable:true},
                {name:'className',index:'className',width:80,align:"center",sortable:false},
				{name:'extendXml',index:'extendXml',width:80,align:"center",sortable:false},
                {name:'isLog',index:'isLog',width:20,align:"center",sortable:false, formatter:booleanFormatter},
				{name:'createTime',index:'createTime',width:40,align:"center",sortable:false},
				{name:'createUser',index:'createUser',width:40,align:"center",sortable:false},
                {name:'operation',index:'Id',width:30,align:"center",sortable:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageconfigTableGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "日志列表",
            rownumbers:true,
//            multiselect: true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#configTableGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")' >修改</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#configTableGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#configTableGrid").jqGrid('navGrid','#pageconfigTableGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#configTableGrid").setGridWidth(width, true);
        };

//        JORegion.showAll();
    });

    function doEdit(id) {
        openWindow("configTableWindow", "编辑", "${ctx}/configTable/init.do?id=" + id, true, "configTableGrid", 645, 330);
    }

    function doAdd() {
        openWindow("configTableWindow", "新增", "${ctx}/configTable/init.do", true, "configTableGrid", 645, 330);
    }

    /**
     *
     * @param id
     */
    function doView(id) {
        openWindow("configTableWindow", "查看", "${ctx}/configTable/view.do?id=" + id, true, "configTableGrid", 645, 330);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/configTable/delete.do?id=" + id, "configTableGrid");
    }

    function doRefresh() {
        var msg = "您确定要刷新表日志配置信息缓存吗?";

        $.messager.confirm('系统提示', msg, function(r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: "${ctx}/configTable/refresh.do",
//                    data: sendData,
                    dataType: 'json',
                    success: function(data) {
                        if (data.success) {
                            showInfoMsg(data.msg,null);
                        } else {
                            showErrorMsg(data.msg);
                        }
                    },
                    error: function(xmlR, status, e) {
                        showErrorMsg("[" + e + "]" + xmlR.responseText);
                    }
                });
            }
        });
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="表操作日志配置列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="configTableForm" action="">
                    <table width="100%">
                        <tr>
                            <td width="8%" nowrap="nowrap" align="left">
                                表名:
                                <input type="text" id="tableName" name="tableName" value="" class="title_input"
                                       op="like" entity="t" isCapital="false" dtype="String"/>
                            </td>
                            <td width="8%" nowrap="nowrap" align="left">
                                Class名:
                                <input type="text" id="className" name="className" value="" class="title_input"
                                       op="like" entity="t" isCapital="false" dtype="String"/>
                            </td>
                            <td align="left" width="85%">&nbsp;&nbsp;
                                <input type="button" value="查询" class="btn_Search" onClick="javascript:search('configTableGrid', 'configTableForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd();"/>
                                <input type="button" value=" " class="btn_Refresh" onClick="javascript:doRefresh();"/>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            <%--</div>--%>
        </div>
        <table id="configTableGrid"></table>
        <div id="pageConfigTableGrid"></div>
        <div id="configTableWindow"></div>
    </div>
</body>
</html>