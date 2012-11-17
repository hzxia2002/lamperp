<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysPersonDeptEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysPersonDeptbutton').click(function() {
            if (!$("#sysPersonDeptEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysPersonDeptEditForm", "sysPersonDeptWindow", "sysPersonDeptGrid");
        });
    });
</script>

<div>
    <form:form id="sysPersonDeptEditForm" name="sysPersonDeptEditForm" action="${ctx}/sysPersonDept/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        部门标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="dept" value="${bean.dept}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        人员标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="person" value="${bean.person}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        职务:
                    </td>
                    <td  class="container">
                        <input type="text" name="position" value="${bean.position}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        序号:
                    </td>
                    <td  class="container">
                        <input type="text" name="orderNo" value="${bean.orderNo}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td  class="container">
                        <input type="text" name="isValid" value="${bean.isValid}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否单位负责人:
                    </td>
                    <td  class="container">
                        <input type="text" name="isManager" value="${bean.isManager}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysPersonDeptbutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('sysPersonDeptWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>