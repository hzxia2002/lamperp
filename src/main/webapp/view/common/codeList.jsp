<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<option value="-1" ><---请选择--></option>
<c:forEach items="${codeList}" var="item">
    <option value="${item.id}" <c:if test="${item.id==id}">selected="selected" </c:if>>${item.name}</option>
</c:forEach>