<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<div>
      <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        用户标识:
                    </td>
                    <td  class="container">
                      ${bean.user}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        角色标识:
                    </td>
                    <td  class="container">
                      ${bean.role}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="button_cancel" onclick="closeWindow('sysUserRoleWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>