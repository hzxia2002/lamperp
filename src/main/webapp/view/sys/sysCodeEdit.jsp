<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        // 回调函数，刷新树节点
        var callback = function(data) {
            if (data.success) {
                if('${bean.id}' != '') {
                    refreshTree("sysCodeDetailTreeDiv", "edit");
                } else {
                    refreshTree("sysCodeDetailTreeDiv", "add");
                }
                closeWindow("sysCodeDetailWindow");
                showInfoMsg(data.msg,null);
            } else {
                showErrorMsg(data.msg);
            }
        };

        /**
         * 进行校核绑定
         */
        $('#sysCodeEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysCodebutton').click(function() {
            if (!$("#sysCodeEditForm").form('validate')) {
                return;
            }

            //提交表单
            <%--saveAjaxData("${ctx}/sysCode/save.do", "sysCodeEditForm", "sysCodeDetailWindow", "sysCodeDetailGrid", callback);--%>
            saveAjaxData("${ctx}/sysCode/save.do", "sysCodeEditForm", "sysCodeDetailWindow", "sysCodeDetailGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="sysCodeEditForm" modelAttribute="bean" name="sysCodeEditForm" action="${ctx}/sysCode/save.do" method="post">
	    <input type="hidden" name="id" value="${bean.id}" />
        <input type="hidden" name="parent" value="${bean.parent.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--父节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="parent" value="${bean.parent}" />&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>编码:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" required="true" class="input_table" maxlength="50"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" required="true" class="input_table" maxlength="100"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        系统定义:
                    </td>
                    <td  class="container">
                        <form:checkbox path="isReserved"/>
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--叶节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="isLeaf" value="${bean.isLeaf}" />&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--树形层次:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="treeId" value="${bean.treeId}" />&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="description" id="description">${bean.description}</textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysCodebutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysCodeDetailWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>