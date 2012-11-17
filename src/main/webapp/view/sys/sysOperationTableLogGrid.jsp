<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysOperationTableLogGrid").jqGrid({
            url:'${ctx}/sysOperationTableLog/grid.do',
            datatype: "json",
//            colNames:["标识","数据表","操作日志","IP地址","创建时间","更新时间","更新人","创建人","操作"],
            colNames:["标识","数据表","操作类型","IP地址","操作人","操作时间","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false, hidden:true},
				{name:'table.tableName',index:'table.tableName',width:80,align:"center",sortable:true},
				{name:'logType',index:'logType',width:80,align:"center",sortable:true},
//				{name:'logXml',index:'logXml',width:80,align:"center",sortable:false},
				{name:'ipAddress',index:'ipAddress',width:80,align:"center",sortable:false},
                {name:'createUser',index:'createUser',width:80,align:"center",sortable:false},
				{name:'createTime',index:'createTime',width:80,align:"center",sortable:false},
//				{name:'updateTime',index:'updateTime',width:80,align:"center",sortable:false},
//				{name:'updateUser',index:'updateUser',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:40,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysOperationTableLogGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "单位列表",
//            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysOperationTableLogGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>";
//                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysOperationTableLogGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysOperationTableLogGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysOperationTableLogGrid").setGridWidth(width, true);
        };


//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysOperationTableLogForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


    /**
     *
     * @param id
     */
    function doView(id) {
        openWindow("sysOperationTableLogWindow", "查看", "${ctx}/sysOperationTableLog/view.do?id=" + id, true, "sysOperationTableLogGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysOperationTableLog/delete.do?id=" + id, "sysOperationTableLogGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="数据表操作日志列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysOperationTableLogForm" action="">
                    <table width="100%">
                        <tr>
                            <td width="8%" nowrap="nowrap" align="left">
                                表名:
                                <input type="text" id="tableName" name="tableName" value="" class="title_input"
                                       op="like" entity="t_table" dtype="String" isCapital="false"/>
                            </td>
                            <td width="30%" nowrap="nowrap" align="left">
                                操作时间:
                                <%--<input type="text" name="openDate" class="Wdate" value="${bean.openDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>--%>
                                <input type="text" id="createTime" name="createTime" value="" class="Wdate"
                                       op="moreAndEq" entity="t" dtype="String"
                                       onFocus="WdatePicker({isShowClear:false,readOnly:true})" style="width:100px"/>
                                至
                                <input type="text" id="createTime1" name="createTime" value="" class="Wdate"
                                       op="lessAndEq" entity="t" dtype="String"
                                       onFocus="WdatePicker({isShowClear:false,readOnly:true})" style="width:100px"/>
                            </td>
                            <td align="left">&nbsp;&nbsp;
                                <input type="button" value="查询" class="btn_Search" onClick="javascript:search('sysOperationTableLogGrid', 'sysOperationTableLogForm');"/>&nbsp;
                                <%--<input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            </div>
        <%--</div>--%>
        <table id="sysOperationTableLogGrid"></table>
        <div id="pageSysOperationTableLogGrid"></div>
        <div id="sysOperationTableLogWindow"></div>
    </div>
</body>
</html>