<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="java.util.*" %>
<%@page import="com.justonetech.core.session.UserSessionImpl" %>
<%@page import="com.justonetech.core.utils.Constant" %>
<%@page import="com.justonetech.core.security.util.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title><spring:message code="main.title" /></title>
	<script type="text/javascript">
		jQuery.ajaxSetup({cache:false});//ajax不缓存
		jQuery(function($){

		});

		function setMain(title,href){
			$(".combo-panel").parent(".panel").remove(); //清楚所有class为combo-panel的class为panel的父元素，解决combobox在页面缓存的问题
			var centerURL = href;
			var centerTitle = title;

			$('body').layout('panel','center').panel({
				title:"所在位置："+centerTitle,
				href:centerURL
			});

			$('body').layout('panel','center').panel('refresh');
			return false;
		}

		//弹出窗口
		function showWindow(options){
			jQuery("#MyPopWindow").window(options);
		}
		//关闭弹出窗口
		function closeWindow(){
			$("#MyPopWindow").window('close');
		}
	</script>
  </head>
  <!-- easyui-layout 可分上下左右中五部分，中间的是必须的，支持href，这样就可以不用iframe了 -->
  <body class="easyui-layout" id="mainBody" fit="true">
		<!-- 上 -->
		<div region="north" split="false" style="background:#E0ECFF;height:30px;text-align:left;" border="1">
			<%@ include file="/common/menu.jsp" %>
		</div>

		<!-- 中 -->
		<div region="center" class="maindiv" title="所在位置: 首页" style="overflow-x:hidden;padding: 0px;" href="welcome.jsp" ></div>
		<div id="MyPopWindow" modal="true" shadow="false" minimizable="false" cache="false" maximizable="false" collapsible="false" resizable="false" style="margin: 0px;padding: 0px;overflow: auto;"></div>
  </body>
</html>
