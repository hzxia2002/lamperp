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
                        用户标识:
                    </td>
                    <td  class="container">
                      ${bean.user.displayName}
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
                        进入时间:
                    </td>
                    <td  class="container">
                      ${bean.enterTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        退出时间:
                    </td>
                    <td  class="container">
                      ${bean.outTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        访问页面:
                    </td>
                    <td  class="container">
                      ${bean.pageUrl}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作类型:
                    </td>
                    <td  class="container">
                      ${bean.logType.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        浏览器版本:
                    </td>
                    <td  class="container">
                      ${bean.ieVersion}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        SESSIONID:
                    </td>
                    <td  class="container">
                      ${bean.sessionid}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysLogWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>