<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

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
                    产品名称:
                </td>
                <td  class="container">
                    ${bean.product.name}
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    产品编码:
                </td>
                <td  class="container">
                    ${bean.product.code}
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    入库单编号:
                </td>
                <td  class="container">
                    ${bean.code}
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    数量:
                </td>
                <td  class="container">
                    ${bean.count}
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    单价:
                </td>
                <td  class="container">
                    ${bean.price}
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    备注:
                </td>
                <td  class="container">
                    ${bean.description}
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    创建人:
                </td>
                <td class="container">
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
            <tr>
                <td colspan="2" valign="middle" align="center">
                    <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('inStorageWindow')">
                </td>
            </tr>
        </table>

    </div>
</div>