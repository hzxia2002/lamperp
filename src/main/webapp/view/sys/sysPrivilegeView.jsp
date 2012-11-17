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
                        父节点:
                    </td>
                    <td  class="container">
                      ${bean.parent.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        权限编码:
                    </td>
                    <td  class="container">
                      ${bean.code}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        权限名称:
                    </td>
                    <td  class="container">
                      ${bean.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        权限类型:
                    </td>
                    <td  class="container">
                        ${bean.type.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        TAG:
                    </td>
                    <td  class="container">
                      ${bean.tag}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        页面地址:
                    </td>
                    <td  class="container">
                      ${bean.url}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        定义:
                    </td>
                    <td  class="container">
                      ${bean.definition}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        描述:
                    </td>
                    <td  class="container">
                      ${bean.description}
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--是否叶节点:--%>
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
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysPrivilegeWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>