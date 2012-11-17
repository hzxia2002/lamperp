<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<div>
      <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        角色编码:
                    </td>
                    <td  class="container">
                      ${bean.code}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        角色名称:
                    </td>
                    <td  class="container">
                      ${bean.roleName}
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
                <tr class="cssline">
                    <td  class="csslabel">
                        创建时间:
                    </td>
                    <td  class="container">
                      ${bean.createTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间:
                    </td>
                    <td  class="container">
                      ${bean.updateTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建人:
                    </td>
                    <td  class="container">
                      ${bean.createUser}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新人:
                    </td>
                    <td  class="container">
                      ${bean.updateUser}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="button_cancel" onclick="closeWindow('sysRoleWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>