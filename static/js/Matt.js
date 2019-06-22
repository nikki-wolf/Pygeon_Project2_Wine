
//************************FORMAT THE DATA SO WE CAN PUT INTO FLAT DATA*************************/
// var countries
// var varieties 
// var subvarieties;

//    var url = "/api_rating"; 

//     // countries=[]; varieties=[]; subvarieties=[];
//     // d3.json(url).then(function(wineData) {

//         d3.json(url, function(wineData) {
//         console.log(wineData);
//         for(let i=0;i<wineData.length;i++){
//             countries.push(wineData[i].Country)
//             varieties.push(wineData[i].Variety)
//             subvarieties.push(wineData[i].Subvariety)}
//     });  

//     console.log(countries);
//     console.log(varieties);
//     console.log(subvarieties);

Wine_types={'Bold Red': ['Malbec', 'Syrah','Red Blend','Shiraz', 'Mourvedre', 'Merlot','Bordeaux-style Red Blend', 'Pinotage', 'Petite Sirah', 'Touriga Nacional', 'Cabernet Sauvignon', 'Portuguese Red', 'Meritage'],
           'Medium Red': ['Meriot', 'Sangiovese', 'Rhône-style Red Blend','Zinfandel','Cabernet Franc', 'Tempranillo', 'Nebbiolo', 'Barbera', 'Cotes du Rhone Blend'],
           'Light Red':['Pinot Noir', 'Grenache', 'Gamay', 'St. Laurent', 'Carignan', 'Counoise'],
           'Rich White': ['Chardonnay', 'Semillon','Viognier', 'Marsanne', 'Roussanne'],
           'Light White': ['Bordeaux-style White Blend','Sauvignon Blanc', 'White Blend' , 'Albarino', 'Pitot Blanc', 'Vermentino', 'Melon de Bourgogne', 'Gargenega', 'Trebbiano', 'Pinot Gris', 'Pinot Grigio', 'Veltliner'],
           'Sweet White': ['Moscato', 'Riesling', 'Chenin Blanc', 'Gewurztraminer', 'Late Harvest Whites', 'Alascian Pinot Gris'],
           'Rosé': ['Rosé','Provencal Rose', 'White Zinfandel', 'Loire Valley Rose', 'Pinot Noir Rose', 'Syrah Rose', 'Garnache Rosado', 'Bandol Rose', 'Tempranilio Rose', 'Saignee Method Rose'],
           'Sparkling': ['Champagne', 'Prosecco', 'Cremant', 'Cava', 'Metodo Classico', 'Sparkling Wine', 'Sparkling Rose', 'Sparkling Blend', 'Champagne Blend'],
           'Dessert': ['Port', 'Sherry', 'Maderia', 'Vin Santo', 'Muscat', 'PX', 'Pedro Ximenez'],
           'Others': ['Others']
          }
//find winetypes per country:
var countriesRating=[]
var varieties=[]
var subvarieties=[];

var url = "/api_rating";
var wineRatingData=[]
 d3.json(url,function(wineData) {
   wineRatingData.push(wineData)
   console.log(wineData)
   wineData.forEach(function(d,i){
     countriesRating.push(d.Country)
     varieties.push(eval( '(' + d["Variety"].replace(/\bnan\b/g, "null") + ')' ).filter(onlyUnique))
     subvarieties.push(eval( '(' + d["Subvariety"].replace(/\bnan\b/g, "null") + ')' ).filter(onlyUnique))
   })
   console.log(countriesRating)
   console.log(varieties);
   console.log(subvarieties);
   var subvar=[]
   var a;
   console.log(countriesRating.length)
   for (let i=0;i<countriesRating.length;i++){
     subvar[i]=[];
     //console.log(i,varieties[i])
     for (let j=0;j<varieties[i].length;j++){
       //console.log(i,j,varieties[i][j])
       subvar[i][j]=[];
       //if (Object.keys(Wine_types).includes(varieties[i][j])){

         //console.log(i,j,Wine_types[varieties[i][j]])
         //console.log("i=",i,"obj=",Wine_types[varieties[i][j]])
           subvar[i][j].push(subvarieties[i][j])
       for (let k=0;k<subvarieties[i].length;k++){
         if ((Wine_types[varieties[i][j]]).includes(subvarieties[i][k])){
             subvar[i][j].push(subvarieties[i][j])
         }
       }
       subvar[i][j]=subvar[i][j].filter(onlyUnique)
     }
        // }
   }
   console.log(subvar)
 });

 //*****************************************Place into Flat DATA**************************************************************//
 var countriesRating=[]
 var varieties=[]
 var subvarieties=[];

//  Turn data into Flat Data
 var flat = [
    {"name": "wine", "Parent": null}]
 for(let i=0; i < countriesRating.length; i++){
    flat.push({"name": countriesRating[i], "parent": "wine"})
    for(let j=0; j < varieties[i].length; j++){
        flat.push({"name": varieties[i][j], "parent": countriesRating[i]})
        for(let k=0; k < varieties[i][j].length; k++ ){
            flat.push({"name": subvarieties[i][j][k], "parent": varieties[i][j]})
        }
 

    }
 
 };
 console.log(flat);

//EXAMPLE OF STRATIFY//
//  // the flat data
// var flatData = [
//     {"name": "Top Level", "parent": null},
//     {"name": "Level 2: A", "parent": "Top Level" },
//     {"name": "Level 2: B", "parent": "Top Level" },
//     {"name": "Son of A", "parent": "Level 2: A" },
//     {"name": "Daughter of A", "parent": "Level 2: A" }
//    ];
   
//    // convert the flat data into a hierarchy
//    var treeData = d3.stratify()
//     .id(function(d) { return d.name; })
//     .parentId(function(d) { return d.parent; })
//     (flatData);

//************************VISUALIZATIONS***************************************************/

var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;
	
var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," 
	                                + margin.top + ")");

root = Wine[0];
root.x0 = height / 2;
root.y0 = 0;

function toggleAll(d) {
  if (d.children) {
    if (d.status == "green") {
      d._children = d.children;
      d._children.forEach(toggleAll);
      d.children = null;
    }
  }
}

root.children.forEach(toggleAll);
  
update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { 
		  return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d.status; });

  nodeEnter.append("text")
	  .attr("x", function(d) { 
		  return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { 
		  return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { 
		  return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d.status; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { 
		  return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  console.log(d);
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}



//find unique vaues in an array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
   }
