/**
 * tree - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 * 	 draggable
 *   droppable
 *   
 * Node is a javascript object which contains following properties:
 * 1 id: An identity value bind to the node.
 * 2 text: Text to be showed.
 * 3 checked: Indicate whether the node is checked selected.
 * 3 attributes: Custom attributes bind to the node.
 * 4 target: Target DOM object.
 */
(function($){
	/**
	 * wrap the <ul> tag as a tree and then return it.
	 */
	function wrapTree(target){
		var tree = $(target);
		tree.addClass('tree');
		return tree;
	}
	
	function parseTreeData(target){
		var data = [];
		
		getData(data, $(target));
		
		function getData(aa, tree){
			tree.children('li').each(function(){
				var node = $(this);
				var item = {};
				item.text = node.children('span').html();
				if (!item.text){
					item.text = node.html();
				}
				item.id = node.attr('id');
				item.iconCls = node.attr('iconCls') || node.attr('icon');
				item.checked = node.attr('checked') == 'true';
				item.state = node.attr('state') || 'open';
				
				var subTree = node.children('ul');
				if (subTree.length){
					item.children = [];
					getData(item.children, subTree);
				}
				aa.push(item);
			});
		}
		return data;
	}
	
	function bindTreeEvents(target){
		var opts = $.data(target, 'tree').options;
		var tree = $.data(target, 'tree').tree;
		
		$('div.tree-node', tree).unbind('.tree').bind('dblclick.tree', function(){
			selectNode(target, this);
			opts.onDblClick.call(target, getSelectedNode(target));
		}).bind('click.tree', function(){
			selectNode(target, this);
			opts.onClick.call(target, getSelectedNode(target));
		}).bind('mouseenter.tree', function(){
			$(this).addClass('tree-node-hover');
			return false;
		}).bind('mouseleave.tree', function(){
			$(this).removeClass('tree-node-hover');
			return false;
		}).bind('contextmenu.tree', function(e){
			opts.onContextMenu.call(target, e, getNode(target, this));
		});
		
		$('span.tree-hit', tree).unbind('.tree').bind('click.tree', function(){
			var node = $(this).parent();
			toggleNode(target, node[0]);
			return false;
		}).bind('mouseenter.tree', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).addClass('tree-expanded-hover');
			} else {
				$(this).addClass('tree-collapsed-hover');
			}
		}).bind('mouseleave.tree', function(){
			if ($(this).hasClass('tree-expanded')){
				$(this).removeClass('tree-expanded-hover');
			} else {
				$(this).removeClass('tree-collapsed-hover');
			}
		}).bind('mousedown.tree', function(){
			return false;
		});
		
		$('span.tree-checkbox', tree).unbind('.tree').bind('click.tree', function(){
			var node = $(this).parent();
			checkNode(target, node[0], !$(this).hasClass('tree-checkbox1'));
			return false;
		}).bind('mousedown.tree', function(){
			return false;
		});
	}
	
	function disableDnd(target){
		var nodes = $(target).find('div.tree-node');
		nodes.draggable('disable');
		nodes.css('cursor', 'pointer');
	}
	
	function enableDnd(target){
		var opts = $.data(target, 'tree').options;
		var tree = $.data(target, 'tree').tree;
		
		tree.find('div.tree-node').draggable({
			disabled: false,
			revert: true,
			cursor: 'pointer',
			proxy: function(source){
				var p = $('<div class="tree-node-proxy tree-dnd-no"></div>').appendTo('body');
				p.html($(source).find('.tree-title').html());
				p.hide();
				return p;
			},
			deltaX: 15,
			deltaY: 15,
			onBeforeDrag: function(e){
				if (e.which != 1) return false;
				$(this).next('ul').find('div.tree-node').droppable({accept:'no-accept'});	// the child node can't be dropped
			},
			onStartDrag: function(){
				$(this).draggable('proxy').css({
					left:-10000,
					top:-10000
				});
			},
			onDrag: function(e){
				var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
				var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				if (d>3){	// when drag a little distance, show the proxy object
					$(this).draggable('proxy').show();
				}
				this.pageY = e.pageY;
			},
			onStopDrag: function(){
				$(this).next('ul').find('div.tree-node').droppable({accept:'div.tree-node'}); // restore the accept property of child nodes
			}
		}).droppable({
			accept:'div.tree-node',
			onDragOver: function(e, source){
				var pageY = source.pageY;
				var top = $(this).offset().top;
				var bottom = top + $(this).outerHeight();
				
				$(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
				if (pageY > top + (bottom - top) / 2){
					if (bottom - pageY < 5){
						$(this).addClass('tree-node-bottom');
					} else {
						$(this).addClass('tree-node-append');
					}
				} else {
					if (pageY - top < 5){
						$(this).addClass('tree-node-top');
					} else {
						$(this).addClass('tree-node-append');
					}
				}
			},
			onDragLeave: function(e, source){
				$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
			},
			onDrop: function(e, source){
				var dest = this;
				var action, point;
				if ($(this).hasClass('tree-node-append')){
					action = append;
				} else {
					action = insert;
					point = $(this).hasClass('tree-node-top') ? 'top' : 'bottom';
				}
				
				setTimeout(function(){
					action(source, dest, point);
				}, 0);
				
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
			}
		});
		
		function append(source, dest){
			if (getNode(target, dest).state == 'closed'){
				expandNode(target, dest, function(){
					doAppend();
				});
			} else {
				doAppend();
			}
			
			function doAppend(){
				var node = $(target).tree('pop', source);
				$(target).tree('append', {
					parent: dest,
					data: [node]
				});
				opts.onDrop.call(target, dest, node, 'append');
			}
		}
		
		function insert(source, dest, point){
			var param = {};
			if (point == 'top'){
				param.before = dest;
			} else {
				param.after = dest;
			}
			
			var node = $(target).tree('pop', source);
			param.data = node;
			$(target).tree('insert', param);
			opts.onDrop.call(target, dest, node, point);
		}
	}
	
	function checkNode(target, nodeEl, checked){
		var opts = $.data(target, 'tree').options;
		if (!opts.checkbox) return;
		var node = $(nodeEl);
		var ck = node.find('.tree-checkbox');
		ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
		if (checked){
			ck.addClass('tree-checkbox1');
		} else {
			ck.addClass('tree-checkbox0');
		}
		if (opts.cascadeCheck){
			setParentCheckbox(node);
			setChildCheckbox(node);
		}
		
		var nodedata = getNode(target, nodeEl);
		opts.onCheck.call(target, nodedata, checked);
		
		function setChildCheckbox(node){
			var childck = node.next().find('.tree-checkbox');
			childck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
			if (node.find('.tree-checkbox').hasClass('tree-checkbox1')){
				childck.addClass('tree-checkbox1');
			} else {
				childck.addClass('tree-checkbox0');
			}
		}
		
		function setParentCheckbox(node){
			var pnode = getParentNode(target, node[0]);
			if (pnode){
				var ck = $(pnode.target).find('.tree-checkbox');
				ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
				if (isAllSelected(node)){
					ck.addClass('tree-checkbox1');
				} else if (isAllNull(node)){
					ck.addClass('tree-checkbox0');
				} else {
					ck.addClass('tree-checkbox2');
				}
				setParentCheckbox($(pnode.target));
			}
			
			function isAllSelected(n){
				var ck = n.find('.tree-checkbox');
				if (ck.hasClass('tree-checkbox0') || ck.hasClass('tree-checkbox2')) return false;
				var b = true;
				n.parent().siblings().each(function(){
					if (!$(this).children('div.tree-node').children('.tree-checkbox').hasClass('tree-checkbox1')){
						b = false;
					}
				});
				return b;
			}
			function isAllNull(n){
				var ck = n.find('.tree-checkbox');
				if (ck.hasClass('tree-checkbox1') || ck.hasClass('tree-checkbox2')) return false;
				var b = true;
				n.parent().siblings().each(function(){
					if (!$(this).children('div.tree-node').children('.tree-checkbox').hasClass('tree-checkbox0')){
						b = false;
					}
				});
				return b;
			}
		}
	}
	
	/**
	 * when append or remove node, adjust its parent node check status.
	 */
	function adjustCheck(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = $(nodeEl);
		if (isLeaf(target, nodeEl)){
			var ck = node.find('.tree-checkbox');
			if (ck.length){
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else {
					checkNode(target, nodeEl, false);
				}
			} else if (opts.onlyLeafCheck){
				$('<span class="tree-checkbox tree-checkbox0"></span>').insertBefore(node.find('.tree-title'));
				bindTreeEvents(target);
			}
		} else {
			var ck = node.find('.tree-checkbox');
			if (opts.onlyLeafCheck){
				ck.remove();
			} else {
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else if (ck.hasClass('tree-checkbox2')){
					var allchecked = true;
					var allunchecked = true;
					var children = getChildren(target, nodeEl);
					for(var i=0; i<children.length; i++){
						if (children[i].checked){
							allunchecked = false;
						} else {
							allchecked = false;
						}
					}
					if (allchecked){
						checkNode(target, nodeEl, true);
					}
					if (allunchecked){
						checkNode(target, nodeEl, false);
					}
				}
			}
		}
	}
	
	/**
	 * load tree data to <ul> tag
	 * ul: the <ul> dom element
	 * data: array, the tree node data
	 * append: defines if to append data
	 */
	function loadData(target, ul, data, append){
		var opts = $.data(target, 'tree').options;
		
		if (!append){
			$(ul).empty();
		}
		
		var checkedNodes = [];
		var depth = $(ul).prev('div.tree-node').find('span.tree-indent, span.tree-hit').length;
		appendNodes(ul, data, depth);
		bindTreeEvents(target);
		if (opts.dnd){
			enableDnd(target);
		} else {
			disableDnd(target);
		}
//		makeDnD(target);
		
		for(var i=0; i<checkedNodes.length; i++){
			checkNode(target, checkedNodes[i], true);
		}
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}
		opts.onLoadSuccess.call(target, nodedata, data);
		
		function appendNodes(ul, children, depth){
			for(var i=0; i<children.length; i++){
				var li = $('<li></li>').appendTo(ul);
				var item = children[i];
				
				// the node state has only 'open' or 'closed' attribute
				if (item.state != 'open' && item.state != 'closed'){
					item.state = 'open';
				}
				
				var node = $('<div class="tree-node"></div>').appendTo(li);
				node.attr('node-id', item.id);
				
				// store node attributes
				$.data(node[0], 'tree-node', {
					id: item.id,
					text: item.text,
					iconCls: item.iconCls,
					attributes: item.attributes
				});
				
				$('<span class="tree-title"></span>').html(item.text).appendTo(node);
				
				if (opts.checkbox){
					if (opts.onlyLeafCheck){
						if (item.state == 'open' && (!item.children || !item.children.length)){
							if (item.checked){
								$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
							} else {
								$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
							}
						}
					} else {
						if (item.checked){
							$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
							checkedNodes.push(node[0]);
						} else {
							$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
						}
					}
				}
				
				if (item.children && item.children.length){
					var subul = $('<ul></ul>').appendTo(li);
					if (item.state == 'open'){
						$('<span class="tree-icon tree-folder tree-folder-open"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-expanded"></span>').prependTo(node);
					} else {
						$('<span class="tree-icon tree-folder"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
						subul.css('display','none');
					}
					appendNodes(subul, item.children, depth+1);
				} else {
					if (item.state == 'closed'){
						$('<span class="tree-icon tree-folder"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
					} else {
						$('<span class="tree-icon tree-file"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-indent"></span>').prependTo(node);
					}
				}
				for(var j=0; j<depth; j++){
					$('<span class="tree-indent"></span>').prependTo(node);
				}
			}
		}
	}
	
	/**
	 * request remote data and then load nodes in the <ul> tag.
	 * ul: the <ul> dom element
	 * param: request parameter
	 */
	function request(target, ul, param, callback){
		var opts = $.data(target, 'tree').options;
		
		param = param || {};
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}

		if (opts.onBeforeLoad.call(target, nodedata, param) == false) return;
		if (!opts.url) return;
		
		var folder = $(ul).prev().children('span.tree-folder');
		folder.addClass('tree-loading');
		$.ajax({
			type: opts.method,
			url: opts.url,
			data: param,
			dataType: 'json',
			success: function(data){
				folder.removeClass('tree-loading');
				loadData(target, ul, data);
				if (callback){
					callback();
				}
			},
			error: function(){
				folder.removeClass('tree-loading');
				opts.onLoadError.apply(target, arguments);
				if (callback){
					callback();
				}
			}
		});
	}
	
	function expandNode(target, nodeEl, callback){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeExpand.call(target, node) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (ul.length){
			if (opts.animate){
				ul.slideDown('normal', function(){
					opts.onExpand.call(target, node);
					if (callback) callback();
				});
			} else {
				ul.css('display','block');
				opts.onExpand.call(target, node);
				if (callback) callback();
			}
		} else {
			var subul = $('<ul style="display:none"></ul>').insertAfter(nodeEl);
			// request children nodes data
			request(target, subul[0], {id:node.id}, function(){
				if (opts.animate){
					subul.slideDown('normal', function(){
						opts.onExpand.call(target, node);
						if (callback) callback();
					});
				} else {
					subul.css('display','block');
					opts.onExpand.call(target, node);
					if (callback) callback();
				}
			});
		}
	}
	
	function collapseNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeCollapse.call(target, node) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (opts.animate){
			ul.slideUp('normal', function(){
				opts.onCollapse.call(target, node);
			});
		} else {
			ul.css('display','none');
			opts.onCollapse.call(target, node);
		}
	}
	
	function toggleNode(target, nodeEl){
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		
		if (hit.hasClass('tree-expanded')){
			collapseNode(target, nodeEl);
		} else {
			expandNode(target, nodeEl);
		}
	}
	
	function expandAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function expandToNode(target, nodeEl){
		var nodes = [];
		var p = getParentNode(target, nodeEl);
		while(p){
			nodes.unshift(p);
			p = getParentNode(target, p.target);
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function collapseAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			collapseNode(target, nodes[i].target);
		}
	}
	
	/**
	 * get the first root node, if no root node exists, return null.
	 */
	function getRootNode(target){
		var roots = getRootNodes(target);
		if (roots.length){
			return roots[0];
		} else {
			return null;
		}
	}
	
	/**
	 * get the root nodes.
	 */
	function getRootNodes(target){
		var roots = [];
		$(target).children('li').each(function(){
			var node = $(this).children('div.tree-node');
			roots.push(getNode(target, node[0]));
		});
		return roots;
	}
	
	/**
	 * get all child nodes corresponding to specified node
	 * nodeEl: the node DOM element
	 */
	function getChildren(target, nodeEl){
		var nodes = [];
		if (nodeEl){
			getNodes($(nodeEl));
		} else {
			var roots = getRootNodes(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes($(roots[i].target));
			}
		}
		function getNodes(node){
			node.next().find('div.tree-node').each(function(){
				nodes.push(getNode(target, this));
			});
		}
		return nodes;
	}
	
	/**
	 * get the parent node
	 * nodeEl: DOM object, from which to search it's parent node 
	 */
	function getParentNode(target, nodeEl){
		var ul = $(nodeEl).parent().parent();
		if (ul[0] == target){
			return null;
		} else {
			return getNode(target, ul.prev()[0]);
		}
	}
	
	function getCheckedNode(target){
		var nodes = [];
		$(target).find('.tree-checkbox1').each(function(){
			var node = $(this).parent();
			nodes.push(getNode(target, node[0]));
		});
		return nodes;
	}
	
	/**
	 * Get the selected node data which contains following properties: id,text,attributes,target
	 */
	function getSelectedNode(target){
		var node = $(target).find('div.tree-node-selected');
		if (node.length){
			return getNode(target, node[0]);
		} else {
			return null;
		}
	}
	
	/**
	 * Append nodes to tree.
	 * The param parameter has two properties:
	 * 1 parent: DOM object, the parent node to append to.
	 * 2 data: array, the nodes data.
	 */
	function appendNodes(target, param){
		var node = $(param.parent);
		
		var ul;
		if (node.length == 0){
			ul = $(target);
		} else {
			ul = node.next();
			if (ul.length == 0){
				ul = $('<ul></ul>').insertAfter(node);
			}
		}
		
		// ensure the node is a folder node
		if (param.data && param.data.length){
			var nodeIcon = node.find('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		
		loadData(target, ul[0], param.data, true);
		
		adjustCheck(target, ul.prev());
	}
	
	/**
	 * insert node to before or after specified node
	 * param has the following properties:
	 * before: DOM object, the node to insert before
	 * after: DOM object, the node to insert after
	 * data: object, the node data 
	 */
	function insertNode(target, param){
		var ref = param.before || param.after;
		var pnode = getParentNode(target, ref);
		var li;
		if (pnode){
			appendNodes(target, {
				parent: pnode.target,
				data: [param.data]
			});
			li = $(pnode.target).next().children('li:last');
		} else {
			appendNodes(target, {
				parent: null,
				data: [param.data]
			});
			li = $(target).children('li:last');
		}
		if (param.before){
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	
	/**
	 * Remove node from tree. 
	 * param: DOM object, indicate the node to be removed.
	 */
	function removeNode(target, nodeEl){
		var parent = getParentNode(target, nodeEl);
		var node = $(nodeEl);
		var li = node.parent();
		var ul = li.parent();
		li.remove();
		if (ul.children('li').length == 0){
			var node = ul.prev();
			
			node.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
			node.find('.tree-hit').remove();
			$('<span class="tree-indent"></span>').prependTo(node);
			if (ul[0] != target){
				ul.remove();
			}
		}
		if (parent){
			adjustCheck(target, parent.target);
		}
	}
	
	/**
	 * get specified node data, include its children data
	 */
	function getData(target, nodeEl){
		/**
		 * retrieve all children data which is stored in specified array
		 */
		function retrieveChildData(aa, ul){
			ul.children('li').each(function(){
				var node = $(this).children('div.tree-node');
				var nodedata = getNode(target, node[0]);
				var sub = $(this).children('ul');
				if (sub.length){
					nodedata.children = [];
					getData(nodedata.children, sub);
				}
				aa.push(nodedata);
			});
		}
		
		if (nodeEl){
			var nodedata = getNode(target, nodeEl);
			nodedata.children = [];
			retrieveChildData(nodedata.children, $(nodeEl).next());
			return nodedata;
		} else {
			return null;
		}
	}
	
	function updateNode(target, param){
		var node = $(param.target);
		var data = $.data(param.target, 'tree-node');
		
		if (data.iconCls){
			node.find('.tree-icon').removeClass(data.iconCls);
		}
		$.extend(data, param);
		$.data(param.target, 'tree-node', data);
		
		node.attr('node-id', data.id);
		node.find('.tree-title').html(data.text);
		if (data.iconCls){
			node.find('.tree-icon').addClass(data.iconCls);
		}
		var ck = node.find('.tree-checkbox');
		ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
		if (data.checked){
//			ck.addClass('tree-checkbox1');
			checkNode(target, param.target, true);
		} else {
//			ck.addClass('tree-checkbox0');
			checkNode(target, param.target, false);
		}
	}
	
	/**
	 * get the specified node
	 */
	function getNode(target, nodeEl){
		var node = $.extend({}, $.data(nodeEl, 'tree-node'), {
			target: nodeEl,
			checked: $(nodeEl).find('.tree-checkbox').hasClass('tree-checkbox1')
		});
		if (!isLeaf(target, nodeEl)){
			node.state = $(nodeEl).find('.tree-hit').hasClass('tree-expanded') ? 'open' : 'closed';
		}
		return node;
	}
	
	function findNode(target, id){
		var node = $(target).find('div.tree-node[node-id=' + id + ']');
		if (node.length){
			return getNode(target, node[0]);
		} else {
			return null;
		}
	}
	
	/**
	 * select the specified node.
	 * nodeEl: DOM object, indicate the node to be selected.
	 */
	function selectNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeSelect.call(target, node) == false) return;
		
		$('div.tree-node-selected', target).removeClass('tree-node-selected');
		$(nodeEl).addClass('tree-node-selected');
		opts.onSelect.call(target, node);
	}
	
	/**
	 * Check if the specified node is leaf.
	 * nodeEl: DOM object, indicate the node to be checked.
	 */
	function isLeaf(target, nodeEl){
		var node = $(nodeEl);
		var hit = node.children('span.tree-hit');
		return hit.length == 0;
	}
	
	function beginEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeEdit.call(target, node) == false) return;
		
		$(nodeEl).css('position', 'relative');
		var nt = $(nodeEl).find('.tree-title');
		var width = nt.outerWidth();
		nt.empty();
		var editor = $('<input class="tree-editor">').appendTo(nt);
		editor.val(node.text).focus();
		editor.width(width + 20);
		editor.height(document.compatMode=='CSS1Compat' ? (18-(editor.outerHeight()-editor.height())) : 18);
		editor.bind('click', function(e){
			return false;
		}).bind('mousedown', function(e){
			e.stopPropagation();
		}).bind('mousemove', function(e){
			e.stopPropagation();
		}).bind('keydown', function(e){
			if (e.keyCode == 13){	// enter
				endEdit(target, nodeEl);
				return false;
			} else if (e.keyCode == 27){	// esc
				cancelEdit(target, nodeEl);
				return false;
			}
		}).bind('blur', function(e){
			e.stopPropagation();
			endEdit(target, nodeEl);
		});
	}
	
	function endEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		var editor = $(nodeEl).find('input.tree-editor');
		var val = editor.val();
		editor.remove();
		var node = getNode(target, nodeEl);
		node.text = val;
		updateNode(target, node);
		opts.onAfterEdit.call(target, node);
	}
	
	function cancelEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		$(nodeEl).find('input.tree-editor').remove();
		var node = getNode(target, nodeEl);
		updateNode(target, node);
		opts.onCancelEdit.call(target, node);
	}
	
	$.fn.tree = function(options, param){
		if (typeof options == 'string'){
			return $.fn.tree.methods[options](this, param);
		}
		
		var options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tree');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.fn.tree.defaults, $.fn.tree.parseOptions(this), options);
				$.data(this, 'tree', {
					options: opts,
					tree: wrapTree(this)
				});
				var data = parseTreeData(this);
				if (data.length && !opts.data){
					opts.data = data
				}
//				loadData(this, this, data);
			}
			
			if (opts.data){
				loadData(this, this, opts.data);
			} else {
				if (opts.dnd){
					enableDnd(this);
				} else {
					disableDnd(this);
				}
			}
			if (opts.url){
				request(this, this);
			}
		});
	};
	
	$.fn.tree.methods = {
		options: function(jq){
			return $.data(jq[0], 'tree').options;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, this, data);
			});
		},
		getNode: function(jq, nodeEl){	// get the single node
			return getNode(jq[0], nodeEl);
		},
		getData: function(jq, nodeEl){	// get the specified node data, include its children
			return getData(jq[0], nodeEl);
		},
		reload: function(jq, nodeEl){
			return jq.each(function(){
				if (nodeEl){
					var node = $(nodeEl);
					var hit = node.children('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					node.next().remove();
					expandNode(this, nodeEl);
				} else {
					$(this).empty();
					request(this, this);
				}
			});
		},
		getRoot: function(jq){
			return getRootNode(jq[0]);
		},
		getRoots: function(jq){
			return getRootNodes(jq[0]);
		},
		getParent: function(jq, nodeEl){
			return getParentNode(jq[0], nodeEl);
		},
		getChildren: function(jq, nodeEl){
			return getChildren(jq[0], nodeEl);
		},
		getChecked: function(jq){
			return getCheckedNode(jq[0]);
		},
		getSelected: function(jq){
			return getSelectedNode(jq[0]);
		},
		isLeaf: function(jq, nodeEl){
			return isLeaf(jq[0], nodeEl);
		},
		find: function(jq, id){
			return findNode(jq[0], id);
		},
		select: function(jq, nodeEl){
			return jq.each(function(){
				selectNode(this, nodeEl);
			});
		},
		check: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, true);
			});
		},
		uncheck: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, false);
			});
		},
		collapse: function(jq, nodeEl){
			return jq.each(function(){
				collapseNode(this, nodeEl);
			});
		},
		expand: function(jq, nodeEl){
			return jq.each(function(){
				expandNode(this, nodeEl);
			});
		},
		collapseAll: function(jq, nodeEl){
			return jq.each(function(){
				collapseAllNode(this, nodeEl);
			});
		},
		expandAll: function(jq, nodeEl){
			return jq.each(function(){
				expandAllNode(this, nodeEl);
			});
		},
		expandTo: function(jq, nodeEl){
			return jq.each(function(){
				expandToNode(this, nodeEl);
			});
		},
		toggle: function(jq, nodeEl){
			return jq.each(function(){
				toggleNode(this, nodeEl);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				appendNodes(this, param);
			});
		},
		insert: function(jq, param){
			return jq.each(function(){
				insertNode(this, param);
			});
		},
		remove: function(jq, nodeEl){
			return jq.each(function(){
				removeNode(this, nodeEl);
			});
		},
		pop: function(jq, nodeEl){
			var node = jq.tree('getData', nodeEl);
			jq.tree('remove', nodeEl);
			return node;
		},
		update: function(jq, param){
			return jq.each(function(){
				updateNode(this, param);
			});
		},
		enableDnd: function(jq){
			return jq.each(function(){
				enableDnd(this);
			});
		},
		disableDnd: function(jq){
			return jq.each(function(){
				disableDnd(this);
			});
		},
		beginEdit: function(jq, nodeEl){
			return jq.each(function(){
				beginEdit(this, nodeEl);
			});
		},
		endEdit: function(jq, nodeEl){
			return jq.each(function(){
				endEdit(this, nodeEl);
			});
		},
		cancelEdit: function(jq, nodeEl){
			return jq.each(function(){
				cancelEdit(this, nodeEl);
			});
		}
	};
	
	$.fn.tree.parseOptions = function(target){
		var t = $(target);
		return {
			url:t.attr('url'),
			method:(t.attr('method') ? t.attr('method') : undefined),
			checkbox:(t.attr('checkbox') ? t.attr('checkbox') == 'true' : undefined),
			cascadeCheck:(t.attr('cascadeCheck') ? t.attr('cascadeCheck') == 'true' : undefined),
			onlyLeafCheck:(t.attr('onlyLeafCheck') ? t.attr('onlyLeafCheck') == 'true' : undefined),
			animate:(t.attr('animate') ? t.attr('animate') == 'true' : undefined),
			dnd:(t.attr('dnd') ? t.attr('dnd') == 'true' : undefined)
		};
	};
	
	$.fn.tree.defaults = {
		url: null,
		method: 'post',
		animate: false,
		checkbox: false,
		cascadeCheck: true,
		onlyLeafCheck: false,
		dnd: false,
		data: null,
		
		onBeforeLoad: function(node, param){},
		onLoadSuccess: function(node, data){},
		onLoadError: function(){},
		onClick: function(node){},	// node: id,text,checked,attributes,target
		onDblClick: function(node){},	// node: id,text,checked,attributes,target
		onBeforeExpand: function(node){},
		onExpand: function(node){},
		onBeforeCollapse: function(node){},
		onCollapse: function(node){},
		onCheck: function(node, checked){},
		onBeforeSelect: function(node){},
		onSelect: function(node){},
		onContextMenu: function(e, node){},
		onDrop: function(target, source, point){},	// point:'append','top','bottom'
		onBeforeEdit: function(node){},
		onAfterEdit: function(node){},
		onCancelEdit: function(node){}
	};
})(jQuery);
