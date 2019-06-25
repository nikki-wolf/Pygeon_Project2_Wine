// global variables
var countryUnpack, priceUnpack, ratingUnpack,
    varietyUnpack, uniqueCountry, uniqueID,
    ratingFilled,priceFilled, countryFilled,
    countryNumber;


// plot function
function myParallel() {
  var url = "/api_rating_extended";
  d3.json(url).then(function(wineData) {
    console.log(wineData)
    
      function unpack(rows, key) {
        return rows.map(function(row) { 
           return row[key]; 
         });
        }
      countryUnpack = unpack(wineData, 'country');
      countryFilled=countryUnpack.map(function(d){
        if (d==null){
          return "NA"
        }
        return d;
      });
      //console.log(countryFilled, 'Unpacked Countries')

      priceUnpack = unpack(wineData, 'price')
      priceUnpack =priceUnpack.map(Number);
      priceFilled=priceUnpack.map(function(d){
        if (d==null){
          return 0
        }
        return d;
      });
      // if(ratingFilled !== ratingFilled) {
      //   console.info('x is NaN.');
      // }

     // console.log(priceFilled, 'unpacked prices')

      ratingUnpack = unpack(wineData, 'rating')
      ratingUnpack = ratingUnpack.map(Number);
      ratingFilled=ratingUnpack.map(function(d){
        if (d==null){
          return 0
        }
        return d;
      });
      //console.log(ratingFilled, 'rating filled')
     // console.log(typeof ratingFilled)
      // if(ratingFilled !== ratingFilled) {
      //   console.info('x is NaN.');
      // }

      varietyUnpack = unpack(wineData, 'variety')
      varietyUnpack = varietyUnpack.map(Number);
      var varietyFilled=varietyUnpack.map(function(d){
        if (d==null){
          return 0
        }
        return d;
      });
      //console.log(varietyFilled, 'unpacked variety')

      // retrieve unique values of countries
      uniqueCountry = countryUnpack.filter((v, i, a) => a.indexOf(v) === i);

      countryNumber=[]
      for (let i=0;i<countryUnpack.length;i++){
        for (let j=0;j<uniqueCountry.length;j++){
          if (countryUnpack[i]==uniqueCountry[j]){
            countryNumber[i]=j;
          }
        }
      }
      //console.log(uniqueCountry)

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

        {
        constraintrange: [0,1],
        range: [0,uniqueCountry.length],
        tickvals: uniqueID,
        ticktext: uniqueCountry,
        label: 'Countries',
        values: countryNumber.slice(0,1000)
        },
        {
        constraintrange: [0,10],
        range: [0, 100],
        label: 'Price',
        values: priceFilled.slice(0,1000),
        // multiselect:true
      
      }, 
      {
        constraintrange: [86,87],
       // pad:[200,200,200],
        // multiselect: true,
        label: 'Rating',
        range: [80, Math.max(...ratingUnpack)],
        values: ratingFilled.slice(0,1000),
      }


      // {
      //   range: [0,6],
      //   label: 'Variety',
      //   tickvals: Array.apply(0,new Array(6)).map(function(_,i){ return i+1 }),
      //   ticktext: varietyUnpack,
      //   values: varietyFilled
  
      // }
      ]
    }];
    // var layout = {
    //   width: 710,
    //   height: 620
    // };
      var layout = {}    
    Plotly.plot('heatherDiv', data, layout);
    });

  
    };
myParallel()