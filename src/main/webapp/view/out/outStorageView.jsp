<%@ page contentType="text/html; charset=UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>

<script type="text/javascript">
    var products = {};
    $(document).ready(function () {
        /**
         * 进行校核绑定
         */
        $('#outStorageEditForm input').each(function () {
            if ($(this).attr('required') || $(this).attr('validType')) {
                $(this).validatebox();
            }
        });

        $('#formOutStoragebutton').click(function() {

            if(confirm("您确定要提交数据？提交后数据不能再修改")){
                if(!$("#mendFormIds").val()){
                    alert("维修单不能为空");
                    return;
                }
                if (!$("#outStorageEditForm").form('validate')) {
                    return;
                }
                $("#products").val(toJsonString(products));
                //提交表单
                saveAjaxData("${ctx}/outStorage/save.do", "outStorageEditForm", "outStorageWindow", "outStorageGrid");
            }

        });

        $("#editTable tr:odd").addClass("cssline_1");

        $("#productAddGrid").jqGrid({
            url:'${ctx}/outStorage/getProducts.do',
            datatype: "json",
            colNames:["ID","产品名称","产品编号","数量","状态","操作"],
            colModel:[
                {name:'id',index:'id',width:80,align:"center",sortable:false,hidden:true},
                {name:'productName',index:'productName',width:80,align:"center",sortable:false},
                {name:'code',index:'code',width:80,align:"center",sortable:false},
                {name:'count',index:'count',width:80,align:"center",sortable:false},
                {name:'status',index:'status',width:80,align:"center",sortable:false,hidden:true},
                {name:'operation',index:'Id',width:80,align:"center",sortable:false}
            ],
            rowNum:10,
            autowidth :true, // 宽度自适应父窗口宽度
            mtype:"POST", // POST GET
            prmNames:{rows:"pageSize", sort:"orderBy", order:"order"}, // 设置翻页、排序参数
            rowList:[10,20,30,50],
            pager: '#pageProductGrid',
            jsonReader: { repeatitems : false },
            shrinkToFit: true,
            caption: "出库单明细",
//            multiselect: true,
            height: 140,
            width: 690,
            beforeRequest:function(){
                jQuery("#productAddGrid").jqGrid('setGridParam',
                        { postData:{mendFormId:$("#mendFormName").val()||"",mendFormIds:$("#mendFormIds").val()||"",showAll:$("#showAll").val()},page:1});
            }, gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接

            }

        });


        $('#addPer').click(function() {

            if($("#per_productName").val()&&$("#perCount").val()){
                if(!$("#mendFormName").val()){
                    alert("请选择维修单");
                    return;
                }
                var productId = $("#per_product").val();
//                products[productId] =  $("#perCount").val();
                $.ajax({
                    url:"${ctx}/outStorage/saveDetails.do",
                    type:"post",
                    data:{count:$("#perCount").val(),productId:productId,mendFormId:$("#mendFormName").val()},
                    success:function(){
                        reloadGridData(false);
                        $("#per_productName").val("") ;
                        $("#per_product").val("") ;
                        $("#perCount").val("");
                    }
                });

            } else{
                alert("请选择材料,并输入数量");
            }

        });

        $('#showAllProduct').click(function() {
            reloadGridData(true);
        });

    });



    function reloadGridData(isShowAll){
        $("#showAll").val(isShowAll);
        jQuery("#productAddGrid").trigger("reloadGrid");
    }

    function doEdit(id){
        var udatas = $("#productAddGrid").jqGrid('getRowData',id);
        $("#per_productName").val(udatas["productName"]+"("+udatas["code"]+")") ;
        $("#per_product").val(id) ;
        $("#perCount").val(udatas["count"]);
    }

    function doDelete(id){
        delete products[id];
        $.ajax({
            type: 'POST',
            url: "${ctx}/outStorage/deleteDetail.do",
            data: {productId:id,outStorageId:"${bean.id}"},
            dataType: 'json',
            success: function(data) {},
            error: function(xmlR, status, e) {}
        });

        reloadGridData();
    }

    function selectMendForm(){
        reloadGridData(false);
    }

    function setMendForm(treeNodes){
        var preIds = "";
        if( $("#mendFormIds").val()){
            preIds = ","+ $("#mendFormIds").val()+",";
        }
        for(var i=0;i<treeNodes.length;i++){
            var ids = "";
            var address = treeNodes[i].type;
            var array = address.split("_");
            if(preIds.indexOf(","+array[0]+",")>=0) {
                continue;
            }
            ids += $("#mendFormIds").val() + ($("#mendFormIds").val()?(","+array[0]):array[0]);
            $("#mendFormName").append("<option value='"+array[0]+"'>"+array[1]+"("+array[2]+")"+"</option>");
            $("#mendFormIds").val(ids);
        }

    }

