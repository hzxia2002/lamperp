<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysDeptEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysDeptbutton').click(function() {
            if (!$("#sysDeptEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysDeptEditForm", "sysDeptWindow", "sysDeptGrid");
        });

        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
    <form:form id="sysDeptEditForm" modelAttribute="bean" name="sysDeptEditForm" action="${ctx}/sysDept/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        上级单位/部门:
                    </td>
                    <td  class="container">
                        <input type="hidden" name="parent" value="${bean.parent.id}" />
                        <input type="text" name="parent_name" value="${bean.parent.name}" readonly="true" class="input_table" disabled="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>单位代码:
                    </td>
                    <td  class="container">
                        <input type="text" name="code" value="${bean.code}" class="input_table" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>单位名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" class="input_table" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>简称:
                    </td>
                    <td  class="container">
                        <input type="text" name="shortName" value="${bean.shortName}" class="input_table" required="true"/>&nbsp;
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--叶节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="isLeaf" value="${bean.isLeaf}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--树形层次:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="treeId" value="${bean.treeId}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span class="errors">*</span>机构代码证:
                    </td>
                    <td  class="container">
                        <input type="text" name="cardNo" value="${bean.cardNo}" class="input_table" required="true"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        公司类型:
                    </td>
                    <td  class="container">
                        <select name="type">
                            <c:forEach items="${companyTypeItems}" var="item">
                                 <option value="${item.key}" <c:if test="${(item.key==bean.type)}">selected="true"</c:if>>${item.value}</option>
                            </c:forEach>
                        </select>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        联系人:
                    </td>
                    <td  class="container">
                        <input type="text" name="linker" value="${bean.linker}" class="input_table" style="width: 140"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        电话:
                    </td>
                    <td  class="container">
                        <input type="text" name="telephone" value="${bean.telephone}" class="input_table" style="width: 140"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        email:
                    </td>
                    <td  class="container">
                        <input type="text" name="email" value="${bean.email}" class="input_table" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        网址:
                    </td>
                    <td  class="container">
                        <input type="text" name="netSite" value="${bean.netSite}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        传真:
                    </td>
                    <td  class="container">
                        <input type="text" name="fax" value="${bean.fax}" class="input_table" style="width: 140"/>&nbsp;
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--注册地编码:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="cityCode" value="${bean.cityCode}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--注册地名称:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="cityName" value="${bean.cityName}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--隶属省市代码:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="provinceCode" value="${bean.provinceCode}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--隶属省市名称:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="provinceName" value="${bean.provinceName}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--注册地址:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="address" value="${bean.address}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--排序:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                        <%--<input type="text" name="orderNo" value="${bean.orderNo}" class="input_table"/>&nbsp;--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        单位标志:
                    </td>
                    <td  class="container">
                        <input type="text" name="isTag" value="${bean.isTag}" class="input_table"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td  class="container">
                        <form:checkbox path="isValid"/>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                        <textarea rows="4" cols="60" class="textarea_table" name="memo" id="memo">${bean.memo}</textarea>
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建时间/创建人:
                    </td>
                    <td  class="container">
                        ${bean.createTime}/${bean.createUser}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间/更新人:
                    </td>
                    <td  class="container">
                        ${bean.updateTime}/${bean.updateUser}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysDeptbutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('sysDeptWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>