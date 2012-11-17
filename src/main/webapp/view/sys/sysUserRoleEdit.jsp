<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysUserRoleEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysUserRolebutton').click(function() {
            if (!$("#sysUserRoleEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysUserRoleEditForm", "sysUserRoleWindow", "sysUserRoleGrid");
        });
    });
</script>

<div>
    <form:form id="sysUserRoleEditForm" name="sysUserRoleEditForm" action="${ctx}/sysUserRole/save.do" method="post">
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
                        角色标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="role" value="${bean.role}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysUserRolebutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('sysUserRoleWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>