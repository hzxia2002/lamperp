<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<script type="text/javascript">
    $(document).ready(function () {
        $("#viewTable tr:odd").addClass("cssline_1");
    });
</script>

<div>
      <div>
            <table border="0" cellspacing="1" width="100%" id="viewTable">
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--父节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.parent}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        单位代码:
                    </td>
                    <td  class="container">
                      ${bean.code}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        单位名称:
                    </td>
                    <td  class="container">
                      ${bean.name}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        简称:
                    </td>
                    <td  class="container">
                      ${bean.shortName}
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--叶节点:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.isLeaf}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--树形层次:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.treeId}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        机构代码证:
                    </td>
                    <td  class="container">
                      ${bean.cardNo}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        注册地编码:
                    </td>
                    <td  class="container">
                      ${bean.cityCode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        注册地名称:
                    </td>
                    <td  class="container">
                      ${bean.cityName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        隶属省市代码:
                    </td>
                    <td  class="container">
                      ${bean.provinceCode}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        隶属省市名称:
                    </td>
                    <td  class="container">
                      ${bean.provinceName}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        注册地址:
                    </td>
                    <td  class="container">
                      ${bean.address}
                    </td>
                </tr>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--排序:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.orderNo}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <%--<tr class="cssline">--%>
                    <%--<td  class="csslabel">--%>
                        <%--单位标志:--%>
                    <%--</td>--%>
                    <%--<td  class="container">--%>
                      <%--${bean.isTag}--%>
                    <%--</td>--%>
                <%--</tr>--%>
                <tr class="cssline">
                    <td  class="csslabel">
                        是否有效:
                    </td>
                    <td  class="container">
                      ${bean.isValid ? "有效" : "无效"}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        备注:
                    </td>
                    <td  class="container">
                      ${bean.memo}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建时间:
                    </td>
                    <td  class="container">
                      ${bean.createTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新时间:
                    </td>
                    <td  class="container">
                      ${bean.updateTime}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        创建人:
                    </td>
                    <td  class="container">
                      ${bean.createUser}
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        更新人:
                    </td>
                    <td  class="container">
                      ${bean.updateUser}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('sysDeptWindow')">
                    </td>
                </tr>
            </table>
      
    </div>
</div>