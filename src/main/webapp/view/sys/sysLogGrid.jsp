<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysLogGrid").jqGrid({
            url:'${ctx}/sysLog/grid.do',
            datatype: "json",
            colNames:["ID","用户标识","IP地址","进入时间","退出时间","访问页面","操作类型","浏览器版本","SESSIONID","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false, hidden:true},
				{name:'user.loginName',index:'user.loginName',width:40,align:"center",sortable:false},
				{name:'ipAddress',index:'ipAddress',width:40,align:"center",sortable:false},
				{name:'enterTime',index:'enterTime',width:80,align:"center",sortable:false},
				{name:'outTime',index:'outTime',width:80,align:"center",sortable:false},
				{name:'pageUrl',index:'pageUrl',width:80,align:"center",sortable:false},
				{name:'logType.name',index:'logType.name',width:40,align:"center",sortable:false},
				{name:'ieVersion',index:'ieVersion',width:80,align:"center",sortable:false},
				{name:'sessionid',index:'sessionid',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:30,align:"center",sortable:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysLogGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "日志列表",
//            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysLogGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
//                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysLogGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysLogGrid").jqGrid('navGrid','#pageSysLogGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysLogGrid").setGridWidth(width, true);
        };

//        JORegion.showAll();
    });


    /**
     *
     * @param id
     */
    function doView(id) {
        openWindow("sysLogWindow", "查看", "${ctx}/sysLog/view.do?id=" + id, true, "sysLogGrid", 645, 330);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysLog/delete.do?id=" + id, "sysLogGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="用户日志列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysLogForm" action="">
                    <table width="100%">
                        <tr>
                            <td width="8%" nowrap="nowrap" align="left">
                                日志类型:
                                <input type="text" id="loginName" name="loginName" value="" class="title_input"
                                       op="like" entity="t" dtype="String"/>
                            </td>
                            <td width="30%" nowrap="nowrap" align="left">
                                登录时间:
                                <%--<input type="text" name="openDate" class="Wdate" value="${bean.openDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>--%>
                                <input type="text" id="enterTime" name="enterTime" value="" class="Wdate"
                                       op="moreAndEq" entity="t" dtype="String"
                                       onFocus="WdatePicker({isShowClear:false,readOnly:true})" style="width:100px"/>
                                至
                                <input type="text" id="enterTime1" name="enterTime" value="" class="Wdate"
                                       op="lessAndEq" entity="t" dtype="String"
                                       onFocus="WdatePicker({isShowClear:false,readOnly:true})" style="width:100px"/>
                            </td>
                            <td align="left">&nbsp;&nbsp;
                                <input type="button" value="查询" class="btn_Search" onClick="javascript:search('sysLogGrid', 'sysLogForm');"/>&nbsp;
                                <%--<input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            <%--</div>--%>
        </div>
        <table id="sysLogGrid"></table>
        <div id="pageSysLogGrid"></div>
        <div id="sysLogWindow"></div>
    </div>
</body>
</html>