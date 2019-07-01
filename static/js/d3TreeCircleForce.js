//-------------------- generates a simultion force to show the correlation between wine price and rating for each country 
//--------------------         (Avg values for all wine variety and subvariety in each country)--------------------------
// Kevin-06-26-19

//find winetypes per country:
let urlFS = "/JSONForceSimulation";

var margin={"width":-800, "height":200}

var priceRadiusMult=1.0;

var rangePrice=[10000000000, 1E-12];//will be gaining the correct min and max values
var rangeRating=[10000000000, 1E-12];//will be gaining the correct min and max values

var circleRadiusFSRange=[10,50]
var width = window.innerWidth+margin.width, 
    height = window.innerHeight+margin.height, 
    ratingDivisor = 100, nodePadding = 2.5;

var svgFS = d3.select("#forceSimulation")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//var color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);
var color = ["#b3b3b3", "#66c2a5", "#8da0cb", "#fc8d62" , "#a6d854", "#ffd92f", "#e78ac3", "#000080"];

//add legend for colors using rectangles
color.forEach(function(d,i){
    svgFS.append("rect")
    .attr("x", 91+60*i)
    .attr("y", height-25)
    .attr("width", 10)
    .attr("height",10)
    .style("fill", d);
})
let rectTexts=["Avg(Rating):","<83","83-85","85-86","86-87","87-88","88-89","89-90",">90"]
rectTexts.forEach(function(d,i){
    svgFS.append("text")
       .attr("x", 23+60*i)
       .attr("y", height-28)
       .text(d)
       .style("font-size","10")
})

var simulation = d3.forceSimulation()
    .force("forceX", d3.forceX().strength(.1).x(width * .5))
    .force("forceY", d3.forceY().strength(.1).y(height * .5))
    .force("center", d3.forceCenter().x(width * .5).y(height * .5))
    .force("charge", 
    
    d3.forceManyBody().strength(-20));


 //create a tooltip
 var div = d3.select("#forceSimulation")
          .append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);

// d3 force simulation: dynamic
var graph=[];

d3.json(urlFS).then(function(data) {
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
        return b.price - a.price
    });
   
    //finding min and max of price and rating
    for (let i=0;i<graph.length;i++){
        rangePrice[0]=Math.min(rangePrice[0],graph[i]['price']);
        rangePrice[1]=Math.max(rangePrice[1],graph[i]['price']);
        rangeRating[0]=Math.min(rangeRating[0],graph[i]['rating']);
        rangeRating[1]=Math.max(rangeRating[1],graph[i]['rating']);
    }

    // add legend for circle sizes, courtesy to Laurent Chauvirey
    var l = circleLegend(svgFS)
        .domain([featureScale(rangePrice,circleRadiusFSRange)(rangePrice[0])*priceRadiusMult,
                 featureScale(rangePrice,circleRadiusFSRange)(rangePrice[1])*priceRadiusMult]) // the dataset min and max
        .range( [10,50]) // the circle area/size mapping
        .values( makeArr(rangePrice[0],rangePrice[1],4).map(d=>d.toFixed(0))) 
        .width(width+400) // it centers to this
        .height(height+500) // it centers to this
        .suffix('') // ability to pass in a suffix e.g. '%'
        .circleColor( '#888') // stroke of the circles
        .textPadding(50) // left padding on text
        .textColor( '#454545') // the fill for text
    // and render it
    l.render()

    svgFS.append("text")
        .attr("x", width-150)
        .attr("y", height-50)
        .text("Avg(Price): $")
        .style("font-size","10")


    //update the simulation based on the data
    simulation
        .nodes(graph)
        .force("collide", d3.forceCollide().strength(1.).radius(function(d){ return d.price + nodePadding; }).iterations(1))
        .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
        });

    var node = svgFS.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph)
        .enter().append("circle")
            .attr("r", function(d) { return featureScale(rangePrice,circleRadiusFSRange)(d.price)*priceRadiusMult})
            .attr("fill", function(d) { return getcolorSecond(d.rating) })
            //.attr("fill", function(d){ return getColour("#FF0000", '#0000FF', rangeRating[0], rangeRating[1], d.rating)})
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            //.on("mouseover",(d,i) => createTooltip(d,i))
            .on("mouseover", function(d,i){
              var matrix = this.getScreenCTM()
              .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));
              div.transition()        
              .duration(200)      
              .style("opacity", .9);

              div.html((`<h1>${d.country}</h2><br><h3>Rating= ${d.rating.toFixed(1)} 
                  (mean)</h3><br><h3>Price= $${d.price.toFixed(1)} (mean)</h3>`))
                  .style("left",d.x+ "px")
                  .style("top",d.y+ "px");

              console.log( "windowoffsetX=",window.pageXOffset,
                          "windowoffsetY=",window.pageYOffset,
                          this.getScreenCTM(),
                          "d.x=",d.x,"d.y=",d.y)
            })
            .on("mouseout",function(d){
              div.transition()        
                 .duration(500)      
                 .style("opacity", 0);
      })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

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

