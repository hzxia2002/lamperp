<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        var setting = {
            async: {
                enable: true,
                url: "${ctx}/sysRolePrivilege/tree.do?roleId=${roleId}"
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };

        // var zNodes = [{"id":1,"open":true,"name":"12121"},{"id":3,"open":true,"name":"adadads"},{"id":2,"pId":1,"open":true,"name":"test002"}];

        var tree = $.fn.zTree.init($("#sysRolePrivilegeTree"), setting);

        $('#p').panel();

        $("#btnSave").click(function(){
            var roleId = $("#roleId").val();

            if(roleId == null || roleId == "") {
                showInfoMsg("请先选择角色再进行授权!");
                return;
            }

            var checkNodes = tree.getCheckedNodes();
            var ids = "";

            if(checkNodes != null && checkNodes.length > 0) {
                for(i=0; i<checkNodes.length; i++) {
                    ids += checkNodes[i].id + ",";
                }
            }

            $.ajax({
                type: 'POST',
                url: "${ctx}/sysRolePrivilege/save.do",
                cache: false,
                dataType: 'json',
                data:{ids: ids, roleId: roleId},
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
        });


        <%--var sysRolePrivilegeTree = new JOTree({--%>
            <%--treeId:"sysRolePrivilegeTree"--%>
            <%--, url:"${ctx}/sysRolePrivilege/tree.do"--%>
            <%--,   callback: {--%>
                <%--onClick: zTreeOnClick--%>
            <%--}--%>
            <%--, check: {--%>
                <%--enable: true--%>
            <%--}--%>
        <%--});--%>
    });
</script>

<div>
    <form:form id="sysRolePrivilegeEditForm" name="sysRolePrivilegeEditForm" action="${ctx}/sysRolePrivilege/save.do" method="post">
        <input type="hidden" name="ids" id="ids">
        <input type="hidden" name="roleId" id="roleId" value="${roleId}">
        <div id="tools" style="vertical-align: top">
            <input type="button" id="btnSave" class="btn_Ok" value="保存">
        </div>
        <div id="p" class="easyui-panel" style="width:500px;height:450px;" tools="#tools" title="请选择授权资源">
            <div id="sysRolePrivilegeTree" class="ztree"></div>
        </div>
    </form:form>
</div>