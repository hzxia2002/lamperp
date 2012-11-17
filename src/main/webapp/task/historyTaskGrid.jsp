<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../common/taglibs.jsp"%>
<%@include file="/common/header_easyui.jsp" %>
<script language="javascript">
    var treeObj;
    $(document).ready(function () {
        jQuery("#taskGrid").jqGrid({
            url:'${ctx}/task/historyTaskGrid.do',
            datatype: "json",
            colNames:["ID","任务名称","任务标记","计划完成时间","任务开始时间","任务结束时间","翻译字数","翻译员","报酬(元)","是否委托翻译","状态","操作"],
            colModel:[
                {name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
                {name:'name',index:'name',width:80,align:"center",sortable:false},
                {name:'tag',index:'tag',width:80,align:"center",sortable:false},
                {name:'completeDate',index:'completeDate',width:80,align:"center",sortable:false},
                {name:'startDate',index:'startDate',width:80,align:"center",sortable:false},
                {name:'endDate',index:'endDate',width:80,align:"center",sortable:false},
                {name:'wordCount',index:'wordCount',width:80,align:"center",sortable:false},
                {name:'translator.name',index:'translator.name',width:80,align:"center",sortable:false},
                {name:'reward',index:'reward',width:80,align:"center",sortable:false},
                {name:'isEntrust',index:'isEntrust',width:80,align:"center",sortable:false,formatter:booleanFormat},
                {name:'status',index:'status',width:80,align:"center",sortable:false},
//                {name:'doc',index:'doc',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageTaskGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "任务列表",
//            multiselect: true,
            rownumbers: true,
            height: 330,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#taskGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#' style='color:#f60'  class='button'  onclick='doView(" + id + ")'>查看</a>&nbsp;";

                    jQuery("#taskGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#taskGrid").jqGrid('navGrid','#pageTaskGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#taskGrid").setGridWidth(width, true);
        };


//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#taskForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });


    function doView(id) {
        openWindow("taskWindow", "查看", "${ctx}/task/view.do?id=" + id, true, "taskGrid",800,540);
    }

</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="center" title="任务列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
    <div id="effect1">
        <form id="taskForm" action="">
            <table width="100%">
                <input type="hidden" value="" id="project" name="id" op="like" entity="t.project"/>
                <tr>
                    <td width="8%" nowrap="nowrap" align="left">
                        任务名称:
                        <input type="text" id="name" name="name" value="" class="title_input"
                               op="like" entity="t" isCapital="false" dtype="String"/>
                    </td>
                    <td>
                        <input type="button" value="查询" class="btn_Search" onclick="javascript:search('taskGrid','taskForm');"/>&nbsp;
                        <%--<input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>--%>
                        <%--<a href="javascript:void(0);" onclick="toggleDiv('advanced_condition', '0')">高级查询</a>--%>
                    </td>
                </tr>
            </table>
            <div style="display: none;height:30px" id="advanced_condition">

            </div>
        </form>
    </div>
    <%--</div>--%>
    <table id="taskGrid"></table>
    <div id="pageTaskGrid"></div>
    <div id="taskWindow"></div>
</div>
</body>
</html>