/**
 * $('#dg').JOGrid({
 *   createUrl:'',
 *   editUrl:'',
 *   destroyUrl:''
 * });
 */
(function($){
	function buildGrid(target, options){
		var opts = $.extend({}, {
			onDblClickRow:function(){
				$(target).JOGrid('edit');
			}
		}, options);
		$(target).datagrid(opts);
	}

	var methods = {
		create: function(jq){
			return jq.each(function(){
				// debugger;
				var opts = $(this).datagrid('options');
				$('#dlg-bill').dialog('open').dialog('refresh', opts.createUrl);
			});
		},
		edit: function(jq){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				var row = $(this).datagrid('getSelected');
				if (row){
					$('#dlg-bill').dialog('open').dialog('refresh', opts.editUrl+'?id='+row.id);
				} else {
					$.messager.alert('警告','请先选择单据后再打开!');
				}
			});
		},
		query: function(jq){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				var dg = $(this);
				showQueryDialog({
					title:opts.query.title,
					width:opts.query.width,
					height:opts.query.height,
					form:opts.query.form,
					callback:function(data){
						dg.datagrid('load', data);
						if (opts.query.callback){
							opts.query.callback();
						}
					}
				});
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var dg = $(this);
				var opts = dg.datagrid('options');
				// var row = dg.datagrid('getSelected');
				var rows = dg.datagrid('getSelections');
				if (rows){
					$.messager.confirm('警告','是否真的删除选中的记录？',function(r){
						if (r){
				        	var ps = "";
				        	$.each(rows,function(i,n){
				        		if(i==0)
				        			ps += "?id="+n.id;
				        		else
				        			ps += "&id="+n.id;
				        	});

				        	$.post(opts.destroyUrl + ps,function(data){
				        		if (result.success){
									dg.datagrid('reload');
									$.messager.alert('提示',data.msg,'info');
								} else {
									$.messager.alert('警告',result.msg);
								}
				        	});
						}
					});
				} else {
					$.messager.alert('警告','请先选择单据后再进行删除!');
				}
			});
		}
	};

	$.fn.JOGrid = function(options, param){
		if (typeof options == 'string'){
			var method = methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}

		options = options || {};
		return this.each(function(){
			buildGrid(this, options);
		});
	};
})(jQuery);