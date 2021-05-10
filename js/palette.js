var ob = ob || {};
ob.palette = ob.palette || {};

;(function (namespace, undefined) {
  namespace.stack = function() {
    /* default color transformation */
    var _transform = function(color, count) {
      color = d3.rgb(color);
      var new_color = d3.scale.linear()
        .domain([0, count])
        .range([color, color.darker(2.0)])
      return new_color;
    };

     var _default_palette = d3.scale.ordinal().range([
        '#D9CEB2',
        '#948C75',
        '#D5DED9',
        '#7A6A53',
        '#99B2B7'
      ]);

    return {
      _stack: [_default_palette],
      
      /* get/set transform used when new is needed */
      transform: function() {
        if (arguments.length == 0) {
          return _transform;
        }
        else {
          _transform = arguments[0];
          return this;
        }
      },

      palette: function() {
        if (arguments.length == 0) {
          if (this._stack.length > 0) {
            return this._stack[0];
          }
          return null;
        }
        else {
          this._stack[this._stack.length - 1] = arguments[0];
        }
        return this;
      },

      shift: function() {
        this._stack.shift();
      },

      unshift: function(color, count) {
        this._stack.unshift(_transform(color, count));
      },
    };
  }
})(ob.palette);
