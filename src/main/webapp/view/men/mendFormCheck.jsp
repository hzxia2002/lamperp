<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#mendFormEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formMendFormbutton').click(function() {
            if (!$("#mendFormEditForm").form('validate')) {
                return;
            }

            if(!$("#mendDate").val()){
                alert("请填写维修日期");
                return;
            }
            //提交表单
            saveAjaxData("${ctx}/mendForm/doCheck.do", "mendFormEditForm", "mendFormWindow", "mendFormGrid");
        });

        $("#editTable tr:odd").addClass("cssline_1");
    });

    function calcTotal(){
        var total = 0;
        if(!isNaN(parseFloat($("#trafficFee").val()))){
            total  += parseFloat($("#trafficFee").val());
        }
        if(!isNaN(parseFloat($("#materialFee").val()))){
            total  += parseFloat($("#materialFee").val());
        }
        if(!isNaN(parseFloat($("#lodgeFee").val()))){
            total  += parseFloat($("#lodgeFee").val());
        }
        if(!isNaN(parseFloat($("#lampFee").val()))){
            total  += parseFloat($("#lampFee").val());
        }
        if(!isNaN(parseFloat($("#storeFee").val()))){
            total  += parseFloat($("#storeFee").val());
        }
        if(!isNaN(parseFloat($("#inTrafficFee").val()))){
            total  += parseFloat($("#inTrafficFee").val());
        }
        if(!isNaN(parseFloat($("#materialTransFee").val()))){
            total  += parseFloat($("#materialTransFee").val());
        }
        if(!isNaN(parseFloat($("#otherFee").val()))){
            total  += parseFloat($("#otherFee").val());
        }
        $("#total").val(total);
    }
</script>

<div>
<form:form id="mendFormEditForm" name="mendFormEditForm" action="${ctx}/mendForm/save.do" method="post">
<input type="hidden" name="id" value="${bean.id}" />
<div>
<table border="0" cellspacing="1" cellpadding="1" width="100%" id="editTable">
    <tr class="cssline">
        <td align="right" width="15%">
            厂商名称:
        </td>
        <td class="container" width="35%">${bean.firm.name}&nbsp;</td>
        <td align="right" width="15%">
            维修编号:
        </td>
        <td  class="container">
                ${bean.mendNo}&nbsp;
        </td>
    </tr>

    <tr class="cssline">
        <td align="right">
            记录日期:
        </td>
        <td  class="container">
            <fmt:formatDate value="${bean.recordTime}"  pattern="yyyy-MM-dd HH:mm:ss"/>&nbsp;
        </td>
        <td align="right">
            区域:
        </td>
        <td  class="container">
            "${bean.area.name}
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            店号:
        </td>
        <td  class="container">
                ${bean.storeNo}&nbsp;
        </td>
        <td align="right">
            <span style="color: red;font-size: 12px">*</span> 中文店名:
        </td>
        <td  class="container">
                ${bean.storeName}&nbsp;
        </td>
    </tr>

    <tr class="cssline">
        <td align="right">
            报修人:
        </td>
        <td  class="container">
                ${bean.troubleCaller}&nbsp;
        </td>
        <td align="right">
            保修损坏数量:
        </td>
        <td  class="container">
                ${bean.breakdownCount}&nbsp;
        </td>
    </tr>


    <tr class="cssline">
        <td align="right">
            是否保修:
        </td>
        <td  class="container">
            <input type="radio" name="isGuarantee" value="1" <c:if test="${bean.isGuarantee==1}">checked="checked"</c:if> disabled="true"> 是
            <input type="radio" name="isGuarantee" value="0" <c:if test="${bean.isGuarantee==0}">checked="checked"</c:if> disabled="true"> 否
        </td>
        <td align="right">
            是否当店保修:
        </td>
        <td  class="container">
            <input type="radio" name="isCurshopGuarant" value="1" <c:if test="${bean.isCurshopGuarant==1}">checked="checked"</c:if> disabled="true"> 是
            <input type="radio" name="isCurshopGuarant" value="0" <c:if test="${bean.isCurshopGuarant==0}">checked="checked"</c:if> disabled="true"> 否
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            问题一级分类:
        </td>
        <td  class="container">
                ${bean.problemTypeOne.name}&nbsp;
        </td>
        <td align="right">
            二级分类:
        </td>
        <td  class="container">
                ${bean.problemTypeSecond.name}&nbsp;
        </td>
    </tr>

    <tr class="cssline">
        <td align="right">
            维修等级:
        </td>
        <td  class="container">
                ${bean.mendRank.name}&nbsp;
        </td>
        <td align="right">
            维修期限:
        </td>
        <td  class="container">
                ${bean.mendDueLimit.name}&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            问题描述:
        </td>
        <td  class="container" colspan="3">
            <textarea rows="4" cols="80"  name="description" readonly="true">${bean.description}</textarea>
        </td>
    </tr>

    <tr class="cssline">
        <td align="right">
            市外交通费用(元):
        </td>
        <td  class="container">
            <input type="text" id="trafficFee" name="trafficFee" value="${bean.trafficFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
        <td align="right">
            材料费用(元):
        </td>
        <td  class="container">
            <input type="text" id="materialFee" name="materialFee" value="${bean.materialFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            市内交通费用(元):
        </td>
        <td  class="container">
            <input type="text" id="inTrafficFee" name="inTrafficFee" value="${bean.inTrafficFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
        <td align="right">
            材料运输费用(元):
        </td>
        <td  class="container">
            <input type="text" id="materialTransFee" name="materialTransFee" value="${bean.materialTransFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            住宿费用(元):
        </td>
        <td  class="container">
            <input type="text" id="lodgeFee" name="lodgeFee" value="${bean.lodgeFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
        <td align="right">
            材料费用(元):
        </td>
        <td  class="container">
            <input type="text" id="lampFee" name="lampFee" value="${bean.lampFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            库存费用(元):
        </td>
        <td  class="container">
            <input type="text" id="storeFee" name="storeFee" value="${bean.storeFee}" validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
        <td align="right">
            其它费用(元):
        </td>
        <td  class="container">
            <input type="text" id="otherFee" name="otherFee" value="${bean.otherFee}"  validType="number(2)" style="width: 200px" onblur="calcTotal()"/>&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            总计(元):
        </td>
        <td  class="container" colspan="3">
            <input type="text" id="total" name="total" value="${bean.total}" readonly="true" validType="number(2)" style="width: 200px"/>&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            实际维修日期:
        </td>
        <td  class="container">
            <input type="text" id="mendDate" name="mendDate" class="Wdate" value="${bean.mendDate}" style="width: 100px" onFocus="WdatePicker({readOnly:true})"/>&nbsp;

        </td>
        <td align="right">
            <font color="red">*</font>维修人:
        </td>
        <td class="container" colspan="3">
            <input type="text" name="mender" value="${bean.mender}" style="width: 200px" required="true"/>&nbsp;
        </td>
    </tr>
    <tr class="cssline">
        <td align="right">
            更换材料:
        </td>
        <td  class="container" colspan="3">
            <textarea rows="4" cols="80"  name="material" >${bean.material}</textarea>
        </td>
    </tr>
    <tr>
        <td colspan="4" valign="middle" align="center">
            <input type="button" id="formMendFormbutton" value="确定" class="btn_Ok">&nbsp;
            <input type="button" value="取消" class="btn_Del" onclick="closeWindow('mendFormWindow')">
        </td>
    </tr>
</table>

</div>
</form:form>
</div>