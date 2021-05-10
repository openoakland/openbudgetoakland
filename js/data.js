var ob = ob || {};
ob.data = ob.data || {};

;(function (namespace, undefined) {
  namespace.findIndex = function(array, value, comparitor) {
    /* apparently this method will be part of the js array in future
       browser releases, but it is not supported right now */
    for (var idx = 0; idx < array.length; idx++) {
      if (comparitor(array[idx], value) == 0) {
        return idx;
      }
    }
    return -1;
  }

	namespace.hierarchy = function() {

		/* helper function for preparing data for visualization */
		function _prepare_recurse(node) {
			/* nodes need to have 'children' in order to work with calls to
			   d3.layout.partition
			 */

			/* hold sum of child values */
			var value = {
				income: 0.0,
				expense: 0.0,
				balance: 0.0
			};


			/* recurse through children of node */
			node.values.forEach(function(child) {
				child.depth = node.depth + 1;
				child.parent = node;
				/* 'values' either contains the budget amount for a node,
				   or it contains a list of sub nodes.  This code checks
				   whether 'values' is an array or a number.  If it is a
				   number it accumulates it, otherwise it continues to
				   process the children
				 */
				if (child.hasOwnProperty('values')) {
					if (isNaN(child.values)) {
						if (child.values instanceof Array) {
							/* for visualization code, need to set children variable */
							//child.children = child.values;
							var child_value = _prepare_recurse(child);
							value.income += child_value.income;
							value.expense += child_value.expense;
							value.balance += child_value.balance;
						}
					}
					else {
						/* parse integer of child values */
						child.income = 0.0;
						child.expense = 0.0;
						child.balance = 0.0;
						var total = parseFloat(child.values);
						/*child.value = parseFloat(child.values);*/
						if (total < 0.0) {
							child.income = -1.0 * total
							value.income += child.income;
						}
						else {
							child.expense = total;
							value.expense += child.expense;
						}
						/*
						if (child.value < 0.0) {
							child.income = -1.0 * child.value;
							value.income += child.income;
						}
						else {
							child.expense = child.value;
							value.expense += child.expense;
						}
						*/
						child.balance = child.expense - child.income;
						value.balance += child.balance;
						delete child.values;
					}
				}
			});

			/* assign the value for this node as the sum of the child values */
			node.balance = value.balance;
			node.value = node.balance;
			node.income = value.income;
			node.expense = value.expense;

			/* sort child values */
			node.values.sort(function(a, b) {
				return b.balance - a.balance;
			});

			/* return this nodes value */
			return value;
		}

		/* process the return to d3.nest so that it can be displayed */
		function _prepare(data) {
			var root = {
				key: 'Budget',
				depth: 0,
				values: data
			};
			_prepare_recurse(root);
			return root;
		}

		return {
			crunch: function(rows, order) {
				/* d3.nest takes the row data given by fusion tables and converts it into
				   hierarchical data needed for our visualization.  Accumulate
				   and nest data to depth determined by 'heirarchy'
				 */
				var amount_pos = order.length;
				var nest = d3.nest();
				d3.range(order.length)
					.forEach(function(i) {
						/* recursively apply hierarchy keys */
						nest = nest.key(function(d) { return d[i]; });
					});

				/* when rolling up child data into group, sum their values */
				nest = nest.rollup(function(d) {
					var sum = 0.0;
					d.forEach(function(x) {
						sum += parseFloat(x[amount_pos]);
					});
					return sum;
				}).entries(rows);


				/* prepare data for visualization */
				var root = _prepare(nest);
				//root.values = root.children;
				return root;
			},
			spelunk: function(root, keys, cmp) {
        if (arguments.length < 3) {
          cmp = function(v1, v2) { v1 == v2 ? 0 : 1; }
        }
				var node = root;
				/* make copy of keys */
				var p = keys.slice();
				while (p.length > 0) {
					var next_key = p.shift();
					var next_node = null;
					node.values.forEach(function(c) {
						if (cmp(c.key, next_key) == 0) {
							next_node = c
						}
					});
					if (!next_node) {
						return node;
					}
					node = next_node;
				}
				return node;
			},
			path: function(node) {
				var p = [];
				while (node) {
					p.unshift(node);
					node = node.parent;
				}
				return p;
			},
			apply: function(node, func) {
				var self = this;
				func(node);
				if (node.values) {
					node.values.forEach(function(x) {
						self.apply(x, func);
					});
				}
			}
		};
	}
})(ob.data);
