function showQueryDialog(options){
	var opts = options || {};
	var dlg = $('#dlg-query');
	if (!dlg.length){
		dlg = $('<div id="dlg-query"></div>').appendTo('body');
		dlg.dialog({
			title:opts.title||'高级查询',
			width:opts.width||400,
			height:opts.height||300,
			closed:true,
			modal:true,
			href:opts.form,
			buttons:[{
				text:'查询',
				iconCls:'icon-search',
				handler:function(){
					dlg.dialog('close');
					var param = {};
					dlg.find('.query').each(function(){
						var name = $(this).attr('name');
						var val = $(this).val();
						if ($(this).hasClass('datebox-f')){
							name = $(this).attr('comboname');
							val = $(this).datebox('getValue');
						} else if ($(this).hasClass('combogrid-f')){
							name = $(this).attr('comboname');
							val = $(this).combogrid('getValue');
						} else if ($(this).hasClass('combobox-f')){
							name = $(this).attr('comboname');
							val = $(this).combobox('getValue');
						}
						param[name] = val;
					});
					opts.callback(param);
				}
			},{
				text:'取消',
				iconCls:'icon-cancel',
				handler:function(){dlg.dialog('close');}
			}]
		});
	}
	dlg.dialog('open');
}

/**
 * 取得系统时间
 */
function getDate(divId){
    //获取系统时间
    var date=new Date();
    var month=date.getMonth()+1; //month默认0-11，所以要加1
    var minutes=date.getMinutes(),Min;
    var seconds=date.getSeconds(),updateTime;
    updateTime=60-seconds;
    minutes<=9 ? Min="0"+minutes : Min=minutes;
    var week=date.getDay(),day;

    switch(week){
        case 0 : day="星期日";break;
        case 1 : day="星期一";break;
        case 2 : day="星期二";break;
        case 3 : day="星期三";break;
        case 4 : day="星期四";break;
        case 5 : day="星期五";break;
        case 6 : day="星期六";break;
    }

    var time=date.getFullYear()+"年"+month+"月"+date.getDate()+"日 "+date.getHours()+":"+Min+ ":" + seconds + " " + day;

    // alert(time);

    // debugger;

    $("#" + divId).text(time); //jquery
    //var container=document.getElementById("updateTime");
    //container.innerText=time; //javascript;
    setTimeout("getDate('" + divId + "')", 1000);  //定时请求时间
}

/**
 * 添加收藏夹
 *
 * @param title
 * @param url
 */
function addBookmark(title,url) {
    if (window.sidebar) {
        window.sidebar.addPanel(title, url,"");
    } else if( document.all ) {
        window.external.AddFavorite(url, title);
    } else if( window.opera && window.print ) {
        return true;
    }
}

function search(gridId,queryRegion){
//    debugger;

    var inputs = $("#"+queryRegion+" input");

    var params = {};
    var tmpParams = {};
    var length = 0;

    inputs.each(function(index){
        if($(this).attr("type") === "text" || $(this).attr("type") === "hidden"
            || ($(this).attr("type") === "radio" && $(this).attr("checked"))){
            var param = {};
            if($(this).val() && $(this).attr("name") != undefined){
                param["propertyName"] = $(this).attr("name");
                param["operator"] =getOperator($(this).attr("op")||"like");
                param["firstValue"] = $(this).val();
                param["type"] = $(this).attr("dType")||"String";
                param["entity"] = $(this).attr("entity")||"";
                param["isCapital"] = $(this).attr("isCapital")||"";
                params[length.toString()] = param;
                length++;
            }
        } else if($(this).attr("type") === "checkbox" && $(this).attr("checked")) {
            if(tmpParams[$(this).attr("name")]) {
                tmpParams[$(this).attr("name")]["firstValue"] += "," + $(this).val();
            } else {
                var param = {};
                param["firstValue"] = $(this).val();
                param["propertyName"] = $(this).attr("name");
                param["operator"] =getOperator($(this).attr("op")||"in");
                param["type"] = $(this).attr("dType")||"String";
                param["entity"] = $(this).attr("entity")||"";
                param["isCapital"] = $(this).attr("isCapital")||"";

                tmpParams[$(this).attr("name")] = param;
            }
        }
    });

    inputs = $("#"+queryRegion+" select");

    inputs.each(function(index){
        var param = {};
        if($(this).val()){
            param["propertyName"] = $(this).attr("name");
            param["operator"] =getOperator($(this).attr("op")||"in");

            try{
                param["firstValue"] = $(this).val().join(",");
            } catch (error) {
                param["firstValue"] = $(this).val();
            }

            param["type"] = $(this).attr("dType")||"String";
            param["entity"] = $(this).attr("entity")||"";
            param["isCapital"] = $(this).attr("isCapital")||"";

            params[(length).toString()] = param;
            length++;
        }
    });

    for(var key in tmpParams) {
        params[(length++).toString()] = tmpParams[key];
    }

    jQuery("#"+gridId).jqGrid('setGridParam',
        { postData:{condition:toJsonString(params)},
            page:1}).trigger("reloadGrid");

    // 将查询换成easyui datagrid
//    jQuery("#" + gridId).datagrid({queryParams:{condition:toJsonString(params)}, page:1}).trigger('reload');
}

