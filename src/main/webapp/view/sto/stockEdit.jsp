<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#stockEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formStockbutton').click(function() {
            if (!$("#stockEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/stock/save.do", "stockEditForm", "stockWindow", "stockGrid");
        });

		 $("#editTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="stockEditForm" name="stockEditForm" action="${ctx}/stock/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="editTable">

                <tr class="line">
                    <td  class="label">
                        产品ID:
                    </td>
                    <td  class="container">
                        <input type="text" name="product" value="${bean.product}" />&nbsp;
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        数量:
                    </td>
                    <td  class="container">
                        <input type="text" name="count" value="${bean.count}" />&nbsp;
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        仓库:
                    </td>
                    <td  class="container">
                        <input type="text" name="warehouse" value="${bean.warehouse}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formStockbutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('stockWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>