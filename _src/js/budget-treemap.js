var ob = ob || {};
ob.display = ob.display || {};

;(function (namespace, undefined) {
	namespace.budget_treemap = function() {
    var _url = null;
    var _treemap = null;
    var _spreadsheet = null;
    /* The 'cruncher' reorganizes the budget data into a hierarchy
    * and offers some other functionality into managing the data */
    var _cruncher = ob.data.hierarchy();
    var _get_value = function(d) {
      return d['balance'];
    };
    var _max_rects = 40;
    var _min_area_for_text = 0.0125;
    var _palette = [
      '#D9CEB2',
      '#948C75',
      '#D5DED9',
      '#7A6A53',
      '#99B2B7'
    ];
    var _spreadsheet_selector = "#table";
    var _treemap_selector = "#treemap";
    /* layout settings */
    var _layout = {
      width: 800,
      height: 500,
    };

    var _hierarchy = [
      'Fund Description',
      'Department',
      'Division',
      'Account Category'
    ];

    /* used to convert numerical data into text data */
    var _format = {
      number: d3.format("$,d"),
      percent: d3.format(".2%")
    };

    /* create and configure the tooltip */
    var _tooltip_function = function(d, i) {
      /* this creates the html content that is displayed within
      * the tooltip */
      var display = '<p class="treemap_tooltip title">' + d.key + '</p>';
      display += '<p class="treemap_tooltip amount">' + _format.number(_get_value(d)) + '</p>';
      var percent = 1.0;
      if (d.parent) {
        percent = _get_value(d) / _get_value(d.parent);
      }
      display += '<p class="treemap_tooltip percentage">' + _format.percent(percent) + '</p>';
      return display;
    };

    /* determine current view in hierarchy based on url _hash */
    var _hash = {
      get: function(root) {
        if (window.location.hash.length < 2) {
          return root;
        }
        return _cruncher.spelunk(
          root,
          window.location.hash.replace("#", "").split(".")
        );
      },
      set: function(node) {
        var _hash = _cruncher.path(node)
          .slice(1)
          .map(function(d) { return d.key; })
          .join('.');
        window.location.hash = _hash;
      }
    };

    return {
      width: function() {
        if (arguments.length) {
          _layout.width = arguments[0];
          return this;
        }
        return _layout.width;
      },

      height: function() {
        if (arguments.length) {
          _layout.height = arguments[0];
          return this;
        }
        return _layout.height;
      },

      url: function() {
        if (arguments.length) {
          _url = arguments[0];
          return this;
        }
        return _url;
      },

      count: function() {
        if (arguments.length) {
          _max_rects = arguments[0];
          return this;
        }
        return _max_rects;
      },

      palette: function() {
        if (arguments.length) {
          _palette = arguments[0];
          return this;
        }
        return _palette;
      },

			value: function() {
				if (arguments.length) {
					_get_value = arguments[0];
					return this;
				}
        return _get_value;
			},

      tooltip: function() {
        if (arguments.length) {
          _tooltip_function = arguments[0];
          return this;
        }
        return _tooltip_function;
      },

      hierarchy: function() {
        if (arguments.length) {
          _hierarchy = arguments[0];
          return this;
        }
        return _hierarchy;
      },

      spreadsheet: function() {
        if (arguments.length) {
          _spreadsheet_selector = arguments[0];
          return this;
        }
        return _spreadsheet_selector;
      },

      treemap: function() {
        if (arguments.length) {
          _treemap_selector = arguments[0];
          return this;
        }
        return _treemap_selector;
      },


      create: function() {
        /* create initial color palette */
        var _color_stack = ob.palette.stack().palette(d3.scale.ordinal().range(_palette));

        /* create and configure the tooltip */
        var _tooltip = ob.display.tooltip().html(_tooltip_function);

        /* call d3 to load the budget data, and then display the data
        * after it has loaded */
        d3.json(url, function(data) {
          var root = _cruncher.crunch(data.rows, _hierarchy);

          /* caculate data percentages */
          _cruncher.apply(root, function(node) {
            if (node.parent) {
              node.precentage = node.value / node.parent.value;
            }
            else {
              node.percentage = 1.0;
            }
          });
          var node = _hash.get(root);

          _cruncher.path(node).forEach(function(d) {
            if (d.parent) {
              var i = d.parent.values.indexOf(d);
              _color_stack.unshift(
                _color_stack.palette()(i),
                Math.min(d.values.length, _max_rects));
            }
          });

          _spreadsheet = ob.display.spreadsheet()
            .element(d3.select(_spreadsheet_selector))
            .width(_layout.width)
            .value(function(d) {
              /* have to make sure values are greater than zero, otherwise
              * treemap layout breaks */
              return _get_value(d) <= 0 ? 0.001 : _get_value(d);
            });

          /* create treemap using current color scheme */
          _treemap = ob.display.treemap()
            .colors(_color_stack.palette())
            .value(_get_value);

          /* configure treemap and display */
          _treemap.width(_layout.width)
            .height(_layout.height)
            .value(function(d) {
              /* have to make sure values are greater than zero, otherwise
              * treemap layout breaks */
              return _get_value(d) <= 0 ? 0.001 : _get_value(d);
            })
            .rects(_max_rects)
            .rect_text(function(d, i) {
              /* this controls the text that is displayed in the
              * rectangles */
              var text_width = _layout.width * d.dx;
              var text_height = _layout.height * d.dy;
              if (text_width < 100 || text_height < 40) {
                return "";
              }
              var html = '<div class="amount">';
              html += _format.number(_get_value(d));
              html += '</div><div class="name">';
              html += d.key;
              html += '</div>';
              return html;
            })
            .on("mouseover", function(d, i) {
              /* when a mouse is over of rectangle, show the
              * tooltip for that rectangle */
              _tooltip.show(d,i);
            })
            .on("mousemove", function(d, i) {
              /* when a mouse is moving have the tooltip follow along */
              _tooltip.track();
            })
            .on("mouseout", function(d, i) {
              /* when a mouse leaves a rectangle, hide the tooltip */
              _tooltip.hide();
            })
            .on("display", function(d) {
              /* This is called when a new budget view is being
              * displayed.  It updates the _hash in the URL, as well
              * as the spreadsheet data */
              _hash.set(d);
              _spreadsheet.data(d.values)
                .colors(_treemap.colors())
                .display();
            })
            .on("transition", function(d, i, direction) {
              /* This is called right before a transition from one
              * budget view to the next happens. */
              if (direction) {
                /* add in a new set of colors */
                _color_stack.unshift(_treemap.colors()(i), d.children.length);
              }
              else {
                /* pop off the last used color */
                _color_stack.shift();
              }
              /* set the colors for the treemap */
              _treemap.colors(_color_stack.palette());
            })
            .data(root)
            .display(d3.select(_treemap_selector), node);
          /* when the spreadsheet is clicked, tell the treemap to
          * transition */
          _spreadsheet.on("click", _treemap.transition);
        });
      }
    };
  }
})(ob.display);
