/**
 * datagrid - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *  panel
 * 	resizable
 * 	linkbutton
 * 	pagination
 * 
 */
(function($){
	/**
	 * Get the index of array item, return -1 when the item is not found.
	 */
	function indexOfArray(a,o){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i] == o) return i;
		}
		return -1;
	}
	/**
	 * Remove array item, 'o' parameter can be item object or id field name.
	 * When 'o' parameter is the id field name, the 'id' parameter is valid.
	 */
	function removeArrayItem(a,o,id){
		if (typeof o == 'string'){
			for(var i=0,len=a.length; i<len; i++){
				if (a[i][o] == id){
					a.splice(i, 1);
					return;
				}
			}
		} else {
			var index = indexOfArray(a,o);
			if (index != -1){
				a.splice(index, 1);
			}
		}
	}
	
	function setSize(target, param) {
		var opts = $.data(target, 'datagrid').options;
		var panel = $.data(target, 'datagrid').panel;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		
		if (opts.fit == true){
			var p = panel.panel('panel').parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		
		panel.panel('resize', {
			width: opts.width,
			height: opts.height
		});
	}
	
	function setBodySize(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var wrap = $.data(target, 'datagrid').panel;
		var innerWidth = wrap.width();
		var innerHeight = wrap.height();
		
		var view = dc.view;
		var view1 = dc.view1;
		var view2 = dc.view2;
		var header1 = view1.children('div.datagrid-header');
		var header2 = view2.children('div.datagrid-header');
		var table1 = header1.find('table');
		var table2 = header2.find('table');
		
		// set view width
		view.width(innerWidth);
		var headerInner = header1.children('div.datagrid-header-inner').show();
		view1.width(headerInner.find('table').width());
		if (!opts.showHeader) headerInner.hide();
		view2.width(innerWidth - view1.outerWidth());
		view1.children('div.datagrid-header,div.datagrid-body,div.datagrid-footer').width(view1.width());
		view2.children('div.datagrid-header,div.datagrid-body,div.datagrid-footer').width(view2.width());
		
		// set header height
		var hh;
		header1.css('height', '');
		header2.css('height', '');
		table1.css('height', '');
		table2.css('height', '');
		hh = Math.max(table1.height(), table2.height());
		table1.height(hh);
		table2.height(hh);
		if ($.boxModel == true){
			header1.height(hh - (header1.outerHeight()-header1.height()));
			header2.height(hh - (header2.outerHeight()-header2.height()));
		} else {
			header1.height(hh);
			header2.height(hh);
		}
		
		// set body height
		if (opts.height != 'auto') {
			var height = innerHeight
					- view2.children('div.datagrid-header').outerHeight(true)
					- view2.children('div.datagrid-footer').outerHeight(true)
					- wrap.children('div.datagrid-toolbar').outerHeight(true)
					- wrap.children('div.datagrid-pager').outerHeight(true);
			view1.children('div.datagrid-body').height(height);
			view2.children('div.datagrid-body').height(height);
		}
		
		view.height(view2.height());
		view2.css('left', view1.outerWidth());
	}
	
	/**
	 * make the load message display on center of panel.
	 */
	function centerLoadingMsg(target){
		var panel = $(target).datagrid('getPanel');
		var mask = panel.children('div.datagrid-mask');
		if (mask.length){
			mask.css({
				width: panel.width(),
				height: panel.height()
			});
			var msg = panel.children('div.datagrid-mask-msg');
			msg.css({
				left: (panel.width() - msg.outerWidth()) / 2,
				top: (panel.height() - msg.outerHeight()) / 2
			});
		}
	}
	
	function fixRowHeight(target, index){
		var rows = $.data(target, 'datagrid').data.rows;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		if (!dc.body1.is(':empty')){
			if (index >= 0){
				setHeight(index);
			} else {
				for(var i=0; i<rows.length; i++){
					setHeight(i);
				}
				if (opts.showFooter){
					var footRows = $(target).datagrid('getFooterRows') || [];
					for(var i=0; i<footRows.length; i++){
						setHeight(i, 'footer');
					}
					setBodySize(target);
				}
			}
		}
		if (opts.height == 'auto'){
			var body1 = dc.body1.parent();
			var body2 = dc.body2;
			var height = 0;
			var width = 0;
			body2.children().each(function(){
				var c = $(this);
				if (c.is(':visible')){
					height += c.outerHeight();
					if (width < c.outerWidth()){
						width = c.outerWidth();
					}
				}
			});
			if (width > body2.width()){
				height += 18;	// add the horizontal scroll height
			}
			body1.height(height);
			body2.height(height);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler('scroll');
		
		// set body row or footer row height
		function setHeight(index, type){
			type = type || 'body';
			var tr1 = opts.finder.getTr(target, index, type, 1);
			var tr2 = opts.finder.getTr(target, index, type, 2);
			tr1.css('height', '');
			tr2.css('height', '');
			var height = Math.max(tr1.height(), tr2.height());
			tr1.css('height', height);
			tr2.css('height', height);
		}
	}
	
	/**
	 * wrap and return the grid object, fields and columns
	 */
	function wrapGrid(target, rownumbers) {
		function getColumns(thead){
			var columns = [];
			$('tr', thead).each(function(){
				var cols = [];
				$('th', this).each(function(){
					var th = $(this);
					var col = {
						title: th.html(),
						align: th.attr('align') || 'left',
						sortable: th.attr('sortable')=='true' || false,
						checkbox: th.attr('checkbox')=='true' || false
					};
					if (th.attr('field')) {
						col.field = th.attr('field');
					}
					if (th.attr('formatter')){
						col.formatter = eval(th.attr('formatter'));
					}
					if (th.attr('styler')){
						col.styler = eval(th.attr('styler'));
					}
					if (th.attr('editor')){
						var s = $.trim(th.attr('editor'));
						if (s.substr(0,1) == '{'){
							col.editor = eval('(' + s + ')');
						} else {
							col.editor = s;
						}
					}
					if (th.attr('rowspan')) col.rowspan = parseInt(th.attr('rowspan'));
					if (th.attr('colspan')) col.colspan = parseInt(th.attr('colspan'));
					if (th.attr('width')) col.width = parseInt(th.attr('width')) || 100;
					if (th.attr('hidden')) col.hidden = true;
					if (th.attr('resizable')) col.resizable = th.attr('resizable') == 'true';
					
					cols.push(col);
				});
				columns.push(cols);
			});
			
			return columns;
		}
		
		var panel = $(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner"></div>' +
							'</div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body"></div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-resize-proxy"></div>' +
					'</div>' +
				'</div>'
		).insertAfter(target);
		
		panel.panel({
			doSize:false
		});
		panel.panel('panel').addClass('datagrid').bind('_resize', function(e, force){
			var opts = $.data(target, 'datagrid').options;
			if (opts.fit == true || force){
				setSize(target);
				setTimeout(function(){
					if ($.data(target, 'datagrid')){
						fixColumnSize(target);
					}
				}, 0);
			}
			return false;
		});
		
		$(target).hide().appendTo(panel.children('div.datagrid-view'));
		
		var frozenColumns = getColumns($('thead[frozen=true]', target));
		var columns = getColumns($('thead[frozen!=true]', target));
		var view = panel.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		
		return {
			panel: panel,
			frozenColumns: frozenColumns,
			columns: columns,
			dc: {	// some data container
				view: view,
				view1: view1,
				view2: view2,
				body1: view1.children('div.datagrid-body').children('div.datagrid-body-inner'),
				body2: view2.children('div.datagrid-body'),
				footer1: view1.children('div.datagrid-footer').children('div.datagrid-footer-inner'),
				footer2: view2.children('div.datagrid-footer').children('div.datagrid-footer-inner')
			}
		};
	}
	
	function parseGridData(target){
		var data = {
			total:0,
			rows:[]
		};
		var fields = getColumnFields(target,true).concat(getColumnFields(target,false));
		$(target).find('tbody tr').each(function(){
			data.total++;
			var col = {};
			for(var i=0; i<fields.length; i++){
				col[fields[i]] = $('td:eq('+i+')', this).html();
			}
			data.rows.push(col);
		});
		return data;
	}
	
	function buildGrid(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var panel = $.data(target, 'datagrid').panel;
		
		panel.panel($.extend({}, opts, {
			doSize: false,
			onResize: function(width, height){
				centerLoadingMsg(target);
				setTimeout(function(){
					if ($.data(target, 'datagrid')){
						setBodySize(target);
						fitColumns(target);
						opts.onResize.call(panel, width, height);
					}
				}, 0);
			},
			onExpand: function(){
				setBodySize(target);
				fixRowHeight(target);
				opts.onExpand.call(panel);
			}
		}));
		
		var view1 = dc.view1;
		var view2 = dc.view2;
		var header1 = view1.children('div.datagrid-header').children('div.datagrid-header-inner');
		var header2 = view2.children('div.datagrid-header').children('div.datagrid-header-inner');
		
		createColumnHeader(header1, opts.frozenColumns, true);
		createColumnHeader(header2, opts.columns, false);
		
		header1.css('display', opts.showHeader ? 'block' : 'none');
		header2.css('display', opts.showHeader ? 'block' : 'none');
		view1.find('div.datagrid-footer-inner').css('display', opts.showFooter ? 'block' : 'none');
		view2.find('div.datagrid-footer-inner').css('display', opts.showFooter ? 'block' : 'none');
		
		if (opts.toolbar) {
			if (typeof opts.toolbar == 'string'){
				$(opts.toolbar).addClass('datagrid-toolbar').prependTo(panel);
				$(opts.toolbar).show();
			} else {
				$('div.datagrid-toolbar', panel).remove();
				var tb = $('<div class="datagrid-toolbar"></div>').prependTo(panel);
				for(var i=0; i<opts.toolbar.length; i++) {
					var btn = opts.toolbar[i];
					if (btn == '-') {
						$('<div class="datagrid-btn-separator"></div>').appendTo(tb);
					} else {
						var tool = $('<a href="javascript:void(0)"></a>');
						tool[0].onclick = eval(btn.handler || function(){});
						tool.css('float', 'left').appendTo(tb).linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			}
		} else {
			$('div.datagrid-toolbar', panel).remove();
		}
		
		$('div.datagrid-pager', panel).remove();
		if (opts.pagination) {
			var pager = $('<div class="datagrid-pager"></div>').appendTo(panel);
			pager.pagination({
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
		
		function createColumnHeader(container, columns, frozen){
			if (!columns) return;
			$(container).show();
			$(container).empty();
			var t = $('<table border="0" cellspacing="0" cellpadding="0"><tbody></tbody></table>').appendTo(container);
			for(var i=0; i<columns.length; i++) {
				var tr = $('<tr></tr>').appendTo($('tbody', t));
				var cols = columns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					
					var attr = '';
					if (col.rowspan) attr += 'rowspan="' + col.rowspan + '" ';
					if (col.colspan) attr += 'colspan="' + col.colspan + '" ';
					var td = $('<td ' + attr + '></td>').appendTo(tr);
					
					if (col.checkbox){
						td.attr('field', col.field);
						$('<div class="datagrid-header-check"></div>').html('<input type="checkbox"/>').appendTo(td);
					} else if (col.field){
						td.attr('field', col.field);
						td.append('<div class="datagrid-cell"><span></span><span class="datagrid-sort-icon"></span></div>');
						$('span', td).html(col.title);
						$('span.datagrid-sort-icon', td).html('&nbsp;');
						var cell = td.find('div.datagrid-cell');
						if (col.resizable == false) cell.attr('resizable', 'false');
						col.boxWidth = $.boxModel ? (col.width - (cell.outerWidth() - cell.width())) : col.width;
						cell.width(col.boxWidth);
						cell.css('text-align', (col.align || 'left'));
					} else {
						$('<div class="datagrid-cell-group"></div>').html(col.title).appendTo(td);
					}
					
					if (col.hidden){
						td.hide();
					}
				}
				
			}
			if (frozen && opts.rownumbers){
				var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-rownumber"></div></td>');
				if ($('tr',t).length == 0){
					td.wrap('<tr></tr>').parent().appendTo($('tbody',t));
				} else {
					td.prependTo($('tr:first', t));
				}
			}
		}
	}
	
	/**
	 * bind datagrid row events
	 */
	function bindRowEvents(target){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		
		// get all rows
		var tr = opts.finder.getTr(target, '', 'allbody');
		tr.unbind('.datagrid').bind('mouseenter.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			opts.finder.getTr(target, index).addClass('datagrid-row-over');
		}).bind('mouseleave.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			opts.finder.getTr(target, index).removeClass('datagrid-row-over');
		}).bind('click.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			if (opts.singleSelect == true){
				clearSelections(target);
				selectRow(target, index);
			} else {
				if ($(this).hasClass('datagrid-row-selected')){
					unselectRow(target, index);
				} else {
					selectRow(target, index);
				}
			}
			if (opts.onClickRow){
				opts.onClickRow.call(target, index, data.rows[index]);
			}
		}).bind('dblclick.datagrid', function(){
			var index = $(this).attr('datagrid-row-index');
			if (opts.onDblClickRow){
				opts.onDblClickRow.call(target, index, data.rows[index]);
			}
		}).bind('contextmenu.datagrid', function(e){
			var index = $(this).attr('datagrid-row-index');
			if (opts.onRowContextMenu){
				opts.onRowContextMenu.call(target, e, index, data.rows[index]);
			}
		});
		
		tr.find('td[field]').unbind('.datagrid').bind('click.datagrid', function(){
			var index = $(this).parent().attr('datagrid-row-index');
			var field = $(this).attr('field');
			var value = data.rows[index][field];
			opts.onClickCell.call(target, index, field, value);
		}).bind('dblclick.datagrid', function(){
			var index = $(this).parent().attr('datagrid-row-index');
			var field = $(this).attr('field');
			var value = data.rows[index][field];
			opts.onDblClickCell.call(target, index, field, value);
		});
		
		tr.find('div.datagrid-cell-check input[type=checkbox]').unbind('.datagrid').bind('click.datagrid', function(e){
			var index = $(this).parent().parent().parent().attr('datagrid-row-index');
			if (opts.singleSelect){
				clearSelections(target);
				selectRow(target, index);
			} else {
				if ($(this).is(':checked')){
					selectRow(target, index);
				} else {
					unselectRow(target, index);
				}
			}
			e.stopPropagation();
		});
	}
	
	/**
	 * bind the datagrid events
	 */
	function bindEvents(target) {
		var panel = $.data(target, 'datagrid').panel;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		var header = dc.view.find('div.datagrid-header');
		header.find('td:has(div.datagrid-cell)').unbind('.datagrid').bind('mouseenter.datagrid', function(){
			$(this).addClass('datagrid-header-over');
		}).bind('mouseleave.datagrid', function(){
			$(this).removeClass('datagrid-header-over');
		}).bind('contextmenu.datagrid', function(e){
			var field = $(this).attr('field');
			opts.onHeaderContextMenu.call(target, e, field);
		});
		header.find('input[type=checkbox]').unbind('.datagrid').bind('click.datagrid', function(){
			if (opts.singleSelect) return false;
			if ($(this).is(':checked')){
				selectAll(target);
			} else {
				unselectAll(target);
			}
		});
		
		dc.body2.unbind('.datagrid').bind('scroll.datagrid', function(){
			dc.view1.children('div.datagrid-body').scrollTop($(this).scrollTop());
			dc.view2.children('div.datagrid-header').scrollLeft($(this).scrollLeft());
			dc.view2.children('div.datagrid-footer').scrollLeft($(this).scrollLeft());
		});
		
		function setSorting(headerCell, enabled){
			headerCell.unbind('.datagrid');
			if (!enabled) return;
			headerCell.bind('click.datagrid', function(e){
				var field = $(this).parent().attr('field');
				var opt = getColumnOption(target, field);
				if (!opt.sortable) return;
				
				opts.sortName = field;
				opts.sortOrder = 'asc';
				
				var c = 'datagrid-sort-asc';
				if ($(this).hasClass('datagrid-sort-asc')){
					c = 'datagrid-sort-desc';
					opts.sortOrder = 'desc';
				}
				header.find('div.datagrid-cell').removeClass('datagrid-sort-asc datagrid-sort-desc');
				$(this).addClass(c);
				
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $.data(target, 'datagrid').data;
					loadData(target, data);
				}
				
				if (opts.onSortColumn){
					opts.onSortColumn.call(target, opts.sortName, opts.sortOrder);
				}
			});
		}
		
		setSorting(header.find('div.datagrid-cell'), true);
		header.find('div.datagrid-cell').each(function(){
			$(this).resizable({
				handles:'e',
				disabled:($(this).attr('resizable') ? $(this).attr('resizable')=='false' : false),
				minWidth:25,
				onStartResize: function(e){
					header.css('cursor', 'e-resize');
					dc.view.children('div.datagrid-resize-proxy').css({
						left:e.pageX - $(panel).offset().left - 1,
						display:'block'
					});
					setSorting($(this), false);	// disable the column sorting
				},
				onResize: function(e){
					dc.view.children('div.datagrid-resize-proxy').css({
						display:'block',
						left:e.pageX - $(panel).offset().left - 1
					});
					return false;
				},
				onStopResize: function(e){
					header.css('cursor', '');
					var field = $(this).parent().attr('field');
					var col = getColumnOption(target, field);
					col.width = $(this).outerWidth();
					col.boxWidth = $.boxModel == true ? $(this).width() : $(this).outerWidth();
					fixColumnSize(target, field);
					fitColumns(target);
					setTimeout(function(){
						setSorting($(e.data.target), true);	// enable the column sorting
					},0);
					
					dc.view2.children('div.datagrid-header').scrollLeft(dc.body2.scrollLeft());
					dc.view.children('div.datagrid-resize-proxy').css('display', 'none');
					opts.onResizeColumn.call(target, field, col.width);
				}
			});
		});
		
		dc.view1.children('div.datagrid-header').find('div.datagrid-cell').resizable({
			onStopResize: function(e){
				header.css('cursor', '');
				var field = $(this).parent().attr('field');
				var col = getColumnOption(target, field);
				col.width = $(this).outerWidth();
				col.boxWidth = $.boxModel == true ? $(this).width() : $(this).outerWidth();
				fixColumnSize(target, field);
				
				dc.view2.children('div.datagrid-header').scrollLeft(dc.body2.scrollLeft());
				dc.view.children('div.datagrid-resize-proxy').css('display', 'none');
				setBodySize(target);
				fitColumns(target);
				setTimeout(function(){
					setSorting($(e.data.target), true);	// enable the column sorting
				},0);
				opts.onResizeColumn.call(target, field, col.width);
			}
		});
	}
	
	/**
	 * expand the columns to fit the grid width
	 */
	function fitColumns(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		if (!opts.fitColumns){
			return;
		}
		var header = dc.view2.children('div.datagrid-header');
		var fieldWidths = 0;
		var lastColumn;
		var fields = getColumnFields(target, false);
		for(var i=0; i<fields.length; i++){
			var col = getColumnOption(target, fields[i]);
			if (!col.hidden && !col.checkbox){
				fieldWidths += col.width;
				lastColumn = col;
			}
		}
		var headerInner = header.children('div.datagrid-header-inner').show();
		var leftWidth = header.width() - header.find('table').width() - opts.scrollbarSize;
		var rate = leftWidth / fieldWidths;
		if (!opts.showHeader) headerInner.hide();
		for(var i=0; i<fields.length; i++){
			var col = getColumnOption(target, fields[i]);
			if (!col.hidden && !col.checkbox){
				var width = Math.floor(col.width * rate);
				addHeaderWidth(col, width);
				leftWidth -= width;
			}
		}
		fixColumnSize(target);
		
		if (leftWidth){
			addHeaderWidth(lastColumn,leftWidth);
			fixColumnSize(target, lastColumn.field);
		}
		
		function addHeaderWidth(col,width){
			col.width += width;
			col.boxWidth += width;
			header.find('td[field="' + col.field + '"] div.datagrid-cell').width(col.boxWidth);
		}
	}
	
	/**
	 * fix column size with the specified field
	 */
	function fixColumnSize(target, field) {
		var panel = $.data(target, 'datagrid').panel;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		if (field) {
			fix(field);
		} else {
			var header = dc.view1.children('div.datagrid-header').add(dc.view2.children('div.datagrid-header'));
			header.find('td[field]').each(function(){
				fix($(this).attr('field'));
			});
		}
		fixMergedSize(target);
		
		setTimeout(function(){
			fixRowHeight(target);
			fixEditableSize(target);
		}, 0);
		
		function fix(field){
			var col = getColumnOption(target, field);
			var bf = opts.finder.getTr(target,'','allbody').add(opts.finder.getTr(target,'','allfooter'));
			bf.find('td[field="' + field + '"]').each(function(){
				var td = $(this);
				var colspan = td.attr('colspan') || 1;
				if (colspan == 1){
					td.find('div.datagrid-cell').width(col.boxWidth);
					td.find('div.datagrid-editable').width(col.width);
				}
			});
		}
	}
	
	function fixMergedSize(target){
		var panel = $.data(target, 'datagrid').panel;
		var dc = $.data(target, 'datagrid').dc;
		var header = dc.view1.children('div.datagrid-header').add(dc.view2.children('div.datagrid-header'));
		panel.find('div.datagrid-body td.datagrid-td-merged').each(function(){
			var td = $(this);
			var colspan = td.attr('colspan') || 1;
			var field = td.attr('field');
			var header_td = header.find('td[field="' + field + '"]');
			var width = header_td.width();
			for(var i=1; i<colspan; i++){
				header_td = header_td.next();
				width += header_td.outerWidth();
			}
			
			var cell = td.children('div.datagrid-cell');
			if ($.boxModel == true){
				cell.width(width - (cell.outerWidth() - cell.width()));
			} else {
				cell.width(width);
			}
		});
	}
	
	function fixEditableSize(target){
		var panel = $.data(target, 'datagrid').panel;
		panel.find('div.datagrid-editable').each(function(){
			var ed = $.data(this, 'datagrid.editor');
			if (ed.actions.resize) {
				ed.actions.resize(ed.target, $(this).width());
			}
		});
	}
	
	function getColumnOption(target, field){
		var opts = $.data(target, 'datagrid').options;
		if (opts.columns){
			for(var i=0; i<opts.columns.length; i++){
				var cols = opts.columns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					if (col.field == field){
						return col;
					}
				}
			}
		}
		if (opts.frozenColumns){
			for(var i=0; i<opts.frozenColumns.length; i++){
				var cols = opts.frozenColumns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					if (col.field == field){
						return col;
					}
				}
			}
		}
		return null;
	}
	
	/**
	 * get column fields which will be show in row
	 */
	function getColumnFields(target, frozen){
		var opts = $.data(target, 'datagrid').options;
		var columns = (frozen==true) ? (opts.frozenColumns || [[]]) : opts.columns;
		if (columns.length == 0) return [];
		
		var fields = [];
		
		function getColumnIndex(count){
			var c = 0;
			var i = 0;
			while(true){
				if (fields[i] == undefined){
					if (c == count){
						return i;
					}
					c ++;
				}
				i++;
			}
		}
		
		function getFields(r){
			var ff = [];
			var c = 0;
			for(var i=0; i<columns[r].length; i++){
				var col = columns[r][i];
				if (col.field){
					ff.push([c, col.field]);	// store the field index and name
				}
				c += parseInt(col.colspan || '1');
			}
			for(var i=0; i<ff.length; i++){
				ff[i][0] = getColumnIndex(ff[i][0]);	// calculate the real index in fields array
			}
			for(var i=0; i<ff.length; i++){
				var f = ff[i];
				fields[f[0]] = f[1];	// update the field name
			}
		}
		
		for(var i=0; i<columns.length; i++){
			getFields(i);
		}
		
		return fields;
	}
	
	/**
	 * load data to the grid
	 */
	function loadData(target, data){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var wrap = $.data(target, 'datagrid').panel;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		data = opts.loadFilter.call(target, data);
		var rows = data.rows;
		$.data(target, 'datagrid').data = data;
		if (data.footer){
			$.data(target, 'datagrid').footer = data.footer;
		}
		
		if (!opts.remoteSort){
			var opt = getColumnOption(target, opts.sortName);
			if (opt){
				var sortFunc = opt.sorter || function(a,b){
					return (a>b?1:-1);
				};
				data.rows.sort(function(r1,r2){
					return sortFunc(r1[opts.sortName], r2[opts.sortName])*(opts.sortOrder=='asc'?1:-1);
				});
			}
		}
		
		// render datagrid view
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, rows);
		}
		opts.view.render.call(opts.view, target, dc.body2, false);
		opts.view.render.call(opts.view, target, dc.body1, true);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		opts.onLoadSuccess.call(target, data);
		
		var pager = wrap.children('div.datagrid-pager');
		if (pager.length){
			if (pager.pagination('options').total != data.total){
				pager.pagination({total:data.total});
			}
		}
		
		fixRowHeight(target);
		bindRowEvents(target);
		dc.body2.triggerHandler('scroll');
		
		if (opts.idField){
			for(var i=0; i<rows.length; i++){
				if (isSelected(rows[i])){
					selectRecord(target, rows[i][opts.idField]);
				}
			}
		}
		
		function isSelected(row){
			for(var i=0; i<selectedRows.length; i++){
				if (selectedRows[i][opts.idField] == row[opts.idField]){
					selectedRows[i] = row;
					return true;
				}
			}
			return false;
		}
	}
	
	/**
	 * Return the index of specified row or -1 if not found.
	 * row: id value or row record
	 */
	function getRowIndex(target, row){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').data.rows;
		if (typeof row == 'object'){
			return indexOfArray(rows, row);
		} else {
			for(var i=0; i<rows.length; i++){
				if (rows[i][opts.idField] == row){
					return i;
				}
			}
			return -1;
		}
	}
	
	function getSelectedRows(target){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		
		if (opts.idField){
			return $.data(target, 'datagrid').selectedRows;
		} else {
			var rows = [];
			opts.finder.getTr(target, '', 'selected', 2).each(function(){
				var index = parseInt($(this).attr('datagrid-row-index'));
				rows.push(data.rows[index]);
			});
			return rows;
		}
	}
	
	/**
	 * clear all the selection records
	 */
	function clearSelections(target){
		unselectAll(target);
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		selectedRows.splice(0, selectedRows.length);
	}
	
	/**
	 * Select all rows of current page.
	 */
	function selectAll(target){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').data.rows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		// get all rows
		var tr = opts.finder.getTr(target, '', 'allbody').addClass('datagrid-row-selected');
		var allck = tr.find('div.datagrid-cell-check input[type=checkbox]');
		$.fn.prop ? allck.prop('checked',true) : allck.attr('checked',true);
		for(var index=0; index<rows.length; index++){
			if (opts.idField){
				(function(){
					var row = rows[index];
					for(var i=0; i<selectedRows.length; i++){
						if (selectedRows[i][opts.idField] == row[opts.idField]){
							return;
						}
					}
					selectedRows.push(row);
				})();
			}
		}
		opts.onSelectAll.call(target, rows);
	}
	
	function unselectAll(target){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		// get all selected rows
		var tr = opts.finder.getTr(target, '', 'selected').removeClass('datagrid-row-selected');
		var allck = tr.find('div.datagrid-cell-check input[type=checkbox]');
		$.fn.prop ? allck.prop('checked', false) : allck.attr('checked', false);
		if (opts.idField){
			for(var index=0; index<data.rows.length; index++){
				removeArrayItem(selectedRows, opts.idField, data.rows[index][opts.idField]);
			}
		}
		opts.onUnselectAll.call(target, data.rows);
	}
	
	/**
	 * select a row with specified row index which start with 0.
	 */
	function selectRow(target, index){
		var dc = $.data(target, 'datagrid').dc;
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (index < 0 || index >= data.rows.length){
			return;
		}
		
		if (opts.singleSelect == true){
			clearSelections(target);
		}
		var tr = opts.finder.getTr(target, index);
		if (!tr.hasClass('datagrid-row-selected')){
			tr.addClass('datagrid-row-selected');
			var ck = $('div.datagrid-cell-check input[type=checkbox]',tr);
			$.fn.prop ? ck.prop('checked', true) : ck.attr('checked', true);
			if (opts.idField){
				var row = data.rows[index];
				(function(){
					for(var i=0; i<selectedRows.length; i++){
						if (selectedRows[i][opts.idField] == row[opts.idField]){
							return;
						}
					}
					selectedRows.push(row);
				})();
			}
		}
		opts.onSelect.call(target, index, data.rows[index]);
		
		var headerHeight = dc.view2.children('div.datagrid-header').outerHeight();
		var body2 = dc.body2;
		var top = tr.position().top - headerHeight;
		if (top <= 0){
			body2.scrollTop(body2.scrollTop() + top);
		} else if (top + tr.outerHeight() > body2.height() - 18){
			body2.scrollTop(body2.scrollTop() + top + tr.outerHeight() - body2.height() + 18);
		}
		
	}
	
	/**
	 * select record by idField.
	 */
	function selectRecord(target, idValue){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		if (opts.idField){
			var index = -1;
			for(var i=0; i<data.rows.length; i++){
				if (data.rows[i][opts.idField] == idValue){
					index = i;
					break;
				}
			}
			if (index >= 0){
				selectRow(target, index);
			}
		}
	}
	
	/**
	 * unselect a row.
	 */
	function unselectRow(target, index){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var data = $.data(target, 'datagrid').data;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (index < 0 || index >= data.rows.length){
			return;
		}
		
		var tr = opts.finder.getTr(target, index);
		var ck = tr.find('div.datagrid-cell-check input[type=checkbox]');
		tr.removeClass('datagrid-row-selected');
		$.fn.prop ? ck.prop('checked', false) : ck.attr('checked', false);
		
		var row = data.rows[index];
		if (opts.idField){
			removeArrayItem(selectedRows, opts.idField, row[opts.idField]);
		}
		opts.onUnselect.call(target, index, row);
	}
	
	/**
	 * Begin edit a row
	 */
	function beginEdit(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (tr.hasClass('datagrid-row-editing')) return;
		if (opts.onBeforeEdit.call(target, index, row) == false) return;
		
		tr.addClass('datagrid-row-editing');
		createEditor(target, index);
		fixEditableSize(target);
		
		tr.find('div.datagrid-editable').each(function(){
			var field = $(this).parent().attr('field');
			var ed = $.data(this, 'datagrid.editor');
			ed.actions.setValue(ed.target, row[field]);
		});
		validateRow(target, index);	// validate the row data
	}
	
	/**
	 * Stop edit a row.
	 * index: the row index.
	 * cancel: if true, restore the row data.
	 */
	function endEdit(target, index, cancel){
		var opts = $.data(target, 'datagrid').options;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (!tr.hasClass('datagrid-row-editing')) {
			return;
		}
		
		if (!cancel){
			if (!validateRow(target, index)) return;	// invalid row data
			
			var changed = false;
			var changes = {};
			tr.find('div.datagrid-editable').each(function(){
				var field = $(this).parent().attr('field');
				var ed = $.data(this, 'datagrid.editor');
				var value = ed.actions.getValue(ed.target);
				if (row[field] != value){
					row[field] = value;
					changed = true;
					changes[field] = value;
				}
			});
			if (changed){
				if (indexOfArray(insertedRows, row) == -1){
					if (indexOfArray(updatedRows, row) == -1){
						updatedRows.push(row);
					}
				}
			}
		}
		
		tr.removeClass('datagrid-row-editing');
		
		destroyEditor(target, index);
		$(target).datagrid('refreshRow', index);
		
		if (!cancel){
			opts.onAfterEdit.call(target, index, row, changes);
		} else {
			opts.onCancelEdit.call(target, index, row);
		}
	}
	
	/**
	 * get the specified row editors
	 */
	function getEditors(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var editors = [];
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				editors.push(ed);
			}
		});
		return editors;
	}
	
	/**
	 * get the cell editor
	 * param contains two parameters: index and field
	 */
	function getEditor(target, param){
		var editors = getEditors(target, param.index);
		for(var i=0; i<editors.length; i++){
			if (editors[i].field == param.field){
				return editors[i];
			}
		}
		return null;
	}
	
	/**
	 * create the row editor and adjust the row height.
	 */
	function createEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-cell');
			var field = $(this).attr('field');
			
			var col = getColumnOption(target, field);
			if (col && col.editor){
				// get edit type and options
				var edittype,editoptions;
				if (typeof col.editor == 'string'){
					edittype = col.editor;
				} else {
					edittype = col.editor.type;
					editoptions = col.editor.options;
				}
				
				// get the specified editor
				var editor = opts.editors[edittype];
				if (editor){
					var oldHtml = cell.html();
					var width = cell.outerWidth();
					cell.addClass('datagrid-editable');
					if ($.boxModel == true){
						cell.width(width - (cell.outerWidth() - cell.width()));
					}
					cell.html('<table border="0" cellspacing="0" cellpadding="1"><tr><td></td></tr></table>');
					cell.children('table').attr('align', col.align);
//					cell.children('table').click(function(e){
//						e.stopPropagation();
//					});
					cell.children('table').bind('click dblclick contextmenu',function(e){
						e.stopPropagation();
					});
					$.data(cell[0], 'datagrid.editor', {
						actions: editor,
						target: editor.init(cell.find('td'), editoptions),
						field: field,
						type: edittype,
						oldHtml: oldHtml
					});
				}
			}
		});
		fixRowHeight(target, index);
	}
	
	/**
	 * destroy the row editor and restore the row height.
	 */
	function destroyEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], 'datagrid.editor');
				
				var width = cell.outerWidth();
				cell.removeClass('datagrid-editable');
				if ($.boxModel == true){
					cell.width(width - (cell.outerWidth() - cell.width()));
				}
			}
		});
	}
	
	/**
	 * Validate while editing, if valid return true.
	 */
	function validateRow(target, index){
		var tr = $.data(target, 'datagrid').options.finder.getTr(target, index);
		if (!tr.hasClass('datagrid-row-editing')){
			return true;
		}
		
		var vbox = tr.find('.validatebox-text');
		vbox.validatebox('validate');
		vbox.trigger('mouseleave');
		var invalidbox = tr.find('.validatebox-invalid');
		return invalidbox.length == 0;
	}
	
	/**
	 * Get changed rows, if state parameter is not assigned, return all changed.
	 * state: inserted,deleted,updated
	 */
	function getChanges(target, state){
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		
		if (!state){
			var rows = [];
			rows = rows.concat(insertedRows);
			rows = rows.concat(deletedRows);
			rows = rows.concat(updatedRows);
			return rows;
		} else if (state == 'inserted'){
			return insertedRows;
		} else if (state == 'deleted'){
			return deletedRows;
		} else if (state == 'updated'){
			return updatedRows;
		}
		
		return [];
	}
	
	function deleteRow(target, index){
		var opts = $.data(target, 'datagrid').options;
		var data = $.data(target, 'datagrid').data;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		$(target).datagrid('cancelEdit', index);
		
		var row = data.rows[index];
		if (indexOfArray(insertedRows, row) >= 0){
			removeArrayItem(insertedRows, row);
		} else {
			deletedRows.push(row);
		}
		removeArrayItem(selectedRows, opts.idField, data.rows[index][opts.idField]);
		
		opts.view.deleteRow.call(opts.view, target, index);
		if (opts.height == 'auto'){
			fixRowHeight(target);	// adjust the row height
		}
	}
	
	function insertRow(target, param){
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, param.index, param.row);
		bindRowEvents(target);
		insertedRows.push(param.row);
	}
	
	function appendRow(target, row){
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, null, row);
		bindRowEvents(target);
		insertedRows.push(row);
	}
	
	function initChanges(target){
		var data = $.data(target, 'datagrid').data;
		var rows = data.rows;
		var originalRows = [];
		for(var i=0; i<rows.length; i++){
			originalRows.push($.extend({}, rows[i]));
		}
		$.data(target, 'datagrid').originalRows = originalRows;
		$.data(target, 'datagrid').updatedRows = [];
		$.data(target, 'datagrid').insertedRows = [];
		$.data(target, 'datagrid').deletedRows = [];
	}
	
	function acceptChanges(target){
		var data = $.data(target, 'datagrid').data;
		var ok = true;
		for(var i=0,len=data.rows.length; i<len; i++){
			if (validateRow(target, i)){
				endEdit(target, i, false);
			} else {
				ok = false;
			}
		}
		if (ok){
			initChanges(target);
		}
	}
	
	function rejectChanges(target){
		var opts = $.data(target, 'datagrid').options;
		var originalRows = $.data(target, 'datagrid').originalRows;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		var data = $.data(target, 'datagrid').data;
		
		for(var i=0; i<data.rows.length; i++) endEdit(target, i, true);
		
		var selectedIds = [];
		for(var i=0; i<selectedRows.length; i++){
			selectedIds.push(selectedRows[i][opts.idField]);
		}
		selectedRows.splice(0, selectedRows.length);
		
		data.total += deletedRows.length - insertedRows.length;
		data.rows = originalRows
		loadData(target, data);
		for(var i=0; i<selectedIds.length; i++){
			selectRecord(target, selectedIds[i]);
		}
		
		initChanges(target);
	}
	
	/**
	 * request remote data
	 */
	function request(target, params){
		var opts = $.data(target, 'datagrid').options;
		
		if (params) opts.queryParams = params;
		if (!opts.url) return;
		
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		if (opts.onBeforeLoad.call(target, param) == false) return;
		
		$(target).datagrid('loading');
		setTimeout(function(){
			doRequest();
		}, 0);
		
		function doRequest(){
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					setTimeout(function(){
						$(target).datagrid('loaded');
					}, 0);
					loadData(target, data);
					setTimeout(function(){
						initChanges(target);
					}, 0);
				},
				error: function(){
					setTimeout(function(){
						$(target).datagrid('loaded');
					}, 0);
					if (opts.onLoadError){
						opts.onLoadError.apply(target, arguments);
					}
				}
			});
		}
	}
	
	function mergeCells(target, param){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').data.rows;
		
		param.rowspan = param.rowspan || 1;
		param.colspan = param.colspan || 1;
		
		if (param.index < 0 || param.index >= rows.length) return;
		if (param.rowspan == 1 && param.colspan == 1) return;
		
		var value = rows[param.index][param.field];	// the cell value
		
		var tr = opts.finder.getTr(target, param.index);
		var td = tr.find('td[field="'+param.field+'"]');
		td.attr('rowspan', param.rowspan).attr('colspan', param.colspan);
		td.addClass('datagrid-td-merged');
		
		for(var i=1; i<param.colspan; i++){
			td = td.next();
			td.hide();
			rows[param.index][td.attr('field')] = value;
		}
		for(var i=1; i<param.rowspan; i++){
			tr = tr.next();
			var td = tr.find('td[field="'+param.field+'"]').hide();
			rows[param.index + i][td.attr('field')] = value;
			for(var j=1; j<param.colspan; j++){
				td = td.next();
				td.hide();
				rows[param.index + i][td.attr('field')] = value;
			}
		}
		
		setTimeout(function(){
			fixMergedSize(target);
		}, 0);
	}
	
	$.fn.datagrid = function(options, param){
		if (typeof options == 'string'){
			return $.fn.datagrid.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datagrid');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.extend({},$.fn.datagrid.defaults,{queryParams:{}}), $.fn.datagrid.parseOptions(this), options);
				$(this).css('width', '').css('height', '');
				
				var wrapResult = wrapGrid(this, opts.rownumbers);
				if (!opts.columns) opts.columns = wrapResult.columns;
				if (!opts.frozenColumns) opts.frozenColumns = wrapResult.frozenColumns;
				$.data(this, 'datagrid', {
					options: opts,
					panel: wrapResult.panel,
					dc: wrapResult.dc,
					selectedRows: [],
					data: {total:0,rows:[]},
					originalRows: [],
					updatedRows: [],
					insertedRows: [],
					deletedRows: []
				});
			}
			
			buildGrid(this);
			
			if (!state) {
				var data = parseGridData(this);
				if (data.total > 0){
					loadData(this, data);
					initChanges(this);
				}
//				fixColumnSize(this);
			}
			setSize(this);
			
			if (opts.url) {
				request(this);
			}
			
			bindEvents(this);
				
		});
	};
	
	var editors = {
		text: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		textarea: {
			init: function(container, options){
				var input = $('<textarea class="datagrid-editable-input"></textarea>').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		checkbox: {
			init: function(container, options){
				var input = $('<input type="checkbox">').appendTo(container);
				input.val(options.on);
				input.attr('offval', options.off);
				return input;
			},
			getValue: function(target){
				if ($(target).is(':checked')){
					return $(target).val();
				} else {
					return $(target).attr('offval');
				}
			},
			setValue: function(target, value){
				var checked = false;
				if ($(target).val() == value){
					checked = true;
				}
				$.fn.prop ? $(target).prop('checked', checked) : $(target).attr('checked', checked);
			}
		},
		numberbox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.numberbox(options);
				return input;
			},
			destroy: function(target){
				$(target).numberbox('destroy');
			},
			getValue: function(target){
				return $(target).numberbox('getValue');
			},
			setValue: function(target, value){
				$(target).numberbox('setValue', value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		validatebox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.validatebox(options);
				return input;
			},
			destroy: function(target){
				$(target).validatebox('destroy');
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				var input = $(target);
				if ($.boxModel == true){
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		},
		datebox: {
			init: function(container, options){
				var input = $('<input type="text">').appendTo(container);
				input.datebox(options);
				return input;
			},
			destroy: function(target){
				$(target).datebox('destroy');
			},
			getValue: function(target){
				return $(target).datebox('getValue');
			},
			setValue: function(target, value){
				$(target).datebox('setValue', value);
			},
			resize: function(target, width){
				$(target).datebox('resize', width);
			}
		},
		combobox: {
			init: function(container, options){
				var combo = $('<input type="text">').appendTo(container);
				combo.combobox(options || {});
				return combo;
			},
			destroy: function(target){
				$(target).combobox('destroy');
			},
			getValue: function(target){
				return $(target).combobox('getValue');
			},
			setValue: function(target, value){
				$(target).combobox('setValue', value);
			},
			resize: function(target, width){
				$(target).combobox('resize', width)
			}
		},
		combotree: {
			init: function(container, options){
				var combo = $('<input type="text">').appendTo(container);
				combo.combotree(options);
				return combo;
			},
			destroy: function(target){
				$(target).combotree('destroy');
			},
			getValue: function(target){
				return $(target).combotree('getValue');
			},
			setValue: function(target, value){
				$(target).combotree('setValue', value);
			},
			resize: function(target, width){
				$(target).combotree('resize', width)
			}
		}
	};
	
	$.fn.datagrid.methods = {
		options: function(jq){
			var gopts = $.data(jq[0], 'datagrid').options;
			var popts = $.data(jq[0], 'datagrid').panel.panel('options');
			var opts = $.extend(gopts, {
				width: popts.width,
				height: popts.height,
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
			var pager = jq.datagrid('getPager');
			if (pager.length){
				var pagerOpts = pager.pagination('options');
				$.extend(opts, {
					pageNumber: pagerOpts.pageNumber,
					pageSize: pagerOpts.pageSize
				});
			}
			return opts;
		},
		getPanel: function(jq){
			return $.data(jq[0], 'datagrid').panel;
		},
		getPager: function(jq){
			return $.data(jq[0], 'datagrid').panel.find('div.datagrid-pager');
		},
		getColumnFields: function(jq, frozen){
			return getColumnFields(jq[0], frozen);
		},
		getColumnOption: function(jq, field){
			return getColumnOption(jq[0], field);
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		load: function(jq, params){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				opts.pageNumber = 1;
				var pager = $(this).datagrid('getPager');
				pager.pagination({pageNumber:1});
				request(this, params);
			});
		},
		reload: function(jq, params){
			return jq.each(function(){
				request(this, params);
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				var view = $(this).datagrid('getPanel').children('div.datagrid-view');
				var view1 = view.children('div.datagrid-view1');
				var view2 = view.children('div.datagrid-view2');
				if (footer){
					$.data(this, 'datagrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, view2.find('div.datagrid-footer-inner'), false);
					opts.view.renderFooter.call(opts.view, this, view1.find('div.datagrid-footer-inner'), true);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).datagrid('fixRowHeight');
				}
			});
		},
		loading: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				$(this).datagrid('getPager').pagination('loading');
				if (opts.loadMsg){
					var panel = $(this).datagrid('getPanel');
					$('<div class="datagrid-mask" style="display:block"></div>').appendTo(panel);
					$('<div class="datagrid-mask-msg" style="display:block"></div>').html(opts.loadMsg).appendTo(panel);
					centerLoadingMsg(this);
				}
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				$(this).datagrid('getPager').pagination('loaded');
				var panel = $(this).datagrid('getPanel');
				panel.children('div.datagrid-mask-msg').remove();
				panel.children('div.datagrid-mask').remove();
			});
		},
		fitColumns: function(jq){
			return jq.each(function(){
				fitColumns(this);
			});
		},
		fixColumnSize: function(jq){
			return jq.each(function(){
				fixColumnSize(this);
			});
		},
		fixRowHeight: function(jq, index){
			return jq.each(function(){
				fixRowHeight(this, index);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
				initChanges(this);
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'datagrid').data;
		},
		getRows: function(jq){
			return $.data(jq[0], 'datagrid').data.rows;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'datagrid').footer;
		},
		getRowIndex: function(jq, id){	// id or row record
			return getRowIndex(jq[0], id);
		},
		getSelected: function(jq){
			var rows = getSelectedRows(jq[0]);
			return rows.length>0 ? rows[0] : null;
		},
		getSelections: function(jq){
			return getSelectedRows(jq[0]);
		},
		clearSelections: function(jq){
			return jq.each(function(){
				clearSelections(this);
			});
		},
		selectAll: function(jq){
			return jq.each(function(){
				selectAll(this);
			});
		},
		unselectAll: function(jq){
			return jq.each(function(){
				unselectAll(this);
			});
		},
		selectRow: function(jq, index){
			return jq.each(function(){
				selectRow(this, index);
			});
		},
		selectRecord: function(jq, id){
			return jq.each(function(){
				selectRecord(this, id);
			});
		},
		unselectRow: function(jq, index){
			return jq.each(function(){
				unselectRow(this, index);
			});
		},
		beginEdit: function(jq, index){
			return jq.each(function(){
				beginEdit(this, index);
			});
		},
		endEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, false);
			});
		},
		cancelEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, true);
			});
		},
		getEditors: function(jq, index){
			return getEditors(jq[0], index);
		},
		getEditor: function(jq, param){	// param: {index:0, field:'name'}
			return getEditor(jq[0], param);
		},
		refreshRow: function(jq, index){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.refreshRow.call(opts.view, this, index);
			});
		},
		validateRow: function(jq, index){
			return validateRow(jq[0], index);
//			return jq.each(function(){
//				validateRow(this, index);
//			});
		},
		updateRow: function(jq, param){	// param: {index:1,row:{code:'code1',name:'name1'}}
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.updateRow.call(opts.view, this, param.index, param.row);
			});
		},
		appendRow: function(jq, row){
			return jq.each(function(){
				appendRow(this, row);
			});
		},
		insertRow: function(jq, param){
			return jq.each(function(){
				insertRow(this, param);
			});
		},
		deleteRow: function(jq, index){
			return jq.each(function(){
				deleteRow(this, index);
			});
		},
		getChanges: function(jq, state){
			return getChanges(jq[0], state);	// state: inserted,deleted,updated
		},
		acceptChanges: function(jq){
			return jq.each(function(){
				acceptChanges(this);
			});
		},
		rejectChanges: function(jq){
			return jq.each(function(){
				rejectChanges(this);
			});
		},
		mergeCells: function(jq, param){
			return jq.each(function(){
				mergeCells(this, param);
			});
		},
		showColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').show();
				$(this).datagrid('getColumnOption', field).hidden = false;
				$(this).datagrid('fitColumns');
			});
		},
		hideColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').hide();
				$(this).datagrid('getColumnOption', field).hidden = true;
				$(this).datagrid('fitColumns');
			});
		}
	};
	
	$.fn.datagrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.panel.parseOptions(target), {
			fitColumns: (t.attr('fitColumns') ? t.attr('fitColumns') == 'true' : undefined),
			striped: (t.attr('striped') ? t.attr('striped') == 'true' : undefined),
			nowrap: (t.attr('nowrap') ? t.attr('nowrap') == 'true' : undefined),
			rownumbers: (t.attr('rownumbers') ? t.attr('rownumbers') == 'true' : undefined),
			singleSelect: (t.attr('singleSelect') ? t.attr('singleSelect') == 'true' : undefined),
			pagination: (t.attr('pagination') ? t.attr('pagination') == 'true' : undefined),
			pageSize: (t.attr('pageSize') ? parseInt(t.attr('pageSize')) : undefined),
			pageNumber: (t.attr('pageNumber') ? parseInt(t.attr('pageNumber')) : undefined),
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined),
			remoteSort: (t.attr('remoteSort') ? t.attr('remoteSort') == 'true' : undefined),
			sortName: t.attr('sortName'),
			sortOrder: t.attr('sortOrder'),
			showHeader: (t.attr('showHeader') ? t.attr('showHeader') == 'true' : undefined),
			showFooter: (t.attr('showFooter') ? t.attr('showFooter') == 'true' : undefined),
			scrollbarSize: (t.attr('scrollbarSize') ? parseInt(t.attr('scrollbarSize')) : undefined),
			loadMsg: (t.attr('loadMsg')!=undefined ? t.attr('loadMsg') : undefined),
			idField: t.attr('idField'),
			toolbar: t.attr('toolbar'),
			url: t.attr('url'),
			rowStyler: (t.attr('rowStyler') ? eval(t.attr('rowStyler')) : undefined)
		});
	};
	
	var defaultView = {
		render: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			if (frozen){
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
					return;
				}
			}
			
			var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
			for(var i=0; i<rows.length; i++) {
				// get the class and style attributes for this row
				var cls = (i % 2 && opts.striped) ? 'class="datagrid-row-alt"' : '';
				var styleValue = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : '';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				
				table.push('<tr datagrid-row-index="' + i + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			table.push('</tbody></table>');
			
			$(container).html(table.join(''));
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				table.push('<tr datagrid-row-index="' + i + '">');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, rowIndex, rowData){
			var opts = $.data(target, 'datagrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				var rownumber = rowIndex + 1;
				if (opts.pagination){
					rownumber += (opts.pageNumber-1)*opts.pageSize;
				}
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					// get the cell style attribute
					var styleValue = col.styler ? (col.styler(rowData[field], rowData, rowIndex)||'') : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + style + '>');
					
					var style = 'width:' + (col.boxWidth) + 'px;';
					style += 'text-align:' + (col.align || 'left') + ';';
					style += opts.nowrap == false ? 'white-space:normal;' : '';
					
					cc.push('<div style="' + style + '" ');
					if (col.checkbox){
						cc.push('class="datagrid-cell-check ');
					} else {
						cc.push('class="datagrid-cell ');
					}
					cc.push('">');
					
					if (col.checkbox){
						cc.push('<input type="checkbox"/>');
					} else if (col.formatter){
						cc.push(col.formatter(rowData[field], rowData, rowIndex));
					} else {
						cc.push(rowData[field]);
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, rowIndex){
			var row = {};
			var fields = $(target).datagrid('getColumnFields',true).concat($(target).datagrid('getColumnFields',false));
			for(var i=0; i<fields.length; i++){
				row[fields[i]] = undefined;
			}
			var rows = $(target).datagrid('getRows');
			$.extend(row, rows[rowIndex]);
			this.updateRow.call(this, target, rowIndex, row);
		},
		
		updateRow: function(target, rowIndex, row){
			var opts = $.data(target, 'datagrid').options;
			var rows = $(target).datagrid('getRows');
			
			var tr = opts.finder.getTr(target, rowIndex);
			for(var field in row){
				rows[rowIndex][field] = row[field];
				var td = tr.children('td[field="' + field + '"]');
				var cell = td.find('div.datagrid-cell');
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var styleValue = col.styler ? col.styler(rows[rowIndex][field], rows[rowIndex], rowIndex) : '';
					td.attr('style', styleValue || '');
					if (col.hidden){
						td.hide();
					}
					
					if (col.formatter){
						cell.html(col.formatter(rows[rowIndex][field], rows[rowIndex], rowIndex));
					} else {
						cell.html(rows[rowIndex][field]);
					}
				}
			}
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : '';
			tr.attr('style', styleValue || '');
			$(target).datagrid('fixRowHeight', rowIndex);
		},
		
		insertRow: function(target, index, row){
			var opts = $.data(target, 'datagrid').options;
			var dc = $.data(target, 'datagrid').dc;
			var data = $.data(target, 'datagrid').data;
			
			if (index == undefined || index == null) index = data.rows.length;
			if (index > data.rows.length) index = data.rows.length;
			
			for(var i=data.rows.length-1; i>=index; i--){
				opts.finder.getTr(target, i, 'body', 2).attr('datagrid-row-index', i+1);
				var tr = opts.finder.getTr(target, i, 'body', 1).attr('datagrid-row-index', i+1);
				if (opts.rownumbers){
					tr.find('div.datagrid-cell-rownumber').html(i+2);
				}
			}
			
			var fields1 = $(target).datagrid('getColumnFields', true);
			var fields2 = $(target).datagrid('getColumnFields', false);
			var tr1 = '<tr datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields1, true, index, row) + '</tr>';
			var tr2 = '<tr datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields2, false, index, row) + '</tr>';
			if (index >= data.rows.length){	// append new row
				if (data.rows.length){	// not empty
					opts.finder.getTr(target, '', 'last', 1).after(tr1);
					opts.finder.getTr(target, '', 'last', 2).after(tr2);
				} else {
					dc.body1.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr1 + '</tbody></table>');
					dc.body2.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr2 + '</tbody></table>');
				}
			} else {	// insert new row
				opts.finder.getTr(target, index+1, 'body', 1).before(tr1);
				opts.finder.getTr(target, index+1, 'body', 2).before(tr2);
			}
			
			data.total += 1;
			data.rows.splice(index, 0, row);
			
			this.refreshRow.call(this, target, index);
		},
		
		deleteRow: function(target, index){
			var opts = $.data(target, 'datagrid').options;
			var data = $.data(target, 'datagrid').data;
			
			opts.finder.getTr(target, index).remove();
			for(var i=index+1; i<data.rows.length; i++){
				opts.finder.getTr(target, i, 'body', 2).attr('datagrid-row-index', i-1);
				var tr1 = opts.finder.getTr(target, i, 'body', 1).attr('datagrid-row-index', i-1);
				if (opts.rownumbers){
					tr1.find('div.datagrid-cell-rownumber').html(i);
				}
			}
			
			data.total -= 1;
			data.rows.splice(index,1);
		},
		
		onBeforeRender: function(target, rows){},
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			if (opts.showFooter){
				var footer = $(target).datagrid('getPanel').find('div.datagrid-footer');
				footer.find('div.datagrid-cell-rownumber,div.datagrid-cell-check').css('visibility', 'hidden');
			}
		}
	};
	
	$.fn.datagrid.defaults = $.extend({}, $.fn.panel.defaults, {
		frozenColumns: null,
		columns: null,
		fitColumns: false,
		toolbar: null,
		striped: false,
		method: 'post',
		nowrap: true,
		idField: null,
		url: null,
		loadMsg: 'Processing, please wait ...',
		rownumbers: false,
		singleSelect: false,
		pagination: false,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10,20,30,40,50],
		queryParams: {},
		sortName: null,
		sortOrder: 'asc',
		remoteSort: true,
		showHeader: true,
		showFooter: false,
		scrollbarSize: 18,
		rowStyler: function(rowIndex, rowData){},	// return style such as 'background:red'
		loadFilter: function(data){
			if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
				return {
					total: data.length,
					rows: data
				};
			} else {
				return data;
			}
		},
		
		editors: editors,
		finder:{
			getTr:function(target, index, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var dc = $.data(target, 'datagrid').dc;	// data container
				var opts = $.data(target, 'datagrid').options;
				if (serno == 0){
					var tr1 = opts.finder.getTr(target, index, type, 1);
					var tr2 = opts.finder.getTr(target, index, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index='+index+']');
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index='+index+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-selected');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr:last[datagrid-row-index]');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index]');
					}
				}
			},
			getRow:function(target, index){
				return $.data(target, 'datagrid').data.rows[index];
			}
		},
		view: defaultView,
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onClickRow: function(rowIndex, rowData){},
		onDblClickRow: function(rowIndex, rowData){},
		onClickCell: function(rowIndex, field, value){},
		onDblClickCell: function(rowIndex, field, value){},
		onSortColumn: function(sort, order){},
		onResizeColumn: function(field, width){},
		onSelect: function(rowIndex, rowData){},
		onUnselect: function(rowIndex, rowData){},
		onSelectAll: function(rows){},
		onUnselectAll: function(rows){},
		onBeforeEdit: function(rowIndex, rowData){},
		onAfterEdit: function(rowIndex, rowData, changes){},
		onCancelEdit: function(rowIndex, rowData){},
		onHeaderContextMenu: function(e, field){},
		onRowContextMenu: function(e, rowIndex, rowData){}
	});
})(jQuery);