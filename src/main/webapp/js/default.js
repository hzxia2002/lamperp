// 定义全局变量
var errAjaxMsg = "<div class=\"errMsg\">数据出错或服务器正忙，请重新尝试！</div>";
var openWindowId = "winOpenId";
var listGridId = "listGrid";

/**
 * 调整页面大小
 *
 * @param gridId
 */
function adjustPageSize(gridId){
    //由于div宽度在resize时还没有调整所以无法直接获取到调整后的宽度，故采用延时处理
//    window.setTimeout("adjustGridSize('" + gridId + "')",1000);
}

/**
 * 调整Grid大小
 *
 * @param gridId
 */
//function adjustGridSize(gridId){
//    if($("#hiddenDiv") == null || $("#hiddenDiv")=="undefined") return;
//
//    var minWidth = 700;
//    var w = $("#hiddenDiv").width();
//
//    if (w < minWidth) w = minWidth;
//
//    $("#" + gridId).setGridWidth(w - 22);
//}

function getPageSize() {
    var winW, winH;
    if(window.innerHeight) {// all except IE
        winW = window.innerWidth;
        winH = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {// IE 6 Strict Mode
        winW = document.documentElement.clientWidth;
        winH = document.documentElement.clientHeight;
    } else if (document.body) { // other
        winW = document.body.clientWidth;
        winH = document.body.clientHeight;
    }  // for small pages with total size less then the viewport
    return {WinW:winW, WinH:winH};
}

function toggleDiv(divId, type) {
    if(type == 0) {
        jQuery("#" + divId).toggle("blind", {}, 100 );
    } else {
        jQuery("." + divId).toggle("blind", {}, 100 );
    }
}


//判断浏览器是否ipad
var IS_IPAD = false;
function checkIsIpad() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    IS_IPAD = userAgent.indexOf("Safari") > -1;
}

//显示或隐藏元素
function showObj(checkObj, objName) {
    document.getElementById(objName).style.display = checkObj.checked ? "" : "none";
}

/**
 * Ajax获取模块数据
 * @param objName
 * @param url
 */
function loadAjaxData(objName, url) {
//    showLoadMsg(objName);
//    alert(url);
    $.ajax({
        url: url,
        cache: false,
        data:"",
        success: function(ret) {
            $("#" + objName + "").html(ret);
        },error:function() {
            $("#" + objName + "").html(errAjaxMsg);
        }
    });
}

/**
 * 表单存储
 * @param url
 * @param formId
 * @param callbackFunc
 */
function saveAjaxData(url, formId, windowId, gridId, callbackFunc) {
//    if (formId == null || "" == formId)formId = "bean";

    $(document).mask('数据处理中...');

    var sendData = "";

    if (formId != null && $('#' + formId).length > 0) {
        sendData = $("#" + formId).serializeArray();
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: sendData,
        dataType: 'json',
        success: function(data) {
            $(document).unmask();

            if (callbackFunc != null) {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(data);
                } else {
                    eval(callbackFunc);
                }
            } else {
                if (data.success) {
                    closeWindow(windowId);
                    refreshGrid(gridId);
                    showInfoMsg(data.msg,null);
                } else {
                    showErrorMsg(data.msg);
                }
            }
        },
        error: function(xmlR, status, e) {
            $(document).unmask();

            showErrorMsg("[" + e + "]" + xmlR.responseText);
        }
    });
}

//弹出窗口
function openWindow(windowId, title, url, isRefreshGrid, gridId, width, height,callback) {
    openNewWindow(windowId, title, url, isRefreshGrid, gridId, width, height,callback);
}

function openNewWindow(windowId, title, url, isRefreshGrid, gridId, width, height,callback) {
    if (windowId == null) windowId = openWindowId;
    /*
    if ($('#' + windowId).length <= 0) {
        $("body").append("<div id=\"" + windowId + "\"></div>");
    }
    */

    if (width == null) width = 650;
    if (height == null) height = 500;
    var wd = window;
    if(window.top){
        wd = window.top;
        wd.$("<div id='"+windowId+"'/>").appendTo(window.top.document.body);
    }
    var left = ($(wd).width() - width) * 0.5;
    var top = ($(wd).height() - height) * 0.5 - 10;

    var win = wd.$('#' + windowId).window({
        title: title,
        href:url,
        loadingMessage:"正在加载数据......",
        iconCls:"icon-edit",
        width: width,
        height: height,
        left:left,
        top:top,
        modal: true,
        shadow: true,
        minimizable:false,
        maximizable:true,
        closed: true,
        resizable:true,
        onClose:function() {
            if (isRefreshGrid) {
                if (gridId) {
                    refreshGrid(gridId);
                    if(callback){
                        callback.call(this);
                    }
                } else {
                    refreshGrid(null);
                    if(callback){
                        callback.call(this);
                    }
                }
            }
            wd.$('#' + windowId).remove();
        }
    });

//    $('#'+newWindowId).show();
    wd.$('#' + windowId).window('open');
//    wd.$('#' + windowId).window("refresh");
}

