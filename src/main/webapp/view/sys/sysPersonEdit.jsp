<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysPersonEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysPersonbutton').click(function() {
            if (!$("#sysPersonEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysPerson/save.do", "sysPersonEditForm", "sysPersonWindow", "sysPersonGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");

        $("#deptId").bind('change',function(){
//            alert('ok');
            var val = this.val();

            if(val != null && val != "") {
                $("#workSiteId").val("");
            }
        });
    });
</script>

<div>
    <form:form id="sysPersonEditForm" modelAttribute="bean" name="sysPersonEditForm" action="${ctx}/sysPerson/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>工号:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" required="true" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>姓名:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" required="true" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        性别:
                    </td>
                    <td  class="container">
                        <form:radiobutton path="sex" value="true"></form:radiobutton>男
                        <form:radiobutton path="sex" value="false"></form:radiobutton>女
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        选择单位:
                    </td>
                    <td class="container">
                        <input type="text" value="${bean.deptName}${bean.workSiteName}" id="popTreeValue" name="popTreeValue" readonly="true" class="input_table"/>
                        <input type="hidden" value="${bean.deptId}" id="deptId" name="deptId"/>
                        <input type="hidden" value="${bean.workSiteId}" id="workSiteId" name="workSiteId"/>
                        <input type="button" name="deptSelect" class="btn_Search" value="单位" onclick="new PopTree({url:'${ctx}/sysDept/tree.do',title:'请选择集团',targetId:'deptId',targetValueId:'popTreeValue', modal:true, openRoot:true});"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        职务:
                    </td>
                    <td  class="container">
                        <input type="text" name="position" value="${bean.position}" class="input_table" title="选择工地或集团后，职务信息才会保存!"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        身份证号:
                    </td>
                    <td  class="container">
                        <input type="text" name="card" value="${bean.card}" class="input_table" style="width: 180px" maxlength="18"/>&nbsp;
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--出生年月:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
						<%--<input type="text" name="bornDate" class="Wdate" value="${bean.bornDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>&nbsp;--%>

                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--籍贯:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="bornPlace" value="${bean.bornPlace}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        移动电话:
                    </td>
                    <td  class="container">
                        <input type="text" name="mobile" value="${bean.mobile}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        固定电话:
                    </td>
                    <td  class="container">
                        <input type="text" name="officeTel" value="${bean.officeTel}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        传真:
                    </td>
                    <td  class="container">
                        <input type="text" name="faxTel" value="${bean.faxTel}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮件:
                    </td>
                    <td  class="container">
                        <input type="text" name="email" value="${bean.email}" validType="email" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮政编码:
                    </td>
                    <td  class="container">
                        <input type="text" name="zipcode" value="${bean.zipcode}" class="input_table" style="width: 60px" maxlength="6"/>&nbsp;
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--学历:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="education" value="${bean.education}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--工作年限:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="workYear" value="${bean.workYear}" class="input_table" style="width: 60px" maxlength="3"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        MSN:
                    </td>
                    <td  class="container">
                        <input type="text" name="msnCode" value="${bean.msnCode}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        QQ:
                    </td>
                    <td  class="container">
                        <input type="text" name="qqCode" value="${bean.qqCode}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        负责人:
                    </td>
                    <td  class="container">
                        <form:checkbox path="isManager"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td class="container">
                        <form:checkbox path="isValid"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="memo" id="memo">${bean.memo}</textarea>
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--创建时间/创建人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--${bean.createTime}/${bean.createUser}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--更新时间/更新人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--${bean.updateTime}/${bean.updateUser}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysPersonbutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysPersonWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>