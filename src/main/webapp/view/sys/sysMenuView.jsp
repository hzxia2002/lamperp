<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<div>
      <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        名称:
                    </td>
                    <td  class="container">
                      ${bean.name}
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        权限编码:
                    </td>
                    <td  class="container">
                      ${bean.privilege}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        层次:
                    </td>
                    <td  class="container">
                      ${bean.menuLevel}
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        链接地址:
                    </td>
                    <td  class="container">
                      ${bean.url}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        事件:
                    </td>
                    <td  class="container">
                      ${bean.jsEvent}
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        父节点:
                    </td>
                    <td  class="container">
                      ${bean.parent.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        叶节点:
                    </td>
                    <td  class="container">
                      <c:out value="${bean.isLeaf ? '是' : '否'}"/>
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--树形层次:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.treeId}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td  class="container">
                      <c:out value="${bean.isValid ? '是' : '否'}"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        参数:
                    </td>
                    <td  class="container">
                      ${bean.param}
                    </td>
                </tr>
                <tr class="cssline_1">
                    <td  class="csslabel">
                        显示图标:
                    </td>
                    <td  class="container">
                      ${bean.icon}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        目标窗口:
                    </td>
                    <td  class="container">
                      ${bean.target}
                    </td>
                </tr>
                <tr>
                    <td height="30" colspan="2" align="center" valign="middle">
                      <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysMenuWindow')">
                    </td>
              </tr>
            </table>
      
    </div>
</div>