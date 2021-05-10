function getpcpData(){
    $.post("/parallelPlot",{'pcpYear':'year'}, function(data){
        // console.log("data For pcp:");
       drawPCP(data);

    });

}
   
function drawPCP(data){
    d3.select('#mid-bottom').select('svg').remove()
   
    var margin = {top: 20, right: 0, bottom: 50, left: 0},
    width = 1200 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([ 0, width ]).padding(1)  //d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
    dragging = {};

    var line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground;

    var svg = d3.select("#mid-bottom").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(-50,50)");//  + "," + margin.top + ")");

        x.domain(dimensions = d3.keys( data[0] )
        .filter( function(d,i)
                 {
                  // console.log("d is ",Object.keys(data[0])[i])
                  //console.log("d is here", d)
                   if( d != "locality"){
                      if(d != "borough"){
                          return   (y[d] = d3.scaleLinear()
                                  .domain(d3.extent(data, function(p)
                                  {
                                      //return +p[d];
                                   // /console.log("d is", +p[Object.keys(data[0])[i]] )
                                     // return +p[Object.keys(data[0])[i]]
                                     //console.log("d inside is", p[d])
                                     return +p[d];
                                  }))
                                  .range([height, 0]));   
                               }
                       else{
                           // console.log("ehre", data.map(function(p){ return p[d] }));
                           return ( 
                               y[d] = d3.scalePoint()
                                       .range([height,0])
                                       .domain(data.map(function(p){ return p[d] })))
                                       ;
                       } 
                   }                                           
                }));



     // Add blue foreground lines for focus.
  foreground = svg.append("g")
  .attr("class", "foreground")
.selectAll("path")
  .data(data)
.enter().append("path")
  .attr("d", path)
  .style("stroke", "steelblue" );

// Add a group element for each dimension.
var g = svg.selectAll(".dimension")
  .data(dimensions)
.enter().append("g")
  .attr("class", "dimension")
  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
  .call(d3.drag().subject(function(d) { return {x: x(d)}; })
    .on("start", function(d) {
      console.log("hi")
      dragging[d] = x(d);
      background.attr("visibility", "hidden");
    })
    .on("drag", function(d) {

      dragging[d] = d3.min([width, d3.max([0, parseFloat(d3.event.x)])]);

      foreground.attr("d", path);
      dimensions.sort(function(a, b) { return position(a) - position(b); });
      x.domain(dimensions);
      g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
    })
    .on("end", function(d) {
      delete dragging[d];
      transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
      transition(foreground).attr("d", path);
      background
          .attr("d", path)
        .transition()
          .delay(500)
          .duration(0)
          .attr("visibility", null);
    }));

// Add an axis and title.
g.append("g")
  .attr("class", "axis")
  .each(function(d) { d3.select(this).call(axis.scale(y[d])).attr("class", "axisColor").attr("stroke", "white").style("font-size", 18); })
    .append("text")
  //.style("text-anchor", "middle")
  .attr("y", -9)
  //.attr("fill","black")
  //.attr("font-size","110%")
  .style('font-family', "Lucida Console")
    .style('font-weight', '600')
    .attr("opacity", 0.7)
    .attr("font-size", "16px")
    .attr("fill", "white")
    .attr("transform", "translate(0,-10)")
  .text(function(d) { return d; });

//Add and store a brush for each axis.
g.append("g")
  .attr("class", "brush")
  .each(function(d) {
    d3.select(this).call(y[d].brush = d3.brushY().extent([[-5, y[d].range()[1]], [5, y[d].range()[0]]]).on("brush", brush).on("start", brushstart).on("end", brush));
  })
.selectAll("rect")
  .attr("x", -8)
  .attr("width", 16);



  //legends

//   for (var i=0; i<color_keys.length; i++){
//     console.log('hi', color_keys[i])
//     svg.append("circle").attr("cx", 20).attr("cy",20 + 30*i).attr("r", 5).style("fill", color(color_keys[i]))
//     svg.append("text").attr("x", 30).attr("y", 20 + 30*i).text("Cluster "+i).style("font-size", "100%").attr("alignment-baseline","middle")
//   } 





