<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysParameterEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysParameterbutton').click(function() {
            if (!$("#sysParameterEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysParameter/save.do", "sysParameterEditForm", "sysParameterWindow", "sysParameterGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="sysParameterEditForm" modelAttribute="bean" name="sysParameterEditForm" action="${ctx}/sysParameter/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">

                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>参数代码:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" class="input_table" required="true" maxlength="50"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>参数名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" class="input_table" required="true" maxlength="50"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        参数值:
                    </td>
                    <td  class="container">
                        <input type="text" name="value" value="${bean.value}" class="input_table" maxlength="200"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        约束:
                    </td>
                    <td  class="container">
                        <input type="text" name="constraint" value="${bean.constraint}" class="input_table" maxlength="2000"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        长参数:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="clobvalue" id="clobvalue">${bean.clobvalue}</textarea>
                    </td>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--创建时间:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="createTime" class="Wdate" value="${bean.createTime}" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})" />&nbsp;--%>

                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--更新时间:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="updateTime" class="Wdate" value="${bean.updateTime}" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})" />&nbsp;--%>

                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--创建人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="createUser" value="${bean.createUser}" />&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--更新人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="updateUser" value="${bean.updateUser}" />&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysParameterbutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysParameterWindow')">
                    </td>
                </tr>
            </table>
        </div>
    </form:form>
</div>