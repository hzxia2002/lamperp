<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {
        jQuery("#sysUserGrid").jqGrid({
            url:'${ctx}/sysUser/grid.do',
            datatype: "json",
//            colNames:["标识","人员标识","登陆名","密码","显示名称","帐号状态","失效/锁定原因","开通日期","截止日期","创建时间","更新时间","更新人","创建人","操作"],
            colNames:["ID","登录名","显示名称","公司名称","角色","状态","截止日期","操作"],
            colModel:[
				{name:'id',index:'id',width:20,align:"center",sortable:false, hidden:true},
//				{name:'person',index:'person',width:80,align:"center",sortable:false},
				{name:'loginName',index:'loginName',width:60,align:"center",sortable:false},
//				{name:'password',index:'password',width:80,align:"center",sortable:false},
				{name:'displayName',index:'displayName',width:80,align:"center",sortable:false},
				{name:'deptName',index:'deptName',width:80,align:"center",sortable:false},
				{name:'roleNames',index:'roleNames',width:120,align:"center",sortable:false},
				{name:'status',index:'status',width:20,align:"center",sortable:false, formatter:statusFormatter},
//				{name:'reasonDesc',index:'reasonDesc',width:80,align:"center",sortable:false},
//				{name:'openDate',index:'openDate',width:80,align:"center",sortable:false},
				{name:'closeDate',index:'closeDate',width:60,align:"center",sortable:false},
//				{name:'createTime',index:'createTime',width:80,align:"center",sortable:false},
//				{name:'updateTime',index:'updateTime',width:80,align:"center",sortable:false},
//				{name:'updateUser',index:'updateUser',width:80,align:"center",sortable:false},
//				{name:'createUser',index:'createUser',width:80,align:"center",sortable:false},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false,title:false}
            ],
            rowNum:15,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[15,30,50],
            pager: '#pageSysUserGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
//            caption: "用户列表",
            multiselect: true,
            rownumbers:true,
            height: 350,
            gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=jQuery("#sysUserGrid").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];
                    var operation = "<a href='#'  style='color:#f60' class='button' onclick='doView(" + id + ")'>查看</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doEdit(" + id + ")' >修改</a>";
                    operation += "&nbsp;<a href='#'  style='color:#f60' class='button' onclick='doDelete(" + id + ")' >删除</a>";
                    jQuery("#sysUserGrid").jqGrid('setRowData', ids[i], { operation: operation});
                }
            }
        });

        jQuery("#sysUserGrid").jqGrid('navGrid','#pageSysUserGrid',{edit:false,add:false,del:false,search:false});

        setGridWidth = function (width){
            jQuery("#sysUserGrid").setGridWidth(width, true);
        };

        var tree = new JOTree({treeId:"sysUserTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysDept/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });


//        JORegion.showAll();

        /**
         * 进行校核绑定
         */
        $('#sysUserForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });
    });

    function getMenu(treeNode){
        return $.ligerMenu({ top: 100, left: 100, width: 120, items:
            [
                { text: '增加', icon:'add', click:function(item){doAdd(treeNode.uid)}},
//                { text: '刷新' }
            ]
        });
    }

    function zTreeOnClick(event, treeId, treeNode) {
        $("#dept_treeId").val(treeNode.treeId);
        search('sysUserGrid','sysUserForm');
    };

    function doView(id) {
        openWindow("sysUserWindow", "查看", "${ctx}/sysUser/view.do?id=" + id, true, "sysUserGrid");
    }

    /**
     *
     * @param id
     */
    function doEdit(id) {
        openWindow("sysUserWindow", "编辑", "${ctx}/sysUser/init.do?id=" + id, true, "sysUserGrid");
    }

    function doDelete(id) {
        doGridDelete("${ctx}/sysUser/delete.do?id=" + id, "sysUserGrid");
    }

    function doAdd(deptId) {
        if(deptId != undefined && deptId != null && deptId != 'root') {
            openWindow("sysUserWindow", "新增", "${ctx}/sysUser/initAdd.do?deptId=" + deptId, true, "sysUserGrid");
        } else {
            showInfoMsg("请选择需要增加用户的公司!", "info");
        }
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div region="west" split="true" title="单位信息" style="width:200px;">
        <div>
            <ul id="sysUserTreeDiv" class="ztree"></ul>
        </div>
    </div>
    <div region="center" title="用户列表" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
        <%--<div id="jo_region_001" title="查询条件" divId="effect1" style="width: 100%">--%>
            <div id="effect1">
                <form id="sysUserForm" action="">
                    <input type="hidden" id="dept_treeId" name="dept_treeId" value="" op="leftLike" entity="t1"/>
                    <table width="100%" height="30">
                        <tr>
                            <td width="8%" nowrap="nowrap" align="left">
                                登录名:
                                <input type="text" id="loginName" name="loginName" value="" class="title_input"
                                       op="like" entity="t" dtype="String"/>
                            </td>
                            <td width="8%" nowrap="nowrap" align="left">
                                显示名称:
                                <input type="text" id="displayName" name="displayName" value="" class="title_input"
                                       op="like" entity="t" dtype="String"/>
                            </td>
                            <td width="8%" nowrap="nowrap" align="left">
                                账户状态:<select id="status" name="status" op="eq" entity="t">
                                    <option value="">全部</option>
                                    <option value="1">有效</option>
                                    <option value="0">无效</option>
                                </select>
                            </td>
                            <td align="left" width="85%">&nbsp;&nbsp;
                                <input type="button" value="查询" class="btn_Search" onClick="javascript:search('sysUserGrid', 'sysUserForm');"/>&nbsp;
                                <%--<input type="button" value="新增" class="btn_Add" onClick="javascript:doAdd(null);"/>--%>
                            </td>
                        </tr>
                    </table>
                    <div style="display: none;height:30px" id="advanced_condition">
                        
                    </div>
                </form>
            <%--</div>--%>
        </div>
        <table id="sysUserGrid"></table>
        <div id="pageSysUserGrid"></div>
        <div id="sysUserWindow"></div>
    </div>
</body>
</html>