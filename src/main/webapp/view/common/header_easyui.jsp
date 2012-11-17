<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>系统示例</title>
<link rel="stylesheet" type="text/css" href="${ctx}/skin/main.css"/>
<link href="<c:url value="/skin/jquery/liger/Aqua/css/ligerui-all.css"/>" rel="stylesheet" type="text/css" />
<%--<link rel="stylesheet" type="text/css" href="<c:url value="/js/jquery/plupload/jquery.plupload.queue/css/jquery.plupload.queue.css"/>"/>--%>
<link rel="stylesheet" type="text/css" href="<c:url value="/js/jquery/plupload/jquery.ui.plupload/css/jquery.ui.plupload.css"/>"/>
<script src="${ctx}/js/jquery/jquery-1.7.1.js" type="text/javascript"></script>
<script src="${ctx}/js/jquery/ui/jquery-ui-1.8.17.min.js" type="text/javascript"></script>
<script src="${ctx}/js/jquery/tree/jquery.ztree.core-3.0.min.js" type="text/javascript"></script>
<script src="${ctx}/js/jquery/tree/jquery.ztree.excheck-3.0.min.js" type="text/javascript"></script>
<script src="${ctx}/js/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script src="${ctx}/js/jquery/grid/i18n/grid.locale-cn.js" type="text/javascript"></script>
<script src="${ctx}/js/jquery/grid/jquery.jqGrid.src.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>

<%--/******************************以下为自行添加内容****************************************/--%>
<script src="${ctx}/js/jquery/jo/jquery.timer.js" type="text/javascript"></script>
<script src="${ctx}/js/default.js" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/liger/core/base.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/liger/plugins/ligerMenu.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/liger/plugins/ligerMenuBar.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/jo/JoTree.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/jo/PopTree.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/jo/jquery.JORegion.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/jquery/jo/jquery.mask.js"/>" type="text/javascript"></script>
<script type="text/javascript" src="<c:url value="/js/jquery/plupload/plupload.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/jquery/plupload/plupload.flash.js"/>"></script>
<%--<script type="text/javascript" src="<c:url value="/js/jquery/plupload/jquery.plupload.queue/jquery.plupload.queue.src.js"/>"></script>--%>
<script type="text/javascript" src="<c:url value="/js/jquery/plupload/jquery.ui.plupload/jquery.ui.plupload.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/jquery/plupload/i18n/cn.js"/>"></script>
<%--<script src="<c:url value="/js/jquery/jo/jquery.JOValidate.js"/>" type="text/javascript"></script>--%>
<%--<script src="${ctx}/js/jquery/easyui/easyloader.js" type="text/javascript"></script>--%>

<script src="${ctx}/js/jquery/easyui/jquery.easyui.1.2.5.js" type="text/javascript"></script>
<script src="${ctx}/js/jquery/easyui/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>

<script type="text/javascript">
    var CONTEXT_NAME = "${ctx}";

//    easyloader.locale = 'zh_CN';
</script>
</head>