function position(d) {
var v = dragging[d];
return v == null ? x(d) : v;
}

function transition(g) {
return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}


function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}



// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = [];
    //filter brushed extents
    svg.selectAll(".brush")
        .filter(function(d) {
            return d3.brushSelection(this);
        })
        .each(function(d) {
            actives.push({
                dimension: d,
                extent: d3.brushSelection(this)
            });
        });
    //set un-brushed foreground line disappear
    foreground.classed("fade", function(d,i) {

        return !actives.every(function(active) {
            var dim = active.dimension;
            return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim])  <= active.extent[1];
        });
    });


    }
}
    
function drawPCPv2(data){
        // console.log("pcp data is", data)
        d3.select('#mid-bottom').select('svg').remove()

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var margin = {top: 20, right: 0, bottom: 50, left: 85},
            svg_dx = 800, 
            svg_dy = 450,
            plot_dx = svg_dx - margin.right - margin.left,
            plot_dy = svg_dy - margin.top - margin.bottom;

        var x = d3.scaleLinear().range([margin.left, plot_dx]),
            y = d3.scaleLinear().range([plot_dy, margin.top]);

        
        var svg2 = d3.select("#mid-bottom")
                    .append("svg")
                    .attr("width", svg_dx)
                    .attr("height", svg_dy);


       // svg2 = d3.select("#svgtab6")
        var lmargin = 50
        var rmargin = 50
        var bottom_margin = 50
        var top_margin = 45
        width = svg2.attr("width") - lmargin - rmargin
        height = svg2.attr("height") - bottom_margin

        var svg = svg2.append("svg")
            .attr("width", width + lmargin + rmargin)
            .attr("height", height + top_margin + bottom_margin)
            .append("g")
            .attr("transform", "translate(" + lmargin + "," + top_margin + ")")



        var x = d3.scalePoint().range([0, width]),
            y = {},
            dragging = {};

        var line = d3.line()
            axis = d3.axisLeft();
        //console.log("keys are ",Object.values(data))
         x.domain(dimensions = d3.keys( data[0] )
                                 .filter( function(d,i)
                                          {
                                           // console.log("d is ",Object.keys(data[0])[i])
                                           //console.log("d is here", d)
                                            if( d != "locality"){
                                               if(d != "borough"){
                                                   return   (y[d] = d3.scaleLinear()
                                                           .domain(d3.extent(data, function(p)
                                                           {
                                                               //return +p[d];
                                                            // /console.log("d is", +p[Object.keys(data[0])[i]] )
                                                              // return +p[Object.keys(data[0])[i]]
                                                              //console.log("d inside is", p[d])
                                                              return +p[d];
                                                           }))
                                                           .range([height, 0]));   
                                                        }
                                                else{
                                                    // console.log("ehre", data.map(function(p){ return p[d] }));
                                                    return ( 
                                                        y[d] = d3.scalePoint()
                                                                .range([height,0])
                                                                .domain(data.map(function(p){ return p[d] })))
                                                                ;
                                                } 
                                            }                                           
                                         }));
            
            var values = Object.keys(data).map(function(key){
                valuesInside = Object.keys(data[key]).map(function(key2){
                    return data[key][key2];
                })
               // console.log("Values inside is", valuesInside)
                return valuesInside;
            });
    //console.log("values is", values)
            //console.log("values are", values)
        //console.log(x.domain)
         background = svg.append("g")
                     .attr("class", "background")
                     .selectAll("path")
                     .data(data)
                     .enter()
                     .append("path")
                     .attr("d", path)
                     .style("stroke","none")

         foreground = svg.append("g")
             .attr("class", "foreground")
             .selectAll("path")
             .data(data)
             .enter()
             .append("path")
             .attr("d", path)
             //.style("stroke", function(data, i){ return color(standardScaledDataTransposed[i][10]);  });
             .style("stroke","#000")

         var g = svg.selectAll(".dimension")
                    .data(dimensions)
                    .enter()
                    .append("g")
                    .attr("class", "dimension")
                    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                    .call(d3.drag()
                    .subject(function(d) { return {x: x(d)}; })
                    .on("start", function(d) {
                        //console.log("drag start");
                       dragging[d] = x(d);
                       background.attr("visibility", "hidden");
                       })
                    .on("drag", function(d) {
                           // console.log("d is", d);
                                 dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                                 foreground.attr("d", path);
                                 dimensions.sort(function(a, b) { return position(a) - position(b); });
                                 x.domain(dimensions);
                                 g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                      })
                    .on("end", function(d) {
                               delete dragging[d];
                               transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                               transition(foreground).attr("d", path);
                               background
                     .attr("d", path)
                     .transition()
                     .delay(500)
                     .duration(0)
                     .attr("visibility", null);
               }));
            //    console.log("creating axes")
               //console.log("creating axes")
         g.append("g")
             .attr("class", "axis")
             .each(function(d) {d3.select(this).call(axis.scale(y[d])); })
             .append("text")
             .style("text-anchor", "middle")
             .attr("y", -9)
             .text(function(d) { return d; })
             .attr("fill", "black")
             .style('font-family', "Lucida Console")
             .style('font-weight', '500')

         g.append("g")
             .attr("class", "brush")
             .each(function(d) {
                 d3.select(this).call( y[d].brush = d3.brushY(y[d]).on("start", brushstart).extent([[-8, y[d].range()[1]], [8, y[d].range()[0]]]).on("brush", brush) );
              })
             .selectAll("rect")
             .attr("x", -8)
             .attr("width", 16);


       function brush() {
           console.log("brush started")
              const actives = [];
               //const actives = dimension.filter(function(p){return !y[p].brush.empty();})
               svg.selectAll('.brush')
                   .filter(function(d)   { return d3.brushSelection(this ); })
                   .each(function(d) {
                   // console.log(d)
                                 actives.push({
                                 dimension: d,
                                 extent: d3.brushSelection(this ),
                               
                             });
                           });
                 console.log("actives is ", actives)
                 actives.every(function(active){console.log(active)})
                foreground.style('display', function(d) {
                                 return actives.every(function(active) {
                                     
                                         const dim = active.dimension;
                                        //  console.log(dim)
                                         //console.log(active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1])
                                         return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
                             }) ? null : 'none';
               })

           
               g.selectAll("rect") 
               .attr("width", 20)
               .attr("x", -10)
       }

       function brushstart() {
         d3.event.sourceEvent.stopPropagation();
        //  g.selectAll("rect") 
        //                 .attr("width", 20)
        //                 .attr("x", -10)
       }

       function transition(g) {
         return g.transition().duration(500);
       }

       function path(d) {
        //console.log("inside path", d)
         return line(dimensions.map(function(p,i) {   return [position(p), y[p](d[p])]; }));  //d[i] because the vallues array has data stored in terms of index
       }

       function position(d) {
         var v = dragging[d];
         return v == null ? x(d) : v;
       }

       svg2.append("circle").attr("cx",20).attr("cy",7).attr("r", 6).style("fill", color(0))
       svg2.append("circle").attr("cx",100).attr("cy",7).attr("r", 6).style("fill", color(1))
       svg2.append("circle").attr("cx",180).attr("cy",7).attr("r", 6).style("fill", color(2))
       svg2.append("circle").attr("cx",260).attr("cy",7).attr("r", 6).style("fill", color(3))
       svg2.append("text").attr("x", 30).attr("y", 7).text("Cluster 1").style("font-size", "15px").attr("alignment-baseline","middle")
       svg2.append("text").attr("x", 110).attr("y", 7).text("Cluster 2").style("font-size", "15px").attr("alignment-baseline","middle")
       svg2.append("text").attr("x", 190).attr("y", 7).text("Cluster 3").style("font-size", "15px").attr("alignment-baseline","middle")
       svg2.append("text").attr("x", 270).attr("y", 7).text("Cluster 4").style("font-size", "15px").attr("alignment-baseline","middle")
}


getpcpData()    