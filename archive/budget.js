$(document).ready(function(){

    function chart() {

        var margin = {top: 20, right: 20, bottom: 300, left: 100},
            width = 960 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        var div = d3.select(".barchart").append("div").attr("class", "tooltip").style("opacity", 0);

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var format = d3.format(",.2f");

        var svg = d3.select(".barchart").append("svg")
        	.attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("data/okcbudget.csv", function(error, data) {

          data.forEach(function(d) {
            d.Total = +d.Total
            d.FundDescription = d.FundDescription;
          });

          x.domain(data.map(function(d) { return d.FundDescription; }));
          y.domain([0, d3.max(data, function(d) { return d.Total; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d) {
                  return "rotate(-65)"
                });;

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".7em")
              .style("text-anchor", "end")
              .text("Total");

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.FundDescription); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.Total); })
              .attr("height", function(d) { return height - y(d.Total); })
              .on("mouseover", function (d) {
    				div.transition()
    				.duration(1000)
    				.style("opacity", .9);
    				div.html("<p>" + d.FundDescription + ": $" + format(d.Total) + "<p>" )
    				.style("left", (d3.event.pageX) + "px")
    				.style("top", (d3.event.pageY-20) + "px")
    			})
    			.on("mouseout", function (d){
    				div.transition()
    				.duration(500)
    				.style("opacity", 0);
    			});

        });

    }

    function bubble() {

        var color = d3.scale.category10();

        var size = 960;

        var pack = d3.layout.pack()
            .sort(null)
            .size([size, size])
            .value(function(d) { return d.Total * d.Total; })
            .padding(5);

        var format = d3.format(",.2f");

        var svg = d3.select("body").append("svg")
            .attr("width", size)
            .attr("height", size);

        d3.csv("data/okcbudget.csv", type, function(error, okcbudget) {

          color.domain(d3.extent(okcbudget, function(d) { return d.Total; }));

          svg.selectAll("circle")
              .data(pack.nodes({children: okcbudget}).slice(1))
            .enter().append("circle")
              .attr("r", function(d) { return d.r; })
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .style("fill", function(d) { return color(d.FundDescription); })
            .append("title")
              .text(function(d) {
                  return d.FundDescription + ": $" + format(d.Total);
              });
        });

        function type(d) {
          d.total = +d.total
          return d;
        }

    }

    (function nestingTest() {

        d3.csv('data/okc_fy2015_budget_detail.csv', function(error, okcbudget){

            console.log(okcbudget);

            var nested = d3.nest()
                .key(function(d) { return d.FundDescription; })
                .rollup(function(d){
                    return d3.sum(d, function(g) { return g["FY2015 Budget"]; });
                })
                .entries(okcbudget);

            var twiceNested = d3.nest()
                .key(function(d) { return d.LOBName; })
                .rollup(function(d){
                    return d3.sum(d, function(g) { return g["FY2015 Budget"]; });
                })
                .entries(okcbudget)

            console.log(nested);
            console.log(twiceNested);

        })
    })()

    chart();
    bubble();

})
