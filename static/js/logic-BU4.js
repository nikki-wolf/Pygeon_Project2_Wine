const maxCircleRadius= 100;

//D3 range slider
var dataTime = d3.range(0, 155, 5).map(function(d) {
  return new Date(1865 + d, 10, 3);
});

//making map base
// Define outdoorMap and satelliteMap layers
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

var satelliteMap = L.tileLayer(mapBoxURLBase, {
  attribution: "Map data &copy; <a href=\"https://www.openoutdoorMap.org/\">OpenoutdoorMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// BaseMaps object to hold our base layers
var baseMaps = {
  "Satellite": satelliteMap,
  "Greyscale": lightMap,
  "Outdoor": outdoorMap
};


// marker variable
var markers={}

// Create our map, giving it the outdoorMap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
      29.7604, -95.3698
    ],
    zoom: 2,
    //layers: [satelliteMap, wineHistory]
    layers: [outdoorMap]
});




//retreive wine history data
let wineHistApi = '/api_history/GeoJSON'
//let wineHistApi = '/api_history'

//retreive wine rating and price data
//let wineRateApi='/api_rating/GeoJSON'
let wineRateApi='/api_rating'


//Transfering all JSON data imported from database and modify them in a format to be used in the code everywhere
var Years=[], Countries=[], Coordinates=[],
    ProductionVolume=[], ProductionCapita=[],ProductionCapitaGDP=[], 
    ConsumptionVolume=[],ConsumptionCapita=[], ConsumptionCapitaGDP=[],
    ExportVolume=[], ExportValue=[], ExportVolumeGDP=[],
    ImportVolume=[], ImportValue=[], ImportVolumeGDP=[],
    ExcessVolume=[], Population=[];

