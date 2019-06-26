//-------------------- KEVIN FOR MATT TO PRODUCE TREE OF COUNTRY VARIETY AND SUBVAIERTY --------------------------
//find winetypes per country:
let url = "/JSONForceSimulation";

var priceRadiusMult=1.0;
var rangePrice=[10000000000, 1E-12];//will be gaining the correct min and max values
var rangeRating=[10000000000, 1E-12];//will be gaining the correct min and max values

var width = window.innerWidth, height = window.innerHeight, ratingDivisor = 100, nodePadding = 2.5;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//var color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);
var color = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3", "#00080"];
color.forEach(function(d,i){
    svg.append("rect")
    .attr("x", 25+60*i)
    .attr("y", height-25)
    .attr("width", 10)
    .attr("height",10)
    .style("fill", d);
})

var simulation = d3.forceSimulation()
    .force("forceX", d3.forceX().strength(.1).x(width * .5))
    .force("forceY", d3.forceY().strength(.1).y(height * .5))
    .force("center", d3.forceCenter().x(width * .5).y(height * .5))
    .force("charge", d3.forceManyBody().strength(-50));

// d3 force simulation: dynsmic
var graph=[];

d3.json(url).then(function(data) {
    d=data.data
    console.log(data.data)
    for (let i=0;i<data['data'].length;i++){
        graph.push(
            {'country':d[i][0],
            'rating': d[i][1],
            'price':d[i][2]})
    }

    // sort the nodes so that the bigger ones are at the back
    graph = graph.sort(function(a,b){ 
        return b.price - a.price});
    
    //finding min and max of price and rating
    for (let i=0;i<graph.length;i++){
        rangePrice[0]=Math.min(rangePrice[0],graph[i]['price']);
        rangePrice[1]=Math.max(rangePrice[1],graph[i]['price']);
        rangeRating[0]=Math.min(rangeRating[0],graph[i]['rating']);
        rangeRating[1]=Math.max(rangeRating[1],graph[i]['rating']);
    }
    console.log(rangeRating)
    //update the simulation based on the data
    simulation
        .nodes(graph)
        .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
        .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
        });

    var node = svg.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph)
        .enter().append("circle")
        .attr("r", function(d) { return featureScale(rangePrice,[10,50])(d.price)*priceRadiusMult})
        .attr("fill", function(d) { return getcolorSecond(d.rating) })
        //.attr("fill", function(d){ return getColour("#FF0000", '#0000FF', rangeRating[0], rangeRating[1], d.rating)})
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
console.log(graph)
});

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }


//find all instances of an element in an array
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

 //find unique vaues in an array
 function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

//linearly scaling all feature ranges so that circle radius always fits in [0,maxCircleRadius] for all properties
function featureScale(featureRange,rangeSize) {
    let x = d3.scaleLinear()
      .domain(featureRange)
      .range(rangeSize);
  
    return x;
  }

  //change color 
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  function map(value, fromSource, toSource, fromTarget, toTarget) {
    return (value - fromSource) / (toSource - fromSource) * (toTarget - fromTarget) + fromTarget;
  }
  
  function getColour(startColour, endColour, min, max, value) {
    var startRGB = hexToRgb(startColour);
    var endRGB = hexToRgb(endColour);
    var percentFade = map(value, min, max, 0, 1);
  
    var diffRed = endRGB.r - startRGB.r;
    var diffGreen = endRGB.g - startRGB.g;
    var diffBlue = endRGB.b - startRGB.b;
  
    diffRed = (diffRed * percentFade) + startRGB.r;
    diffGreen = (diffGreen * percentFade) + startRGB.g;
    diffBlue = (diffBlue * percentFade) + startRGB.b;
  
    var result = "rgb(" + Math.round(diffRed) + ", " + Math.round(diffGreen) + ", " + Math.round(diffBlue) + ")";
    return result;
  }

  function getcolorSecond(value){
      if (value<83){
        return color[0]
      }else if (value<85){
        return color[1]
      }else if (value<86){
        return color[2]
      }else if (value<87){
        return color[3]
      }else if (value<88){
        return color[4]
      }else if (value<89){
        return color[5]
      }else if (value<90){
        return color[6]
      }else{
        return color[7]
      }
  }
// // END OF HIRECHARY