<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#productEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formProductbutton').click(function() {
            if (!$("#productEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/product/save.do", "productEditForm", "productWindow", "productGrid");
        });

		 $("#editTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="productEditForm" name="productEditForm" action="${ctx}/product/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="editTable">

                <tr class="cssline">
                    <td  class="csslabel">
                        名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" style="width: 200px" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        编号:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" style="width: 200px"  required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                        <textarea name="attr1" cols="55" rows="5">${bean.attr1}</textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formProductbutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('productWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>