</script>

<div>
    <form:form id="outStorageEditForm" name="outStorageEditForm" action="${ctx}/outStorage/save.do" method="post">
        <input type="hidden" name="id" value="${bean.id}" />
        <input type="hidden" name="products"  id="products" />
        <input type="hidden" id="showAll" value="true"/>
        <div>
            <table border="0" cellspacing="1" width="100%" id="editTable">

                <tr class="cssline">
                    <td  class="csslabel" >
                        <span style="color: red">*</span>维修单:
                    </td>
                    <td  class="container">
                        <select  size="5" id="mendFormName" name="mendFormName"  style="width: 400px" readonly="true" required="true" onchange="selectMendForm()">
                            <c:forEach items="${mendForms}" var="mendForm">
                                <option value="${mendForm.id}">${mendForm.mendNo}(${mendForm.firm.name})</option>
                            </c:forEach>
                        </select>
                            <%--<input type="text" id="mendFormName" name="mendFormName" value="${bean.mendForm.mendNo}"  style="width: 400px" readonly="true" required="true"/>--%>
                        <input type="hidden" id="mendFormIds" name="mendFormIds" value="${mendFormIds}"  style="width: 400px"/>
                        <%--<img src="${ctx}/skin/icons/edit_add.png" id="formPopTree" onclick="new PopTree({url:'${ctx}/outStorage/mendFormTree.do',confirmClick:setMendForm,onlyLeaf:true});">--%>
                    </td>
                </tr>

                <tr class="cssline">
                    <td  class="csslabel">
                        <span style="color: red">*</span>申领人:
                    </td>
                    <td  class="container">
                        <input type="text" name="drawer" value="${bean.drawer}"  style="width: 400px" required="true" />&nbsp;
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        <span style="color: red">*</span>出库日期:
                    </td>
                    <td  class="container">
                        <input type="text" name="outDate"   class="Wdate" value="${bean.outDate}"   style="width: 100px"/>&nbsp;

                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel">
                        经手人:
                    </td>
                    <td  class="container">
                        <input type="text" name="hander"  id="hander" value="${bean.hander}"  readonly="true" style="width: 400px"/>&nbsp;
                    </td>
                </tr>
                <tr>
                    <td colspan="2" valign="middle" align="center">
                        <%--<input type="button" id="formOutStoragebutton" value="确定" class="btn_Ok">&nbsp;--%>
                        <input type="button" value="关闭" class="btn_Del" onclick="closeWindow('outStorageWindow')">
                    </td>
                </tr>
                <tr class="cssline">
                    <td  class="csslabel" colspan="2">

                    </td>

                </tr>
                <tr class="cssline">
                    <td  colspan="2">
                        <%--产品: <input  type="text" name="per_productName"  class="input_table"   id="per_productName" style="width: 200px" />--%>
                        <%--<input  type="hidden" name="per_product" id="per_product"  />--%>
                        <%--<img src="${ctx}/skin/icons/edit_add.png" id="per_productPopTree" onclick="new PopTree({url:'${ctx}/outStorage/productTree.do',targetId:'per_product',targetValueId:'per_productName',onlyLeaf:true});">--%>
                        <%--数量:<input type="text" name="perCount" id="perCount"/>&nbsp;&nbsp;--%>
                        <%--<input type="button" value="添加" class="btn_Ok"  id="addPer">--%>
                        <input type="button" value="全部" class="btn_Search"  id="showAllProduct">
                    </td>
                </tr>
            </table>

        </div>
    </form:form>
    <table id="productAddGrid"></table>
</div>
