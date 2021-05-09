function getMap(){
  $.post("/map", function(data){
      //console.log("DATA FOR LINE:");
      //console.log(data);
      drawNYCMap(data);

  });
};

getMap()

function drawNYCMap(serverdata){
  //console.log("Data is", serverdata)
  var width = 500,
  height = 650,
  centered;
  d3.select('#mid-top').select('svg').remove()
  // Define color scale
  var color = d3.scaleLinear()
    .domain([1, 20])
    .clamp(true)
    .range(['#fff', '#409A99']);

  var projection = d3.geoMercator()
    .scale(45000)
    // Center the Map in Colombia
    .center([-73.935242, 40.730610])
    .translate([width / 1.2, height / 2.7]);

  var path = d3.geoPath()
    .projection(projection);

  // Set svg width & height
  var svg = d3.select("#mid-top")
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style( "background-color", "#252322");
    //.attr("viewbox", '0 0 100% 100%');

  // Add background
  svg.append('rect')
    .attr('class', 'background')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr("translate","('0', '100')")
    //.style("background-color", "#fff")
    .attr("fill","#fff")
    .on('click', clicked);

  var g = svg.append('g');

  var effectLayer = g.append('g')
    .classed('effect-layer', true);

  var mapLayer = g.append('g')
    .classed('map-layer', true);

  var dummyText = g.append('text')
    .classed('dummy-text', true)
    .attr('x', 10)
    .attr('y', 30)
    .style('opacity', 0);

  var bigText = g.append('text')
    .classed('big-text', true)
    .attr('x', 20)
    .attr('y', 45);


  // Load map data

   // Get province name
   function nameFn(d){
    //  console.log("d is ", d)
    //  console.log("d boroname is ", d.properties.BoroName)
    return d && d.properties ? d.properties.BoroName : null;
  }
  
     // Get province name length
  function nameLength(d){
      var n = nameFn(d);
      return n ? n.length : 0;
  }
  
    // Get province color
  function fillFn(d){
      //return color(nameLength(d));
      //console.log("d is", d)
      return color(1);
  }

  var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  var FONTS = [
    "Open Sans",
    "Josefin Slab",
    "Arvo",
    "Lato",
    "Vollkorn",
    "Abril Fatface",
    "Old StandardTT",
    "Droid+Sans",
    "Lobster",
    "Inconsolata",
    "Montserrat",
    "Playfair Display",
    "Karla",
    "Alegreya",
    "Libre Baskerville",
    "Merriweather",
    "Lora",
    "Archivo Narrow",
    "Neuton",
    "Signika",
    "Questrial",
    "Fjalla One",
    "Bitter",
    "Varela Round"
  ];

  function textArt(text){
    // Use random font
    var fontIndex = Math.round(Math.random() * FONTS.length);
    var fontFamily = FONTS[fontIndex] + ', ' + BASE_FONT;
  
    bigText
      .style('font-family', fontFamily)
      .text(text)
      .style('fill', '#fff');
    //console.log("text is", text)
    // Use dummy text to compute actual width of the text
    // getBBox() will return bounding box
    dummyText
      .style('font-family', fontFamily)
      .text(text);
    var bbox = dummyText.node().getBBox();
  
    var textWidth = bbox.width;
    var textHeight = bbox.height;
    var xGap = 3;
    var yGap = 1;
  
    // Generate the positions of the text in the background
    var xPtr = 0;
    var yPtr = 0;
    var positions = [];
    var rowCount = 0;
    while(yPtr < height){
      while(xPtr < width+100){
        var point = {
          text: text,
          index: positions.length,
          x: xPtr,
          y: yPtr
        };
        var dx = point.x - width/2 + textWidth/2;
        var dy = point.y - height/2;
        point.distance = dx*dx + dy*dy;
  
        positions.push(point);
        xPtr += textWidth + xGap;
      }
      rowCount++;
      xPtr = rowCount%2===0 ? 0 : -textWidth/2;
      xPtr += Math.random() * 10;
      yPtr += textHeight + yGap;
    }
    
    console.log("text is", text)
    var selection = effectLayer.selectAll('text')
      .data(positions, function(d){return d.text+'/'+d.index;});
  
    // // // Clear old ones
    selection.exit().transition()
      .style('opacity', 0)
      .remove();
  
    // // Create text but set opacity to 0
    selection.enter().append('text')
      .text(function(d){return d.text;})
      .attr('x', function(d){return d.x;})
      .attr('y', function(d){return d.y;})
      .style('font-family', fontFamily)
      .style('fill', '#777')
      .style('opacity', 0);
  
    selection
      .style('font-family', fontFamily)
      .attr('x', function(d){return d.x;})
      .attr('y', function(d){return d.y;});
  
    // Create transtion to increase opacity from 0 to 0.1-0.5
    // Add delay based on distance from the center of the <svg> and a bit more randomness.
    selection.transition()
      .delay(function(d){
        return d.distance * 0.01 + Math.random()*1000;
      })
      .style('opacity', function(d){
        return 0.1 + Math.random()*0.4;
      });
  }
  


  function mouseover(d){
    //console.log("here mousover")
      // Highlight hovered province
      //d3.select(this).style('fill', 'orange');
      d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
    
      // Draw effects
      textArt(nameFn(d));
  }
    
  function mouseout(d){
      // Reset province color
      // mapLayer.selectAll('path')
      //   .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
    
      d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
      // Remove effect text
      effectLayer.selectAll('text').transition()
        .style('opacity', 0)
        .remove();
    
      // Clear province name
      bigText.text('');
  }
  
  // When clicked, zoom in
  function clicked(d) {
    console.log("cliked zoom in")
    // console.log("d in click event is", nameFn(d))
    // console.log("here")
    var x, y, k;
  
    // Compute centroid of the selected path
    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
      console.log("zooming in")
      
      filteredData = []
    for( i = 0 ; i< serverdata.length; i++){
      if(serverdata[i]["borough"] == nameFn(d)){
        filteredData.push(serverdata[i])
      }
    }
    isBoroughClicked = true
    //console.log("filtered data is ", filteredData)
    drawScatterPlotv2(filteredData);
    drawlinev2(filteredData);
    drawPCP(filteredData);
    drawBorough(filteredData);
    
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
      console.log("server data is", serverdata)
      drawScatterPlotv2(serverdata)
      drawlinev2(serverdata);
      drawPCP(serverdata);
      drawBorough(serverdata)
      isBoroughClicked = false
      
      
    }
  
    // Highlight the clicked province
    //mapLayer.selectAll('path')
      //.style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
  
    // Zoom
    g.transition()
      .duration(750)
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
      //console.log("server data is", serverdata)
    
   
    

  }  

      // var svg2 = d3.select("#mid-top")
      //   .append("svg")
      //   .attr("id","svg-mt")
      //   .attr("width", "100%")
      //   .attr("height", "100%")
      //   .style("background-color", "#fff")
      //   .append("g")
        //.attr("transform", "translate(130,130)")
        var data = d3.map();
        var colorScale = d3.scaleThreshold()
  .domain([0,100,200,300,400,500,600,700,1000])
  .range(d3.schemeBlues[7]);
        d3.queue()
        .defer(d3.json, "/static/json/nyc.geojson")
        .defer(d3.csv, "/static/json/borough_freq_2020.csv", function(d) { data.set(d.neighbourhood_group_cleansed, +d.count); })
        .await(ready);
//   d3.csv("/Data/listings_2019.csv", 
//         function(data){
//           for (var i = 0; i < data.length; i++) {
//             console.log(data[i]);
        
//         }
// });

//d3.csv('/static/json/borough_freq_2020.csv', function(error, temp){  console.log(temp)});

     // d3.json('/static/json/nyc.geojson', function(mapData) {
     function ready(error, mapData){
       if(error){console.log(error);}
           console.log(mapData)
          // console.log(serverdata)
          var features = mapData.features;
          

          // Update color scale domain based on data
          //color.domain([0, d3.max(features, nameLength)]);
        // console.log("features is", features)
          // Draw each province as a path
          mapLayer.selectAll('path')
              .data(features)
              .enter().append('path')
              .attr('d', path)
              .attr('vector-effect', 'non-scaling-stroke')
              .attr('fill', function(d){
                // /console.log("data is", serverdata);'
                console.log(d)
                d.total = data.get(d.properties.BoroName) || 0;
                console.log(d.total)
                return colorScale(d.total);
              })
              .on('mouseover', mouseover)
              .on('mouseout', mouseout)
              .on('click', clicked);

      };
 
}


//drawNYCMap();