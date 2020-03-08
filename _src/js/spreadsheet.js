var ob = ob || {};
ob.display = ob.display || {};

;(function (namespace, undefined) {

	namespace.spreadsheet = function() {
		var _data = null;
		var _element = null;
		var _width = null;
		var _on = {};
    var _columns = []

		var _get_value = function(d) {
			return d.value;
		}

    var _cell = function(d, i, elem) {
      elem.html(d.value);
    }

    var _column = function(d, i, elem) {
      elem.html(d.value);
    }

		return {

			width: function() {
				if (arguments.length == 0) {
					return _width;
				}
				_width = arguments[0];
				return this;
			},

			on: function(action, callback) {
				if (callback) {
					_on[action] = callback;
				}
				else if (action) {
					return _on[action];
				}
				return this;
			},

      columns: function() {
        if (arguments.length == 0) {
          return _columns;
        }
        _columns = arguments[0];
        return this;
      },

      column: function() {
        if (arguments.length == 0) {
          return _column;
        }
        _column = arguments[0];
        return this;
      },

      cell: function() {
        if (arguments.length == 0) {
          return _cell;
        }
        _cell = arguments[0];
        return this;
      },

			value: function() {
				if (arguments.length == 0) {
					return _get_value;
				}
				else {
					_get_value = arguments[0];
					return this;
				}
			},

			data: function() {
				if (arguments.length == 0) {
					return _data;
				}
				else {
					_data = arguments[0].slice();
					_data.sort(function (a, b) {
						return _get_value(b) - _get_value(a);
					});
				}
				return this;
			},

			element: function() {
				if (arguments.length == 0) {
					return _element;
				}
				else {
					_element = arguments[0];
				}
				return this;
			},


			display: function() {
				/* remove old stuff */
				_element.select("table").remove();
				var table = _element.append("table")
					.attr("class", "spreadsheet table")
					.attr("width", _width);
				var thead_tr = table.append("thead").append("tr");
				var tbody = table.append("tbody");
				_element.select("#more").remove();

        /* configure columns */
        for (var i = 0; i < _columns.length; i++) {
          _column(_columns[i], i, thead_tr.append("th"));
        }

				tbody.selectAll("tr").remove();
				var rows = tbody.selectAll("tr").data(_data);
				var row = rows.enter().append("tr")
					.on("click", function(d, i) {
						if (_on["click"]) {
							_on["click"](d,i);
						}
					});
        var cells = row.selectAll("td").data(function(d, i) {
          var new_data = [];
          for (var j = 0; j < _columns.length; j++) {
            new_data.push({'d': d, 'row': i});
          }
          return new_data;
        });

        var cell = cells.enter().append("td");
        cell.datum(function(d, i) {
          _cell(d.d, i, d.row, d3.select(this));
        });
        cells.exit().remove();



				return this;
			},
		};
	}
})(ob.display);
