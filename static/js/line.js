function getLine(){
    $.post("/line",{'line':'year'}, function(data){
        // console.log("DATA FOR LINE:");
        // console.log(data);
        drawlinev2(data);

    });
};

getLine()



function drawlinev2(data){
  d3.select('#right-top').select('svg').remove()
      // set the dimensions and margins of the graph
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 560 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      var lines =[];
      var i = 0
      for( i = 0; i < 366; i++){
        lines.push(0)
      }
    //   Object.keys(data).forEach(function(key) {
    //     lines[i] = data[key];
    //     i=i+1;
    // });
    d3.select('#right-top').select('svg').remove()

    availability_properties_map = {}
    for( i = 0; i < 366; i++){
      availability_properties_map[i] = []
    }
    for(i = 0; i < data.length; i++){
      if( !( data[i]['availability'] in availability_properties_map)){
        availability_properties_map[data[i]['availability']] = [data[i]]
      }
      else{
        availability_properties_map[data[i]['availability']].push(data[i])
      }
    }

    Object.keys(availability_properties_map).forEach(function(key) {
      //console.log("key is ", availability_properties_map[key].length)
      lines[key] = availability_properties_map[key].length;
      
      // /i=i+1;
  });
  // console.log(lines)

    //console.log("availability_properties_map is", availability_properties_map)
    //console.log("lines is", lines)
    // append the svg object to the body of the page
    var svg = d3.select("#right-top")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(50,20)")
    .append("g")
    .attr("transform", "translate(" + margin.left + ")");

    //Read the data
   // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

      // When reading the csv, I must format variables:
      // function(d){
      //   return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
      // },

    // Now I can use this dataset:
    //function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0,366])
      .range([ 0, width ]);

    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .attr("class", "axisColor")
      .attr("stroke", "white")
      .style("font-size", 15)
      .append("text")
                   .attr("y", 35)   // x and y for the text relative to the graph itself.
                   .attr("x", 200)
                   .style('font-family', "Lucida Console")
                   .style('font-weight', '600')
                   .attr("opacity", 0.7)
                   .attr("font-size", "15px")
                   .attr("fill", "white")
                   .text("Availability");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(lines, function(d) { return d; })])
      .range([ height, 0 ]);

    yAxis = svg.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "axisColor")
      .attr("stroke", "white")
      .append("text")
                      //.attr("y", 40)   // x and y for the text relative to the graph itself.
                      .attr("y", "-40")
                      .attr("x", "-50")
                      .attr("transform", "rotate(-90)")
                      .attr("font-size", "18px")
                      .attr("fill", "white")
                      .style('font-family', "Lucida Console")
                      .style('font-weight', '600')
                      .attr("opacity", 0.7)
                      .text("Properties");;
    // // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        //.on("start",brushstart)
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
   
    function brushstart(){
      d3.event.sourceEvent.stopPropagation(); 
    }
    // // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // console.log("Adding the line")
    // // Add the line
    line.append("path")
      .datum(lines)
     // .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d,i) {  return x(i) })
        .y(function(d) {  return y(d) })
        
        )
        
        // .on("mouseout", function() { focus.style("display", "none"); })
        // .on("mousemove", mousemove);

    // // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      // if(!extent){
      //   if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      //   x.domain([ 4,8])
      // }else{
      //   console.log("extent is",  extent)
      //   x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      //   x.domain([extent[0], extent[1]])
      //   line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      // }

      // Update axis and line position
      // xAxis.transition().duration(1000).call(d3.axisBottom(x))
      // line
      //     .select('.line')
      //     .transition()
      //     .duration(1000)
      //     .attr("d", d3.line()
      //       .x(function(d,i) { return x(i) })
      //       .y(function(d) { return y(d) })
      //     )

      sendData = []
      console.log("extent is", extent)

      // Here extent is null try using a else loop
      if (extent != null){
        // console.log("extent is",  extent)
        // console.log(x.invert(extent[0]), x.invert(extent[1]) )
        // // x.domain([extent[0], extent[1]])
      for(i = parseInt(x.invert(extent[0])); i < parseInt(x.invert(extent[1]))+1; i++){
        // console.log(i)
        if(i<366){
        for( j = 0; j < availability_properties_map[i].length; j++){
          sendData.push(availability_properties_map[i][j])
        }
      }
      }
      console.log("senddata is", sendData)
      drawPCP(sendData)
      drawScatterPlotv2(sendData)
      drawBorough(sendData)
      drawNYCMap(sendData)
      //sending data from line chart to bar chart
      // console.log("DATA IS", sendData)
      // d_brushed=sendData
      // boroughMap = {}
      // boroughList = []
      // for( i = 0; i < d_brushed.length; i++){
      //     if( !( d_brushed[i]['borough'] in boroughMap))
      //     {
      //         boroughMap[d_brushed[i]['borough']] = 1
      //     }
      //     else{
      //         boroughMap[d_brushed[i]['borough']]++
      //     }
      // }
      
      // console.log("boroughMap is", boroughMap)
      // tempmap = {}
      // BoroughList = []

      // for(var key in boroughMap) {
      //     tempmap={'Borough': key, 'value': boroughMap[key]}
      //     console.log(tempmap)
      //     BoroughList.push(tempmap)
      //     // do something with "key" and "value" variables
      //   }
      //   console.log("boroughmap is ",BoroughList )
      //   drawBorough(BoroughList)
      
      // console.log("we have finished brushing")
    }
    else{
      getScatterPlotData(data);
      getBorough(data);
      getpcpData(data);
      getLine(data);
      getMap(data);

      // console.log("extent",extent)
    }
  }

    // If user double click, reinitialize the chart
    // svg.on("dblclick",function(){
    //   x.domain(d3.extent(data, function(d) { return d.date; }))
    //   xAxis.transition().call(d3.axisBottom(x))
    //   line
    //     .select('.line')
    //     .transition()
    //     .attr("d", d3.line()
    //       .x(function(d) { return x(d.date) })
    //       .y(function(d) { return y(d.value) })
    //   )
    // });

    }//)





