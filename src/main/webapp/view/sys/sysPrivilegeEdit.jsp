<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysPrivilegeEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysPrivilegebutton').click(function() {
            if (!$("#sysPrivilegeEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysPrivilege/save.do", "sysPrivilegeEditForm", "sysPrivilegeWindow", "sysPrivilegeGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="sysPrivilegeEditForm" name="sysPrivilegeEditForm" action="${ctx}/sysPrivilege/save.do" method="post">
	<input type="hidden" id="id" name="id" value="${bean.id}" />
    <input type="hidden" id="parent" name="parent" value="${bean.parent.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        父节点:
                    </td>
                    <td  class="container">
                        <input type="text" name="parent_name" value="${bean.parent.name}" class="input_table" disabled="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>权限编码:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" required="true" maxlength="100" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>权限名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" required="true" maxlength="80" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        权限类型:
                    </td>
                    <td  class="container">
                        <input class="easyui-combobox"
                               name="type"
                               url="${ctx}/sysCode/getCodeDetailList.do?code=PRIVILEGE_TYPE"
                               valueField="id"
                               textField="name"
                               panelHeight="auto"
                               panelWidth="180px"
                               value="${bean.type.id}"
                               style="width:180px">
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        TAG:
                    </td>
                    <td  class="container">
                        <input type="text" name="tag" value="${bean.tag}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        页面地址:
                    </td>
                    <td  class="container">
                        <input type="text" name="url" value="${bean.url}" maxlength="200" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        定义:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="definition" id="definition">${bean.definition}</textarea>
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
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--是否叶节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--${bean.isLeaf}--%>
                        <%--<input type="text" name="isLeaf" value="${bean.isLeaf}" />--%>
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
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysPrivilegebutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysPrivilegeWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>