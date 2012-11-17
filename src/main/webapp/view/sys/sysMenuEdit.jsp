<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysMenuEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysMenubutton').click(function() {
            if (!$("#sysMenuEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysMenu/save.do", "sysMenuEditForm", "sysMenuWindow", "sysMenuGrid");
        });
    });
</script>

<div>
    <form:form id="sysMenuEditForm" modelAttribute="bean" name="sysMenuEditForm" action="${ctx}/sysMenu/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" size="60" class="input_table" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        <span class="errors">*</span>权限编码:
                    </td>
                    <td  class="container">
                        <input type="text" id="privilege" name="privilege" value="${bean.privilege}" size="60" class="input_table" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        层次:
                    </td>
                    <td  class="container">
                        <input type="text" name="menuLevel" class="input_table" value="${bean.menuLevel}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        链接地址:
                    </td>
                    <td  class="container">
                        <input type="text" name="url" value="${bean.url}" size="60" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        事件:
                    </td>
                    <td  class="container">
                        <textarea rows="5" cols="60" class="textarea_table" name="jsEvent" id="jsEvent">${bean.jsEvent}</textarea>
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        父节点:
                    </td>
                    <td  class="container">
                        <input type="hidden" name="parent" value="${bean.parent.id}" />
                        <input type="text" name="parent_name" value="${bean.parent.name}" readonly="true" size="60" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        叶节点:
                    </td>
                    <td  class="container">
                        <form:checkbox path="isLeaf" disabled="true"/>
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--树形层次:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="treeId" value="${bean.treeId}" />&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td  class="container">
                        <form:checkbox path="isValid"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        参数:
                    </td>
                    <td  class="container">
                        <input type="text" name="param" value="${bean.param}" size="60" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        显示图标:
                    </td>
                    <td  class="container">
                        <input type="text" name="icon" value="${bean.icon}" size="60" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>目标窗口:
                    </td>
                    <td class="container">
                        <input class="easyui-combobox"
                               name="target"
                               url="${ctx}/sysCode/getCodeDetailList.do?code=TARGET_TYPE"
                               valueField="code"
                               textField="name"
                               panelHeight="auto"
                               value="${bean.target}">
                    </td>
                </tr>
                <tr>
                    <td height="30" colspan="2" align="center" valign="middle">
                    <input type="button" id="formSysMenubutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysMenuWindow')">
                    </td>
              </tr>
            </table>
      
        </div>
    </form:form>
</div>