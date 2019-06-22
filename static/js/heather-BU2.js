// global variables
var countryUnpack, priceUnpack, ratingUnpack,
    varietyUnpack, uniqueCountry, uniqueID,
    ratingFilled,priceFilled, countryFilled,
    countryNumber, 
    priceCountry, ratingCountry, varietyCountry, subvarietyCountry, varietyCountryUnique;

// plot function
function myParallel(contInd) {
  var url = "/api_rating";
  d3.json(url).then(function(wineData) {
    console.log(wineData)
    
      function unpack(rows, key) {
        return rows.map(function(row) { 
           return row[key]; 
         });
      }
      countryUnpack = unpack(wineData, 'Country');
      countryFilled=countryUnpack.map(function(d){
        if (d==null){
          return "NA"
        }
        return d;
      })
      priceCountry=[]
      ratingCountry=[]
      varietyCountry=[]
      varietyCountryUnique=[]
      console.log(wineData.length)
      for(let i=0;i<wineData.length;i++){
        priceCountry.push(JSON.parse(wineData[i].Price.replace(/\bnan\b/g, "null")))
        ratingCountry.push(JSON.parse(wineData[i].Rating.replace(/\bnan\b/g, "null")))
        varietyCountry.push(eval( '(' + wineData[i].Variety.replace(/\bnan\b/g, "null") + ')' ))
        varietyCountryUnique.push(eval( '(' + wineData[i].Variety.replace(/\bnan\b/g, "null") + ')' ).filter(onlyUnique))
      }
      // loop through each unique country, grab the ID and push it to an array. uniqueID was declared as global variable
      //uniqueCountry.forEach(function(value, index) {
      //  uniqueID.push(index);
     // });
     var data = [{
      type: 'parcoords',
      visible: true,
      line: {
        showscale: true,
        color:  Array.apply(0,new Array(43)).map(function(_,i){ return i+1 }),
        cmin: 1,
        cmax: 43,
        colorscale: 'Jet',
        // color: unpack(wineData, 'country'),
        //color:  Array.apply(0,new Array(43)).map(function(_,i){ return i+1 }),
        //colorscale: 'Electric',
        //cmin:1,
        //cmax: 42
      },
      
      dimensions: [
        // {
        //   range: [0, 120915],
        //   label: 'Country',
        //   values: Array.apply(0,new Array(120915)).map(function(_,i){ return i+1 }), 
        // },

        
        // {
        // range: [0,uniqueCountry.length],
        // tickvals: uniqueID,
        // ticktext: uniqueCountry,
        // label: 'Countries',
        // values: countryNumber.slice(20000,30000)
        // },
        {
        //constraintrange: [0,10],
        range: [0, 1000],
        label: 'Price',
        values: priceCountry[contInd].slice(0,1000),
        // multiselect:true
      
      }, 
      {
        constraintrange: [86,90],
        pad:[200,200,200],
        // multiselect: true,
        label: 'Rating',
        range: [80, Math.max(...ratingCountry[contInd])],
        values: ratingCountry[contInd].slice(0,1000),
      },
      {
        range: [0,varietyCountryUnique[contInd].length],
        label: 'Variety',
        tickvals: Array.apply(0,new Array(varietyCountryUnique.length)).map(function(_,i){ return i+1 }),
        ticktext: varietyCountryUnique[contInd],
        values: varietyCountry[contInd].slice(0,1000)
      }
      ]
    }];
    // var layout = {
    //   width: 710,
    //   height: 620
    // };
    var layout = {}    
    Plotly.plot('heatherDiv', data, layout);
  })
};


    //find unique vaues in an array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
myParallel(7)