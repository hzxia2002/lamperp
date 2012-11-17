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
                        产品ID:
                    </td>
                    <td  class="container">
                      ${bean.product}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        数量:
                    </td>
                    <td  class="container">
                      ${bean.count}
                    </td>
                </tr>
                <tr class="line">
                    <td  class="label">
                        仓库:
                    </td>
                    <td  class="container">
                      ${bean.warehouse}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="button_cancel" onclick="closeWindow('stockWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>