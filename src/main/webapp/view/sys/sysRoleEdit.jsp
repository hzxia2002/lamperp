<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysRoleEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysRolebutton').click(function() {
            if (!$("#sysRoleEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysRole/save.do", "sysRoleEditForm", "sysRoleWindow", "sysRoleGrid");
        });
    });
</script>

<div>
    <form:form id="sysRoleEditForm" modelAttribute="bean" name="sysRoleEditForm" action="${ctx}/sysRole/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>角色编码:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" required="true" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>角色名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="roleName" value="${bean.roleName}" required="true" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        描述:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="description" id="description">${bean.description}</textarea>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建时间:
                    </td>
                    <td  class="container">
                        ${bean.createTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间:
                    </td>
                    <td  class="container">
                        ${bean.updateTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建人:
                    </td>
                    <td  class="container">
                        ${bean.createUser}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新人:
                    </td>
                    <td  class="container">
                        ${bean.updateUser}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysRolebutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysRoleWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>