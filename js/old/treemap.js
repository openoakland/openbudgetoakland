OpenSpending = "OpenSpending" in window ? OpenSpending : {};

(function ($) {

OpenSpending.Treemap = function (elem, context, state) {
  var self = this;

  var resources = [
                 OpenSpending.scriptRoot + "/widgets/treemap/js/thejit-2.min.js",
                 OpenSpending.scriptRoot + "/widgets/treemap/css/treemap.css"
                 ];

  if ($.browser.msie) {
    resources.push(OpenSpending.scriptRoot + "/widgets/treemap/js/excanvas.js");
  }

  self.context = _.extend({
    click: function(node) {
      if (node.data.link) {
        var link = context.embed ? node.data.link + '?embed=true' : node.data.link;
        document.location.href = link;
      }
    },
    hasClick: function(node) {
      return node.data.link !== undefined;
    },
    createLabel: function(widget, domElement, node) {
      if ((node.data.value/self.total)>0.03) {
        domElement.innerHTML = "<div class='desc'><div class='amount'>" + OpenSpending.Utils.formatAmountWithCommas(node.data.value,0,self.currency) + "</div><div class='lbl'>" + node.name + "</div></div>";
      }
    },
    tooltipMessage: function(widget, node) {
      var percentualValue = (node.data.value * 100)/widget.total;
      return node.name + " (" + OpenSpending.Utils.formatAmountWithCommas(percentualValue, 2) + "%)";
    },
    drilldown: function(node) {
      self.drilldown(node);
    }
  }, context);
  self.state = state;

  this.configure = function(endConfigure) {
    self.$qb.empty();
    var qb = new OpenSpending.Widgets.QueryBuilder(
      self.$qb, self.update, endConfigure, self.context, [
            {
              variable: 'drilldowns',
              label: 'Tiles:',
              type: 'select',
              'default': self.state.drilldowns,
              help: 'Each selected dimension will display as an additional level of tiles for the treemap.'
            },
            {
              variable: 'year',
              label: 'Year:',
              type: 'slider',
              'dimension': 'time',
              'attribute': 'year',
              'default': self.state.year,
              help: 'Filter by year.'
            },
            {
              variable: 'cuts',
              label: 'Filters:',
              type: 'cuts',
              'default': self.state.cuts,
              help: 'Limit the set of data to display.'
            }
          ]
    );
  };

  this.update = function(state) {
    self.state = state;
    self.state.drilldowns = self.state.drilldowns || [self.state.drilldown];
    self.state.cuts = self.state.cuts || {};

    var cuts = [];
    for (var field in self.state.cuts) {
      cuts.push(field + ':' + self.state.cuts[field]);
    }

    if (self.state.year) {
      cuts.push('time.year:' + self.state.year);
    }

    if (typeof self.context.member !== 'undefined' && typeof self.context.dimension !== 'undefined') {
      cuts.push(self.context.dimension + ':' + self.context.member);
    }

    //console.log(self.state);
    if (self.state.drilldowns) {
      self.aggregator = new OpenSpending.Aggregator({
        siteUrl: self.context.siteUrl,
        dataset: self.context.dataset,
        drilldowns: self.state.drilldowns,
        cuts: cuts,
        rootNodeLabel: 'Total',
        callback: function(data) {
          self.setDataFromAggregator(this.dataset, data);
        }
      });
    }
  };

  this.getDownloadURL = function() {
    return self.aggregator.getCSVURL();
  };

  this.serialize = function() {
    return self.state;
  };

  this.init = function () {
    self.$e = elem;
    self.$e.before('<div class="treemap-qb"></div>');
    self.$qb = elem.prev();
    self.$e.addClass("treemap-widget");
    self.update(state);
  };

  this.setDataFromAggregator = function (dataset, data) {
    self.currency = data.currency;
    self.setNode(data);
  };

  this.setNode = function (node) {
    var needsColorization = true;
    self.total = node.amount;
    self.data = {children: _.map(node.children, function(item) {
      if (item.color)
        needsColorization = false;
      return {
        children: [],
        id: item.id,
        name: item.label || item.name,
        data: {
            node: item,
            value: item.amount,
            $area: item.amount,
            title: item.label || item.name,
            link: item.html_url,
            name: item.name,
            $color: item.color || '#333333'
          }
        };
    })};

    if (needsColorization) {
      this.autoColorize();
    }
    self.draw();

  };

  this.drilldown = function(tile) {
    if (!tile.data.node.children.length) {
      self.context.click(tile);
    } else {
      self.setNode(tile.data.node);
    }
  };

  this.autoColorize = function() {
    var nodes = self.data.children.length;
    var colors = OpenSpending.Utils.getColorPalette(nodes);
    for (var i = 0; i < nodes; i++) {
      self.data.children[i].data.$color = colors[i];
    }
  };

  this.draw = function () {
    self.$e.empty();
    if (!self.data.children.length) {
      $(self.$e).hide();
      return;
    }
    $(self.$e).show();
    self.tm = new $jit.TM.Squarified({
        injectInto: self.$e.prop('id'),
        levelsToShow: 1,
        titleHeight: 0,
        animate: true,
        transition: $jit.Trans.Expo.easeOut,

        offset: 2,
        Label: {
          type: 'HTML',
          size: 12,
          family: 'Tahoma, Verdana, Arial',
          color: '#DDE7F0'
          },
        Node: {
          color: '#243448',
          CanvasStyles: {
            shadowBlur: 0,
            shadowColor: '#000'
          }
        },
        Events: {
          enable: true,
          onClick: function(node) {
            if(node) {
              self.context.drilldown(node);
            }
          },
          onRightClick: function() {
            self.tm.out();
          },
          onMouseEnter: function(node, eventInfo) {
            if(node) {
              if (!self.context.hasClick(node)) {
                self.$e.find('#'+node.id).css('cursor', 'default');
              }
              node.setCanvasStyle('shadowBlur', 8);
              node.orig_color = node.getData('color');
              node.setData('color', '#A3B3C7');
              self.tm.fx.plotNode(node, self.tm.canvas);
            }
          },
          onMouseLeave: function(node) {
            if(node) {
              node.removeData('color');
              node.removeCanvasStyle('shadowBlur');
              node.setData('color', node.orig_color);
              self.tm.plot();
            }
          }
        },
        duration: 1000,
        Tips: {
          enable: true,
          type: 'Native',
          offsetX: 20,
          offsetY: 20,
          onShow: function(tip, node, isLeaf, domElement) {
            var html = '<div class="tip-title">' +
                self.context.tooltipMessage(self, node) +
                '</div><div class="tip-text">';
            var data = node.data;
            tip.innerHTML = html;
          }
        },
        //Implement this method for retrieving a requested
        //subtree that has as root a node with id = nodeId,
        //and level as depth. This method could also make a server-side
        //call for the requested subtree. When completed, the onComplete
        //callback method should be called.
        request: function(nodeId, level, onComplete){
          // var tree = eval('(' + json + ')');
          var tree = json;
          var subtree = $jit.json.getSubtree(tree, nodeId);
          $jit.json.prune(subtree, 1);
          onComplete.onComplete(nodeId, subtree);
        },
        //Add the name of the node in the corresponding label
        //This method is called once, on label creation and only for DOM labels.
        onCreateLabel: function(domElement, node){
          self.context.createLabel(self, domElement, node);
        }
    });
    self.tm.loadJSON(this.data);
    self.tm.refresh();
  };

  // The rest of this function is suitable for copypasta into other
  // plugins: load all scripts we need, and return a promise object
  // that will fire when the class is ready
  var dfd = $.Deferred();
  dfd.done(function(that) {that.init();});

  if (!window.treemapWidgetLoaded) {
    yepnope({
      load: resources,
      complete: function() {
        window.treemapWidgetLoaded = true;
        dfd.resolve(self);
      }
    });
  } else {
    dfd.resolve(self);
  }

  return dfd.promise();
};

})(jQuery);