// function drawline(data){
// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page


// var lines =[];
//     var i=0
//     Object.keys(data).forEach(function(key) {
//         lines[i] = data[key];
//         i=i+1;
//     });


// var svg = d3.select("#right-top")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .attr("transform", "translate(50,20)")
//     .append("g")
//     .attr("transform", "translate(" + margin.left + ")");
    

//     var x = d3.scaleLinear()
//             .domain([0, 365])
//             .range([ 0, width ]);

//     svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x))
//       .attr("class", "axisColor")
//       .attr("stroke", "white")
//       .style("font-size", 15)
//       .append("text")
//                    .attr("y", 35)   // x and y for the text relative to the graph itself.
//                    .attr("x", 200)
//                    .style('font-family', "Lucida Console")
//                    .style('font-weight', '600')
//                    .attr("opacity", 0.7)
//                    .attr("font-size", "15px")
//                    .attr("fill", "white")
//                    .text("Availability");;

//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain([0, d3.max(lines, function(d) { return d; })])
//       .range([ height, 0 ]);
//     svg.append("g")
//       .call(d3.axisLeft(y))
//       .style("font-size", 15) 
//       .attr("class", "axisColor")
//       .attr("stroke", "white")
//       .append("text")
//                       //.attr("y", 40)   // x and y for the text relative to the graph itself.
//                       .attr("y", "-40")
//                       .attr("x", "-50")
//                       .attr("transform", "rotate(-90)")
//                       .attr("font-size", "18px")
//                       .attr("fill", "white")
//                       .style('font-family', "Lucida Console")
//                       .style('font-weight', '600')
//                       .attr("opacity", 0.7)
//                       .text("Properties");;
      
//     // Add the line
//     svg.append("path")
//       .datum(lines)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", d3.line()
//         .x(function(d,i) { return x(i) })
//         .y(function(d) { return y(d) })
//         )
//         .on("mouseover", function() { console.log("Mouseover"); d3.select(this).style("display", null); })
//         .on("mouseout", function() { d3.select(this).style("display", "none"); })
//         .on("mousemove", mousemove);

//         function mousemove() {
//             var x0 = x.invert(d3.mouse(this)[0]),
//                 i = bisectDate(data, x0, 1),
//                 d0 = data[i - 1],
//                 d1 = data[i],
//                 d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//             focus.attr("transform", "translate(" + x(d.date) + "," + y(d.likes) + ")");
//             focus.select(".tooltip-date").text(dateFormatter(d.date));
//             focus.select(".tooltip-likes").text(formatValue(d.likes));
//         }
      
// }
