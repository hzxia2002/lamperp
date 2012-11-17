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

                <tr class="line">
                    <td  class="label">
                        名称:
                    </td>
                    <td  class="container">
                      ${bean.name}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        编号:
                    </td>
                    <td  class="container">
                      ${bean.code}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        属性1:
                    </td>
                    <td  class="container">
                      ${bean.attr1}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        属性2:
                    </td>
                    <td  class="container">
                      ${bean.attr2}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        属性3:
                    </td>
                    <td  class="container">
                      ${bean.attr3}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        属性4:
                    </td>
                    <td  class="container">
                      ${bean.attr4}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="button_cancel" onclick="closeWindow('productWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>