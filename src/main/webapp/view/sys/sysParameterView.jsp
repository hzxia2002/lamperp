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
                        参数代码:
                    </td>
                    <td  class="container">
                      ${bean.code}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        参数名称:
                    </td>
                    <td  class="container">
                      ${bean.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        参数值:
                    </td>
                    <td  class="container">
                      ${bean.value}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        约束:
                    </td>
                    <td  class="container">
                      ${bean.constraint}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        长参数:
                    </td>
                    <td  class="container">
                      ${bean.clobvalue}
                    </td>
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
                        <%--创建人:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.createUser}--%>
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
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysParameterWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>