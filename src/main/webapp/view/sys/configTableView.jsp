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
                        表名:
                    </td>
                    <td  class="container">
                      ${bean.tableName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        Class名:
                    </td>
                    <td  class="container">
                      ${bean.className}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        扩展XML:
                    </td>
                    <td  class="container">
                      ${bean.extendXml}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        记录日志:
                    </td>
                    <td  class="container">
                      ${bean.isLog ? "是" : "否"}
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
                        创建时间:
                    </td>
                    <td  class="container">
                        ${bean.createTime}
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
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间:
                    </td>
                    <td  class="container">
                        ${bean.updateTime}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('configTableWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>