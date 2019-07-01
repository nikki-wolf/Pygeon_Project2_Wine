//-------------------- KEVIN FOR MATT TO PRODUCE TREE OF COUNTRY VARIETY AND SUBVAIERTY --------------------------
//find winetypes per country:
var countriesRating=[];
var varieties=[];
var subvarieties=[];
var price=[];
var rating=[];
var wineTree={};

var varietiesUnique=[];
var subvarietiesUnique=[];
var wineData=[]

var wineType={};

 var url = "/JSONTree";
 var wineRatingData=[]

 //find unique vaues in an array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

// d3 tree: dynsmic
d3.json(url).then(function(treeData) {

    // Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 0, bottom: 30, left: 45},
        width = 800 - margin.left - margin.right,
        height = 1200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#D3tree").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate("
            + margin.left + "," + margin.top + ")");

    var i = 0,
        duration = 750,
        root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
    if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
    }

    function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ d.y = d.depth * 180});

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { return d.data.name; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
})


//d3 tree: STatic format
// var margin = {top: 100, right: 10, bottom: 240, left: 10},
// width = 1200 - margin.left - margin.right,
// height = 1200 - margin.top - margin.bottom;

// var orientations = {
//   "bottom-to-top": {
//     size: [width, height],
//     x: function(d) { return d.x; },
//     y: function(d) { return height - d.y; }
//   }
// };

// var svg = d3.select("body").selectAll("svg")
//     .data(d3.entries(orientations))
//     .enter().append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
// d3.json("/JSONTree").then(function(data) {

//   svg.each(function(orientation) {
//     var svg = d3.select(this),
//         o = orientation.value;

//     // Compute the layout.
//     var treemap = d3.tree().size(o.size);
        
//     var nodes = d3.hierarchy(data);
    
//         nodes = treemap(nodes);
    
//     var links = nodes.descendants().slice(1);


//     // Create the link lines.
//     svg.selectAll(".link")
//         .data(links)
//       .enter().append("path")
//         .attr("class", "link")
//         .attr("d", function(d) {
//        return "M" + d.x + "," + o.y(d)
//          + "C" + d.x + "," + (o.y(d) + o.y(d.parent)) / 2
//          + " " + d.parent.x + "," +  (o.y(d) + o.y(d.parent)) / 2
//          + " " + d.parent.x + "," + o.y(d.parent);
//        });

//     // Create the node circles.
//     var node = svg.selectAll(".node")
//         .data(nodes.descendants())
//       .enter()
//     		.append("g")
//     node.append("circle")
//         .attr("class", "node")
//         .attr("r", 4.5)
//         .attr("cx", o.x)
//         .attr("cy", o.y);
    
    
//    node .append("text")
//         .text(function (d) {return d.data.name;})
//         .attr("x", o.x)
//         .attr("dx", 5)
//         .attr("y", o.y);
//   });
// });
// //   })

//find all instances of an element in an array
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}
// // END OF HIRECHARY