/**
 * propertygrid - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	function buildGrid(target){
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			view:(opts.showGroup ? groupview : undefined),
			onClickRow:function(index, row){
				if (opts.editIndex != index){
					var col = $(this).datagrid('getColumnOption', "value");
					col.editor = row.editor;
					leaveRow(opts.editIndex);
					$(this).datagrid('beginEdit', index);
					$(this).datagrid('getEditors', index)[0].target.focus();
					opts.editIndex = index;
				}
				opts.onClickRow.call(target, index, row);
			}
		}));
		$(target).datagrid('getPanel').panel('panel').addClass('propertygrid');
		$(target).datagrid('getPanel').find('div.datagrid-body').unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
			e.stopPropagation();
		});
		$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(){
			leaveRow(opts.editIndex);
			opts.editIndex = undefined;
		});
		
		function leaveRow(index){
			if (index == undefined) return;
			var t = $(target);
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		}
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'propertygrid', {
					options: $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options)
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datagrid.parseOptions(target), {
			showGroup:(t.attr('showGroup') ? t.attr('showGroup')=='true' : undefined)
		});
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			var index = 0;
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				
				table.push('<div class="datagrid-group" group-index=' + i + '>');
				table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
				table.push('<tr>');
				table.push('<td style="border:0;">');
				if (!frozen){
					table.push('<span>');
					table.push(opts.groupFormatter.call(target, group.fvalue, group.rows));
					table.push('</span>');
				}
				table.push('</td>');
				table.push('</tr>');
				table.push('</tbody></table>');
				table.push('</div>');
				
				table.push('<table cellspacing="0" cellpadding="0" border="0"><tbody>');
				for(var j=0; j<group.rows.length; j++) {
					// get the class and style attributes for this row
					var cls = (index % 2 && opts.striped) ? 'class="datagrid-row-alt"' : '';
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					
					table.push('<tr datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
					table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
					table.push('</tr>');
					index++;
				}
				table.push('</tbody></table>');
			}
			
			$(container).html(table.join(''));
		},
		
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			var view = $(target).datagrid('getPanel').find('div.datagrid-view');
			var view1 = view.children('div.datagrid-view1');
			var view2 = view.children('div.datagrid-view2');
			
			$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
			
			if (opts.rownumbers || opts.frozenColumns.length){
				var group = view1.find('div.datagrid-group');
			} else {
				var group = view2.find('div.datagrid-group');
			}
			$('<td style="border:0"><div class="datagrid-row-expander datagrid-row-collapse" style="width:25px;height:16px;cursor:pointer"></div></td>').insertBefore(group.find('td'));
			
			view.find('div.datagrid-group').each(function(){
				var groupIndex = $(this).attr('group-index');
				$(this).find('div.datagrid-row-expander').bind('click', {groupIndex:groupIndex}, function(e){
					var group = view.find('div.datagrid-group[group-index=' + e.data.groupIndex + ']');
					if ($(this).hasClass('datagrid-row-collapse')){
						$(this).removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
						group.next('table').hide();
					} else {
						$(this).removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
						group.next('table').show();
					}
					$(target).datagrid('fixRowHeight');
				});
			});
		},
		
		onBeforeRender: function(target, rows){
			var opts = $.data(target, 'datagrid').options;
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						fvalue: row[opts.groupField],
						rows: [row],
						startRow: i
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			function getGroup(fvalue){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.fvalue == fvalue){
						return group;
					}
				}
				return null;
			}
			
			this.groups = groups;
			
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				for(var j=0; j<group.rows.length; j++){
					newRows.push(group.rows[j]);
				}
			}
			$.data(target, 'datagrid').data.rows = newRows;
		}
	});
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupField:'group',
		groupFormatter:function(fvalue){return fvalue}
	});
	/*
	$.extend($.fn.propertygrid.defaults.editors, {
		'boolean':{
			init:function(container,options){
				var s = $('<select><option>true</option><option>false</option></select>').appendTo(container);
				return s;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value+'');
			},
			resize:function(target,width){
				$(target).width(width);
			}
		}
	});
	*/
})(jQuery);