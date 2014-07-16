var ob = ob || {};
ob.display = ob.display || {};

;(function (namespace, undefined) {

	namespace.spreadsheet = function() {
		var _data = null;
		var _rows = 10;
		var _colors = null;
		var _element = null;
		var _width = null;
		var _on = {};
		var _format = {
			number: d3.format("$,d"),
			percent: d3.format(".2%")
		};

		var _get_value = function(d) {
			return d.value;
		}

		return {
			rows: function() {
				if (arguments.length == 0) {
					return _rows;
				}
				_rows = arguments[0];
				return this;
			},

			width: function() {
				if (arguments.length == 0) {
					return _width;
				}
				_width = arguments[0];
				return this;
			},

			colors: function() {
				if (arguments.length == 0) {
					return _colors;
				}
				else {
					_colors = arguments[0];
					return this;
				}
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

			format: function() {
				if (arguments.length == 1) {
					return _format[arguments[0]];
				}
				else if (arguments.length == 2) {
					_format[arguments[0]] = arguments[1];
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
				thead_tr.append("th");
				/* TODO: make these rows configurable */
				thead_tr.append("th").attr("class", "item").html("Item");
				thead_tr.append("th").attr("class", "money").html("Income");
				thead_tr.append("th").attr("class", "money").html("Expense");
				thead_tr.append("th").attr("class", "money").html("Balance");

				tbody.selectAll("tr").remove();
				var rows = tbody.selectAll("tr").data(_data);
				var row = rows.enter().append("tr")
					.on("click", function(d, i) {
						if (_on["click"]) {
							_on["click"](d,i);
						}
					})
				row.style("visibility", function(d, i) {
						return i > _rows ? "hidden" : "visible";
					})
					.style("display", function(d, i) {
							return i > _rows ? "none" : "table-row";
					});
				row.append("td")
					.append("div")
					.attr("class", "square")
					.style("background-color", function(d, i) {
						return _colors(i);
					})
				row.append("td")
					.attr("class", "item")
					.html(function(d, i) {
							return d.key;
					})
					.append("div")
					.style("color", function(d, i) { return _colors(i); });
				row.append("td")
					.attr("class", "money")
					.html(function(d) { return _format.number(d.income); });
				row.append("td")
					.attr("class", "money")
					.html(function(d) { return _format.number(d.expense); });
				row.append("td")
					.attr("class", "money")
					.html(function(d) { return _format.number(d.balance); });
				rows.exit().remove();
				if (_data.length > _rows) {
					_element.append("button")
						.attr("class", "btn btn-default")
						.attr("id", "more")
						.text("Show more")
						.on("click", function() {
							row.style("visibility", "visible")
								.style("display", "table-row");
							_element.select("#more").remove();

						});
				}

				return this;
			},
		};
	}
})(ob.display);
