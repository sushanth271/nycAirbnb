function getBorough(){
    $.post("/Borough",{'borough':'year'}, function(data){
        // console.log("DATA FOR BOROUGH:")
        // console.log(data)
        // drawBoroughBar(data);
        drawBorough(data);
    });
};

getBorough()

function drawBorough(data){
  //console.log("data is", data)
  
  var locality_count_map = {}
  for(i = 0; i < data.length; i++){
    //console.log(data[i]["locality"])
    if( !(data[i]["locality"] in locality_count_map )){
      locality_count_map[data[i]["locality"]] = 1
    }else{
      locality_count_map[data[i]["locality"]]++
    }
  }
  // console.log(locality_count_map)
  //locality_count_map_sorted = Object.keys(locality_count_map).sort(function(a,b){return locality_count_map[a]-locality_count_map[b]})
  var items = Object.keys(locality_count_map).map(function(key) {
    return [key, locality_count_map[key]];
  });

  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  //console.log(locality_count_map_sorted)
  // console.log(items.slice(0, 10));

  sortedLocalities = []
  if(items.length > 20){
    topCount = 20
  }else{
    topCount = items.length
  }
  for(i = 0 ; i< topCount; i++){
    tempDict = {}
    tempDict["Borough"] = items[i][0]
    tempDict["value"] = items[i][1]
    sortedLocalities.push(tempDict)
  }
  // console.log(sortedLocalities)

  var selectedList=[]


  d3.select("#left-top").select("svg").remove();
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#left-top")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(50,20)")
  .append("g")
    .attr("transform",
          "translate(" + 100 + "," + 0 + ")");


            // Add X axis
  var x = d3.scaleLinear()
  .domain([0, d3.max(sortedLocalities, function(d) {  return d.value; })])
  .range([ 0, width]);

svg.append("g")
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
                   .text("Properties");;

     // Y axis
  var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(sortedLocalities.map(function(d) { return d.Borough; }))
  .padding(.1);
svg.append("g")
  .call(d3.axisLeft(y))
  .style("font-size", 15) 
      .attr("class", "axisColor")
      .attr("stroke", "white")
      

    //Bars
    svg.selectAll("myRect")
    .data(sortedLocalities)
    .enter()
    .append("rect")
    
    .attr("x", x(0) )
    
    // .on("mouseover",  function(d){ d3.select(this).style("fill","#900C3F"); d3.select(this.parentNode).append("text").attr("x",  x(d.value) + 15 ).attr("y", y(d.Borough) + (height)/(topCount*2) ).text(d.value).attr("id","hovertext").attr("fill", "white") })
    // .on("mouseout",  function(d){ d3.select(this).style("fill","steelblue "); d3.select("#hovertext").remove();  })
    .on("mouseover",  function(d){  d3.select(this.parentNode).append("text").attr("x",  x(d.value) + 15 ).attr("y", y(d.Borough) + (height)/(topCount*2) ).text(d.value).attr("id","hovertext").attr("fill", "white") })
    .on("mouseout",  function(d){  d3.select("#hovertext").remove();  })
    .on("click",function(d){
                    
                    if (selectedList.includes(d.Borough)){
                      d3.select(this).style("fill","steelblue")
                      console.log("it is in selected so remove from list");
                      var index = selectedList.indexOf(d.Borough)
                      selectedList.splice(index,1);
                    }
                    else{
                      selectedList.push(d.Borough);
                      d3.select(this).style("fill","green");
                    }
                      console.log(selectedList)
                      // d3.select(this).style("fill","green");

                      filteredData = []
                      for( i = 0 ; i< data.length; i++){
                        for(j=0; j<selectedList.length;j++)
                      if(data[i]["locality"] == selectedList[j]){
                        filteredData.push(data[i])
                    }
                  }
                  // console.log(filteredData)
                  if (selectedList.length>0){
                    drawScatterPlotv2(filteredData)
                    drawPCP(filteredData)
                    drawlinev2(filteredData)
                  }
                  else{
                    drawScatterPlotv2(data)
                    drawPCP(data)
                    drawlinev2(data)
                  }
                  })
    .transition()
    .duration(300)
    .attr("y", function(d) { return y(d.Borough); })
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "steelblue")


    
    // console.log("AT LAST",selectedList);
}

// function drawBoroughBarOld(data){
    
//    //console.log("INSIDE FUNCTION DATA IS");
//     //console.log(data);
//     //console.log(data['Bronx']);
//     width = 450;
//     height = 400;
//     //console.log(Object.keys(data).length);
//     var borough =[];
//     var i=0
//     Object.keys(data).forEach(function(key) {
//         borough[i] = key;
//         i=i+1;
//     });
//     //console.log("data is");
//     //console.log(borough);
//     var properties = [];
//     i=0;
//     Object.keys(data).forEach(function(key) {
//         properties[i] = data[key];
//         i=i+1;
//     });
//     //console.log(properties);
//     var svg =d3.select("#left-top")
//                 .append("svg")
//                 .attr("id","svglt")
//                 .attr("width","485")
//                 .attr("height","450")
//                 //.style("background-color","#fff")
//                 .attr("transform","translate(60,30)")
//                 .append("g")

//     var x = d3.scaleBand()
//                 .range([50, width])
//                 .padding(0.1);
//     var y = d3.scaleLinear()
//                 .range([height, 30]);
    
//     x.domain(borough.map(function(d) {  return d; }));
//     y.domain([0, d3.max(properties, function(d) {  return d; })+100]);

//     svg.selectAll(".bar")
//       .data(borough)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("fill","steelblue")
//       .attr("x", function(d) { return x(d); })
//       .attr("width", x.bandwidth())


//         svg.selectAll(".bar")
//         .data(properties)
//       .attr("y", function(d) { return y(d); })
//       .attr("height", function(d) { return height - y(d); });  

    
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .attr("class", "axisColor")
//         //.attr("stroke", "white")
//         .style("font-size", 15)
//         .append("text")
//         .attr("y", 40)   // x and y for the text relative to the graph itself.
//         .attr("x", 200)
//         .style('font-weight', '600')
//         .attr("font-size", "15px")
//         // /.attr("fill", "black")
//         .attr("font-size", "15px")
//         .attr("fill", "white")
//         .text("Borough");
// ;
    

    
//     svg.append("g")
//     .attr("transform", "translate(50)")
//         .call(d3.axisLeft(y))
//         .attr("class", "axisColor")
//         .style("font-size", 15) ;

//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -5)
//         .attr("x",0 - (height / 2))
//         .attr("dy", "1em")
//         .style("text-anchor", "middle")
//         .style('stroke', '#0b1a38')
//         .style('stroke-opacity', '0.3')
//         .attr("font-size", "18px")
//         .attr("fill", "white")
//         .text("Properties");

    

// }