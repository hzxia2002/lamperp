<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#outFormDetailsEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formOutFormDetailsbutton').click(function() {
            if (!$("#outFormDetailsEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/outFormDetails/save.do", "outFormDetailsEditForm", "outFormDetailsWindow", "outFormDetailsGrid");
        });

		 $("#editTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="outFormDetailsEditForm" name="outFormDetailsEditForm" action="${ctx}/outFormDetails/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="editTable">

                <tr class="line">
                    <td  class="label">
                        材料ID:
                    </td>
                    <td  class="container">
                        <input type="text" name="product" value="${bean.product}" />&nbsp;
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        出库单ID:
                    </td>
                    <td  class="container">
                        <input type="text" name="outStorage" value="${bean.outStorage}" />&nbsp;
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        出库数量:
                    </td>
                    <td  class="container">
                        <input type="text" name="count" value="${bean.count}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formOutFormDetailsbutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('outFormDetailsWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>