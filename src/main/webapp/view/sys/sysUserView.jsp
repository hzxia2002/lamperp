<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<script type="text/javascript">
    $(document).ready(function () {
        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>
<div>
      <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        登陆名:
                    </td>
                    <td  class="container">
                      ${bean.loginName}
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--密码:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.password}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--对应人员:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--${bean.person.name}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        真实姓名:
                    </td>
                    <td  class="container">
                      ${bean.displayName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        性别:
                    </td>
                    <td  class="container">
                        <c:choose>
                            <c:when test="${bean.person.sex == null}">未知</c:when>
                            <c:when test="${bean.person.sex}">男</c:when>
                            <c:otherwise>女</c:otherwise>
                        </c:choose>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        所在公司:
                    </td>
                    <td class="container">
                        ${bean.deptName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        身份证号:
                    </td>
                    <td  class="container">
                        ${bean.person.card}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        移动电话:
                    </td>
                    <td  class="container">
                        ${bean.person.mobile}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        固定电话:
                    </td>
                    <td  class="container">
                        ${bean.person.officeTel}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        传真:
                    </td>
                    <td  class="container">
                        ${bean.person.faxTel}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮件:
                    </td>
                    <td  class="container">
                        ${bean.person.email}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮政编码:
                    </td>
                    <td  class="container">
                        ${bean.person.zipcode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        MSN:
                    </td>
                    <td  class="container">
                        ${bean.person.msnCode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        QQ:
                    </td>
                    <td  class="container">
                        ${bean.person.qqCode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        开通日期:
                    </td>
                    <td  class="container">
                      ${bean.openDate}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        截止日期:
                    </td>
                    <td  class="container">
                      ${bean.closeDate}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        帐号状态:
                    </td>
                    <td  class="container">
                        <c:choose>
                            <c:when test="${bean.status == '0'}">锁定</c:when>
                            <c:when test="${bean.status == '1'}">正常</c:when>
                            <c:otherwise>失效</c:otherwise>
                        </c:choose>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        失效/锁定原因:
                    </td>
                    <td  class="container">
                        ${bean.reasonDesc}
                    </td>
                </tr>
                <tr>
                    <td class="csslabel">
                        角色名称:
                    </td>
                    <td>${bean.roleNames}</td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--创建时间:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.createTime}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--更新时间:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.updateTime}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--更新人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.updateUser}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--创建人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.createUser}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysUserWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>