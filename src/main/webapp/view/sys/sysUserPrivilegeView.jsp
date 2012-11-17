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
                        权限标识:
                    </td>
                    <td  class="container">
                      ${bean.privilege}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否禁止授权:
                    </td>
                    <td  class="container">
                      ${bean.isDeny}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="button_cancel" onclick="closeWindow('sysUserPrivilegeWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>