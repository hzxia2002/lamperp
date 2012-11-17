<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../common/taglibs.jsp"%>
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
                    任务名称:
                </td>
                <td  class="container">
                    ${bean.name}
                </td>
                <td  class="label">
                    任务标记:
                </td>
                <td  class="container">
                    ${bean.tag}
                </td>
            </tr>

            <tr class="line">
                <td  class="label">
                    计划完成时间:
                </td>
                <td  class="container">
                    ${bean.completeDate}
                </td>
                <td  class="label">
                    任务开始时间:
                </td>
                <td  class="container">
                    ${bean.startDate}
                </td>
            </tr>

            <tr class="line">
                <td  class="label">
                    翻译字数:
                </td>
                <td  class="container">
                    ${bean.wordCount}
                </td>
                <td  class="label">
                    状态:
                </td>
                <td  class="container">
                    ${bean.status}
                </td>
            </tr>

            <tr class="cssline">
                <td  class="csslabel">
                    翻译要求:
                </td>
                <td  class="container" colspan="3">
                    &nbsp;<textarea type="text" name="requirement" cols="70" rows="3" readonly="true">${bean.requirement}</textarea>&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    分配明细:
                </td>
                <td  class="container" colspan="3">
                    &nbsp;<textarea type="text" name="signDetail" cols="70" rows="3" readonly="true">${bean.signDetail}</textarea>&nbsp;
                </td>
            </tr>
            <tr class="cssline">
                <td  class="csslabel">
                    审稿意见:
                </td>
                <td  class="container" colspan="3">
                    &nbsp;<textarea type="text" name="reviewSugestion" cols="70" rows="3" readonly="true">${bean.reviewSugestion}</textarea>&nbsp;
                </td>
            </tr>
            <tr>
                <td colspan="4" valign="middle" align="center">
                    <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('taskWindow')">
                </td>
            </tr>
        </table>
        <iframe border="0" src="view/doc/fileListView.jsp?docId=${bean.doc.id}" style="width: 99%; height:280px"/>
    </div>
</div>