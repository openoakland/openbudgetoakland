
var ob = ob || {};
ob.display = ob.display || {};

;(function (namespace, undefined) {
	namespace.tooltip = function() {

		var _html = null;
		var _tooltip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.attr("id", "tooltip")
			.text("a simple tooltip");
		var _offset = {top: -10, left:10};

		return {
			html: function() {
				if (arguments.length == 0) {
					return _html;
				}
				else {
					_html = arguments[0];
				}
				return this;
			},

			show: function() {
				_tooltip.style("visibility", "visible");
				if (_html) {
					_tooltip.html(_html.apply(this, arguments));
				}
				return this;
			},
			track: function() {
				_tooltip.style("top", (event.pageY + _offset.top)+"px")
					.style("left",(event.pageX + _offset.left)+"px");
		    },
			hide: function() {
				_tooltip.style("visibility", "hidden");
				return this;
			},
		};
	}
})(ob.display);

