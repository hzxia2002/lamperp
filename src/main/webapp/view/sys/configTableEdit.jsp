<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#configTableEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formconfigTablebutton').click(function() {
            if (!$("#configTableEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/configTable/save.do", "configTableEditForm", "configTableWindow", "configTableGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="configTableEditForm" modelAttribute="bean" name="configTableEditForm" action="${ctx}/configTable/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">

                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>表名:
                    </td>
                    <td  class="container">
                        <input type="text" name="tableName" value="${bean.tableName}" class="input_table" required="true" maxlength="100"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>Class名:
                    </td>
                    <td  class="container">
                        <input type="text" name="className" value="${bean.className}" class="input_table" required="true" maxlength="100"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        扩展XML:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="extendXml" id="extendXml">${bean.extendXml}</textarea>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        记录日志:
                    </td>
                    <td  class="container">
                        <form:checkbox path="isLog"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formconfigTablebutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('configTableWindow')">
                    </td>
                </tr>
            </table>
        </div>
    </form:form>
</div>