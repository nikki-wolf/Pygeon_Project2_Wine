// Function to determine marker size based on production
function markerSize(production) {
  return production/100000;
}


//retreive wine history data
let wineHistApi = '/api_history/GeoJSON'

//retreive wine rating and price data
let wineRateApi='/api_rating/GeoJSON'


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

// Create overlay object to hold our overlay layer
//var overlayMaps = {
//  Earthquakes: wineHistory,
//  Faults: wineRate
//};

// marker variable
var markers={}

// Create our map, giving it the outdoorMap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
      29.7604, -95.3698
    ],
    zoom: 3,
    //layers: [satelliteMap, wineHistory]
    layers: [outdoorMap]
});

marker=arkerYear(1980);


// function to update markers with year
function markerYear(yrSpecIndex) {
  d3.select('#value-time').text(d3.timeFormat('%Y')(yrSpecIndex));

  d3.json(wineHistApi).then(function(d1) {
    marker=L.geoJSON(d1.features, {
      onEachFeature: function (feature, marker) {
        //console.log(feature.properties.Country)
        let a=feature.properties.Population;
        let b=JSON.parse(a.replace(/\bnan\b/g, "null"));
        //console.log(JSON.parse(feature.properties.Year.replace(/\bnan\b/g, "null"))[yrSpecIndex])
        marker.bindPopup("<h3>" + feature.properties.Country +
          "</h3><hr><p>" + JSON.parse(feature.properties.Production_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex]+"</p>"+
          "</h3><hr><p>" + JSON.parse(feature.properties.PConsumption_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex] "</p>");
          // "</h3><hr><p>" + "</p>");
      }
    }
  )


// define layers to be added to the base group
var groupProdVol=L.featureGRoup()
var groupConsVol=L.featureGRoup()

//adding to layer group
//var wineHistLayer=new L.LayerGroup()
//var wineRateLayer=new L.LayerGroup()

//let yrSpecIndex=150
// Perform a GET request to the query URLs
// d3.json(wineHistApi).then(function(d1) {
//   L.geoJSON(d1.features, {
//     onEachFeature: function (feature, marker) {
//       console.log(feature.properties.Country)
//       let a=feature.properties.Population;
//       let b=JSON.parse(a.replace(/\bnan\b/g, "null"));
//       console.log(JSON.parse(feature.properties.Year.replace(/\bnan\b/g, "null"))[yrSpecIndex])
//       marker.bindPopup("<h3>" + feature.properties.Country +
//         "</h3><hr><p>" + JSON.parse(feature.properties.Production_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex]+ "</p>");
//         // "</h3><hr><p>" + "</p>");
//     },
//     pointToLayer: function(feature, latlng) {
//       if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(feature.properties.Country)){
//          let a=JSON.parse(feature.properties.Production_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex];
//          return new L.circleMarker(latlng, 
//           {radius: markerSize(a)});
//         }
//     },
//     style: function(d){
//       return {
//           fillColor: getColor(3),
//           fillOpacity: .6,
//           color: "white",
//           stroke: true,
//           weight: .8
//       }
//     }
//   }).addTo(wineHistLayer);

//   d3.json(wineRateApi).then(function(d2){
//     // console.log(d2.features)
//     L.geoJson(d2.features, {
//       style: function(){
//         return{
//               color: "orange",
//               fillOpacity: 0.,
//               weight: 2
//             }

//       },
//     }).addTo(wineRateLayer)

//   });

//   // Sending our earthquakes and faults layers to the createMap function
//   createMap(wineHistLayer, wineRateLayer)
// });



  //creat basemap and add layers to it
function updateMap(wineHistory,wineRate) {

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

  //legend
//   var legend = L.control({position: 'bottomright'});

//   legend.onAdd = function (map) {
  
//       var div = L.DomUtil.create('div', 'info legend'),
//       grades = [0, 1,2,3,4,5],
//       labels = [];
  
//       // loop through our density intervals and generate a label with a colored square for each interval
//       for (var i = 0; i < grades.length; i++) {
//           div.innerHTML +=
//               '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//   }
  
//   return div;
//   };
  
//   legend.addTo(myMap);
  
// }

//selecting the colors for circle markers
function getColor(d) {
  return d>5 ? 'red':
        d>4 ? "#FFEDA0":
        d>3 ? "orange":
        d>2 ? "yellow":
        d>1 ? "#bfff00":
        "#00fa00";
};

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
  .default(new Date(1980, 10, 3))
  .on('onchange', val => functionYear(val))
  
  // .on('onchange', val => {
  //   d3.select('#value-time').text(d3.timeFormat('%Y')(val));
  // });
      
  
    // d3.json(wineRateApi).then(function(d2){
    //   // console.log(d2.features)
    //   L.geoJson(d2.features, {
    //     style: function(){
    //       return{
    //             color: "orange",
    //             fillOpacity: 0.,
    //             weight: 2
    //           }
  
    //     },
    //   }).addTo(wineRateLayer)
  
    //});
  
    // Sending our earthquakes and faults layers to the createMap function
   // createMap(wineHistLayer, wineRateLayer)
  });
}

// function to update production data
function updateProd(yrSpecIndex) {
  d3.json(wineHistApi).then(function(d1) {
    L.geoJSON(d1.features, {
      pointToLayer: function(feature, latlng) {
      if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(feature.properties.Country)){
        let a=JSON.parse(feature.properties.Production_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex];
        return new L.circleMarker(latlng, 
          {radius: markerSize(a)});
        }
      },
      style: function(d){
        return {
            fillColor: getColor(3),
            fillOpacity: .6,
            color: "black",
            stroke: true,
            weight: .8
        }
      }
    }).addTo(myMap);
  })
}










var gTime = d3
  .select('#slider-time')
  .append('svg')
  .attr('width', 1300)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);


//initialize map using values from 1980

function initialize(yrSpecIndex){
  d3.json(wineHistApi).then(function(d1) {
    L.geoJSON(d1.features, {
      onEachFeature: function (feature, marker) {
        //console.log(feature.properties.Country)
        let a=feature.properties.Population;
        let b=JSON.parse(a.replace(/\bnan\b/g, "null"));
        //console.log(JSON.parse(feature.properties.Year.replace(/\bnan\b/g, "null"))[yrSpecIndex])
        marker.bindPopup("<h3>" + feature.properties.Country +
          "</h3><hr><p>" + JSON.parse(feature.properties.Production_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex]+ "</p>");
          // "</h3><hr><p>" + "</p>");
      },
      pointToLayer: function(feature, latlng) {
        if (!['World', 'Other WEM', 'Other ECA', 'Other LAC', 'Other AME'].includes(feature.properties.Country)){
           let a=JSON.parse(feature.properties.Production_volume.replace(/\bnan\b/g, "null"))[yrSpecIndex];
           return new L.circleMarker(latlng, 
            {radius: markerSize(a)});
          }
      },
      style: function(d){
        return {
            fillColor: getColor(3),
            fillOpacity: .6,
            color: "black",
            stroke: true,
            weight: .8
        }
      }
    }).addTo(wineHistLayer);
  
    d3.json(wineRateApi).then(function(d2){
      // console.log(d2.features)
      L.geoJson(d2.features, {
        style: function(){
          return{
                color: "orange",
                fillOpacity: 0.,
                weight: 2
              }
  
        },
      }).addTo(wineRateLayer)
  
    });
  
    // Sending our earthquakes and faults layers to the createMap function
    createMap(wineHistLayer, wineRateLayer)
  }
}

