<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<link href="<c:url value="/skin/form.css"/>" rel="stylesheet" type="text/css" />

<script type="text/javascript">
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#sysLogEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formSysLogbutton').click(function() {
            if (!$("#sysLogEditForm").form('validate')) {
                return;
            }

            //提交表单
            saveAjaxData("${ctx}/sysDept/save.do", "sysLogEditForm", "sysLogWindow", "sysLogGrid");
        });
    });
</script>

<div>
    <form:form id="sysLogEditForm" name="sysLogEditForm" action="${ctx}/sysLog/save.do" method="post">
	<input type="hidden" name="id" value="${bean.id}" />
        <div>
            <table border="0" cellspacing="1" width="100%">

                <tr class="cssline">
                    <td  class="csslabel">
                        用户标识:
                    </td>
                    <td  class="container">
                        <input type="text" name="user" value="${bean.user}" />&nbsp;
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
                        进入时间:
                    </td>
                    <td  class="container">
                        <input type="text" name="enterTime" class="Wdate" value="${bean.enterTime}" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})" />&nbsp;

                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        完成时间:
                    </td>
                    <td  class="container">
                        <input type="text" name="outTime" class="Wdate" value="${bean.outTime}" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy-MM-dd HH:mm:ss'})" />&nbsp;

                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        访问页面:
                    </td>
                    <td  class="container">
                        <input type="text" name="pageUrl" value="${bean.pageUrl}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        操作类型:
                    </td>
                    <td  class="container">
                        <input type="text" name="logType" value="${bean.logType}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        浏览器版本:
                    </td>
                    <td  class="container">
                        <input type="text" name="ieVersion" value="${bean.ieVersion}" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        SESSIONID:
                    </td>
                    <td  class="container">
                        <input type="text" name="sessionid" value="${bean.sessionid}" />&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" id="formSysLogbutton" value="确定" class="button_confirm">&nbsp;
                        <input type="button" value="取消" class="button_cancel" onclick="closeWindow('sysLogWindow')">
                    </td>
                </tr>
            </table>
      
        </div>
    </form:form>
</div>