function getLine(){
    $.post("/line",{'line':'year'}, function(data){
        console.log("DATA FOR LINE:");
        console.log(data);
        drawline(data);

    });
};

getLine()







function drawline(data){
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page


var lines =[];
    var i=0
    Object.keys(data).forEach(function(key) {
        lines[i] = data[key];
        i=i+1;
    });
console.log("lines",lines)

var svg = d3.select("#right-top")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
            .domain([0, 365])
            .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    console.log("------------+++++++++++++++++----------------------")
    var y = d3.scaleLinear()
      .domain([0, d3.max(lines, function(d) {console.log(d); return d; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

      console.log("------------+++++++++++++++++----------------------")
    // Add the line
    svg.append("path")
      .datum(lines)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d,i) { return x(i) })
        .y(function(d) { return y(d) })
        )
}
