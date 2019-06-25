
//-------------------- KEVIN FOR MATT TO PRODUCE TREE OF COUNTRY VARIETY AND SUBVAIERTY --------------------------
wineTypes={'Bold Red': ['Malbec', 'Syrah','Red Blend','Shiraz', 'Mourvedre', 'Merlot','Bordeaux-style Red Blend', 'Pinotage', 'Petite Sirah', 'Touriga Nacional', 'Cabernet Sauvignon', 'Portuguese Red', 'Meritage'],
            'Medium Red': ['Meriot', 'Sangiovese', 'Rhône-style Red Blend','Zinfandel','Cabernet Franc', 'Tempranillo', 'Nebbiolo', 'Barbera', 'Cotes du Rhone Blend'],
            'Light Red':['Pinot Noir', 'Grenache', 'Gamay', 'St. Laurent', 'Carignan', 'Counoise'],
            'Rich White': ['Chardonnay', 'Semillon','Viognier', 'Marsanne', 'Roussanne'],
            'Light White': ['Bordeaux-style White Blend','Sauvignon Blanc', 'White Blend' , 'Albarino', 'Pitot Blanc', 'Vermentino', 'Melon de Bourgogne', 'Gargenega', 'Trebbiano', 'Pinot Gris', 'Pinot Grigio', 'Veltliner'],
            'Sweet White': ['Moscato', 'Riesling', 'Chenin Blanc', 'Gewurztraminer', 'Late Harvest Whites', 'Alascian Pinot Gris'],
            'Rosé': ['Rosé','Provencal Rose', 'White Zinfandel', 'Loire Valley Rose', 'Pinot Noir Rose', 'Syrah Rose', 'Garnache Rosado', 'Bandol Rose', 'Tempranilio Rose', 'Saignee Method Rose'],
            'Sparkling': ['Champagne', 'Prosecco', 'Cremant', 'Cava', 'Metodo Classico', 'Sparkling Wine', 'Sparkling Rose', 'Sparkling Blend', 'Champagne Blend'],
            'Dessert': ['Port', 'Sherry', 'Maderia', 'Vin Santo', 'Muscat', 'PX', 'Pedro Ximenez'],
            //'Others': ['Others']
           }
//find winetypes per country:
var countriesRating=[]
var varieties=[]
var subvarieties=[];
var price=[]
var wineTree={}

