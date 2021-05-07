function getPie(){
    $.post("/Pie",{'borough':'year'}, function(data){
        console.log("DATA FOR PIE CAHRT:")
        console.log(data)
        drawPie(data)
    });
};

getPie()
var k = 1
function send(data){
    k= parseInt(data)
    console.log("VALUE OF K IS:",k)
    getPie()
}

function drawPie(data){
    console.log("VALUE OF K IS:",k)
    // set the dimensions and margins of the graph
var width = 450
height = 450
margin = 40
// console.log("Inside pie chart")
// console.log(data)
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin
// d3.select("#left-bottom").remove();
// append the svg object to the div called 'my_dataviz'
d3.select("#left-bottom").select("svg").remove();
var svg = d3.select("#left-bottom")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// create 2 data_set
var dict1 = {}
// console.log(data[0])
for (i=0; i<data[0].length;i++){
    // console.log(data[0][i].Bathroom)
    dict1[data[0][i].Bathroom]=data[0][i].value
}
// console.log("dict is",dict1)
// var data1 = {a: 9, b: 20, c:30, d:8, e:12}
var data1 = dict1

var dict2 = {}
for (i=0; i<data[1].length;i++){
    // console.log(data[0][i].Bathroom)
    dict2[data[1][i].bedrooms]=data[1][i].value
}
// var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}
var data2 = dict2

// set the color scale
var color = d3.scaleOrdinal()
.domain(["a", "b", "c", "d", "e", "f","g","h","i","j","k"])
.range(d3.schemeDark2);

// A function that create / update the plot for a given variable:
function update(data) {

// Compute the position of each group on the pie:
var pie = d3.pie()
.value(function(d) {return d.value; })
.sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
var data_ready = pie(d3.entries(data))

// map to data
var u = svg.selectAll("path")
.data(data_ready)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
u
.enter()
.append('path')
.merge(u)
.transition()
.duration(1000)
.attr('d', d3.arc()
  .innerRadius(0)
  .outerRadius(radius)
)
.attr('fill', function(d){ return(color(d.data.key)) })
.attr("stroke", "white")
.style("stroke-width", "2px")
.style("opacity", 1)

// remove the group that is not present anymore
u
.exit()
.remove()

}

// Initialize the plot with the first dataset
if (k==1){
    update(data1)
}
if(k==2){
    update(data2)
}
}