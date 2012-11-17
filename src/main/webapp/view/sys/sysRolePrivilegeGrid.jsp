<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../../common/taglibs.jsp"%>
<%@include file="../common/header_easyui.jsp" %>
<script language="javascript">
    $(document).ready(function () {

        var tree = new JOTree({treeId:"sysRoleTreeDiv"
            , menu : getMenu,
            url:"${ctx}/sysRole/tree.do"
            ,   callback: {
                onClick: zTreeOnClick
            }
            ,   openRoot: true
        });

    });

    function zTreeOnClick(event, treeId, treeNode) {
//        $("#treeId").val(treeNode.treeId);
//        search('sysPrivilegeGrid','sysPrivilegeForm');
        doAdd(treeNode.uid);
    };

    function getMenu(treeNode){
        return $.ligerMenu({ top: 100, left: 100, width: 120, items:
                [
                    { text: '授权', icon:'add', click:function(item){doAdd(treeNode.uid)}}
                ]
        });
    }

    function doAdd(roleId) {
        $("#sysRolePrivilegeDiv").load("${ctx}/sysRolePrivilege/init.do?roleId=" + roleId);
    }
</script>

<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
<div region="west" split="true" title="角色信息" style="width:200px;">
    <div>
        <ul id="sysRoleTreeDiv" class="ztree"></ul>
    </div>
</div>
<div region="center" title="角色授权" style="width:100%; height:100%; background:#fafafa;overflow-x: hidden; overflow-y: auto;">
    <div>
        <div id="sysRolePrivilegeDiv"></div>
    </div>
</div>
</body>
</html>