//Reading Jsonified data from mLab database in our Flask App
d3.json(wineHistApi).then(function(d){

  //year slider change control
  var sliderTime = d3.sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(1000 * 60 * 60 * 24 * 365 * 5)
  .width(1200)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(dataTime)
  .default(new Date(1980, 10, 3))
  //.on('onchange', val => markerYear(years.indexOf(val)));
  .on('onchange', function(val){
    // console.log(parseInt(d3.timeFormat('%Y')(val)))
    d3.select('#value-time').text(d3.timeFormat('%Y')(val))
    allMarkerCircle(Years.indexOf(parseInt(d3.timeFormat('%Y')(val))), myMap.getZoom(), false)
  })

  //action to change circle sizes based on chagning zoom level
  myMap.on('zoomend', function() {
    console.log(this.getZoom())
    allMarkerCircle(yearSlider, this.getZoom(), false)
  })

  var gTime = d3
  .select('#slider-time')
  .append('svg')
  .attr('width', 1300)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);
  Features=d.features
  Years=JSON.parse(Features[0].properties.Year.replace(/\bnan\b/g, "null"));
  for (let i=0;i<Features.length;i++){

    let countryProps=Features[i].properties;

    Countries.push(countryProps.Country);
    Coordinates.push([Features[i].geometry.coordinates[1], Features[i].geometry.coordinates[0]]);
    ProductionVolume.push(JSON.parse(countryProps.Production_volume.replace(/\bnan\b/g, "null")));
    ProductionCapita.push(JSON.parse(countryProps.Production_capita.replace(/\bnan\b/g, "null")));
    ProductionCapitaGDP.push(JSON.parse(countryProps.Production_capita_GDP.replace(/\bnan\b/g, "null")));

    ConsumptionVolume.push(JSON.parse(countryProps.Consumption_volume.replace(/\bnan\b/g, "null")));
    ConsumptionCapita.push(JSON.parse(countryProps.Consumption_capita.replace(/\bnan\b/g, "null")));
    ConsumptionCapitaGDP.push(JSON.parse(countryProps.Consumption_capita_GDP.replace(/\bnan\b/g, "null")));

    ExportVolume.push(JSON.parse(countryProps.Export_volume.replace(/\bnan\b/g, "null")));
    ExportValue.push(JSON.parse(countryProps.Export_value.replace(/\bnan\b/g, "null")));
    ExportVolumeGDP.push(JSON.parse(countryProps.Export_volume_GDP.replace(/\bnan\b/g, "null")));

    ImportVolume.push(JSON.parse(countryProps.Import_volume.replace(/\bnan\b/g, "null")));
    ImportValue.push(JSON.parse(countryProps.Import_value.replace(/\bnan\b/g, "null")));
    ImportVolumeGDP.push(JSON.parse(countryProps.Import_volume_GDP.replace(/\bnan\b/g, "null")));

    ExcessVolume.push(JSON.parse(countryProps.Excess_volume.replace(/\bnan\b/g, "null")));

    Population.push(JSON.parse(countryProps.Population.replace(/\bnan\b/g, "null")));
  }
  console.log(Coordinates)
  console.log(ProductionVolume)
  // Define arrays to hold created markers
var ProductionVolumeMark =[];
var ConsumptionVolumeMark = [];

var productionVolumnLayer, consumptionVolumeLayer; 
var overlayMaps, controlLayer;

///////////////
yearSlider=100
///////////////

  // Loop through countries and create markers
  function allMarkerCircle(yearSlider, zoomLevel, init=false){
    // if (ProductionVolumeMark != []) {
    //         myMap.removeLayer(ProductionVolumeMark);
    // };

    // if (ConsumptionVolumeMark != []) {
    //    myMap.removeLayer(ProductionVolumeMark);
    // };
    console.log('yrslider===================',yearSlider, ' zoomLevel=',myMap.getZoom())
    ProductionVolumeMark =[];
    ConsumptionVolumeMark = [];
    if (!init){
      // myMap.eachLayer(function(layer){
      //   myMap.removeLayer(layer)
      // })
     myMap.removeLayer(ProductionVolumeMark)
     myMap.removeLayer(consumptionVolumeLayer)
     myMap.removeLayer(overlayMaps)
      console.log("HAS OVERLAY")
    }else{
      console.log(overlayMaps)
    }
    
    for (let i = 0; i < Countries.length; i++) {
      if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(Countries[i])){
        // Marker circle for ProductionVolume
        if (ProductionVolume[i][yearSlider]){
          ProductionVolumeMark.push(
            L.circle(Coordinates[i], {
              stroke: false,
              fillOpacity: 0.25,
              color: "blue",
              fillColor: "blue",
              radius: ProductionVolume[i][yearSlider]/5/zoomLevel
            })
          );
        }
        // Markeer circle for ConsumptionVolume
        if (ConsumptionVolume[i][yearSlider]){
          ConsumptionVolumeMark.push(
            L.circle(Coordinates[i], {
              stroke: false,
              fillOpacity: 0.5,
              color: "red",
              fillColor: "red",
              radius: ConsumptionVolume[i][yearSlider]/5/zoomLevel
            })
          );
        }
      }
    }
    console.log(ProductionVolumeMark)

    // Create separate layers groups per feature
    productionVolumnLayer = L.layerGroup(ProductionVolumeMark);
    consumptionVolumeLayer = L.layerGroup(ConsumptionVolumeMark);
    
    // Create an overlay object
    overlayMaps = {
      "Production Volume (kL)": productionVolumnLayer,
      "Consumption Volume (kL)": consumptionVolumeLayer,
    };

    //Control form including all base and overlay maps
    if(!controlLayer){
      controlLayer=L.control.layers(baseMaps, overlayMaps, {
        // collapsed: false
      }).addTo(myMap);
    }
    // controlLayer=L.control.layers(baseMaps, overlayMaps, {
    //   // collapsed: false
    // }).addTo(myMap);
  }
    allMarkerCircle(145,myMap.getZoom(), true) //default yr 2010
    // // Create separate layers groups per feature


    // // Create an overlay object
    // var overlayMaps = {
    //   "Production Volume (kL)": productionVolumnLayer,
    //   "Consumption Volume (kL)": consumptionVolumeLayer,
    // };

    // L.control.layers(baseMaps, overlayMaps, {
    //   // collapsed: false
    // }).addTo(myMap);


  }); //END OF READING FROM API-JSON  (DO NOT GO BEYOND EXCEPT FOR FUNCTIONS and TESTS)

  //Check with db and original csv file to make sure dta transfer is acceptable
  function checkDatabaseImport(){
    console.log(Countries)
    console.log(Years)
    console.log(ProductionVolume) 
    console.log(ProductionCapita)
    console.log(ProductionCapitaGDP)
    console.log(ConsumptionVolume) 
    console.log(ConsumptionCapita)
    console.log(ConsumptionCapitaGDP)
    console.log(ExportVolume) 
    console.log(ExportValue)
    console.log(ExportVolumeGDP)
    console.log(ImportVolume) 
    console.log(ImportValue)
    console.log(ImportVolumeGDP)
    console.log(ExcessVolume) 
    console.log(Population)
    console.log("prod_capita_Italy @2010=",ProductionCapita[Countries.indexOf('Italy')][Years.indexOf(2010)])
  } 



