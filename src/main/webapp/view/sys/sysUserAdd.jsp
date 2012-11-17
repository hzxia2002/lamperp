<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page import="com.justonetech.system.domain.SysUser" %>
<%@ page import="java.util.Set" %>
<%@ page import="com.justonetech.system.domain.SysRole" %>
<%@ page import="com.justonetech.core.utils.CollectionUtil" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.justonetech.system.domain.SysUserRole" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysUserEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysUserbutton').click(function() {
            if (!$("#sysUserEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysUser/save.do", "sysUserEditForm", "sysUserWindow", "sysUserGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="sysUserEditForm" modelAttribute="bean" name="sysUserEditForm" action="${ctx}/sysUser/save.do" method="post">
	    <input type="hidden" name="id" id="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>登陆名:
                    </td>
                    <td  class="container">
                        <input type="text" name="loginName" value="${bean.loginName}" class="input_table" required="true" style="width:180px"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>密码:
                    </td>
                    <td  class="container">
                        <input type="password" name="password" id="password" value="${bean.password}" class="input_table" required="true" style="width:180px"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>密码确认:
                    </td>
                    <td  class="container">
                        <input type="password" name="password2" value="${bean.password2}" class="input_table" required="true" validType="equalTo['#password']" style="width:180px"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>真实姓名:
                    </td>
                    <td  class="container">
                        <input type="text" name="displayName" value="${bean.displayName}" class="input_table" required="true" style="width:180px"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        性别:
                    </td>
                    <td  class="container">
                        <form:radiobutton path="person.sex" value="true"></form:radiobutton>男
                        <form:radiobutton path="person.sex" value="false"></form:radiobutton>女
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        所在公司:
                    </td>
                    <td class="container">
                        <input type="text" value="${bean.deptName}" id="popTreeValue" name="popTreeValue" readonly="true" class="input_table"/>
                        <input type="hidden" value="${bean.deptId}" id="deptId" name="deptId"/>
                        <input type="button" name="deptSelect" class="btn_Search" value="选择" onclick="new PopTree({url:'${ctx}/sysDept/tree.do',title:'请选择公司',targetId:'deptId',targetValueId:'popTreeValue', modal:true, openRoot:true});"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        身份证号:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.card" value="${bean.person.card}" class="input_table" style="width: 180px" maxlength="18"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        移动电话:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.mobile" value="${bean.person.mobile}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        固定电话:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.officeTel" value="${bean.person.officeTel}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        传真:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.faxTel" value="${bean.person.faxTel}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮件:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.email" value="${bean.person.email}" validType="email" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮政编码:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.zipcode" value="${bean.person.zipcode}" class="input_table" style="width: 60px" maxlength="6"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        MSN:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.msnCode" value="${bean.person.msnCode}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        QQ:
                    </td>
                    <td  class="container">
                        <input type="text" name="person.qqCode" value="${bean.person.qqCode}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        开通日期:
                    </td>
                    <td  class="container">
                        <input type="text" name="openDate" class="Wdate" value="${bean.openDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        截止日期:
                    </td>
                    <td  class="container">
                        <input type="text" name="closeDate" class="Wdate" value="${bean.closeDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>&nbsp;

                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        帐号状态:
                    </td>
                    <td  class="container">
                        <form:select path="status">
                            <form:option value="1">正常</form:option>
                            <form:option value="0">锁定</form:option>
                            <form:option value="2">失效</form:option>
                        </form:select>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        失效/锁定原因:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="reasonDesc" id="reasonDesc">${bean.reasonDesc}</textarea>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        用户角色:
                    </td>
                    <td  class="container">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <%
                                int i=0;

                                // ~取得用户角色集合
                                SysUser user = (SysUser)request.getAttribute("bean");
                                Set set = user.getSysUserRoles();
                                String roleNames = StringUtils.defaultIfEmpty(user.getRoleNames(), "");
                                String[] ids = roleNames.split(",");
                            %>
                            <c:forEach var="role" items="${roleList}">
                                <%if(i%3 == 0) {%>
                                <tr class="cssline_1">
                                    <%}
                                        SysRole role = (SysRole)pageContext.getAttribute("role");

                                        String isChecked = "";

                                        if(ids != null && ids.length > 0){
                                            if (CollectionUtil.isContains(ids, role.getId().toString())){
                                                isChecked = "checked";
                                            }
                                        } else if (set != null && set.size() > 0){
                                            Iterator it = set.iterator();
                                            while(it.hasNext()){
                                                SysUserRole sysUserRole = (SysUserRole)it.next();
                                                Long roleId = sysUserRole.getRole().getId();
                                                if(roleId == role.getId()){
                                                    isChecked = "checked";
                                                    set.remove(sysUserRole);
                                                    break;
                                                }
                                            }
                                        }
                                    %>
                                    <td class="container">
                                        <input type="checkbox" name="ids" value="<c:out value="${role.id}"/>" <%=isChecked%>>
                                        <c:out value="${role.roleName}"/>
                                    </td>
                                    <%if(i%3 == 2) {%>
                                </tr>
                                <%} %>
                                <%i++; %>
                            </c:forEach>
                            <%
                                int j = i%3;
                                if(j > 0){
                                    for(int m=0; m<(3-j); m++){
                            %>
                            <td class="container">&nbsp;</td>
                            <%
                                }
                            %>
                            </tr>
                            <%
                                }
                            %>
                        </table>
                    </td>
                </tr>

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
                        <%--更新人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="updateUser" value="${bean.updateUser}" />&nbsp;--%>
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
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysUserbutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysUserWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>