//刷新grid
function refreshGrid(gridId) {
    if (gridId == null)gridId = listGridId;
    if ($('#' + gridId).length <= 0) return;
    $("#" + gridId).trigger("reloadGrid");
}

//关闭弹出窗口
function closeWindow(windowId) {
    if (windowId == null) windowId = openWindowId;
    if ($('#' + windowId).length <= 0) return;
    $('#' + windowId).window('close');
}

//删除列表记录
function doGridDelete(url, gridId, msg, callbackFunc){
    if(msg == null) msg = "您确定要删除此记录吗?";
    $.messager.confirm('系统提示', msg, function(r) {
        if (r) {
            saveAjaxData(url, null,null, gridId, callbackFunc);
        }
    });
}

//登录页居中
function adjustDivPostionCenter(divName) {
    var postop = ($(document).height() - $("#" + divName).height()) / 2;
    var posleft = ($(window).width() - $("#" + divName).width()) / 2;
    var loginTop = 120;
    if (postop < loginTop) postop = loginTop;
    $("#" + divName).css({"left":posleft + "px","top":postop + "px"});
    $("#" + divName).show();
}

//弹出信息窗口 title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
function showErrorMsg(msgString) {
    showInfoMsg(msgString, "error");
}
function showInfoMsg(msgString, msgType) {
    var title = "系统提示";
    if(msgType == null || "" == msgType) msgType = "info";
    if(msgType == "info" || msgType == "warning"){
        title = "系统提示";
    }else if(msgType == "error"){
        title = "出错了";
    }
    $.messager.alert(title, msgString, msgType);
}

//选择日历
function calendar(objName,dateType){
    var json = "";
    if(dateType != null){
        if('all' == dateType){
            json += "dateFmt:'yyyy-MM-dd HH:mm:ss'";
        }else if('datetime' == dateType){
            json += "dateFmt:'yyyy-MM-dd HH:mm'";
        }else{
            json += "dateFmt:'yyyy-MM-dd'";
        }
    }
    if(objName != null && objName != ""){
        if(json != ""){
            json = "el:'"+objName+"',"+json;
        }else{
            json = "el:'"+objName+"'";
        }
    }
    if(json != "") json = "{"+json+"}";
    WdatePicker(eval("("+json+")"));
}
//选择日历
function calendarByJson(customJson){
    if(customJson != null){
        WdatePicker(customJson);
    }
}

//计算年龄
function getAge(brithday,returnObj) {
    if (brithday == null || brithday == "") return "";
    var aDate = new Date();
    var thisYear = aDate.getFullYear();
    var brith = brithday.substr(0, 4);
    var age = parseInt(thisYear) - parseInt(brith);
    if(returnObj != null){
        returnObj.val(age);
    }else{
        return age;
    }
}

//for grid
function booleanFormat(cellvalue, options, rowObject) {
    return cellvalue == "true"||cellvalue?"是":"否";
}
//for grid
function validFormat(cellvalue, options, rowObject) {
    return cellvalue == "true"||cellvalue?"有效":"无效";
}

//input check
function validateForm(formName){
    return $("#"+formName).validationEngine('validateform');
}

function validateInit(conditions,formName){
    for (var i = 0; i < conditions.length; i++) {
        var cond = conditions[i];
        //下面两个效果相同
        $("#"+formName+" [name=" + cond.name + "]").attr("data-validation-engine", cond.rule);
//            $("#bean [name=" + cond.name + "]").addClass(cond.rule);
    }
    $("#"+formName).validationEngine('attach', {
        promptPosition:"bottomRight",
        isOverflown:true,
        overflownDIV:"#winOpenId"
    });
}
//default filter for tree
function defaultFilter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i = 0, l = childNodes.length; i < l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function booleanFormatter(cellvalue, options, rowObject) {
    if(cellvalue) {
        return "是";
    } else {
        return "否";
    }
}

function genderFormatter(cellvalue, options, rowObject) {
    if(cellvalue == null) {
        return "未知";
    } else if(cellvalue) {
        return "男";
    } else {
        return "女";
    }
}

function validFormatter(cellvalue, options, rowObject) {
    if(cellvalue != null && cellvalue == "1") {
        return "有效";
    } else {
        return "无效";
    }
}

function statusFormatter(cellvalue, options, rowObject) {
    if(cellvalue != null && cellvalue == "1") {
        return "正常";
    } else if(cellvalue != null && cellvalue == "0"){
        return "锁定";
    } else {
        return "失效";
    }
}

/**
 * 记录系统日志
 * @param url URL地址
 * @param logType 日志类型
 */
function log(url, logTypeCode) {
    var logUrl = CONTEXT_PATH + "/sysLog/save.do";
    var logType = logTypeCode || "2";

    $.ajax({
        type: 'POST',
        url: logUrl,
        data: {
            pageUrl : url,
            logTypeCode : logType
        },
        dataType: 'json'
    });
}