var varietiesUnique=[];
var subvarietiesUnique=[];

 var url = "/api_rating?country=Brazil";
 var wineRatingData=[]
 d3.json(url).then(function(wineData) {
    wineRatingData.push(wineData)
    console.log(wineData)
    wineData.forEach(function(d,i){
      countriesRating.push(d.Country)
      varieties.push(eval( '(' + d["Variety"].replace(/\bnan\b/g, "null") + ')' ))
      subvarieties.push(eval( '(' + d["Subvariety"].replace(/\bnan\b/g, "null") + ')' ))
      price.push(JSON.parse(d["Price"].replace(/\bnan\b/g, "null")))
    })

    console.log(countriesRating);
    console.log(varieties);
    console.log(subvarieties);

   // creating tree format of wine data including root: World, node1: country, node2: variety, node3: subvariety
    console.log('Initializeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    wineTree={"name": "World"};
    wineTree.children=[];//initiating list of countries
    for (let i=0;i<countriesRating.length;i++){//loop through countries

      varietiesUnique=varieties[i].filter(onlyUnique);
      subvarietiesUnique=subvarieties[i].filter(onlyUnique);

      console.log(varietiesUnique); 
      console.log(subvarietiesUnique);

      wineTree.children.push({"name": countriesRating[i]})
      wineTree.children[i].children=[]//initiating list of varieties for each ocuntry

      for (let j=0;j<varietiesUnique.length;j++)
      {//loop thorugh varieties of each country        
        if (varietiesUnique[j] !== 'Others')
        {

          wineTree.children[i].children.push({"name":varietiesUnique[j]})//Sparkling, Bold Red, Rich White, Sweet White, ...
          console.log(`vari=${i},j=${j}=${varietiesUnique[j]}`)
          wineTree.children[i].children[j].children=[]//initiating list of subvarieties for each variety of each country
          
          for (let k=0;k<subvarietiesUnique.length;k++)
          {//loop through subvarieties of each country
            console.log(i,j,k,"var=",varietiesUnique[j], "subvar=", subvarietiesUnique[k])
            //if (subvarieties[i][k] != null && wineTypes[varietiesUnique[j]].includes(subvarietiesUnique[k]) ){
            
            if (wineTypes[varietiesUnique[j]].includes(subvarietiesUnique[k]))
            {
                //find a mean vlaue for all instances of this subvariety in this country
                let indSubVarCountVal=getAllIndexes(subvarieties[i],subvarietiesUnique[k]); //list of index of those instances
                let sum=0
                for (let l=0;l<indSubVarCountVal.length;l++){
                    sum += price[i][indSubVarCountVal[l]]
                }
                let mean=sum/indSubVarCountVal.length
                console.log(i,j,k,wineTree.children[i].children[j], 
                          `var,j=${j},=${varietiesUnique[k]}`,
                          "length=", indSubVarCountVal.length,
                          "sum=",sum,
                          "mean=",mean)
                //wineTree.children[i].children[j].children[k].push({"name":subvarietiesUnique[k]})
              //  wineTree.children[i].children[j].children.push({"name":subvarietiesUnique[k]})
               // wineTree.children[i].children[j].childre[k].push({"value":mean})
                wineTree.children[i].children[j].children[k].push({"name":subvarietiesUnique[k],"value":mean})
                subvarieties=subvarieties.map(function (d) {return d == subvarietiesUnique[k] ? null: d});
                console.log("!!!!!!!!!!!!!!!!!!!!!!subvar=", subvarieties, `subvar${k}=${subvarietiesUnique[k]}`)
            }
            console.log(i,j,k,wineTree)
          }
        }
      }
      console.log(wineTree)
    }

















    console.log(wineTree)
    //post data to JSONTree route in flask app
    // $.post( "/JSONTree", {
    //   javascript_treeData: wineTree 
    //$.get(`/JSONTree/wineTree`)

    //d3 tree
    var margin = {top: 100, right: 10, bottom: 240, left: 10},
    width = 340 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var orientations = {
  "bottom-to-top": {
    size: [width, height],
    x: function(d) { return d.x; },
    y: function(d) { return height - d.y; }
  }
};

var svg = d3.select("body").selectAll("svg")
    .data(d3.entries(orientations))
    .enter().append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
d3.json("/graphJSON").then(function(data) {

  svg.each(function(orientation) {
    var svg = d3.select(this),
        o = orientation.value;

    // Compute the layout.
    var treemap = d3.tree().size(o.size);
        
    var nodes = d3.hierarchy(data);
    
        nodes = treemap(nodes);
    
    var links = nodes.descendants().slice(1);


    // Create the link lines.
    svg.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
       return "M" + d.x + "," + o.y(d)
         + "C" + d.x + "," + (o.y(d) + o.y(d.parent)) / 2
         + " " + d.parent.x + "," +  (o.y(d) + o.y(d.parent)) / 2
         + " " + d.parent.x + "," + o.y(d.parent);
       });

    // Create the node circles.
    var node = svg.selectAll(".node")
        .data(nodes.descendants())
      .enter()
    		.append("g")
    node.append("circle")
        .attr("class", "node")
        .attr("r", 4.5)
        .attr("cx", o.x)
        .attr("cy", o.y);
    
    
   node .append("text")
        .text(function (d) {return d.data.name;})
        .attr("x", o.x)
        .attr("dx", 5)
        .attr("y", o.y);
  });
});





  })
  //find all instances of an element in an array
  function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}


  //     if (Object.keys(wineTypes).includes(varieties)
  //       .some(yvarieties[i]){
  //       subvar[i]=[];

  //     }

  //     subvar
  //   }
  //   console.log(subvar)
  // });

// END OF HIRECHARY