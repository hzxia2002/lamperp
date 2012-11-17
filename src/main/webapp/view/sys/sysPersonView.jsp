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
                        工号:
                    </td>
                    <td  class="container">
                        ${bean.code}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        姓名:
                    </td>
                    <td  class="container">
                        ${bean.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        性别:
                    </td>
                    <td  class="container">
                        <c:choose>
                            <c:when test="${bean.sex == null}">未知</c:when>
                            <c:when test="${bean.sex}">男</c:when>
                            <c:otherwise>女</c:otherwise>
                        </c:choose>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        选择集团/工地:
                    </td>
                    <td class="container">
                        ${bean.deptName}${bean.workSiteName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        职务:
                    </td>
                    <td  class="container">
                        ${bean.position}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        身份证号:
                    </td>
                    <td  class="container">
                        ${bean.card}
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
                        ${bean.mobile}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        固定电话:
                    </td>
                    <td  class="container">
                        ${bean.officeTel}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        传真:
                    </td>
                    <td  class="container">
                        ${bean.faxTel}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮件:
                    </td>
                    <td  class="container">
                        ${bean.email}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        邮政编码:
                    </td>
                    <td  class="container">
                        ${bean.zipcode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        MSN:
                    </td>
                    <td  class="container">
                        ${bean.msnCode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        QQ:
                    </td>
                    <td  class="container">
                        ${bean.qqCode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        负责人:
                    </td>
                    <td  class="container">
                        <c:out value="${bean.isManager ? '是' : '否'}"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td class="container">
                        <c:out value="${bean.isValid ? '有效' : '无效'}"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                        ${bean.memo}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建时间/创建人:
                    </td>
                    <td  class="container">
                      ${bean.createTime}/${bean.createUser}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间/更新人:
                    </td>
                    <td  class="container">
                      ${bean.updateTime}/${bean.updateUser}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysPersonWindow')">
                    </td>
                </tr>
            </table>
    </div>
</div>