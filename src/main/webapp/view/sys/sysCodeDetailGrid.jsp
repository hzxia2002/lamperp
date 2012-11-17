<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysCodeDetailGrid").jqGrid({
            url:'${ctx}/sysCodeDetail/grid.do',
            datatype: "json",
            colNames:["标识","代码标识","父节点","编码","名称","叶节点","树形层次","是否系统定义","特殊标记","是否有效","备注","操作"],
            colModel:[
				{name:'id',index:'id',width:80,align:"center",sortable:false},
				{name:'sysCode',index:'sysCode',width:80,align:"center",sortable:false},
				{name:'parent',index:'parent',width:80,align:"center",sortable:false},
				{name:'code',index:'code',width:80,align:"center",sortable:false},
				{name:'name',index:'name',width:80,align:"center",sortable:false},
				{name:'isLeaf',index:'isLeaf',width:80,align:"center",sortable:false},
				{name:'treeId',index:'treeId',width:80,align:"center",sortable:false},
				{name:'isReserved',index:'isReserved',width:80,align:"center",sortable:false},
				{name:'tag',index:'tag',width:80,align:"center",sortable:false},
				{name:'isValid',index:'isValid',width:80,align:"center",sortable:false},
				{name:'description',index:'description',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageSysCodeDetailGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
            caption: "单位列表",
            multiselect: true,
            rownumbers:true,
            height: 442,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysCodeDetailGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 Modify(id)
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysCodeDetailGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysDeptGrid").jqGrid('navGrid','#pageSysCodeDetailGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysCodeDetailGrid").setGridWidth(width, true);
        };

        var tree = new JOTree({treeId:"sysCodeDetailTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysCodeDetail/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });

        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysCodeDetailForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });

    function zTreeOnClick(event, treeId, treeNode) {
        $("#sysCodeDetailTree").val(treeNode.treeId);
        search('sysCodeDetailGrid','sysCodeDetailForm');
    };
	
    function getMenu(treeNode){
        return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                [
                    { text: '增加', icon:'add' },
                    { text: '修改' },
                    { line: true },
                    { text: '查看', children:
                            [
                                { text: '报表'},
                                { text: '导出', children: [{ text: 'Excel' }, { text: 'Word'}]
                                }
                            ] },
                    { text: '关闭' }
                ]
        });
    }

    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("sysDeptWindow", "编辑", "${ctx}/sysCodeDetail/init.do?id=" + id, true, "sysCodeDetailGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysCodeDetail/delete.do?id=" + id, "sysCodeDetailGrid");
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="west" split="true" title="系统代码明细信息" style="width:150px;">
        <div>
            <div id="sysCodeDetailTreeDiv" class="ztree"></div>
        </div>
    </div>
    <div region="center" title="系统代码明细列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">
            <div id="effect1">
                <form id="sysDeptForm" action="">
                    <table width="100%">
                       
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            </div>
        </div>
        <table id="sysCodeDetailGrid"></table>
        <div id="pageSysCodeDetailGrid"></div>
        <div id="sysCodeDetailWindow"></div>
    </div>
</body>
</html>