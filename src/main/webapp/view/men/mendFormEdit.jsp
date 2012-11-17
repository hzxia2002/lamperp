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

            //提交表单
            saveAjaxData("${ctx}/mendForm/save.do", "mendFormEditForm", "mendFormWindow", "mendFormGrid");
        });

        $("#editTable tr:odd").addClass("cssline_1");

        $.ajax({
            url:"${ctx}/sysCode/getCodeList.do",
            data:{code:"problem_one",id:"${bean.problemTypeOne.id}"},
            success:function(ret){
                $("#problemTypeOne").html(ret);
                loadProblemSecond("${bean.problemTypeOne.id}");
            }
        });

        $("#problemTypeOne").bind("change",function(){
            loadProblemSecond($("#problemTypeOne").val());
        });

    });

    function loadProblemSecond(parentId){
        $.ajax({
            url:"${ctx}/sysCode/getCodeDetailListById.do",
            type:"post",
            data:{parentId:parentId||"${bean.problemTypeOne.id}",id:"${bean.problemTypeSecond.id}"},
            success:function(ret){
                $("#problemTypeSecond").html(ret);
            }
        });
    }
</script>

<div>
<form:form id="mendFormEditForm" name="mendFormEditForm" action="${ctx}/mendForm/save.do" method="post">
<input type="hidden" name="id" value="${bean.id}" />
<div>
<table border="0" cellspacing="1" width="100%" id="editTable">
<tr class="cssline">
    <td width="15%" align="right">
        <span style="color: red;font-size: 12px">*</span>  厂商名称:
    </td>
    <td width="35%">
        <input type="text"
               class="easyui-combobox"
               name="firm"
               url="${ctx}/mendForm/getDepts.do"
               valueField="id"
               textField="name"
               style="width: 200px"
               panelHeight="auto"
               value="${bean.firm.id}"
               required="true"/>&nbsp;
    </td>
    <td width="15%" align="right">
        维修编号:
    </td>
    <td width="35%">
        <input type="text" name="mendNo" value="${bean.mendNo}" style="width: 200px" readonly="true"/>&nbsp;
    </td>
</tr>

<tr class="cssline">
    <td align="right">
        记录日期:
    </td>
    <td>
        <input  name="recordTime" class="Wdate" value="<fmt:formatDate value="${bean.recordTime}"  pattern="yyyy-MM-dd HH:mm:ss"/>" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})"  style="width: 200px"/>&nbsp;
    </td>
    <td align="right">
        区域:
    </td>
    <td>
        <input type="text"
               class="easyui-combobox"
               name="area"
               url="${ctx}/sysCode/getCodeDetailList.do?code=AREA"
               valueField="id"
               style="width: 200px"
               textField="name"
               panelHeight="auto"
               value="${bean.area.id}"/>
    </td>
</tr>
<tr class="cssline">
    <td align="right">
        <span style="color: red;font-size: 12px">*</span> 店号:
    </td>
    <td>
        <input type="text" name="storeNo" value="${bean.storeNo}" style="width: 200px" required="true"/>&nbsp;
    </td>
    <td align="right">
        <span style="color: red;font-size: 12px">*</span> 中文店名:
    </td>
    <td>
        <input type="text" name="storeName" value="${bean.storeName}" style="width: 200px" required="true"/>&nbsp;
    </td>
</tr>

<tr class="cssline">
    <td align="right">
        报修人:
    </td>
    <td>
        <input type="text" name="troubleCaller" value="${bean.troubleCaller}" style="width: 200px"/>&nbsp;
    </td>
    <td align="right">
        保修损坏数量:
    </td>
    <td>
        <input type="text" name="breakdownCount" value="${bean.breakdownCount}" style="width: 200px" validType="number(0)"/>&nbsp;
    </td>
</tr>


<tr class="cssline">
    <td align="right">
        是否保修:
    </td>
    <td>
        <input type="radio" name="isGuarantee" value="1" <c:if test="${bean.isGuarantee==1}">checked="checked"</c:if>> 是
        <input type="radio" name="isGuarantee" value="0" <c:if test="${bean.isGuarantee==0}">checked="checked"</c:if>> 否
    </td>
    <td align="right">
        是否当店保修:
    </td>
    <td>
        <input type="radio" name="isCurshopGuarant" value="1" <c:if test="${bean.isCurshopGuarant==1}">checked="checked"</c:if>> 是
        <input type="radio" name="isCurshopGuarant" value="0" <c:if test="${bean.isCurshopGuarant==0}">checked="checked"</c:if>> 否
    </td>
</tr>
<tr class="cssline">
    <td align="right">
        问题一级分类:
    </td>
    <td>
        <select name="problemTypeOne" id="problemTypeOne" style="width: 200px"></select>
    </td>
    <td align="right">
        二级分类:
    </td>
    <td>
        <select name="problemTypeSecond" id="problemTypeSecond" style="width: 200px"></select>
    </td>
</tr>

<tr class="cssline">
    <td align="right">
        维修等级:
    </td>
    <td>
        <input type="text"
               class="easyui-combobox"
               name="mendRank"
               url="${ctx}/sysCode/getCodeDetailList.do?code=mend_rank"
               valueField="id"
               textField="name"
               panelHeight="auto"
               style="width: 200px"
               value="${bean.mendRank.id}"/>
    </td>
    <td align="right">
        维修期限:
    </td>
    <td>
        <input type="text"
               class="easyui-combobox"
               name="mendDueLimit"
               url="${ctx}/sysCode/getCodeDetailList.do?code=limit"
               valueField="id"
               textField="name"
               style="width: 200px"
               panelHeight="auto"
               value="${bean.mendDueLimit.id}"/>
    </td>
</tr>
<tr class="cssline">
    <td align="right">
        问题描述:
    </td>
    <td colspan="3">
        <textarea rows="4" cols="80"  name="description">${bean.description}</textarea>
    </td>
</tr>

    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--更换材料:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="material" value="${bean.material}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--实际维修日期:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="mendDate" class="Wdate" value="${bean.mendDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>&nbsp;--%>

    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--交通费用:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="trafficFee" value="${bean.trafficFee}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--材料费用:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="materialFee" value="${bean.materialFee}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--住宿费用:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="lodgeFee" value="${bean.lodgeFee}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--灯具费用:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="lampFee" value="${bean.lampFee}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--库存费用:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="storeFee" value="${bean.storeFee}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--总计:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="total" value="${bean.total}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--维修人:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="mender" value="${bean.mender}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
    <%--<tr class="cssline">--%>
    <%--<td>--%>
    <%--状态:--%>
    <%--</td>--%>
    <%--<td>--%>
    <%--<input type="text" name="status" value="${bean.status}" />&nbsp;--%>
    <%--</td>--%>
    <%--</tr>--%>
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