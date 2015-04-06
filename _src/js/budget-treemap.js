var ob = ob || {};
ob.display = ob.display || {};

;(function (namespace, undefined) {
	namespace.budget_treemap = function() {
    var _url = null;
    var _treemap = null;
    var _spreadsheet = null;
    var _dropdown = null;
    /* The 'cruncher' reorganizes the budget data into a hierarchy
    * and offers some other functionality into managing the data */
    var _cruncher = ob.data.hierarchy();
    var _get_value = function(d) {
      return d['data']['amount'];
    };
    var _max_rects = 40;
    var _max_spreadsheet_rows = 10;
    var _min_area_for_text = 0.0125;
    var _palette = [
      '#970000',
      '#CD0059',
      '#E23600',
      '#F07400',
      '#EDA400',
      '#009F76',
      // '#009DB0',
      // '#00C0D7',
      '#008F16',
      '#395BF6',
      '#690180'
    ];
    var _spreadsheet_selector = "#table";
    var _treemap_selector = "#treemap";
    var _dropdown_selector = "#dropdown";
    var _title_selector = "#title";
    var _breadcrumbs_selector = "#breadrumbs";
    /* layout settings */
    var _layout = {
      width: 800,
      height: 500,
    };

    /* used to convert numerical data into text data */
    var _format = {
      number: d3.format("$,d"),
      percent: d3.format(".2%")
    };

    var _config = {
      url: function() {
        return '';
      }
    };

    var _hash_normalize = function(s) {
      return s;
    }

    var _hash_compare = function(v1, v2) {
      return v1 == v2 ? 0 : 1;
    }

    /* interaction */
    var _on_handlers = {};
    /* apply all events defined in _on_handlers to an object that supports the
     * "on" method in a d3 style
     */
    function _apply_handlers(d3obj) {
      for (var event_name in _on_handlers) {
        if (_on_handlers.hasOwnProperty(event_name)) {
          if (_on_handlers[event_name]) {
            d3obj.on(event_name, _on_handlers[event_name]);
          }
        }
      }
    }


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
      _expected_hash: '',

      expected: function() {
        if (arguments.length) {
          this._expected_hash = arguments[0];
          return this;
        }
        return this._expected_hash;
      },

      get: function(root) {
        var hash = window.location.hash.replace("#", "");
        if (_on_handlers.hasOwnProperty("get_hash")) {
          hash = _on_handlers["get_hash"](hash);
        }

        if (hash.length < 1) {
          return root;
        }
        return _cruncher.spelunk(
          root,
          hash.split("."),
          _hash_compare
        );
      },
      set: function(node) {
        var hash = _cruncher.path(node)
          .slice(1)
          .map(function(d) { return _hash_normalize(d.key); })
          .join('.');
        if (_on_handlers.hasOwnProperty("set_hash")) {
          hash = _on_handlers["set_hash"](hash);
        }
        this.expected(hash);
        window.location.hash = hash;
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

      hashnorm: function() {
        if (arguments.length) {
          _hash_normalize = arguments[0];
          return this;
        }
        return _hash_normalize;
      },

      hashcmp: function() {
        if (arguments.length) {
          _hash_compare = arguments[0];
          return this;
        }
        return _hash_compare;
      },

			value: function() {
				if (arguments.length) {
					_get_value = arguments[0];
					return this;
				}
        return _get_value;
			},

			on: function(eventname, eventfunc) {
				_on_handlers[eventname] = eventfunc;
        if (_treemap) {
          _treemap.on(eventname, eventfunc);
        }
        if (_spreadsheet) {
          _spreadsheet.on(eventname, eventfunc);
        }
        if (_dropdown) {
          _dropdown.on(eventname, eventfunc);
        }
				return this;
			},

      config: function() {
        if (arguments.length) {
          _config = arguments[0];
          return this;
        }
        return _config;
      },

      tooltip: function() {
        if (arguments.length) {
          _tooltip_function = arguments[0];
          return this;
        }
        return _tooltip_function;
      },

      dropdown: function() {
        if (arguments.length) {
          _dropdown_selector = arguments[0];
          return this;
        }
        return _dropdown_selector;
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

      title: function() {
        if (arguments.length) {
          _title_selector = arguments[0];
          return this;
        }
        return _title_selector;
      },

      breadcrumbs: function() {
        if (arguments.length) {
          _breadcrumbs_selector = arguments[0];
          return this;
        }
        return _breadcrumbs_selector;
      },

      create: function() {

        /* this handles changes due to backbuttons in the browser */
        var self = this;
        window.onhashchange = function(e) {
          var hash = window.location.hash.replace("#", "");
          if (hash != _hash.expected()) {
            self.refresh();
          }
        };


        /* create initial color palette */
        var _color_stack = ob.palette.stack().palette(d3.scale.ordinal().range(_palette));
        this._create_dropdown();

        /* create and configure the tooltip */
        var _tooltip = ob.display.tooltip().html(_tooltip_function);

        /* call d3 to load the budget data, and then display the data
        * after it has loaded */
        d3.json(_url, function(data) {
          var root = data;
          function _create_breadcrumbs(d) {
            var current_node = d;
            d3.select(_breadcrumbs_selector).selectAll(".crumb").remove();

            var crumbs = d3.select(_breadcrumbs_selector)
              .selectAll(".crumb")
              .data(ob.data.hierarchy().path(d));

            crumbs.enter().append("span")
              .attr("class", "crumb")
              .on("click", function(clicked, i) {
                if (clicked == current_node) {
                  /* don't transition if they click on the same data that is already
                     being display */
                  return;
                }
                var levels = 0;
                var current = current_node;
                while (current && current != clicked) {
                  levels -= 1;
                  current = current.parent;
                }
                _treemap.transition(clicked, levels, false);
              })
              .text(function(d, i) {
                return i > 0 ? ' > ' + d.key : d.key;
              });
          }

          /* set parent links */
          _cruncher.apply(root, function(node) {
            if (node.values) {
              node.values.forEach(function(child) {
                child.parent = node;
              });
            }
          });

          /* caculate data percentages */
          _cruncher.apply(root, function(node) {
            if (node.parent) {
              node.precentage = _get_value(node) / _get_value(node.parent);
            }
            else {
              node.percentage = 1.0;
            }
          });
          var node = _hash.get(root);


          _cruncher.path(node).forEach(function(d) {
            if (d.parent) {
              var i = d.parent.values.indexOf(d);
              /* TODO: color stack isn't consistent when page is refreshed because
               * values are sorted in treemap.js and spreadsheet.js which screws up
               * ordering of "values".  If you want this consistent, you'll have to
               * figure out a way around that.
               */
              
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
            })
            .columns(["", "Item", "Expense", "Revenue"])
            .column(function(d, i, elem) {
              if (i == 1) {
                elem.attr("class", "item").html(d);
              }
              else if (i == 2) {
                elem.attr("class", "money").html(d);
              }
              else if (i == 3) {
                elem.attr("class", "money").html(d);
              }

            })
            .cell(function(d, i, j, elem) {

              if (i == 0) {
                elem.append("div")
                  .attr("class", "square")
                  .style("background-color", _color_stack.palette()(j));
              }
              else if (i == 1) {
                elem.attr("class", "item").html(d.key);
              }
              else if (i == 2) {
                elem.attr("class", "money").html(_format.number(d.data.expense));
              }
              else if (i == 3) {
                elem.attr("class", "money").html(_format.number(d.data.revenue));
              }
              if (i == 0) {
                var parent_node = d3.select(elem.node().parentNode);
                if (j > _max_spreadsheet_rows) {
                  parent_node.style("visibility", "hidden")
                    .style("display", "none");
                }
                else {
                  parent_node.style("visibility", "visible")
                    .style("display", "table-row");
                }
                if (j == (_max_spreadsheet_rows + 1)) {
                  var spreadsheet_element = d3.select(_spreadsheet_selector);
                  spreadsheet_element.append("button")
                    .attr("class", "btn btn-default")
                    .attr("id", "more")
                    .text("Show more")
                    .on("click", function() {
                      spreadsheet_element.selectAll("tr")
                        .style("visibility", "visible")
                        .style("display", "table-row");
                      spreadsheet_element.select("#more").remove();
                      
                    });
                }
              }
            });

          /* apply any "on" handlers to spreadsheet */
          _apply_handlers(_spreadsheet);

          /* create treemap using current color scheme */
          _treemap = ob.display.treemap()
            .colors(_color_stack.palette())
            .value(_get_value);

          /* apply any "on" handlers to treemap */
          _apply_handlers(_treemap);

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
                .display();
              d3.select(_title_selector).text(d.key);
              /* set breadcrumbs */
              _create_breadcrumbs(d);
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
                while (i < 0) {
                  _color_stack.shift();
                  i += 1;
                }
              }
              /* set the colors for the treemap */
              _treemap.colors(_color_stack.palette());
            })
            .data(root)
            .display(d3.select(_treemap_selector), node);
          /* when the spreadsheet is clicked, tell the treemap to
          * transition */
          _spreadsheet.on("click", _treemap.transition);

          /* set title */
          d3.select(_title_selector).text(node.key);

          /* set breadcrumbs */
          _create_breadcrumbs(node);
        });

      },

      _create_dropdown: function() {
        var self = this;
        var values = [];
        for (var key in _config.dropdown_values) {
          if (_config.dropdown_values.hasOwnProperty(key)) {
            values.push(key);
          }
        }
        /* add dropdown */
        _dropdown = d3.select(_dropdown_selector)
          .selectAll("#selector")
          .data(values)
          .enter()
          .append("div")
          .attr("class", "col-sm-6 dropdown")
          .text(function(d) {
            return d;
          })
          .append("select")
          .attr("class", "form-control")
          .on("change", function(d) {
            _config.dropdown_choice[d] = this.options[this.selectedIndex].value;
            _hash.set(_treemap.node());
            self.refresh();
          });
        _apply_handlers(_dropdown);

        /* add options to dropdown */
        _dropdown.selectAll("option")
          .data(function(d) { 
            return _config.dropdown_values[d].map(function(v) { return {'key':d, 'value': v}; });
          })
          .enter()
          .append("option")
          .text(function(d) { return d['value']; })
          .attr("selected", function (d) {
            if (d['value'] == _config.dropdown_choice[d['key']]) { return "selected"; }
          });
      },

      refresh: function() {
          d3.select(_spreadsheet_selector).select("svg").remove();
          d3.select(_treemap_selector).select("svg").remove();
          d3.select(_dropdown_selector).selectAll(".dropdown").remove();
          this.url(_config.url());
          this.create();
      }
    };
  }
})(ob.display);
