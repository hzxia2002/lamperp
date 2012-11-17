<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<%@page import="java.util.Map" %>
<%@ page import="java.util.Iterator" %>
<script type="text/javascript">
    $(document).ready(function () {
        $("#viewTable tr:odd").addClass("cssline_1");
        $("#viewTable tr:even").addClass("cssline");
    });
</script>
<div>
      <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        数据表:
                    </td>
                    <td  class="container">
                      ${bean.table.tableName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作类型:
                    </td>
                    <td  class="container">
                        ${bean.logType}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作日志:
                    </td>
                    <td class="container">
                        <table width="100%" id="detailTable" border="1">
                            <tr align="center">
                                <td><b>字段名</b></td>
                            <c:if test="${tableLog.changeType eq 'INSERT' || tableLog.changeType eq 'UPDATE'}" >
                                <td><b>字段值</b></td>
                            </c:if>
                            <c:if test="${tableLog.changeType eq 'UPDATE' || tableLog.changeType eq 'DELETE'}" >
                                <td><b>原字段值</b></td>
                            </c:if>
                            </tr>
                            <c:forEach items="${tableLog.propertyLogs}" var="pl">
                                <tr>
                                    <td>${pl.propertyName}</td>
                                <c:if test="${tableLog.changeType eq 'INSERT' || tableLog.changeType eq 'UPDATE'}" >
                                    <td>${pl.newValue}</td>
                                </c:if>
                                <c:if test="${tableLog.changeType eq 'UPDATE' || tableLog.changeType eq 'DELETE'}" >
                                    <td>${pl.oldValue}</td>
                                </c:if>
                                </tr>
                            </c:forEach>
                        </table>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        IP地址:
                    </td>
                    <td  class="container">
                      ${bean.ipAddress}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作人:
                    </td>
                    <td  class="container">
                        ${bean.createUser}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作时间:
                    </td>
                    <td  class="container">
                      ${bean.createTime}
                    </td>
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

                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysOperationTableLogWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>