function getSearchData(queryRegion){
//    debugger;

    var inputs = $("#"+queryRegion+" input");

    var params = {};
    var tmpParams = {};
    var length = 0;

    inputs.each(function(index){
        if($(this).attr("type") === "text" || $(this).attr("type") === "hidden"
            || ($(this).attr("type") === "radio" && $(this).attr("checked"))){
            var param = {};
            if($(this).val()){
                param["propertyName"] = $(this).attr("name");
                param["operator"] =getOperator($(this).attr("op")||"like");
                param["firstValue"] = $(this).val();
                param["type"] = $(this).attr("dType")||"String";
                param["entity"] = $(this).attr("entity")||"";
                param["isCapital"] = $(this).attr("isCapital")||"";
                params[length.toString()] = param;
                length++;
            }
        } else if($(this).attr("type") === "checkbox" && $(this).attr("checked")) {
            if(tmpParams[$(this).attr("name")]) {
                tmpParams[$(this).attr("name")]["firstValue"] += "," + $(this).val();
            } else {
                var param = {};
                param["firstValue"] = $(this).val();
                param["propertyName"] = $(this).attr("name");
                param["operator"] =getOperator($(this).attr("op")||"in");
                param["type"] = $(this).attr("dType")||"String";
                param["entity"] = $(this).attr("entity")||"";
                param["isCapital"] = $(this).attr("isCapital")||"";

                tmpParams[$(this).attr("name")] = param;
            }
        }
    });

    inputs = $("#"+queryRegion+" select");

    inputs.each(function(index){
        var param = {};
        if($(this).val()){
            param["propertyName"] = $(this).attr("name");
            param["operator"] =getOperator($(this).attr("op")||"in");

            try{
                param["firstValue"] = $(this).val().join(",");
            } catch (error) {
                param["firstValue"] = $(this).val();
            }

            param["type"] = $(this).attr("dType")||"String";
            param["entity"] = $(this).attr("entity")||"";
            param["isCapital"] = $(this).attr("isCapital")||"";

            params[(length).toString()] = param;
            length++;
        }
    });

    for(var key in tmpParams) {
        params[(length++).toString()] = tmpParams[key];
    }

    return params;

//    jQuery("#"+gridId).jqGrid('setGridParam',
//        { postData:{condition:toJsonString(params)},
//            page:1}).trigger("reloadGrid");

    // 将查询换成easyui datagrid
//    jQuery("#" + gridId).datagrid({queryParams:{condition:toJsonString(params)}, page:1}).trigger('reload');
}

/**
 * 取得列信息中文名
 *
 * @param colNames
 * @return {Object}
 */
function getColNamesArray(colNames){
    var params = {};

    for(var i=0; i<colNames.length; i++) {
        params[i] = colNames[i];
    }

    return params;
}

/**
 * 取得列信息元数据数组（不含列头中文名）
 *
 * @param colModel
 * @return {Object}
 */
function getColModelArray(colModel){
    var params = {};

    for(var i=0; i<colModel.length; i++) {
        var param = {};
        param["name"] = (colModel[i]["name"] == null ? "" : colModel[i]["name"]);
        param["index"] = (colModel[i]["index"] == null ? "" : colModel[i]["index"]);
        param["hidden"] = (colModel[i]["hidden"] == null ? false : colModel[i]["hidden"]);
        param["align"] = (colModel[i]["align"] == null ? "" : colModel[i]["align"]);

        params[i] = param;
    }

    return params;
}

/**
 * 取得列信息元数据数组（含列头中文名）
 *
 * @param colModel
 * @param colNames
 * @return {Object}
 */
