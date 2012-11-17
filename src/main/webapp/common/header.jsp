<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.justonetech.core.security.util.SpringSecurityUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@include file="taglibs.jsp"%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>琢言文化翻译管理系统</title>
    <link href="<c:url value="/skin/style.css"/>" rel="stylesheet" type="text/css" />
    <%@include file="common_js.jsp"%>
</head>
<body>
<div class="Header">
    <div class="logo"><a href="<c:url value="/index.jsp"/>"><img src="<c:url value="/skin/img/logo.gif"/>" border="0"/></a></div>
    <div class="search">
        <div>
        <em>　　　　　<a href="#" onclick="javascript:addBookmark('琢言文化翻译管理系统','http://www.zytranslate.com:8080/')">加入收藏</a></em>
        <span><input type="submit" name="button2" id="button2" value="" class="but" />
            <input type="text" name="textfield2" id="textfield2" class="input" onClick="JavaScript:this.value='';" onMouseOver="JavaScript:this.select();" value="请输入关键字" /></span>
        </div>
        <div style="width: 100%">
        <span><%if(SpringSecurityUtils.getCurrentUser() != null) {%>
            欢迎您，<%=SpringSecurityUtils.getCurrentUser().getRealName()%> <a href="<c:url value="/j_spring_security_logout"/>">退出登录</a>
        <%}%></span>
        </div>
    </div>
    <%
        String path = StringUtils.defaultIfEmpty(request.getParameter("path"), "");
        String defaultUrl = StringUtils.defaultIfEmpty((String)session.getAttribute("defaultUrl"), "/login.jsp");
    %>
    <div class="nav">
        <ul>
            <li class="n1"><a href="<c:url value="/index.jsp"/>?path=index" <%if(path.equals("index")){%> class="tag" <%}%>>返回首页</a></li>
            <li class="n2"><a href="<c:url value="/home/html/about.jsp"/>?path=about" <%if(path.equals("about")){%> class="tag" <%}%>>关于平安工地</a></li>
            <li class="n3"><a href="<c:url value="/home/html/zfms.jsp"/>?path=zfms" <%if(path.equals("zfms")){%> class="tag" <%}%>>资费模式</a></li>
            <li class="n4"><a href="<c:url value="/home/html/ywms.jsp"/>?path=ywms" <%if(path.equals("ywms")){%> class="tag" <%}%>>业务办理</a></li>
            <li class="n5"><a href="<c:url value="<%=defaultUrl%>"/>?path=jkzx" <%if(path.equals("jkzx")){%> class="tag" <%}%>>监控中心</a></li>
            <li class="n6"><a href="<c:url value="/home/html/bzzx.jsp"/>?path=bzzx" <%if(path.equals("bzzx")){%> class="tag" <%}%>>帮助中心</a></li>
        </ul>
    </div>
    <div class="clr"></div>
</div>