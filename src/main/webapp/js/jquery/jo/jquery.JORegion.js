/**
 * efregion构造函数
 * @constructor
 */
JORegion = function()
{
}

/**
 * 将指定div层显示为区域.
 *
 * @param {String} region_id 	: 所要操作的DIV的ID;
 *
 * @return void.
 * @exception 无异常抛出
 */
JORegion.show = function (region_id)
{
    var region_node = document.getElementById(region_id);
//    debugger;

    if (!region_node) return;

    var title = region_node.title;
    var divId = region_node.getAttribute("divId");
    var classId = region_node.getAttribute("classId");

    region_node.className = "ui-jqgrid ui-widget ui-widget-content ui-corner-all";

    var content = null;

    if(divId != null) {
        content = document.getElementById(divId);
    }

    if(classId != null) {
        content = jQuery('.' + classId).html();
    }

    contentText = "<div id='" + divId + "'>";
    contentText += content.innerHTML;
    contentText += "</div>"

    ef_div_head = document.createElement("div");
    ef_div_head.id = region_id + "_head";

    // var innerHtml = "<div class=\"ui-jqgrid ui-widget ui-widget-content ui-corner-all\">";

    var innerHtml = "<div><div class=\"ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix\">";
    innerHtml += "<a class=\"ui-jqgrid-titlebar-close HeaderButton\" href=\"javascript:void(0)\" role=\"link\" style=\"right: 0px;\"";

    if(divId != null) {
        innerHtml += " onclick=\"javascript:toggleDiv('" + divId + "', 0);\">";
    } else if(classId != null) {
        innerHtml += " onclick=\"javascript:toggleDiv('" + classId + "', 1);\">";
    }

    innerHtml += "<span class=\"ui-icon ui-icon-circle-triangle-n\"></span></a>";
    innerHtml += "<span class=\"ui-jqgrid-title\">" + title + "</span>";
    innerHtml += "</div></div>";

    ef_div_head.innerHTML = innerHtml;

    var children = region_node.firstChild;

    region_node.innerHTML = innerHtml;
    region_node.innerHTML += contentText;
    // region_node.innerHTML +="</div>";
}

JORegion.showAll = function(region_id)
{
    var divs = $("div[id^='jo_region']");

    $.each(divs,function(){
        JORegion.show(this.id);
    });
}
