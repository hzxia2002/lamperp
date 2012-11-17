<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysOperationTableLogEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysOperationTableLogbutton').click(function() {
            if (!$("#sysOperationTableLogEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysOperationTableLogEditForm", "sysOperationTableLogWindow", "sysOperationTableLogGrid");
        });
    });
</script>

<div>
    <form:form id="sysOperationTableLogEditForm" name="sysOperationTableLogEditForm" action="${ctx}/sysOperationTableLog/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        数据表:
                    </td>
                    <td  class="container">
                        <input type="text" name="table" value="${bean.table}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作日志:
                    </td>
                    <td  class="container">
                        <input type="text" name="logXml" value="${bean.logXml}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        IP地址:
                    </td>
                    <td  class="container">
                        <input type="text" name="ipAddress" value="${bean.ipAddress}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建时间:
                    </td>
                    <td  class="container">
                        <input type="text" name="createTime" class="Wdate" value="${bean.createTime}" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})" />&nbsp;

                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间:
                    </td>
                    <td  class="container">
                        <input type="text" name="updateTime" class="Wdate" value="${bean.updateTime}" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})" />&nbsp;

                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新人:
                    </td>
                    <td  class="container">
                        <input type="text" name="updateUser" value="${bean.updateUser}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建人:
                    </td>
                    <td  class="container">
                        <input type="text" name="createUser" value="${bean.createUser}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysOperationTableLogbutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('sysOperationTableLogWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>