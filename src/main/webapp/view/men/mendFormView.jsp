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
                <td align="right" width="15%">
                    厂商名称:
                </td>
                <td class="container" width="35%">${bean.firm.name}&nbsp;</td>
                <td align="right" width="15%">
                    维修编号:
                </td>
                <td class="container">
                    ${bean.mendNo}&nbsp;
                </td>
            </tr>

            <tr class="cssline">
                <td  align="right">
                    记录日期:
                </td>
                <td  class="container">
                    <fmt:formatDate value="${bean.recordTime}"  pattern="yyyy-MM-dd HH:mm:ss"/>&nbsp;
                </td>
                <td  align="right">
                    区域:
                </td>
                <td  class="container">
                    "${bean.area.name}
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    店号:
                </td>
                <td  class="container">
                    ${bean.storeNo}&nbsp;
                </td>
                <td  align="right">
                    <span style="color: red;font-size: 12px">*</span> 中文店名:
                </td>
                <td  class="container">
                    ${bean.storeName}&nbsp;
                </td>
            </tr>

            <tr class="cssline">
                <td  align="right">
                    报修人:
                </td>
                <td  class="container">
                    ${bean.troubleCaller}&nbsp;
                </td>
                <td  align="right">
                    保修损坏数量:
                </td>
                <td  class="container">
                    ${bean.breakdownCount}&nbsp;
                </td>
            </tr>


            <tr class="cssline">
                <td  align="right">
                    是否保修:
                </td>
                <td  class="container">
                    <input type="radio" name="isGuarantee" value="1" <c:if test="${bean.isGuarantee==1}">checked="checked"</c:if> disabled="true"> 是
                    <input type="radio" name="isGuarantee" value="0" <c:if test="${bean.isGuarantee==0}">checked="checked"</c:if> disabled="true"> 否
                </td>
                <td  align="right">
                    是否当店保修:
                </td>
                <td  class="container">
                    <input type="radio" name="isCurshopGuarant" value="1" <c:if test="${bean.isCurshopGuarant==1}">checked="checked"</c:if> disabled="true"> 是
                    <input type="radio" name="isCurshopGuarant" value="0" <c:if test="${bean.isCurshopGuarant==0}">checked="checked"</c:if> disabled="true"> 否
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    问题一级分类:
                </td>
                <td  class="container">
                    ${bean.problemTypeOne.name}&nbsp;
                </td>
                <td  align="right">
                    二级分类:
                </td>
                <td  class="container">
                    ${bean.problemTypeSecond.name}&nbsp;
                </td>
            </tr>

            <tr class="cssline">
                <td  align="right">
                    维修等级:
                </td>
                <td  class="container">
                    ${bean.mendRank.name}&nbsp;
                </td>
                <td  align="right">
                    维修期限:
                </td>
                <td  class="container">
                    ${bean.mendDueLimit.name}&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    问题描述:
                </td>
                <td  class="container" colspan="3">
                    <textarea rows="4" cols="80"  name="description" readonly="true">${bean.description}</textarea>
                </td>
            </tr>

            <tr class="cssline">
                <td  align="right">
                    市外交通费用(元):
                </td>
                <td  class="container">
                    ${bean.trafficFee}&nbsp;
                </td>
                <td  align="right">
                    材料费用(元):
                </td>
                <td  class="container">
                    ${bean.materialFee}&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    市内交通费用(元):
                </td>
                <td  class="container">
                    ${bean.inTrafficFee}&nbsp;
                </td>
                <td  align="right">
                    材料运输费用(元):
                </td>
                <td  class="container">
                    ${bean.materialTransFee}&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    住宿费用(元):
                </td>
                <td  class="container">
                    ${bean.lodgeFee}&nbsp;
                </td>
                <td  align="right">
                    材料费用(元):
                </td>
                <td  class="container">
                    ${bean.lampFee}&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    库存费用(元):
                </td>
                <td  class="container">
                    ${bean.storeFee}&nbsp;
                </td>
                <td  align="right">
                    <b>总计(元):</b>
                </td>
                <td  class="container">
                    <strong>${bean.total}</strong>&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    实际维修日期:
                </td>
                <td  class="container">
                    ${bean.mendDate}&nbsp;
                </td>
                <td  align="right">
                    维修人:
                </td>
                <td  class="container" colspan="3">
                   ${bean.mender}&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  align="right">
                    更换材料:
                </td>
                <td  class="container" colspan="3">
                    <textarea rows="4" cols="80"  name="material" disabled="true">${bean.material}</textarea>
                </td>
            </tr>
            <tr>
                <td colspan="4" valign="middle" align="center">
                    <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('mendFormWindow')">
                </td>
            </tr>
        </table>

    </div>
</div>