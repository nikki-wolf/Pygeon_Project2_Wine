const maxCircleRadius= 500000;
const startSlider=1980;

// Define arrays to hold created markers
var productionVolumeMark ,consumptionVolumeMark, exportVolumeMark,importVolumeMark;

var countriesMarked=[];
  
var productionVolumeLayer, consumptionVolumeLayer; 
var overlayMaps, controlLayer;

var polygonMark;

//making map base
// Define outdoorMap and lightMap layers
mapBoxURLBase="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"

var outdoorMap = L.tileLayer(mapBoxURLBase, {
  attribution: "Map data &copy; <a href=\"https://www.openoutdoorMap.org/\">OpenoutdoorMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var lightMap = L.tileLayer(mapBoxURLBase, {
  attribution: "Map data &copy; <a href=\"https://www.openoutdoorMap.org/\">OpenoutdoorMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// BaseMaps object to hold our base layers
var baseMaps = {
  "Greyscale": lightMap,
  "Outdoor": outdoorMap
};


// Create our map, giving it the outdoorMap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
      20,0
    ],
    zoom: 3,
    //layers: [lightMap, wineHistory]
    layers: [outdoorMap]
});

// let polygonsLink="{{ url_for('static', filename='countries.json')}}";
// var xxx=d3.json(polygonsLink)
// console.log(xxx)
// d3.json(countries.geojson).then(function(d){
//   console.log(d)
// })

//retreive wine history data
let wineHistApi = '/api_history/GeoJSON'
//let wineHistApi = '/api_history'

//retreive wine rating and price data
//let wineRateApi='/api_rating/GeoJSON'
let wineRateApi='/api_rating'


//Transfering all JSON data imported from database and modify them in a format to be used in the code everywhere
var years=[], countries=[], coordinates=[],
    productionVolume=[], productionCapita=[],productionCapitaGDP=[], 
    consumptionVolume=[],consumptionCapita=[], consumptionCapitaGDP=[],
    exportVolume=[], exportValue=[], exportVolumeGDP=[],
    importVolume=[], importValue=[], importVolumeGDP=[],
    excessVolume=[], population=[],
    productionVolumeRange, productionCapitaRange, productionCapitaGDPRange,
    consumptionVolumeRange,consumptionCapitaRange, consumptionCapitaGDPRange,
    exportVolumeRange, exportValueRange, exportVolumeGDPRange,
    importVolumeRange, importValueRange, importVolumeGDPRange,
    excessVolumeRange, populationRange;

