var countryUnpack
var price=[]
var rating
var varieties;
function unpack(rows, key) {
    return rows.map(function(row) {
        return row[key];
    });
}

function myParallel() {
 var url = '/api_rating';
 d3.json(url).then(function(wineData) {
   console.log(wineData)


       countryUnpack = unpack(wineData, 'Country');
       //console.log(countryUnpack, 'Unpacked Countries')

       var priceUnpack = unpack(wineData, 'Price')
       console.log(priceUnpack, 'unpacked prices')
       //let a= JSON.parse(priceUnpack.replace(/\bnan\b/g, "null"))
       //console.log(a)

       var ratingUnpack = unpack(wineData, 'Rating')
       //console.log(ratingUnpack, 'unpacked ratings')

       var varietyUnpack = unpack(wineData, 'Variety')
       //console.log(varietyUnpack, 'unpacked variety')

       wineData.forEach(function(data){
         // countries = JSON.parse(data.Country)
         // console.log(countries, "parsed countries")
         price.push(JSON.parse(data.Price.replace(/\bnan\b/g, "null")))
         console.log(typeof price, 'price=', price)
         rating = JSON.parse(data.Rating.replace(/\bnan\b/g, "null"))
         console.log(rating, 'parsed rating')
         varieties = eval('('+data.Variety+')')})
         console.log(varieties, "parsed varieties")
         ;

         console.log(typeof price, 'price=', price)
     var data = [{
       type: 'parcoords',
       // pad: [80,80,80,80],
       visible: true,
       line: {
         // showscale: true,
         // reversescale: true,
         colorscale: 'Jet',
         cmin: 1,
         cmax: 100,
         color:  countryUnpack
       },

       dimensions: [{
         range: [0,43],
         tickvals: Array.apply(0,new Array(43)).map(function(_,i){ return i+1 }),
         ticktext: countryUnpack,
         label: 'Countries',
         values: countryUnpack
       }, {
         constraintrange: [1200,1600],
         range: [Math.min(...price),
         Math.max(...price)],
         label: 'Price',
         values: price,
         multiselect:true

       }, {
         constraintrange: [86,90],
         multiselect: true,
         label: 'Rating',
         range: [Math.min(...rating),
         Math.max(...rating)],
         values: rating
       }, {
         label: 'Variety',
         range: [0,6],
         tickvals: Array.apply(0,new Array(6)).map(function(_,i){ return i+1 }),
         ticktext: varieties,
         values: varieties

       }
       ]
     }];
     var layout = {
       width: 700,
       height: 575
     };


     Plotly.plot('heatherDiv', data, layout);
   })
   }
myParallel()