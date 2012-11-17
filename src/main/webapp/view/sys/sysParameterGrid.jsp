<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysParameterGrid").jqGrid({
            url:'${ctx}/sysParameter/grid.do',
            datatype: "json",
//            colNames:["ID","参数代码","参数名称","参数值","约束","长参数","创建时间","更新时间","创建人","更新人","操作"],
            colNames:["ID","参数代码","参数名称","参数值","约束","长参数","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false, hidden:true},
				{name:'code',index:'code',width:80,align:"center",sortable:false},
				{name:'name',index:'name',width:80,align:"center",sortable:false},
				{name:'value',index:'value',width:80,align:"center",sortable:false},
				{name:'constraint',index:'constraint',width:80,align:"center",sortable:false},
				{name:'clobvalue',index:'clobvalue',width:120,align:"center",sortable:false},
//				{name:'createTime',index:'createTime',width:80,align:"center",sortable:false},
//				{name:'updateTime',index:'updateTime',width:80,align:"center",sortable:false},
//				{name:'createUser',index:'createUser',width:80,align:"center",sortable:false},
//				{name:'updateUser',index:'updateUser',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysParameterGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "参数列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysParameterGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysParameterGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysParameterGrid").jqGrid('navGrid','#pageSysParameterGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysParameterGrid").setGridWidth(width, true);
        };


        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysParameterForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });

    function doView(id) {
        openWindow("sysParameterWindow", "查看", "${ctx}/sysParameter/view.do?id=" + id, true, "sysParameterGrid", 650, 280);
    }

    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("sysParameterWindow", "编辑", "${ctx}/sysParameter/init.do?id=" + id, true, "sysParameterGrid", 650, 280);
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysParameter/delete.do?id=" + id, "sysParameterGrid");
    }

    function doAdd() {
        openWindow("sysParameterWindow", "新增", "${ctx}/sysParameter/init.do", true, "sysParameterGrid", 650, 300);
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="center" title="系统参数表列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysParameterForm" action="">
                    <table width="100%">
                        <input type="hidden" value="" id="treeId" name="treeId" op="like" entity="t"/>
                        <tr>
                            <td width="25%">
                                参数代码：<input type="text" value="" class="title_input"
                                            id="code" name="code" op="like" entity="t"/>
                            </td>
                            <td width="25%" align="center">
                                参数名称：<input type="text" value="" class="title_input"
                                            id="name" name="name" op="like" entity="t" dType="Number"/>
                            </td>
                            <td>
                                <input type="button" value="查询" class="btn_Search" onclick="javascript:search('sysParameterGrid','sysParameterForm');"/>&nbsp;
                                <input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd();"/>
                                <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            </div>
        <%--</div>--%>
        <table id="sysParameterGrid"></table>
        <div id="pageSysParameterGrid"></div>
        <div id="sysParameterWindow"></div>
    </div>
</body>
</html>