//linearly scaling all feature ranges so that circle radius always fits in [0,maxcircleRadiusFS] for all properties
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
    
    //linear space function
    function makeArr(startValue, stopValue, cardinality) {
        var arr = [];
        var currValue = startValue;
        var step = (stopValue - startValue) / (cardinality - 1);
        for (var i = 0; i < cardinality; i++) {
          arr.push(currValue + (step * i));
        }
        return arr;
    }
// // END OF HIRECHARY

//circleLegend from laurent chauvirey’s Block 
function circleLegend(selection) {

    var instance = {}

    // set some defaults 
    var api = {
        // domain: [0, 100], // the values min and max
        // range: [0, 1000], // the circle area/size mapping
        domain :[rangePrice[0]*priceRadiusMult,
                 rangePrice[1]*priceRadiusMult], // the dataset min and max
        range : ([10,50]), // the circle area/size mapping
        values: [8, 34, 89], // values for circles
        width: 10,
        height: 100,
        suffix:'', // ability to pass in a suffix
        circleColor: '#888',
        textPadding: 40,
        textColor: '#454545'
    }
    
    // var sqrtScale = d3.scaleSqrt()
    //     .domain(api.domain)
    //     .range(api.range)

    var sqrtScale = d3.scaleLinear()
        .domain(api.domain)
        .range(api.range)

    instance.render = function () {

        var s = selection.append('g')
            .attr('class', 'legend-wrap')
            // push down to radius of largest circle
            .attr('transform', 'translate(0,' + sqrtScale(d3.max(api.values)) + ')')

        // append the values for circles
        s.append('g')
            .attr('class', 'values-wrap')
            .selectAll('circle')
            .data(api.values)
            .enter().append('circle')
            .attr('class', function (d) { return 'values values-' + d; })
            .attr('r', function (d) { return sqrtScale(d); })
            .attr('cx', api.width/2)
            .attr('cy', function (d) { return api.height/2 - sqrtScale(d); })
            .style('fill', 'none') 
            .style('stroke', api.circleColor) 
            .style('opacity', 0.5) 

        // append some lines based on values
        s.append('g')
            .attr('class', 'values-line-wrap')
            .selectAll('.values-labels')
            .data(api.values)
            .enter().append('line')
            .attr('x1', function (d) { return api.width/2 + sqrtScale(d); })
            .attr('x2', api.width/2 + sqrtScale(api.domain[1]) + 10)
            .attr('y1', function (d) { return api.height/2 - sqrtScale(d); })
            .attr('y2', function (d) { return api.height/2 - sqrtScale(d); })
            .style('stroke', api.textColor)
            .style('stroke-dasharray', ('2,2'))

        // append some labels from values
        s.append('g')
            .attr('class', 'values-labels-wrap')
            .selectAll('.values-labels')
            .data(api.values)
            .enter().append('text')
            .attr('x', api.width/2 + sqrtScale(api.domain[1]) + api.textPadding)
            .attr('y', function (d) { return (api.height/2 - sqrtScale(d)) + 5; })
            .attr('shape-rendering', 'crispEdges')
            .style('text-anchor', 'end')
            .style('fill', api.textColor)
            .text(function (d) { return d + api.suffix; })

        return instance
    }

    for (var key in api) {
        instance[key] = getSet(key, instance).bind(api)
    }

    return instance

    // https://gist.github.com/gneatgeek/5892586
    function getSet(option, component) {
        return function (_) {
            if (! arguments.length) {
                return this[option];
            }
        this[option] = _;
        return component;
      }
    }
    
}