//Reading Jsonified data from mLab database in our Flask App
d3.json(wineHistApi).then(function(d){

  //year slider change control
  
  var gTime = d3
    .select('#slider-time')
    .append('svg')
    .attr('width', 1300)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');


  //D3 range slider
  var dataTime = d3.range(0, 155, 5).map(function(d) {
    return new Date(1865 + d, 10, 3);
  });
  var sliderTime = d3.sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365 * 5)
    .width(1200)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(startSlider, 10, 3))
    .on('onchange', function(val){
      let value=parseInt(d3.timeFormat('%Y')(val))
      d3.select('#value-time').text(d3.timeFormat('%Y')(val))

      productionVolumeMark.forEach(function(d,i){     

       // if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(countries[i])){
        let prodyr=productionVolume[countries.indexOf(countriesMarked[i])][years.indexOf(value)]
        if (prodyr){
          d.setRadius(featureScale(productionVolumeRange)(prodyr))
          .bindPopup(bindPopupTable(value,i))
        }
       // }
      })

      consumptionVolumeMark.forEach(function(d,i){
        //  if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(countries[i])){
        let consyr=consumptionVolume[countries.indexOf(countriesMarked[i])][years.indexOf(value)]
        if (consyr){
          d.setRadius(featureScale(consumptionVolumeRange)(consyr))
          //.bindPopup(`<h1>${countriesMarked[i]}, ${value}</h1> <hr> <h3>Consumption Volume (ML): ${(consumptionVolume[countries.indexOf(countriesMarked[i])][years.indexOf(value)]/1E3).toFixed(0)}</h3>`)
          .bindPopup(bindPopupTable(value,i))
        }
        //  }
      })


      exportVolumeMark.forEach(function(d,i){
        //  if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(countries[i])){
        let consyr=exportVolume[countries.indexOf(countriesMarked[i])][years.indexOf(value)]
        if (consyr){
          d.setRadius(featureScale(exportVolumeRange)(consyr))
          .bindPopup(bindPopupTable(value,i))
        }
        //  }
      })
        
      importVolumeMark.forEach(function(d,i){
        //  if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(countries[i])){
        let consyr=importVolume[countries.indexOf(countriesMarked[i])][years.indexOf(value)]
        if (consyr){
          d.setRadius(featureScale(importVolumeRange)(consyr))
          .bindPopup(bindPopupTable(value,i))
        }
        //  }
      })
      //polygonMark.forEach((d,i)=> d.setPopupContent("<h1>" +"HEREEEEEEEEE"+ countries[i] + "</h1> <hr> <h2>" + productionVolume[i][years.indexOf(value)] + "</h2>"));
            // productionVolumeMark.forEach(d => d.setRadius(parseInt(d3.timeFormat('%Y')(val)*500)))
      // consumptionVolumeMark.forEach(d => d.setRadius(parseInt(d3.timeFormat('%Y')(val)*500)))
    })

  //returns a table tag fitting in hte leaflet popup
  function bindPopupTable(value,i){

    return `<table style="width: 440px">
            <colgroup>
              <col span="1" style="width: 35%;">
              <col span="1" style="width: 20%;">
              <col span="1" style="width: 45%;">
            <colgroup>
            <tbody>
              <tr>
                <th><h3 style="color:black;"> ${countriesMarked[i]}, ${value}</h3> </th>
                <th><h3 style="color:black; font-size:100%">Volume (ML)</h3> </th>
                <th><h3 style="color:black; font-size:100%; text-align:center">per Capita (litres)<b> / Value ($M)<b></h3> </th>
              </tr>

              <tr>
                <td><h3 style="color:blue; font-size:150%">Production</h3></td>
                <td><h3 style="color:blue; font-size:150%">${propertyRounding(productionVolume,i,value,1000,2)}</h3></td>
                <td><h3 style="color:blue; font-size:150%; text-align:center">${propertyRounding(productionCapita,i,value,1,2)} / -</h3></td>
              </tr>

              <tr>
                <td><h3 style="color:orange; font-size:150%">Consumption</h3></td>
                <td><h3 style="color:orange; font-size:150%">${propertyRounding(consumptionVolume,i,value,1000,2)}</h3></td>
                <td><h3 style="color:orange; font-size:150%; text-align:center">${propertyRounding(consumptionCapita,i,value,1,2)} / -</h3></td>
              </tr>

              <tr>
                <td><h3 style="color:green; font-size:150%">Export</h3></td>
                <td><h3 style="color:green; font-size:150%">${propertyRounding(exportVolume,i,value,1000,2)}</h3></td>
                <td><h3 style="color:green; font-size:150%; text-align:center">- /<b> ${propertyRounding(exportValue,i,value,1000,2)}<b></h3></td>
              </tr>

              <tr>
                <td><h3 style="color:red; font-size:150%">Import</h3></td>
                <td><h3 style="color:red; font-size:150%">${propertyRounding(importVolume,i,value,1000,2)}</h3></td>
                <td><h3 style="color:red; font-size:150%; text-align:center">- /<b> ${propertyRounding(importValue,i,value,1000,2)}<b></h3></td>
              </tr>
            <tbody>
          </table>`
  }
  // returns a property par divieded by division rounded by digits
  function propertyRounding(par,i,value,division,digits){
    if (countriesMarked[i]){
      let param= par[countries.indexOf(countriesMarked[i])][years.indexOf(value)]
      if (param){
        return (param/division).toFixed(digits)
      }else{
        return 0;
      }
    }else{
      return 0
    }
  }

  gTime.call(sliderTime);
  // .on('onclick',function(e){
  //     var popLocation= new L.LatLng(-42.8585,147.2468);
  //     var popup = L.popup()
  //       .setLatLng(popLocation)
  //       .setContent('<p>Hello world!<br />This is a nice popup.</p>')
  //       .openOn(mamyMap);        
  // })

  //action to change circle sizes based on chagning zoom level
  // myMap.on('zoomend', function() {
  //   console.log(this.getZoom())
  //   allMarkerCircle(yearSlider, this.getZoom(), false)
  // })


  //reading all JSON data and manipulate them to improve code performance by having only one call
  Features=d.features
  years=JSON.parse(Features[0].properties.Year.replace(/\bnan\b/g, "null"));
  for (let i=0;i<Features.length;i++){

    let countryProps=Features[i].properties;

    countries.push(countryProps.Country);
    coordinates.push([Features[i].geometry.coordinates[1], Features[i].geometry.coordinates[0]]);
    productionVolume.push(JSON.parse(countryProps.Production_volume.replace(/\bnan\b/g, "null")));
    productionCapita.push(JSON.parse(countryProps.Production_capita.replace(/\bnan\b/g, "null")));
    productionCapitaGDP.push(JSON.parse(countryProps.Production_capita_GDP.replace(/\bnan\b/g, "null")));

    consumptionVolume.push(JSON.parse(countryProps.Consumption_volume.replace(/\bnan\b/g, "null")));
    consumptionCapita.push(JSON.parse(countryProps.Consumption_capita.replace(/\bnan\b/g, "null")));
    consumptionCapitaGDP.push(JSON.parse(countryProps.Consumption_capita_GDP.replace(/\bnan\b/g, "null")));

    exportVolume.push(JSON.parse(countryProps.Export_volume.replace(/\bnan\b/g, "null")));
    exportValue.push(JSON.parse(countryProps.Export_value.replace(/\bnan\b/g, "null")));
    exportVolumeGDP.push(JSON.parse(countryProps.Export_volume_GDP.replace(/\bnan\b/g, "null")));

    importVolume.push(JSON.parse(countryProps.Import_volume.replace(/\bnan\b/g, "null")));
    importValue.push(JSON.parse(countryProps.Import_value.replace(/\bnan\b/g, "null")));
    importVolumeGDP.push(JSON.parse(countryProps.Import_volume_GDP.replace(/\bnan\b/g, "null")));

    excessVolume.push(JSON.parse(countryProps.Excess_volume.replace(/\bnan\b/g, "null")));

    population.push(JSON.parse(countryProps.Population.replace(/\bnan\b/g, "null")));
  }

  //range of each feature
  productionVolumeRange=featureRange(productionVolume)
  productionCapitaRange=featureRange(productionCapita)
  productionCapitaGDPRange=featureRange(productionCapitaGDP)

  consumptionVolumeRange=featureRange(consumptionVolume)
  consumptionCapitaRange=featureRange(consumptionCapita)
  consumptionCapitaGDPRange=featureRange(consumptionCapitaGDP)

  exportVolumeRange=featureRange(exportVolume)
  exportValueRange=featureRange(exportValue)
  exportVolumeGDPRange=featureRange(exportVolumeGDP)

  importVolumeRange=featureRange(importVolume)
  importValueRange=featureRange(importValue)
  importVolumeGDPRange=featureRange(importVolumeGDP)

  excessVolumeRange=featureRange(excessVolume)
  populationRange=featureRange(population)

  //polygons around the countries
  var polygonWorld=polygons.features //from the logic_polygon.js including polygons around all countries
  var polygonCountry=[]
  polygonWorld.forEach(function(d,i){
    if (countries.includes(d.properties.ADMIN)){
      polygonCountry.push(d)
    }
  })

  var polygonGeoJSON= {
    "type": "FeatureCollection",                                                                                 
    "features": polygonCountry
  }

  //adding polygons to the map 
  var polyLayer=L.geoJson(polygonGeoJSON, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        //fillColor: chooseColor(feature.properties.borough),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            // layer1=event.target
            this.setStyle({
              fillColor:'blue',fillOpacity: 0.3
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            this.setStyle({
              //fillColor:chooseColor(feature.properties.borough),
              fillOpacity: 0.0
            });
          },
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          //click: function(event) {
          //  map.fitBounds(this.getBounds());
          //  // showpopup;
          //}
      });
      let countryCurrent=feature.properties.ADMIN;
      let ind=countries.indexOf(countryCurrent)
      // Giving each feature a pop-up with information pertinent to it
      //layer.bindPopup("<h1>" + countryCurrent + "</h1> <hr> <h2>" + productionVolume[ind][145] + "</h2>");
      layer.bindPopup(`<iframe frameborder="0" seamless="seamless" width=600px height=400px \
                      scrolling="no" src="/plotlyChart?country=${countryCurrent}"></iframe></div>`, {maxWidth: 600})
    }
  }).addTo(myMap);

  // //adding marker to polygons
  // polygonMark = [];
  // for (let i =42; i < countries.length; i++) {
  //   if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(countries[i])){
  //     polygonMark.push(
  //       L.popup()
  //       .setLatLng(coordinates[i])
  //       .setContent(`<h1>${countries[i]}</h1><hr><h3><h3>`).addTo(polyLayer)
  //     )
  //   }
  // }
  // polygonMark.push(
  //   L.popup()
  //   .setLatLng(coordinates[0])  
  //   .setContent(`<iframe frameborder="0" seamless="seamless" width=600px height=400px \
  //   scrolling="no" src="/plotlyChart?country=${countries[3]}"></iframe></div>`, {maxWidth: 600}).addTo(polyLayer)

  // )

  // Loop through countries and create markers
  function allMarkerCircle(yearSlider, zoomLevel, init=false){
    productionVolumeMark =[];
    consumptionVolumeMark = [];
    exportVolumeMark=[];
    importVolumeMark=[];
  
    for (let i = 0; i < countries.length; i++) {
      if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(countries[i])){
        countriesMarked.push(countries[i])
        let yr= years.indexOf(yearSlider);
        // Marker circle for productionVolume, consumptionVolume, exportVolume, and importVolume
        //if (productionVolume[i][yr]){
          productionVolumeMark.push(
            L.circle(coordinates[i], {
              stroke: false,
              fillOpacity: 0.25,
              color: "blue",
              fillColor: "blue",
              radius: featureScale(productionVolumeRange)(productionVolume[i][yr])
            }).bindPopup(bindPopupTable(yearSlider,i))
          );
        //}

        //if (consumptionVolume[i][startSlider]){
          consumptionVolumeMark.push(
            L.circle(coordinates[i], {
              stroke: false,
              fillOpacity: 0.5,
              color: "orange",
              fillColor: "orange",
              radius:featureScale(consumptionVolumeRange)(consumptionVolume[i][yr])
            }).bindPopup(bindPopupTable(yearSlider,i))
          );
        //}

        //if (exportVolume[i][startSlider]){
          exportVolumeMark.push(
            L.circle(coordinates[i], {
              stroke: false,
              fillOpacity: 0.5,
              color: "green",
              fillColor: "green",
              radius:featureScale(exportVolumeRange)(exportVolume[i][yr])
            }).bindPopup(bindPopupTable(yearSlider,i))
          );
        //}

        //if (importVolume[i][yearSlider]){
          importVolumeMark.push(
            L.circle(coordinates[i], {
              stroke: false,
              fillOpacity: 0.5,
              color: "red",
              fillColor: "red",
              radius:featureScale(importVolumeRange)(importVolume[i][yr])
            }).bindPopup(bindPopupTable(yearSlider,i))
          );
        //}
      }
    }

 
    // Create separate layers groups per feature
    productionVolumeLayer = L.layerGroup(productionVolumeMark);
    consumptionVolumeLayer = L.layerGroup(consumptionVolumeMark);
    exportVolumeLayer = L.layerGroup(exportVolumeMark);
    importVolumeLayer = L.layerGroup(importVolumeMark);

    // Create an overlay object
    overlayMaps = {
      "Production Volume (kL)": productionVolumeLayer,
      "Consumption Volume (kL)": consumptionVolumeLayer,
      "Export Volume (kL)": exportVolumeLayer,
      "Import Volume (kL)": importVolumeLayer,
    };

    //Control form including all base and overlay maps
    if(!controlLayer){
      controlLayer=L.control.layers(baseMaps, overlayMaps, {
        // collapsed: false
      }).addTo(myMap);
    }
    
  } //end of marker function
  allMarkerCircle(startSlider,myMap.getZoom(), true) //default yr 2010

}); //END OF READING FROM API-JSON  (DO NOT GO BEYOND EXCEPT FOR FUNCTIONS and TESTS)

  //Check with db and original csv file to make sure dta transfer is acceptable
  function checkDatabaseImport(){
    console.log(countries)
    console.log(years)
    console.log(productionVolume) 
    console.log(productionCapita)
    console.log(productionCapitaGDP)
    console.log(consumptionVolume) 
    console.log(consumptionCapita)
    console.log(consumptionCapitaGDP)
    console.log(exportVolume) 
    console.log(exportValue)
    console.log(exportVolumeGDP)
    console.log(importVolume) 
    console.log(importValue)
    console.log(importVolumeGDP)
    console.log(excessVolume) 
    console.log(population)
    console.log("prod_capita_Italy @2010=",productionCapita[countries.indexOf('Italy')][years.indexOf(2010)])

    console.log(productionVolumeRange)
    console.log(productionCapitaRange)
    console.log(productionCapitaGDPRange)
  
    console.log(consumptionVolumeRange)
    console.log(consumptionCapitaRange)
    console.log(consumptionCapitaGDPRange)
  
    console.log(exportVolumeRange)
    console.log(exportValueRange)
    console.log(exportVolumeGDPRange)
  
    console.log(importVolumeRange)
    console.log(importValueRange)
    console.log(importVolumeGDPRange)
  
    console.log(excessVolumeRange)
    console.log(populationRange)

    console.log(featureScale(populationRange)(populationRange[1]))
  } 

//find the mimum and maximum values of each property and use a scale linear to fitx the range of circle radius

//find the minimum & maximum of each feature through all years of study (1865-2016) among all countries excluding World
function featureRange(xFeature){
  let xMinMax=[2E12,0];

  for (let i=0;i< countries.length-1;i++){
    xMinMax[0]=Math.min(xMinMax[0],Math.min(...xFeature[i]));
    xMinMax[1]=Math.max(xMinMax[1],Math.max(...xFeature[i]));
  }
  return xMinMax
}

//linearly scaling all feature ranges so that circle radius always fits in [0,maxCircleRadius] for all properties
function featureScale(featureRange) {
  let x = d3.scaleLinear()
    .domain(featureRange)
    .range([0, maxCircleRadius]);

  return x;
}

//logarithmic scaling all feature ranges so that circle radius always fits in [0,maxCircleRadius] for all properties
function featureLogScale(featureRange) {
  let x = d3.scaleLog()
    .domain([featureRange[0]+0.0001,featureRange[1]])
    .range([1, maxCircleRadius]);

  return x;
}
