// legend which doesn't try to do any automatic data discovery.
// It uses an options cfg that is a subset of the
// radar chart options
//
// containing only fields w, h , margin and color

function Legend(  id       // The element id to anchor the legend to 
                  ,titles
                  ,options) // an array of legend text
{
  var cfg = {
    w: 600,				//Width of the circle
    h: 600,				//Height of the circle
    margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
    color: d3.scale.category10()	//Color function
  };
  
  //Put all of the options into a variable called cfg
  if('undefined' !== typeof options){
    for(var i in options){
      if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
    }
  }
  


  
    var svg = d3.select(id).append("svg")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "legend"+id);
  var g = svg.append("g")
   .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")")
   .append("text").text("poop");
}
