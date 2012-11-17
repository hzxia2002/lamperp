<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#inStorageEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formInStoragebutton').click(function() {
//            if(confirm("您确定要提交,提交后数据不能再修改")){
                if (!$("#inStorageEditForm").form('validate')) {
                    return;
                }

                //提交表单
                saveAjaxData("${ctx}/inStorage/save.do", "inStorageEditForm", "inStorageWindow", "inStorageGrid");
//            }
        });

        $("#editTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="inStorageEditForm" name="inStorageEditForm" action="${ctx}/inStorage/save.do" method="post">
        <input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="editTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        入库单编号:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}"  style="width:200px" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        入库产品:
                    </td>
                    <td  class="container">
                        <input type="text"
                               class="easyui-combobox"
                               name="product"
                               url="${ctx}/product/getProductList.do"
                               valueField="id"
                               textField="name"
                               panelHeight="auto"
                               value="${bean.product.id}"/>&nbsp;
                            <%--<input type="text" name="product" value="${bean.product}" style="width:200px" required="true" readOnly="true"/>&nbsp;--%>
                    </td>
                </tr>

                <tr class="cssline">
                    <td  class="csslabel">
                        数量:
                    </td>
                    <td  class="container">
                        <input type="text" name="count" value="${bean.count}"  style="width:200px" validType="number(0)"/>&nbsp;
                        <input type="hidden" name="originCount" value="${bean.count}"  />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        单价:
                    </td>
                    <td  class="container">
                        <input type="text" name="price" value="${bean.price}"  style="width:200px" validType="number(2)"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                        <textarea name="description" cols="55" rows="5">${bean.description}</textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formInStoragebutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('inStorageWindow')">
                    </td>
                </tr>
            </table>

        </div>
    </form:form>
</div>