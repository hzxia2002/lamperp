<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysUserPrivilegeEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysUserPrivilegebutton').click(function() {
            if (!$("#sysUserPrivilegeEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysUserPrivilegeEditForm", "sysUserPrivilegeWindow", "sysUserPrivilegeGrid");
        });
    });
</script>

<div>
    <form:form id="sysUserPrivilegeEditForm" name="sysUserPrivilegeEditForm" action="${ctx}/sysUserPrivilege/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        用户标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="user" value="${bean.user}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        权限标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="privilege" value="${bean.privilege}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否禁止授权:
                    </td>
                    <td  class="container">
                        <input type="text" name="isDeny" value="${bean.isDeny}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysUserPrivilegebutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('sysUserPrivilegeWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>