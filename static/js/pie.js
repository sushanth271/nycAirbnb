function getPie(){
    $.post("/Pie",{'borough':'year'}, function(data){
        // console.log("DATA FOR PIE CAHRT:")
        // console.log(data)
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
    d3.select("#left-bottom").select("svg").remove();

    function getRandomPlaces(listOfPlaces, num){
        // for(let i = 0; i < num; ){
        //     const random = Math.floor(Math.random() * listOfPlaces.length);
        //     if(listOfPlaces.indexOf(listOfPlaces[random]) !== -1){
        //     continue;
        //     };
        //     res.push(listOfPlaces[random]);
        //     i++;
        // };

        return listOfPlaces.slice(0,num);
    }
    // console.log(data.length)
    // console.log(data)
    var inputData = {"Manhattan":0,
                         "Brooklyn":0,
                        "Bronx":0,
                        "Queens":0,
                        "Staten Island":0}

    for(i=0;i<data.length;i++){
        inputData[data[i]["borough"]]++
    }
    // console.log(inputData)

    number_of_words = 12

    boroughs = ["Manhattan", "Brooklyn", "Bronx", "Queens", "Staten Island"]
    for(i =0; i < boroughs.length;i++){
            inputData[boroughs[i]] = Math.ceil((inputData[boroughs[i]]*number_of_words)/data.length)
    }

    // console.log(inputData)

    
    

    var touristPlaces = {"Manhattan":["Charging Bull", "Central Park", "Statue of Liberty", "Empire State Building", "Times Square", "Rockefeller Center", "Grand Central Terminal", "Central Park Zoo", "Vessel", "Top of The Rock"],
                         "Brooklyn":["Coney Island", "Prospect Park", "Brooklyn Museum", "Prospect Park Zoo", "Domino Park", "Brooklyn Brewery", "Wonder Wheel","Kings Theatre", "Ocean Parkway", "Plumb Beach"],
                        "Bronx":["Bronx Zoo", "Yankee Stadium", "New York Botanical Garden", "Broadway", "Throgs Neck Bridge", "Jungle World", "World of Birds", "Hunter Island","Children's Zoo", "Congo Gorilla Forest"],
                        "Queens":["Queens Museum", "Museum of the Moving Image", "Queens Zoo", "Astoria Park", "SculptureCenter", "Jacob Riis Park", "Fort Tilden", "Forest Park", "Whitestone Bridge", "Rikers Island"],
                        "Staten Island":["Staten Island Zoo", "Verrazzano", "South Beach", "Goethals Bridge", "New York Harbor", "Clove Lakes Park", "Bayonne Bridge", "Freshkills Park", "Great Kills Park", "St. George Ferry Terminal"]}
    res = []
    for(i = 0; i < boroughs.length; i++){
            res.push(...getRandomPlaces(touristPlaces[boroughs[i]], inputData[boroughs[i]]))
            // console.log(res)
    }
    var myWords = []
    for(i = 0 ; i < res.length; i++){
        myWords.push({word:res[i], size: Math.random() * 50})
    }
    //var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 425 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#left-bottom").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
  .padding(5)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "steelblue")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .on("mouseover", function(d){
          d3.select(this).style("cursor", "pointer"); 
        })
        .on("click", function(d){
          var str1 = "https://www.google.com/search?q="
          var str2 = d.text
          var res = str1.concat(str2)
          window.open(res, "_blank");
        });
    }
}

// function drawPie(data){
//     // console.log("VALUE OF K IS:",k)
//     // set the dimensions and margins of the graph
// var width = 450
// height = 450
// margin = 40
// // console.log("Inside pie chart")
// // console.log(data)
// // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
// var radius = Math.min(width, height) / 2 - margin
// // d3.select("#left-bottom").remove();
// // append the svg object to the div called 'my_dataviz'
// d3.select("#left-bottom").select("svg").remove();
// var svg = d3.select("#left-bottom")
// .append("svg")
// .attr("width", width)
// .attr("height", height)
// .append("g")
// .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// // create 2 data_set
// var dict1 = {}
// // console.log(data[0])
// for (i=0; i<data[0].length;i++){
//     // console.log(data[0][i].Bathroom)
//     dict1[data[0][i].Bathroom]=data[0][i].value
// }
// // console.log("dict is",dict1)
// // var data1 = {a: 9, b: 20, c:30, d:8, e:12}
// var data1 = dict1

// var dict2 = {}
// for (i=0; i<data[1].length;i++){
//     // console.log(data[0][i].Bathroom)
//     dict2[data[1][i].bedrooms]=data[1][i].value
// }
// // var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}
// var data2 = dict2

// // set the color scale
// var color = d3.scaleOrdinal()
// .domain(["a", "b", "c", "d", "e", "f","g","h","i","j","k"])
// .range(d3.schemeDark2);

// // A function that create / update the plot for a given variable:
// function update(data) {

// // Compute the position of each group on the pie:
// var pie = d3.pie()
// .value(function(d) {return d.value; })
// .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
// var data_ready = pie(d3.entries(data))

// // map to data
// var u = svg.selectAll("path")
// .data(data_ready)

// // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
// u
// .enter()
// .append('path')
// .merge(u)
// .transition()
// .duration(1000)
// .attr('d', d3.arc()
//   .innerRadius(0)
//   .outerRadius(radius)
// )
// .attr('fill', function(d){ return(color(d.data.key)) })
// .attr("stroke", "white")
// .style("stroke-width", "2px")
// .style("opacity", 1)

// // remove the group that is not present anymore
// u
// .exit()
// .remove()

// }

// // Initialize the plot with the first dataset
// if (k==1){
//     update(data1)
// }
// if(k==2){
//     update(data2)
// }
// }