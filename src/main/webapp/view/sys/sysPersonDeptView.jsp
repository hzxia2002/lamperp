<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<div>
      <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        部门标识:
                    </td>
                    <td  class="container">
                      ${bean.dept}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        人员标识:
                    </td>
                    <td  class="container">
                      ${bean.person}
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
                        序号:
                    </td>
                    <td  class="container">
                      ${bean.orderNo}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td  class="container">
                      ${bean.isValid}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否单位负责人:
                    </td>
                    <td  class="container">
                      ${bean.isManager}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="button_cancel" onclick="closeWindow('sysPersonDeptWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>