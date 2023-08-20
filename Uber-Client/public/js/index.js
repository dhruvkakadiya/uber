var data = [
  { name: "Locke", revenue: 0.08167 },
  { name: "Reyes", revenue: 0.05467 },
  { name: "Ford", revenue: 0.05367 },
  { name: "Jarrah", revenue: 0.01267 },
  { name: "Shephard", revenue: 0.03416 },
  { name: "Kwon", revenue: 0.03467 },
  { name: "DM", revenue: 0.04667 },
  { name: "Chirag", revenue: 0.06767 },
  { name: "Rushil", revenue: 0.03167 },
];

var margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10, "%");

var svg = d3
  .select(".analysis")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(
  data.map(function (d) {
    return d.name;
  }),
);
y.domain([
  0,
  d3.max(data, function (d) {
    return d.revenue;
  }),
]);

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg
  .append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Revenue");

svg
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return x(d.name);
  })
  .attr("width", x.rangeBand())
  .attr("y", function (d) {
    return y(d.revenue);
  })
  .attr("height", function (d) {
    return height - y(d.revenue);
  });

function type(d) {
  d.revenue = +d.revenue;
  return d;
}
