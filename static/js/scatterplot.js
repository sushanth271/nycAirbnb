function getScatterPlotData(){
    $.post("/scatterplot",{'scatterYear':'year'}, function(data){
        console.log("DATA For scatter:");
       // console.log(data);
        drawScatterPlotv2(data);

    });

}

function drawScatterPlotv2(data){
    // console.log("click is", isBoroughClicked)
    //console.log(data)
    //datajson = JSON.parse(data)
    //console.log(datajson)
    // console.log("Scatter data", data)
    d3.select('#right-bottom').select('svg').remove()
    var margin = {top: 20, right: 0, bottom: 50, left: 85},
            svg_dx = 500, 
            svg_dy = 400,
            plot_dx = svg_dx - margin.right - margin.left,
            plot_dy = svg_dy - margin.top - margin.bottom;

        var x = d3.scaleLinear().range([margin.left, plot_dx]),
            y = d3.scaleLinear().range([plot_dy, margin.top]);

        
        var svg = d3.select("#right-bottom")
                    .append("svg")
                    .attr("width", svg_dx)
                    .attr("height", svg_dy);


        //console.log("max is", max)
             var d_extent_x = d3.extent( data, function(d){ return d.price;});
             var d_extent_y = d3.extent( data, function(d){ return d.rating;});
                //d_extent_y = d3.extent(data.ratings);
                //console.log(d_extent_y)
            //console.log("extent is", d_extent_x)
            x.domain(d_extent_x);
            //x.domain([0,500])
            //y.domain([50,100])
           y.domain(d_extent_y);
           // y.domain([50,100]);

            var axis_x = d3.axisBottom(x)
                           //.tickFormat(formatIncome),
                axis_y = d3.axisLeft(y)
                           //.tickFormat(formatHsGradAxis);

            svg.append("g")
               .attr("id", "axis_x")
               //.attr("transform", "translate(0," + (plot_dy + margin.bottom / 2) + ")")
               //.attr("transform", "translate(-30, 300)")
               .attr("transform", "translate("+15+","+ plot_dy + ")")
               .call(axis_x)
               .attr("class", "axisColor")
               .style("font-size", 15)
               .append("text")
                   .attr("y", 40)   // x and y for the text relative to the graph itself.
                   .attr("x", 200)
                  // .style('font-family', "Lucida Console")
                  // .style('font-weight', '600')
                   //   .attr("opacity", 0.7)
                   .attr("font-size", "15px")
                   .attr("fill", "black")
                   .text("Price");

            svg.append("g")
               .attr("id", "axis_y")
               .attr("transform", "translate(" + (margin.left / 2) + ", 0)")
               //.attr("transform", "translate(60,-30)")
               .call(axis_y)
               .attr("class", "axisColor")
               .attr("stroke", "#fff")
               .style("font-size", 15)
               .attr("transform", "translate(100)")
               .append("text")
                      //.attr("y", 40)   // x and y for the text relative to the graph itself.
                      .attr("y", "-40")
                      .attr("x", "-50")
                      .attr("transform", "rotate(-90)")
                      .attr("font-size", "20")
                      .attr("fill", "white")
                      .style('font-family', "Lucida Console")
                      .style('font-weight', '600')
                      .attr("opacity", 0.7)
                      //.attr("transform", "translate(0,-10)")
                      .text("Ratings");


            var circles = svg.append("g")
                             .selectAll("circle")
                             .data(data)
                             .enter()
                             .append("circle")
                             .attr("r", 2)
                             //.attr("cx", (d) => x(+d.price))
                             //.attr("cy", (d) => y(+d.ratings))
                             //.attr("cx", funcion(d) { console.log(d.ratings); return d.ratings;} )
                             .attr("cx", function(d) {    return x(d.price)  ; })
                             .attr("cy", function(d) {   return y(d.rating)  ; })
                             .attr("transform", "translate(15)")
                             //.attr("transform", "translate("+15+","+ plot_dy + ")")
                             .attr("class", "non_brushed");

            


            function highlightBrushedCircles() {

                if (d3.event.selection != null) {

                    // revert circles to initial style
                    circles.attr("class", "non_brushed");

                    var brush_coords = d3.brushSelection(this);

                    // style brushed circles
                    circles.filter(function (){

                               var cx = d3.select(this).attr("cx"),
                                   cy = d3.select(this).attr("cy");

                               return isBrushed(brush_coords, cx, cy);
                           })
                           .attr("class", "brushed");
                }
            }

            function displayTable() {

                // disregard brushes w/o selections  
                // ref: http://bl.ocks.org/mbostock/6232537
                if (!d3.event.selection) {
                    return;
                }

                // programmed clearing of brush after mouse-up
                // ref: https://github.com/d3/d3-brush/issues/10
                d3.select(this).call(brush.move, null);

                var d_brushed =  d3.selectAll(".brushed").data();
                console.log("brushed are ", d_brushed)
                // console.log("click is", isBoroughClicked)
                // populate table if one or more elements is brushed
                if (d_brushed.length > 0) {
                    drawPCP(d_brushed)
                    drawlinev2(d_brushed)
                    drawBorough(d_brushed)
                    // boroughMap = {}
                    // boroughCountList = []
                    // for( i = 0; i < d_brushed.length; i++){
                    //     if( !( d_brushed[i]['borough'] in boroughMap))
                    //     {
                    //        // console.log("borugh is", d_brushed[i]['borough'])
                    //         boroughMap[d_brushed[i]['borough']] = 1
                    //     }
                    //     else{
                    //         boroughMap[d_brushed[i]['borough']]++
                    //     }
                        
                    //     //drawBorough(boroughMap)

                    // }
                    
                    // console.log("boroughMap is", boroughMap)
                    // for( key, value of Object.entries(boroughMap)){
                    //     tempMap = {}
                    //     console.log("key values")
                    //     console.log(key, value)
                    //     tempMap = {'Borough' : key , 'value': value}
                    //     boroughCountList.append(tempMap)
                    // }
                    // drawBorough(tempMap)
                    // console.log("boroughmap is ",boroughMap )
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
                    
                } else {
                   // clearTableRows();
                   
                }
            }

            var brush = d3.brush()
                          .on("brush", highlightBrushedCircles)
                          .on("end", displayTable); 

            svg.append("g")
               .call(brush)
               .attr("transform", "translate(15)")
               .on("dblclick", dblclicked);

               function dblclicked() {
                // console.log("DOUBLE CLICK HERE ")
                getScatterPlotData(data);
                getLine(data);
                getpcpData(data);
                getBorough(data);
              }
       // });

        function clearTableRows() {

            hideTableColNames();
            d3.selectAll(".row_data").remove();
        }

        function isBrushed(brush_coords, cx, cy) {

             var x0 = brush_coords[0][0],
                 x1 = brush_coords[1][0],
                 y0 = brush_coords[0][1],
                 y1 = brush_coords[1][1];

            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

        function hideTableColNames() {
            d3.select("table").style("visibility", "hidden");
        }

        function showTableColNames() {
            d3.select("table").style("visibility", "visible");
        }

        function populateTableRow(d_row) {

            showTableColNames();

            var d_row_filter = [d_row.state, 
                                formatIncome(d_row.income), 
                                formatHsGrad(d_row.hs_grad)];

            d3.select("table")
              .append("tr")
              .attr("class", "row_data")
              .selectAll("td")
              .data(d_row_filter)
              .enter()
              .append("td")
              .attr("align", (d, i) => i == 0 ? "left" : "right")
              .text(d => d);
        }

}

getScatterPlotData()