function getColModelAndNameArray(colModel, colNames){
    var params = {};

    for(var i=2; i<colModel.length; i++) {
        var name = colModel[i]["name"] == null ? "" : colModel[i]["name"];

        if(name != '' && name != 'operation') {
            var param = {};

//            alert(colModel[i]["width"]);

            param["name"] = name;
            param["index"] = (colModel[i]["index"] == null ? "" : colModel[i]["index"]);
            param["hidden"] = (colModel[i]["hidden"] == null ? false : colModel[i]["hidden"]);
            param["align"] = (colModel[i]["align"] == null ? "" : colModel[i]["align"]);
            param["width"] = (colModel[i]["width"] == null ? "" : colModel[i]["width"]);
            param["columnName"] = colNames[i];

            params[i] = param;
        }
    }

    return params;
}

/**
 * 取得列信息元数据JSON串（含列头中文名）
 *
 * @param colModel
 * @param colNames
 * @return {*}
 */
function getColModelAndNameJson(colModel, colNames){
    return toJsonString(getColModelAndNameArray(colModel, colNames));
}

function searchLiger(gridId,queryRegion){
    var inputs = $("#"+queryRegion+" input");

    var params = {};
    var tmpParams = {};
    var length = 0;

    inputs.each(function(index){
        if($(this).attr("type") === "text" || $(this).attr("type") === "hidden"
            || ($(this).attr("type") === "radio" && $(this).attr("checked"))){
            var param = {};
            if($(this).val()){
                param["propertyName"] = $(this).attr("name");
                param["operator"] =getOperator($(this).attr("op")||"like");
                param["firstValue"] = $(this).val();
                param["type"] = $(this).attr("dType")||"String";
                param["entity"] = $(this).attr("entity")||"";
                param["isCapital"] = $(this).attr("isCapital")||"";

                params[length.toString()] = param;
                length++;
            }
        } else if($(this).attr("type") === "checkbox" && $(this).attr("checked")) {
            if(tmpParams[$(this).attr("name")]) {
                tmpParams[$(this).attr("name")]["firstValue"] += "," + $(this).val();
            } else {
                var param = {};
                param["firstValue"] = $(this).val();
                param["propertyName"] = $(this).attr("name");
                param["operator"] =getOperator($(this).attr("op")||"in");
                param["type"] = $(this).attr("dType")||"String";
                param["entity"] = $(this).attr("entity")||"";
                param["isCapital"] = $(this).attr("isCapital")||"";

                tmpParams[$(this).attr("name")] = param;
            }
        }
    });

    inputs = $("#"+queryRegion+" select");

    inputs.each(function(index){
        var param = {};
        if($(this).val()){
            param["propertyName"] = $(this).attr("name");
            param["operator"] =getOperator($(this).attr("op")||"in");
            param["firstValue"] = $(this).val().join(",");
            param["type"] = $(this).attr("dType")||"String";
            param["entity"] = $(this).attr("entity")||"";
            param["isCapital"] = $(this).attr("isCapital")||"";

            params[(length).toString()] = param;
            length++;
        }
    });

    for(var key in tmpParams) {
        params[(length++).toString()] = tmpParams[key];
    }

    jQuery("#"+gridId).jqGrid('setGridParam',
        { postData:{condition:toJsonString(params)},
            page:1}).trigger("reloadGrid");

    // 将查询换成easyui datagrid
//    jQuery("." + gridId).ligerGrid({param:{condition:toJsonString(params)}, page:1}).trigger('loadServerData');
}

function getOperator(key){
    var ops = {leftLike:"like '|%'",rightLike:"like '%|'",
        like:"like '%|%'",less:"<",more:">",lessAndEq:"<=",moreAndEq:">=",eq:"=",'in':"in"};
    return ops[key]||"";
}

function toJsonString(jsonObj){
    var sA = [];
    (function(o){
        var isObj=true;
        if(o instanceof Array)
            isObj=false;
        else if(typeof o!='object'){
            if(typeof o=='string')
                sA.push('"'+o+'"');
            else
                sA.push(o);
            return;
        }
        sA.push(isObj?"{":"[");
        for(var i in o){
            if(o.hasOwnProperty(i) && i!='prototype'){
                if(isObj)
                    sA.push(i+':');
                arguments.callee(o[i]);
                sA.push(',');
            }
        }
        sA.push(isObj?"}":"]");
    })(jsonObj);
    return sA.slice(0).join('').replace(/,\}/g,'}').replace(/,\]/g,']');
}
