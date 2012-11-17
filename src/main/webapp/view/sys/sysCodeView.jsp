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
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--父节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.parent.name}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        编码:
                    </td>
                    <td  class="container">
                      ${bean.code}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        名称:
                    </td>
                    <td  class="container">
                      ${bean.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        系统定义:
                    </td>
                    <td  class="container">
                      <c:out value="${bean.isReserved ? '是':'否'}"/>
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--叶节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.isLeaf}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--树形层次:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.treeId}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                      ${bean.description}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysCodeDetailWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>