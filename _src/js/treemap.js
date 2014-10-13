var ob = ob || {};
ob.display = ob.display || {};

;(function (namespace, undefined) {
	namespace.treemap = function() {

		var _data = null;
		var _root = null;

		/* display elements */
		var _svg = null;
		var _g = null;
		var _colors = null;
		var _current_display = null;

		/* layout settings */
		var _margin = {top: 0, right: 0, bottom: 0, left: 0};
		var _width = 800;
		var _height = 500;
		var _min_area_for_text = 0.0125;
		var _max_rects = 40;
		var _transitioning = false;

		var _treemap = null;

		/* interactions */
		var _on_handlers = {};

		function _inner_height() {
			return _height - _margin.top - _margin.bottom;
		}

		function _inner_width() {
			return _width - _margin.left - _margin.right;
		}

		/* data settings */
		var _get_value = function(d) {
			return d.value;
		}

		var _rect_text = function(d, i) {
			return '' + _get_value(d.value);
		}

		function _path(d) {
			var p = [];
			while (d.parent) {
				p.push(d);
				d = d.parent;
			}
			p.reverse();
			return p;
		};

		/* display helper functions */
		function _initialize(root) {
			root.x = root.y = 0;
			root.dx = 1.0;
			root.dy = 1.0;
			root.depth = 0;
		}

		function _create_display(d) {
			var x = d3.scale.linear()
				.domain([0.0, 1.0])
				.range([0, _inner_width()]);

			var y = d3.scale.linear()
				.domain([0.0, 1.0])
				.range([0, _inner_height()]);


			return {
				d: d,
				x: x,
				y: y,

				text: function(text) {
					text.attr("x", function(d) { return x(d.x) + 6; })
						.attr("y", function(d) { return y(d.y) + 6; });
				},

				rect: function(rect) {
					rect.attr("x", function(d) { return x(d.x); })
						.attr("y", function(d) { return y(d.y); })
						.attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
						.attr("height", function(d) { return y(d.y + d.dy) - y(d.y) });
				},

				foreign:  function(foreign) {
					foreign.attr("x", function(d) { return x(d.x); })
						.attr("y", function(d) { return y(d.y); })
						.attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
						.attr("height", function(d) { return y(d.y + d.dy) - y(d.y) });
				}
			};
		}

		/* display show the treemap and writes the embedded transition function */
		function _display(d) {
      var displayed_data = d;
			if (_on_handlers["display"]) {
				_on_handlers["display"](d);
			}
			var disp = _create_display(d);

			disp.g = _svg.insert("g", ".grandparent")
				.datum(d)
				.attr("class", "depth");

			/* add in data */
			_g = disp.g.selectAll("g")
				.data(d.children)
				.enter().append("g")
				.on("click", function (d, i) { disp.transition(d, i, true);} )
				.attr("class", "groups");

			/* transition on child click */
			_g.filter(function(d) { return d.children; })
				.classed("children", true)
				.on("click", function (d, i) { disp.transition(d, i, true); });

			/* write parent rectangle */
			_g.append("rect")
				.attr("class", "parent")
				.style("fill", function(d, i) { return _colors(i);})
				.call(disp.rect)
				.on("mouseover", function(d, i) {
					d3.select(this).style("fill", d3.rgb(_colors(i)).darker());
					if (_on_handlers["mouseover"]) {
						_on_handlers["mouseover"](d, i);
					}
				})
				.on("mousemove", function(d, i){
					if (_on_handlers["mousemove"]) {
						_on_handlers["mousemove"](d, i);
					}
				})
				.on("mouseout", function(d, i) {
					d3.select(this).style("fill", _colors(i));
					if (_on_handlers["mouseout"]) {
						_on_handlers["mouseout"](d, i);
					}
				});

			/* Adding a foreign object instead of a text object, allows for text wrapping */
			var fo = _g.append("foreignObject")
				.call(disp.rect)
				.attr("class","foreignobj")
				.append("xhtml:div")
				.attr("class", "textdiv")
				.on("mouseover", function(d, i) {
					d3.select(this.parentNode.parentNode)
						.select("rect")
						.style("fill", d3.rgb(_colors(i))
						.darker());
					if (_on_handlers["mouseover"]) {
						_on_handlers["mouseover"](d, i);
					}
				})
				.on("mousemove", function(d, i) {
					if (_on_handlers["mousemove"]) {
						_on_handlers["mousemove"](d, i);
					}
				})
				.on("mouseout", function(d, i) {
					d3.select(this.parentNode.parentNode)
						.select("rect")
						.style("fill", _colors(i));
					if (_on_handlers["mouseout"]) {
						_on_handlers["mouseout"](d, i);
					}
				});

			fo.html(function(d, i) {
				return _rect_text(d, i);
			});

			/* create transition function for transitions */
			disp.transition = function(d, i, direction) {
				if (_transitioning || !d) return;
				if (!d.children) return;
				_transitioning = true;
				if (_on_handlers["transition"]) {
					_on_handlers["transition"](d, i, direction);
				}
				/* these are default layout values for items that had
				 * too small of values to be laid out by d3's treemap
				 */
				var small_span = {x: 0.99, dx: 0.01, y: 0.99, dy: 0.01};
				var span1 = d.visible ? d : small_span;
				var span2 = disp.d.visible ? disp.d : small_span;

        if (i < -1) {
          span1 = small_span;
          span2 = small_span;
        }

				/* create new display and update it's coordanates */
				var disp2 = _display(d);
				if (direction) {
					disp2.x.domain([
						-1.0 * span1.x / span1.dx,
						(1.0 - span1.x) / span1.dx
					]);
					disp2.y.domain([
						-1.0 * span1.y / span1.dy,
						(1.0 - span1.y) / span1.dy
					]);
				}
				else {
					/* map the new display data to exist around the
					 * currently displayed data */
					disp2.x.domain([span2.x, span2.x + span2.dx]);
					disp2.y.domain([span2.y, span2.y + span2.dy]);

				}
				/* Fade-in entering text. */
				disp2.g.selectAll("text").style("fill-opacity", 0);
				disp2.g.selectAll("foreignObject div").style("display", "none");

				/* Transition to the new view. */
				disp2.g.selectAll("text")
					.call(disp2.text)
					.style("fill-opacity", 0);
				disp2.g.selectAll("rect")
					.call(disp2.rect)
					.style("fill-opacity", 0);

				disp2.g.selectAll(".textdiv").style("display", "block");
				disp2.g.selectAll(".foreignobj").call(disp2.foreign);

				var t1 = disp.g.transition().duration(750)
				var t2 = disp2.g.transition().duration(750);

				/* update domain mappings for the state at the end of
				 * the transition */
				if (direction) {
					/* map current display to extend beyond bounds */
					disp.x.domain([span1.x, span1.x + span1.dx]);
					disp.y.domain([span1.y, span1.y + span1.dy]);
				}
				else {
					/* map current display to shrink within bounds */

					disp.x.domain([
						-1.0 * span2.x / span2.dx,
						(1.0 - span2.x) / span2.dx
					]);
					disp.y.domain([
						-1.0 * span2.y / span2.dy,
						(1.0 - span2.y) / span2.dy
					]);
				}
				/* set new display to take up entire square */
				disp2.x.domain([0, 1.0]);
				disp2.y.domain([0, 1.0]);

				/* Enable anti-aliasing during the transition. */
				_svg.style("shape-rendering", null);

				/* Draw child nodes on top of parent nodes. */
				if (direction) {
					_svg.selectAll(".depth")
						.sort(function(a, b) { return b.depth - a.depth; });
				}
				else {
					_svg.selectAll(".depth")
						.sort(function(a, b) { return a.depth - b.depth; });
				}

				// Transition to the new view.
				t1.selectAll("text").call(disp.text).style("fill-opacity", 0);
				t2.selectAll("text").call(disp2.text).style("fill-opacity", 1);
				t1.selectAll("rect")
					.call(disp.rect)
					.style("fill-opacity", 0)
					.style("stroke-opacity", 0);
				t2.selectAll("rect")
					.call(disp2.rect)
					.style("fill-opacity", 1)
					.style("stroke-opacity", 1);

				t1.selectAll(".textdiv").style("display", "none");
				t1.selectAll(".foreignobj").call(disp.foreign);
				t2.selectAll(".textdiv").style("display", "block");
				t2.selectAll(".foreignobj").call(disp2.foreign);

				/* Remove the old node when the transition is finished. */
				t1.remove().each("end", function() {
					//_svg.style("shape-rendering", "crispEdges");
					_transitioning = false;
				});
				t1.select(".depth").remove();

				_transitioning = false;
				_current_display = disp2;
			}

			return disp;
		}


		/* recursively layout everything so that it fits within a 1x1 square */
		function _layout(d) {
			if (d.values) {
				/* only layout up to a maximum number of children */
				d.values.sort(function(a, b) {
					return _get_value(b) - _get_value(a);
				});
				d.children = d.values.slice(0, _max_rects);
				_treemap.nodes({children: d.children});
				d.children.forEach(function(c) {
					/* this update moves the postion to the top left */
					c.x = 1.0 - (c.x + c.dx);
					c.y = 1.0 - (c.y + c.dy);
					c.visible = true;
				});
				d.values.slice(_max_rects).forEach(function (c) {
					c.x = 0.0;
					c.y = 0.0;
					c.dx = 1.0;
					c.dy = 1.0;
					c.visible = false;
				});
				d.values.forEach(function(c) {
					/* need to correct parent assigned during treemap */
					c.parent = d;
					_layout(c);
				});
			}
			d.area = d.dx * d.dy;
		}


		return {
			/* exposed layout settings */
			width: function() {
				if (arguments.length == 0) {
					return _width;
				}
				else {
					_width = arguments[0];
					return this;
				}
			},

			height: function() {
				if (arguments.length == 0) {
					return _height;
				}
				else {
					_height = arguments[0];
					return this;
				}
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

			rects: function() {
				if (arguments.length == 0) {
					return _max_rects;
				}
				else {
					_max_rects = arguments[0];
					return this;
				}
			},

			on: function(eventname, eventfunc) {
				_on_handlers[eventname] = eventfunc;
				return this;
			},

			rect_text: function() {
				if (arguments.length == 0) {
					return _rect_text;
				}
				else {
					_rect_text = arguments[0];
					return this;
				}
			},

			data: function() {
				if (arguments.length == 0) {
					return _data;
				}
				else {
					_data = arguments[0];
					_root = _data;
					while (_root.parent) {
						_root = _root.parent;
					}
					return this;
				}
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

			display: function(element, d) {
				_treemap = d3.layout.treemap()
					.round(false)
					//.ratio(_inner_width() / _inner_height())
					//.ratio(_inner_height() / _inner_width())
					.value(_get_value)
					.sort(function(a, b) { return b.value - a.value; });

				/* TODO: how to deal with color arrays */
				if (!_colors) {
					_colors = d3.scale.category10().domain([0, _max_rects]);
				}

				/* create svg */
				_svg = element.append("svg")
					.attr("class", "treemap")
					.attr("width", _width)
					.attr("height", _height)
					.append("g")
					.attr(
						"transform",
						"translate(" + _margin.left + "," + _margin.top + ")")
					.style("shape-rendering", "crispEdges");

				_grandparent = _svg.append("g")
					.attr("class", "grandparent");

        /*
				_grandparent.append("rect")
					.attr("y", -_margin.top)
					.attr("width", _width)
					.attr("height", _margin.top);
        */

				_grandparent.append("text")
					.attr("x", 6)
					.attr("y", 6 - _margin.top)
					.attr("dy", ".75em");


				_initialize(_data);
				_layout(_data);
				_current_display = _display(d || _data);

				return this;
			},

      node: function() {
        return _current_display.d;
      },

			transition: function(d, i, dir) {
        if (arguments.length < 3) {
          dir = true;
        }
				_current_display.transition(d, i, dir);
				return this;
			}
		};
	}
})(ob.display);
