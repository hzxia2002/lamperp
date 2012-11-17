<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../common/taglibs.jsp"%>

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#taskEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formTaskbutton').click(function() {
            if (!$("#taskEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/task/save.do", "taskEditForm", "taskWindow", "taskGrid");
        });

        $("#editTable tr:odd").addClass("cssline_1");


    });
</script>

<div>
    <form:form id="taskEditForm" name="taskEditForm" action="${ctx}/task/save.do" method="post">
        <input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%" id="editTable">
                <tr class="cssline">
                    <td  class="csslabel">
                        所属项目:
                    </td>
                    <td  class="container">
                        <input type="text" name="projectName" value="${bean.project.name}" readonly="true" class="input_table" style="width: 200"/>&nbsp;
                        <input type="hidden" name="project" value="${bean.project.id}" />&nbsp;
                    </td>
                    <td  class="csslabel">
                        任务名称:
                    </td>
                    <td  class="container">
                        <input type="text" name="name" value="${bean.name}" required="true" class="input_table" />&nbsp;
                    </td>
                </tr>

                <tr class="cssline">
                    <td  class="csslabel">
                        任务标记:
                    </td>
                    <td  class="container">
                        <input type="text" name="tag" value="${bean.tag}" required="true" class="input_table" style="width: 140"/>&nbsp;
                    </td>
                    <td  class="csslabel">
                        翻译字数:
                    </td>
                    <td  class="container">
                        <input type="text" name="wordCount" value="${bean.wordCount}" class="input_table"  validType="number(0)" style="width: 120px"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        任务开始时间:
                    </td>
                    <td  class="container">
                        <input type="text" name="startDate" class="Wdate" style="width: 200px" value="${bean.startDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>&nbsp;
                    </td>
                    <td  class="csslabel">
                        计划完成时间:
                    </td>
                    <td  class="container">
                        <input type="text" name="completeDate" class="Wdate" style="width: 200" value="${bean.completeDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})"/>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">

                </tr>
                    <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                    <%--任务结束时间:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                    <%--<input type="text" name="endDate" class="Wdate" value="${bean.endDate}" onFocus="WdatePicker({isShowClear:false,readOnly:true})" style="width: 200px"/>&nbsp;--%>
                    <%--&nbsp;--%>
                    <%--</td>--%>
                    <%--</tr>--%>

                <tr class="cssline">
                    <td  class="csslabel">
                        翻译员:
                    </td>
                    <td  class="container">
                        <input  type="text" name="translatorName" value="${bean.translator.name}" class="input_table" id="translatorName" disabled="true" style="width: 150px"/>
                        <input  type="hidden" name="translator" value="${bean.translator.id}" id="translator" />
                        <img src="${ctx}/skin/icons/edit_add.png"  onclick="new PopTree({url:'${ctx}/task/tree.do',targetId:'translator',targetValueId:'translatorName',onlyLeaf:true,title:'翻译员'});">
                    </td>
                    <td  class="csslabel">
                        报酬(元):
                    </td>
                    <td  class="container">
                        <input type="text" name="reward" value="${bean.reward}" class="input_table" validType="number(2)" style="width: 120px"/>&nbsp;
                    </td>
                </tr>

                <tr class="cssline">
                    <td  class="csslabel">
                        是否委托翻译:
                    </td>
                    <td  class="container" colspan="3">
                        &nbsp;<input type="checkbox" name="isEntrust"  ${bean.isEntrust?"checked":""} />&nbsp;
                    </td>
                </tr>
                <c:if test="${status!=null}">
                    <tr class="cssline">
                        <td  class="csslabel">
                            任务当前状态:
                        </td>
                        <td  class="container" colspan="3">
                            ${status}
                        </td>
                    </tr>
                </c:if>
                <c:if test="${bean.status=='2'||bean.status=='3'}">
                    <tr class="cssline">
                        <td  class="csslabel">
                            任务状态:
                        </td>
                        <td  class="container" colspan="3">
                            <select name="status">
                                <c:forEach items="${statusItems}" begin="2" step="1" var="item">
                                    <option value="${item.key}">${item.value}</option>
                                </c:forEach>
                            </select>

                            <%--&nbsp;<input type="text" name="status" value="${bean.status}" />&nbsp;--%>
                        </td>
                    </tr>
                </c:if>
                <tr class="cssline">
                    <td  class="csslabel">
                        翻译要求:
                    </td>
                    <td  class="container" colspan="3">
                        &nbsp;<textarea type="text" name="requirement" cols="70" rows="3">${bean.requirement}</textarea>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        分配明细:
                    </td>
                    <td  class="container" colspan="3">
                        &nbsp;<textarea type="text" name="signDetail" cols="70" rows="3">${bean.signDetail}</textarea>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        审稿意见:
                    </td>
                    <td  class="container" colspan="3">
                        &nbsp;<textarea type="text" name="reviewSugestion" cols="70" rows="3">${bean.reviewSugestion}</textarea>&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        审稿老师:
                    </td>
                    <td  class="container" colspan="3">
                        &nbsp;<input type="text" name="reviewTeacher" value="${bean.reviewTeacher}" class="input_table" style="width: 200">&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="4" valign="middle" align="center">
                        <input type="button" id="formTaskbutton" value="确定" class="btn_Ok">&nbsp;
                        <input type="button" value="取消" class="btn_Del" onclick="closeWindow('taskWindow')">
                    </td>
                </tr>
            </table>
            <iframe border="0" src="${ctx}/document/fileList.do?docId=${bean.doc.id}" style="width: 99%; height:280px"/>
        </div>
    </form:form>
</div>