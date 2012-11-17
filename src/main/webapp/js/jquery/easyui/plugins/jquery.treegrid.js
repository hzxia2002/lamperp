/**
 * treegrid - jQuery EasyUI
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
	function removeArrayItem(a,o){
		var index = indexOfArray(a,o);
		if (index != -1){
			a.splice(index, 1);
		}
	}
	
	function buildGrid(target){
		var opts = $.data(target, 'treegrid').options;
		$(target).datagrid($.extend({}, opts, {
			url: null,
			onLoadSuccess: function(){},
			onResizeColumn: function(field, width){
				setRowHeight(target);
				opts.onResizeColumn.call(target, field, width);
			},
			onSortColumn: function(sort,order){
				opts.sortName = sort;
				opts.sortOrder = order;
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $(target).treegrid('getData');
					loadData(target, 0, data);
				}
				opts.onSortColumn.call(target, sort, order);
			},
			onBeforeEdit: function(index, row){
				if (opts.onBeforeEdit.call(target, row) == false) return false;
			},
			onAfterEdit:function(index,row,changes){
				bindEvents(target);
				opts.onAfterEdit.call(target, row, changes);
			},
			onCancelEdit:function(index,row){
				bindEvents(target);
				opts.onCancelEdit.call(target, row);
			}
		}));
		if (opts.pagination){
			var pager = $(target).datagrid('getPager');
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
	}
	
	function setRowHeight(target, idValue){
		var opts = $.data(target, 'datagrid').options;
		var panel = $.data(target, 'datagrid').panel;
		
		var view = panel.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		if (opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length>0)){
			if (idValue){
				setHeight(idValue);
				view2.find('tr[node-id=' + idValue + ']').next('tr.treegrid-tr-tree').find('tr[node-id]').each(function(){
					setHeight($(this).attr('node-id'));
				});
			} else {
				view2.find('tr[node-id]').each(function(){
					setHeight($(this).attr('node-id'));
				});
				if (opts.showFooter){
					var footRows = $.data(target, 'datagrid').footer || [];
					for(var i=0; i<footRows.length; i++){
						setHeight(footRows[i][opts.idField]);
					}
					$(target).datagrid('resize');
				}
			}
		}
		if (opts.height == 'auto'){
			var body1 = view1.children('div.datagrid-body');
			var body2 = view2.children('div.datagrid-body');
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
			view.height(view2.height());
		}
		view2.children('div.datagrid-body').triggerHandler('scroll');
		
		function setHeight(idValue){
			var tr1 = view1.find('tr[node-id='+idValue+']');
			var tr2 = view2.find('tr[node-id='+idValue+']');
			tr1.css('height', '');
			tr2.css('height', '');
			var height = Math.max(tr1.height(), tr2.height());
			tr1.css('height', height);
			tr2.css('height', height);
		}
	}
	
	function setRowNumbers(target){
		var opts = $.data(target, 'treegrid').options;
		if (!opts.rownumbers) return;
		$(target).datagrid('getPanel').find('div.datagrid-view1 div.datagrid-body div.datagrid-cell-rownumber').each(function(i){
			var rownumber = i + 1;
//			if (opts.pagination){
//				rownumber += (opts.pageNumber-1)*opts.pageSize;
//			}
			$(this).html(rownumber);
		});
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'treegrid').options;
		var panel = $(target).datagrid('getPanel');
		var body = panel.find('div.datagrid-body');
		body.find('span.tree-hit').unbind('.treegrid').bind('click.treegrid', function(){
			var tr = $(this).parent().parent().parent();
			var id = tr.attr('node-id');
			toggle(target, id);
			return false;
		}).bind('mouseenter.treegrid', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).addClass('tree-expanded-hover');
			} else {
				$(this).addClass('tree-collapsed-hover');
			}
		}).bind('mouseleave.treegrid', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).removeClass('tree-expanded-hover');
			} else {
				$(this).removeClass('tree-collapsed-hover');
			}
		});
		
		body.find('tr[node-id]').unbind('.treegrid').bind('mouseenter.treegrid', function(){
			var id = $(this).attr('node-id');
			body.find('tr[node-id=' + id + ']').addClass('datagrid-row-over');
		}).bind('mouseleave.treegrid', function(){
			var id = $(this).attr('node-id');
			body.find('tr[node-id=' + id + ']').removeClass('datagrid-row-over');
		}).bind('click.treegrid', function(){
			var id = $(this).attr('node-id');
			if (opts.singleSelect){
				unselectAll(target);
				select(target, id);
			} else {
				if ($(this).hasClass('datagrid-row-selected')){
					unselect(target, id);
				} else {
					select(target, id);
				}
			}
			opts.onClickRow.call(target, find(target, id));
		}).bind('dblclick.treegrid', function(){
			var id = $(this).attr('node-id');
			opts.onDblClickRow.call(target, find(target, id));
		}).bind('contextmenu.treegrid', function(e){
			var id = $(this).attr('node-id');
			opts.onContextMenu.call(target, e, find(target, id));
		});
		
		body.find('div.datagrid-cell-check input[type=checkbox]').unbind('.treegrid').bind('click.treegrid', function(e){
			var id = $(this).parent().parent().parent().attr('node-id');
			if (opts.singleSelect){
				unselectAll(target);
				select(target, id);
			} else {
				if ($(this).attr('checked')){
					select(target, id);
				} else {
					unselect(target, id);
				}
			}
			e.stopPropagation();
		});
		
		var header = panel.find('div.datagrid-header');
		header.find('input[type=checkbox]').unbind().bind('click.treegrid', function(){
			if (opts.singleSelect) return false;
			if ($(this).attr('checked')){
				selectAll(target);
			} else {
				unselectAll(target);
			}
		});
	}
	
	/**
	 * create sub tree
	 * parentId: the node id value
	 */
	function createSubTree(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var view = $(target).datagrid('getPanel').children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		var tr1 = view1.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
		var tr2 = view2.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
		var colspan1 = $(target).datagrid('getColumnFields', true).length + (opts.rownumbers?1:0);
		var colspan2 = $(target).datagrid('getColumnFields', false).length;

		_create(tr1, colspan1);
		_create(tr2, colspan2);
		
		function _create(tr, colspan){
			$('<tr class="treegrid-tr-tree">' +
					'<td style="border:0px" colspan="' + colspan + '">' +
					'<div></div>' +
					'</td>' +
				'</tr>').insertAfter(tr);
		}
	}
	
	/**
	 * load data to specified node.
	 */
	function loadData(target, parentId, data, append){
		var opts = $.data(target, 'treegrid').options;
		data = opts.loadFilter.call(target, data, parentId);
		
		var wrap = $.data(target, 'datagrid').panel;
		var view = wrap.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		
		var node = find(target, parentId);
		if (node){
			var node1 = view1.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
			var node2 = view2.children('div.datagrid-body').find('tr[node-id=' + parentId + ']');
			var cc1 = node1.next('tr.treegrid-tr-tree').children('td').children('div');
			var cc2 = node2.next('tr.treegrid-tr-tree').children('td').children('div');
		} else {
			var cc1 = view1.children('div.datagrid-body').children('div.datagrid-body-inner');
			var cc2 = view2.children('div.datagrid-body');
		}
		if (!append){
			$.data(target, 'treegrid').data = [];
			cc1.empty();
			cc2.empty();
		}
		
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, parentId, data);
		}
		opts.view.render.call(opts.view, target, cc1, true);
		opts.view.render.call(opts.view, target, cc2, false);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, view1.find('div.datagrid-footer-inner'), true);
			opts.view.renderFooter.call(opts.view, target, view2.find('div.datagrid-footer-inner'), false);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		opts.onLoadSuccess.call(target, node, data);
		
		// reset the pagination
		if (!parentId && opts.pagination){
			var total = $.data(target, 'treegrid').total;
			var pager = $(target).datagrid('getPager');
			if (pager.pagination('options').total != total){
				pager.pagination({total:total});
			}
		}
		
		setRowHeight(target);
		setRowNumbers(target);
		setCheckboxColumn();
		bindEvents(target);
		
		
		function setCheckboxColumn(){
			var header = view.find('div.datagrid-header');
			var body = view.find('div.datagrid-body');
			var headerCheck = header.find('div.datagrid-header-check');
			if (headerCheck.length){
				var ck = body.find('div.datagrid-cell-check');
				if ($.boxModel){
					ck.width(headerCheck.width());
					ck.height(headerCheck.height());
				} else {
					ck.width(headerCheck.outerWidth());
					ck.height(headerCheck.outerHeight());
				}
			}
		}
	}
	
	function request(target, parentId, params, append, callback){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		
		if (params) opts.queryParams = params;
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
		
		var row = find(target, parentId);
		
		if (opts.onBeforeLoad.call(target, row, param) == false) return;
		if (!opts.url) return;
		
		var folder = body.find('tr[node-id=' + parentId + '] span.tree-folder');
		folder.addClass('tree-loading');
		$(target).treegrid('loading');
		$.ajax({
			type: opts.method,
			url: opts.url,
			data: param,
			dataType: 'json',
			success: function(data){
				folder.removeClass('tree-loading');
				$(target).treegrid('loaded');
				loadData(target, parentId, data, append);
				if (callback) {
					callback();
				}
			},
			error: function(){
				folder.removeClass('tree-loading');
				$(target).treegrid('loaded');
				opts.onLoadError.apply(target, arguments);
				if (callback){
					callback();
				}
			}
		});
	}
	
	function getRoot(target){
		var rows = getRoots(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getRoots(target){
		return $.data(target, 'treegrid').data;
	}
	
	function getParent(target, idValue){
		var row = find(target, idValue);
		if (row._parentId){
			return find(target, row._parentId);
		} else {
			return null;
		}
	}
	
	function getChildren(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-view2 div.datagrid-body');
		var nodes = [];
		if (parentId){
			getNodes(parentId);
		} else {
			var roots = getRoots(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes(roots[i][opts.idField]);
			}
		}
		
		function getNodes(parentId){
			var pnode = find(target, parentId);
			if (pnode && pnode.children){
				for(var i=0,len=pnode.children.length; i<len; i++){
					var cnode = pnode.children[i];
					nodes.push(cnode);
					getNodes(cnode[opts.idField]);
				}
			}
		}
		
		return nodes;
	}
	
	function getSelected(target){
		var rows = getSelections(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getSelections(target){
		var rows = [];
		var panel = $(target).datagrid('getPanel');
		panel.find('div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected').each(function(){
			var id = $(this).attr('node-id');
			rows.push(find(target, id));
		});
		return rows;
	}
	
	function getLevel(target, idValue){
		if (!idValue) return 0;
		var opts = $.data(target, 'treegrid').options;
		var view = $(target).datagrid('getPanel').children('div.datagrid-view');
		var node = view.find('div.datagrid-body tr[node-id=' + idValue + ']').children('td[field=' + opts.treeField + ']');
		return node.find('span.tree-indent,span.tree-hit').length;
	}
	
	function find(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var data = $.data(target, 'treegrid').data;
		var cc = [data];
		while(cc.length){
			var c = cc.shift();
			for(var i=0; i<c.length; i++){
				var node = c[i];
				if (node[opts.idField] == idValue){
					return node;
				} else if (node['children']){
					cc.push(node['children']);
				}
			}
		}
		return null;
	}
	
	function select(target, idValue){
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		tr.addClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', true);
	}
	
	function unselect(target, idValue){
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		tr.removeClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', false);
	}
	
	function selectAll(target){
		var tr = $(target).datagrid('getPanel').find('div.datagrid-body tr[node-id]');
		tr.addClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', true);
	}
	
	function unselectAll(target){
		var tr = $(target).datagrid('getPanel').find('div.datagrid-body tr[node-id]');
		tr.removeClass('datagrid-row-selected');
		tr.find('div.datagrid-cell-check input[type=checkbox]').attr('checked', false);
	}
	
	function collapse(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var row = find(target, idValue);
		var tr = body.find('tr[node-id=' + idValue + ']');
		var hit = tr.find('span.tree-hit');
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		if (opts.onBeforeCollapse.call(target, row) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		row.state = 'closed';
		tr = tr.next('tr.treegrid-tr-tree');
		var cc = tr.children('td').children('div');
		if (opts.animate){
			cc.slideUp('normal', function(){
				setRowHeight(target, idValue);
				opts.onCollapse.call(target, row);
			});
		} else {
			cc.hide();
			setRowHeight(target, idValue);
			opts.onCollapse.call(target, row);
		}
	}
	
	function expand(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		var hit = tr.find('span.tree-hit');
		var row = find(target, idValue);
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		if (opts.onBeforeExpand.call(target, row) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var subtree = tr.next('tr.treegrid-tr-tree');
		if (subtree.length){
			var cc = subtree.children('td').children('div');
			_expand(cc);
		} else {
			createSubTree(target, row[opts.idField]);
			var subtree = tr.next('tr.treegrid-tr-tree');
			var cc = subtree.children('td').children('div');
			cc.hide();
			request(target, row[opts.idField], {id:row[opts.idField]}, true, function(){
				_expand(cc);
			});
		}
		
		function _expand(cc){
			row.state = 'open';
			if (opts.animate){
				cc.slideDown('normal', function(){
					setRowHeight(target, idValue);
					opts.onExpand.call(target, row);
				});
			} else {
				cc.show();
				setRowHeight(target, idValue);
				opts.onExpand.call(target, row);
			}
		}
	}
	
	function toggle(target, idValue){
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		var hit = tr.find('span.tree-hit');
		if (hit.hasClass('tree-expanded')){
			collapse(target, idValue);
		} else {
			expand(target, idValue);
		}
	}
	
	function collapseAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			collapse(target, nodes[i][opts.idField]);
		}
	}
	
	function expandAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			expand(target, nodes[i][opts.idField]);
		}
	}
	
	function expandTo(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var ids = [];
		var p = getParent(target, idValue);
		while(p){
			var id = p[opts.idField];
			ids.unshift(id);
			p = getParent(target, id);
		}
		for(var i=0; i<ids.length; i++){
			expand(target, ids[i]);
		}
	}
	
	function append(target, param){
		var opts = $.data(target, 'treegrid').options;
		if (param.parent){
			var body = $(target).datagrid('getPanel').find('div.datagrid-body');
			var tr = body.find('tr[node-id=' + param.parent + ']');
			if (tr.next('tr.treegrid-tr-tree').length == 0){
				createSubTree(target, param.parent);
			}
			var cell = tr.children('td[field=' + opts.treeField + ']').children('div.datagrid-cell');
			var nodeIcon = cell.children('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		loadData(target, param.parent, param.data, true);
	}
	
	/**
	 * remove the specified node
	 */
	function remove(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		tr.next('tr.treegrid-tr-tree').remove();
		tr.remove();
		
		var pnode = del(idValue);
		if (pnode){
			if (pnode.children.length == 0){
				tr = body.find('tr[node-id=' + pnode[opts.treeField] + ']');
				var cell = tr.children('td[field=' + opts.treeField + ']').children('div.datagrid-cell');
				cell.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
				cell.find('.tree-hit').remove();
				$('<span class="tree-indent"></span>').prependTo(cell);
			}
		}
		
		setRowNumbers(target);
		
		/**
		 * delete the specified node, return its parent node
		 */
		function del(id){
			var cc;
			var pnode = getParent(target, idValue);
			if (pnode){
				cc = pnode.children;
			} else {
				cc = $(target).treegrid('getData');
			}
			for(var i=0; i<cc.length; i++){
				if (cc[i][opts.treeField] == id){
					cc.splice(i, 1);
					break;
				}
			}
			return pnode;
		}
	}
	
	
	$.fn.treegrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.treegrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
//			return $.fn.treegrid.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'treegrid');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'treegrid', {
					options: $.extend({}, $.fn.treegrid.defaults, $.fn.treegrid.parseOptions(this), options),
					data:[]
				});
			}
			
			buildGrid(this);
			request(this);
		});
	};
	
	$.fn.treegrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'treegrid').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				$(this).datagrid('resize', param);
			});
		},
		fixRowHeight: function(jq, idValue){
			return jq.each(function(){
				setRowHeight(this, idValue);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, null, data);
			});
		},
		reload: function(jq, id){
			return jq.each(function(){
				if (id){
					var node = $(this).treegrid('find', id);
					if (node.children){
						node.children.splice(0, node.children.length);
					}
					var body = $(this).datagrid('getPanel').find('div.datagrid-body');
					var tr = body.find('tr[node-id=' + id + ']');
					tr.next('tr.treegrid-tr-tree').remove();
					var hit = tr.find('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					expand(this, id);
				} else {
					request(this, null, {});
//					request(this);
				}
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				var view = $(this).datagrid('getPanel').children('div.datagrid-view');
				var view1 = view.children('div.datagrid-view1');
				var view2 = view.children('div.datagrid-view2');
				if (footer){
					$.data(this, 'treegrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, view1.find('div.datagrid-footer-inner'), true);
					opts.view.renderFooter.call(opts.view, this, view2.find('div.datagrid-footer-inner'), false);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).treegrid('fixRowHeight');
				}
			});
		},
		loading: function(jq){
			return jq.each(function(){
				$(this).datagrid('loading');
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				$(this).datagrid('loaded');
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'treegrid').data;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'treegrid').footer;
		},
		getRoot: function(jq){
			return getRoot(jq[0]);
		},
		getRoots: function(jq){
			return getRoots(jq[0]);
		},
		getParent: function(jq, id){
			return getParent(jq[0], id);
		},
		getChildren: function(jq, id){
			return getChildren(jq[0], id);
		},
		getSelected: function(jq){
			return getSelected(jq[0]);
		},
		getSelections: function(jq){
			return getSelections(jq[0]);
		},
		getLevel: function(jq, id){
			return getLevel(jq[0], id);
		},
		find: function(jq, id){
			return find(jq[0], id);
		},
		isLeaf: function(jq, id){
			var opts = $.data(jq[0], 'treegrid').options;
			var tr = opts.finder.getTr(jq[0], id);
			var hit = tr.find('span.tree-hit');
			return hit.length == 0;
		},
		select: function(jq, id){
			return jq.each(function(){
				select(this, id);
			});
		},
		unselect: function(jq, id){
			return jq.each(function(){
				unselect(this, id);
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
		collapse: function(jq, id){
			return jq.each(function(){
				collapse(this, id);
			});
		},
		expand: function(jq, id){
			return jq.each(function(){
				expand(this, id);
			});
		},
		toggle: function(jq, id){
			return jq.each(function(){
				toggle(this, id);
			});
		},
		collapseAll: function(jq, id){
			return jq.each(function(){
				collapseAll(this, id);
			});
		},
		expandAll: function(jq, id){
			return jq.each(function(){
				expandAll(this, id);
			});
		},
		expandTo: function(jq, id){
			return jq.each(function(){
				expandTo(this, id);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				append(this, param);
			});
		},
		remove: function(jq, id){
			return jq.each(function(){
				remove(this, id);
			});
		},
		refresh: function(jq, id){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				opts.view.refreshRow.call(opts.view, this, id);
			});
		},
		beginEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('beginEdit', id);
				$(this).treegrid('fixRowHeight', id);
			});
		},
		endEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('endEdit', id);
			});
		},
		cancelEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('cancelEdit', id);
			});
		}
	};
	
	$.fn.treegrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datagrid.parseOptions(target), {
			treeField:t.attr('treeField'),
			animate:(t.attr('animate') ? t.attr('animate') == 'true' : undefined)
		});
	};
	
	var defaultView = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			var view = this;
			var table = getTreeData(frozen, this.treeLevel, this.treeNodes);
			$(container).append(table.join(''));
			
			function getTreeData(frozen, depth, children){
				var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
				for(var i=0; i<children.length; i++){
					var row = children[i];
					if (row.state != 'open' && row.state != 'closed'){
						row.state = 'open';
					}
					
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					table.push('<tr node-id=' + row[opts.idField] + ' ' + style + '>');
					table = table.concat(view.renderRow.call(view, target, fields, frozen, depth, row));
					table.push('</tr>');
					
					if (row.children && row.children.length){
						var tt = getTreeData(frozen, depth+1, row.children);
						var v = row.state == 'closed' ? 'none' : 'block';
						
						table.push('<tr class="treegrid-tr-tree"><td style="border:0px" colspan=' + (fields.length + (opts.rownumbers?1:0)) + '><div style="display:' + v + '">');
						table = table.concat(tt);
						table.push('</div></td></tr>');
					}
				}
				table.push('</tbody></table>');
				return table;
			}
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var rows = $.data(target, 'treegrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = ['<table cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				row[opts.idField] = row[opts.idField] || ('foot-row-id'+i);
				
				table.push('<tr node-id=' + row[opts.idField] + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, 0, row));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, depth, row){
			var opts = $.data(target, 'treegrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">0</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					// get the cell style attribute
					var styleValue = col.styler ? (col.styler(row[field], row)||'') : '';
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
						if (row.checked){
							cc.push('<input type="checkbox" checked="checked"/>');
						} else {
							cc.push('<input type="checkbox"/>');
						}
					} else {
						var val = null;
						if (col.formatter){
							val = col.formatter(row[field], row);
						} else {
							val = row[field] || '&nbsp;';
						}
						if (field == opts.treeField){
							for(var j=0; j<depth; j++){
								cc.push('<span class="tree-indent"></span>');
							}
							if (row.state == 'closed'){
								cc.push('<span class="tree-hit tree-collapsed"></span>');
								cc.push('<span class="tree-icon tree-folder ' + (row.iconCls?row.iconCls:'') + '"></span>');
							} else {
								if (row.children && row.children.length){
									cc.push('<span class="tree-hit tree-expanded"></span>');
									cc.push('<span class="tree-icon tree-folder tree-folder-open ' + (row.iconCls?row.iconCls:'') + '"></span>');
								} else {
									cc.push('<span class="tree-indent"></span>');
									cc.push('<span class="tree-icon tree-file ' + (row.iconCls?row.iconCls:'') + '"></span>');
								}
							}
							cc.push('<span class="tree-title">' + val + '</span>');
						} else {
							cc.push(val);
						}
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, id){
			var row = $(target).treegrid('find', id);
			var opts = $.data(target, 'treegrid').options;
			var body = $(target).datagrid('getPanel').find('div.datagrid-body');
			
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
			var style = styleValue ? styleValue : '';
//			var style = styleValue ? 'style="' + styleValue + '"' : '';
			var tr = body.find('tr[node-id=' + id + ']');
			tr.attr('style', style);
			tr.children('td').each(function(){
				var cell = $(this).find('div.datagrid-cell');
				var field = $(this).attr('field');
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var styleValue = col.styler ? (col.styler(row[field], row)||'') : '';
					var style = col.hidden ? 'display:none;' + styleValue : (styleValue ? styleValue : '');
//					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					$(this).attr('style', style);
					
					var val = null;
					if (col.formatter){
						val = col.formatter(row[field], row);
					} else {
						val = row[field] || '&nbsp;';
					}
					if (field == opts.treeField){
						cell.children('span.tree-title').html(val);
						var cls = 'tree-icon';
						var icon = cell.children('span.tree-icon');
						if (icon.hasClass('tree-folder')) cls += ' tree-folder';
						if (icon.hasClass('tree-folder-open')) cls += ' tree-folder-open';
						if (icon.hasClass('tree-file')) cls += ' tree-file';
						if (row.iconCls) cls += ' ' + row.iconCls;
						icon.attr('class', cls);
					} else {
						cell.html(val);
					}
				}
			});
			$(target).treegrid('fixRowHeight', id);
		},
		
		onBeforeRender: function(target, parentId, data){
			if (!data) return false;
			var opts = $.data(target, 'treegrid').options;
			if (data.length == undefined){
				if (data.footer){
					$.data(target, 'treegrid').footer = data.footer;
				}
				if (data.total){
					$.data(target, 'treegrid').total = data.total;
				}
				data = this.transfer(target, parentId, data.rows);
			} else {
				function setParent(children, parentId){
					for(var i=0; i<children.length; i++){
						var row = children[i];
						row._parentId = parentId;
						if (row.children && row.children.length){
							setParent(row.children, row[opts.idField]);
						}
					}
				}
				setParent(data, parentId);
			}
			
			var node = find(target, parentId);
			if (node){
				if (node.children){
					node.children = node.children.concat(data);
				} else {
					node.children = data;
				}
			} else {
				$.data(target, 'treegrid').data = $.data(target, 'treegrid').data.concat(data);
			}
			if (!opts.remoteSort){
				this.sort(target, data);
			}
			
			this.treeNodes = data;
			this.treeLevel = $(target).treegrid('getLevel', parentId);
		},
		
		sort: function(target, data){
			var opts = $.data(target, 'treegrid').options;
			var opt = $(target).treegrid('getColumnOption', opts.sortName);
			if (opt){
				var sortFunc = opt.sorter || function(a,b){
					return (a>b?1:-1);
				};
				_sort(data);
			}
			function _sort(rows){
				rows.sort(function(r1,r2){
					return sortFunc(r1[opts.sortName], r2[opts.sortName])*(opts.sortOrder=='asc'?1:-1);
				});
				for(var i=0; i<rows.length; i++){
					var children = rows[i].children;
					if (children && children.length){
						_sort(children);
					}
				}
			}
		},
		
		transfer: function(target, parentId, data){
			var opts = $.data(target, 'treegrid').options;
			
			// clone the original data rows
			var rows = [];
			for(var i=0; i<data.length; i++){
				rows.push(data[i]);
			}
			
			var nodes = [];
			// get the top level nodes
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				if (!parentId){
					if (!row._parentId){
						nodes.push(row);
//						rows.remove(row);
						removeArrayItem(rows,row);
						i--;
					}
				} else {
					if (row._parentId == parentId){
						nodes.push(row);
//						rows.remove(row);
						removeArrayItem(rows,row);
						i--;
					}
				}
			}
			
			var toDo = [];
			for(var i=0; i<nodes.length; i++){
				toDo.push(nodes[i]);
			}
			while(toDo.length){
				var node = toDo.shift();	// the parent node
				// get the children nodes
				for(var i=0; i<rows.length; i++){
					var row = rows[i];
					if (row._parentId == node[opts.idField]){
						if (node.children){
							node.children.push(row);
						} else {
							node.children = [row];
						}
						toDo.push(row);
//						rows.remove(row);
						removeArrayItem(rows,row);
						i--;
					}
				}
			}
			return nodes;
		}
	});
	
	$.fn.treegrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		treeField:null,
		animate: false,
		singleSelect: true,
		view: defaultView,
		loadFilter: function(data, parentId){
			return data;
		},
		finder:{
			getTr:function(target, id, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var dc = $.data(target, 'datagrid').dc;	// data container
				if (serno == 0){
					var opts = $.data(target, 'treegrid').options;
					var tr1 = opts.finder.getTr(target, id, type, 1);
					var tr2 = opts.finder.getTr(target, id, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						return (serno==1?dc.body1:dc.body2).find('tr[node-id='+id+']');
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id='+id+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-selected');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('tr:last[node-id]');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('tr[node-id]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id]');
					}
				}
			},
			getRow:function(target, id){
				return $(target).treegrid('find', id);
			}
		},
		
		onBeforeLoad: function(row, param){},
		onLoadSuccess: function(row, data){},
		onLoadError: function(){},
		onBeforeCollapse: function(row){},
		onCollapse: function(row){},
		onBeforeExpand: function(row){},
		onExpand: function(row){},
		onClickRow: function(row){},
		onDblClickRow: function(row){},
		onContextMenu: function(e, row){},
		onBeforeEdit: function(row){},
		onAfterEdit: function(row, changes){},
		onCancelEdit: function(row){}
	});
})(jQuery);