// var mark={}
// var prop;
// //function to update markers with year
// function markerYear(yrIndex) {
//   console.log('yrIndex=',yrIndex)
//   d3.select('#value-time').text(d3.timeFormat('%Y')(yrSpecIndex));

//   d3.json(wineHistApi).then(function(d1) { 
//     console.log(d1)
//     if (mark != undefined) {
//       myMap.removeLayer(mark);
//     };
//     //setTimeout(function(){ 
//       L.geoJSON(d1.features, {
        
//         onEachFeature: function (feature, markerLayer) {
//           prop=feature.properties;
//           if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(prop.Country)){
//             mark= markerLayer.bindPopup(`<h3> ${prop.Country},${years[yrIndex]}</h3><hr>
//                                   <p>Production (kL): ${JSON.parse(prop.Production_volume.replace(/\bnan\b/g, "null"))[yrIndex]}</p>
//                                   </h3><hr><p>Consumption (kL): ${JSON.parse(prop.Consumption_volume.replace(/\bnan\b/g, "null"))[yrIndex]}</p>`);
//             // "</h3><hr><p>" + "</p>");
//           }
//         },
//         pointToLayer: function(feature, latlng) {
//           let prop=feature.properties
//           if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(prop.Country)){
//             return new L.circleMarker(latlng, 
//               {radius: JSON.parse(prop.Production_volume.replace(/\bnan\b/g, "null"))[yrIndex]/100000})
//             }
//         },
//         style: function(d){
//           return {
//               fillColor: getColor(d.properties.Production_volume),
//               fillOpacity: .6,
//               color: "white",
//               stroke: true,
//               weight: .8
//           }
//         }
//       }).addTo(myMap)
//     //}, 3000);  
//   })
// }

// function to update markers with year
// function markerYear(yrIndex) {
//   d3.select('#value-time').text(d3.timeFormat('%Y')(yrSpecIndex));
//   if (mark != undefined) {
//     myMap.removeLayer(mark);
//   };

//   L.geoJSON(geoJsonHistFeature, {
//     onEachFeature: function (feature, markerLayer) {
//       console.log('111111111111111111111111111111111111',feature.properties.Production_capita[yrIndex])
//       if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(feature.properties.Country)){
//         console.log('here')
//         mark= markerLayer.bindPopup(`<h3> ${feature.properties.Country},${years[yrIndex]}</h3><hr>
//                               <p>Production (kL): ${feature.properties.Production_volume[yrIndex]}</p>
//                               </h3><hr><p>Consumption (kL): ${feature.properties.Consumption_volume[yrIndex]}</p>`);
//         // "</h3><hr><p>" + "</p>");
//       }else{
//         console.log("not found")
//       }
//     }
//   }).addTo(myMap)
// }
// console.log(mark)

//markerLayer.addData(geoJsonHistFeature);

// // define layers to be added to the base group
// var groupProdVol=L.featureGroup()
// var groupConsVol=L.featureGroup()


// // Function to determine marker size based on production
// function markerSize(data,label) {
//   let x = d3.scaleLinear()
//     .domain([d3.min(data, d => d[Label]) * 0.8,
//       d3.max(data, d => d[Label]) * 1.2
//   ])
//   .range([0, 100]);

//   return x;
//   return production/100000;
// }


// function xScale(hraData,xLabel) {
//   // create scales
//   let x = d3.scaleLinear()
//     .domain([d3.min(hraData, d => d[xLabel]) * 0.8,
//       d3.max(hraData, d => d[xLabel]) * 1.2
//   ])
//   .range([0, maxCircleRadius]);

//   return x;
// }



// function getColor(d) {
//   return d>5 ? 'red':
//         d>4 ? "#FFEDA0":
//         d>3 ? "orange":
//         d>2 ? "yellow":
//         d>1 ? "#bfff00":
//         "#00fa00";
// };

// var prodVolMax=0
// //find the minimum & maximum of each feature throug hall years of study (1865-2016)
// function maxProps(){
//   d3.json(wineHistApi).then(function(d1) { 
//     //setTimeout(function(){ 
//     L.geoJSON(d1.features, {
//       onEachFeature: function (feature, markerLayer) {
//         prop=feature.properties;
//         let prodVol=JSON.parse(prop.Production_volume.replace(/\bnan\b/g, "null"))
//         console.log(Math.max(...prodVol))
//         prodVolMax=Math.max(prodVolMax,Math.max(...prodVol))
//       }
//     })
//   })
// }
// maxProps()
// console.log('maximum prod vol=',prodVolMax)

