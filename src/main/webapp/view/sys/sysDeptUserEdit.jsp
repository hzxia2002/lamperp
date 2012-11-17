<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysDeptUserEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysDeptUserbutton').click(function() {
            if (!$("#sysDeptUserEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysDeptUserEditForm", "sysDeptUserWindow", "sysDeptUserGrid");
        });
    });
</script>

<div>
    <form:form id="sysDeptUserEditForm" name="sysDeptUserEditForm" action="${ctx}/sysDeptUser/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        单位标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="dept" value="${bean.dept}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        用户标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="user" value="${bean.user}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysDeptUserbutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('sysDeptUserWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>