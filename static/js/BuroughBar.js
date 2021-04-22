function getBorough(){
    $.post("/Borough",{'borough':'year'}, function(data){
        //console.log("DATA FOR BOROUGH:");
        //console.log(data);
        //console.log("DATA IS GOING TO BE SENT")
        // jsondata= JSON.stringify(data)
        // console.log("DATA IN JSON")
        // console.log(data)
        // console.log("JSON END")
        drawBoroughBar(data);

    });
};

getBorough()

function drawBoroughBar(data){
    
   //console.log("INSIDE FUNCTION DATA IS");
    //console.log(data);
    //console.log(data['Bronx']);
    width = 450;
    height = 400;
    //console.log(Object.keys(data).length);
    var borough =[];
    var i=0
    Object.keys(data).forEach(function(key) {
        borough[i] = key;
        i=i+1;
    });
    //console.log("data is");
    //console.log(borough);
    var properties = [];
    i=0;
    Object.keys(data).forEach(function(key) {
        properties[i] = data[key];
        i=i+1;
    });
    //console.log(properties);
    var svg =d3.select("#left-top")
                .append("svg")
                .attr("id","svglt")
                .attr("width","485")
                .attr("height","450")
                .style("background-color","#fff")
                .attr("transform","translate(50,30)")
                .append("g")

    var x = d3.scaleBand()
                .range([50, width])
                .padding(0.1);
    var y = d3.scaleLinear()
                .range([height, 30]);
    
    x.domain(borough.map(function(d) {  return d; }));
    y.domain([0, d3.max(properties, function(d) {  return d; })+100]);

    svg.selectAll(".bar")
      .data(borough)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d); })
      .attr("width", x.bandwidth())


        svg.selectAll(".bar")
        .data(properties)
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d); });  

    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        //.attr("stroke", "white")
        .style("font-size", 15)
        .append("text")
        .attr("y", 40)   // x and y for the text relative to the graph itself.
        .attr("x", 200)
        .style('font-weight', '600')
        .attr("font-size", "15px")
        .attr("fill", "black")
        .text("Borough");
;
    

    
    svg.append("g")
    .attr("transform", "translate(50)")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('stroke', '#0b1a38')
        .style('stroke-opacity', '0.3')
        .text("PROPERTIES");

    

}