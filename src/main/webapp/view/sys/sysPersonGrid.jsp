<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysPersonGrid").jqGrid({
            url:'${ctx}/sysPerson/grid.do',
            datatype: "json",
            //colNames:["标识","编号","姓名","身份证号","年龄","性别","出生年月","籍贯","移动电话","固定电话","传真","邮件","邮政编码","学历","工作年限","MSN_CODE","QQ_CODE","备注","创建时间","更新时间","更新人","创建人","操作"],
            colNames:["ID","工号","姓名","性别","身份证","移动电话","所属集团","所属工地","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false, hidden:true},
				{name:'code',index:'code',width:80,align:"center",sortable:false},
				{name:'name',index:'name',width:80,align:"center",sortable:false},
//				{name:'age',index:'age',width:80,align:"center",sortable:false},
				{name:'sex',index:'sex',width:80,align:"center",sortable:false, formatter:genderFormatter},
                {name:'card',index:'card',width:80,align:"center",sortable:false},
//				{name:'bornDate',index:'bornDate',width:80,align:"center",sortable:false},
//				{name:'bornPlace',index:'bornPlace',width:80,align:"center",sortable:false},
				{name:'mobile',index:'mobile',width:80,align:"center",sortable:false},
				{name:'deptName',index:'deptName',width:80,align:"center",sortable:false},
				{name:'workSiteName',index:'workSiteName',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysPersonGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "人员列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysPersonGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>&nbsp;";
                    operation += "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>&nbsp;";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysPersonGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysPersonGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysPersonGrid").setGridWidth(width, true);
        };


//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysPersonForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });

    function doView(id) {
        openWindow("sysPersonWindow", "查看", "${ctx}/sysPerson/view.do?id=" + id, true, "sysPersonGrid");
    }

    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("sysPersonWindow", "编辑", "${ctx}/sysPerson/init.do?id=" + id, true, "sysPersonGrid", 660, 520);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysPerson/delete.do?id=" + id, "sysPersonGrid");
    }

    function doAdd() {
        openWindow("sysPersonWindow", "新增", "${ctx}/sysPerson/initAdd.do", true, "sysPersonGrid", 660, 520);
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="人员管理列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysPersonForm" action="">
                    <table width="100%">
                        <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                        <tr>
                            <td width="25%">
                                工号：<input type="text" value="" class="title_input"
                                          id="code" name="code" op="like" entity="t" isCapital="false"/>
                            </td>
                            <td width="25%">
                                姓名：<input type="text" value="" class="title_input"
                                            id="name" name="name" op="like" entity="t" isCapital="false"/>
                            </td>
                            <td width="25%" align="center">
                                身份证：<input type="text" value="" class="title_input"
                                            id="card" name="card" op="like" entity="t" dType="Number"/>
                            </td>
                            <td>
                                &nbsp;<input type="button" value="查询" class="btn_Search" onclick="javascript:search('sysPersonGrid','sysPersonForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd();"/>
                                <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            <%--</div>--%>
        </div>
        <table id="sysPersonGrid"></table>
        <div id="pageSysPersonGrid"></div>
        <div id="sysPersonWindow"></div>
    </div>
</body>
</html>