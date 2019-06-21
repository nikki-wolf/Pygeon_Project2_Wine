// Function to determine marker size based on population
function markerSize(population) {
  return population / 40;
}

let timeUrl='http://127.0.0.1:5000/get_time'
//let timeUrl='/get_time'
d3.json('/get_time').then(function(data,error) {
  console.log('timeUrl=',timeUrl)
  console.log('data=', data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures('time=',data.time);
});


let ratingUrl='/api_rating'
//let timeUrl='/get_time'
d3.json(ratingUrl).then(function(data,error) {
  console.log('rating data=', data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures('time=',data.time);
});



//let queryUrl = '/api_history/GeoJSON'
//let queryUrl = '/api_history?year=2010'
//let queryUrl = '/api_history/GeoJSON?country=France'
let queryUrl = '/api_history/GeoJSON'
console.log("before func")
//d3.request(queryUrl).header("Content-Type", "application/json").post(function(data){
  d3.json(queryUrl).then(function(data,error){
    console.log(`GeoJSONdata,france=`,data)
  })


// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data,error) {
  if (error) {
    console.log('error=',error)
  }
  console.log('query=',queryUrl)
  console.log('data=', data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(wineHist) {
  console.log(wineHist);
}


// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  //layers: [cities,states,streetmap]
});
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Grabbing our GeoJSON data..
d3.json(queryUrl).then(function(data,error) {
  console.log('queryURL=',queryUrl)
  console.log(data)
  if (error){
    console.log(error)
  }
  // Creating a GeoJSON layer with the retrieved data
  console.log("inside func")
  L.geoJson(data
    ,{style: {color:'maroon',weight:0.5,fillOpacity:0.2}}
    )
  .addTo(myMap);
});



// // An array containing all of the information needed to create city and state markers
// var locations = [
//   {
//     coordinates: [40.7128, -74.0059],
//     state: {
//       name: "New York State",
//       population: 19795791
//     },
//     city: {
//       name: "New York",
//       population: 8550405
//     }
//   },
//   {
//     coordinates: [34.0522, -118.2437],
//     state: {
//       name: "California",
//       population: 39250017
//     },
//     city: {
//       name: "Lost Angeles",
//       population: 3971883
//     }
//   },
//   {
//     coordinates: [41.8781, -87.6298],
//     state: {
//       name: "Michigan",
//       population: 12740000
//     },
//     city: {
//       name: "Chicago",
//       population: 2720546
//     }
//   },
//   {
//     coordinates: [29.7604, -95.3698],
//     state: {
//       name: "Texas",
//       population: 26960000
//     },
//     city: {
//       name: "Houston",
//       population: 2296224
//     }
//   },
//   {
//     coordinates: [41.2524, -95.9980],
//     state: {
//       name: "Nebraska",
//       population: 1882000
//     },
//     city: {
//       name: "Omaha",
//       population: 446599
//     }
//   }
// ];

// // Define arrays to hold created city and state markers
// var cityMarkers = [];
// var stateMarkers = [];

// // Loop through locations and create city and state markers
// for (var i = 0; i < locations.length; i++) {
//   // Setting the marker radius for the state by passing population into the markerSize function
//   stateMarkers.push(
//     L.circle(locations[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.25,
//       color: "white",
//       fillColor: "white",
//       radius: markerSize(locations[i].state.population)
//     })
//   );

//   // Setting the marker radius for the city by passing population into the markerSize function
//   cityMarkers.push(
//     L.circle(locations[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.5,
//       color: "purple",
//       fillColor: "purple",
//       radius: markerSize(locations[i].city.population)
//     })
//   );
// }

// // Define variables for our base layers
// var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// });

// var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.dark",
//   accessToken: API_KEY
// });

// // Create two separate layer groups: one for cities and one for states
// var states = L.layerGroup(stateMarkers);
// var cities = L.layerGroup(cityMarkers);

// // Create a baseMaps object
// var baseMaps = {
//   "Street Map": streetmap,
//   "Dark Map": darkmap
// };

// // Create an overlay object
// var overlayMaps = {
//   "State Population": states,
//   "City Population": cities
// };




// Pass our map layers into our layer control
// Add the layer control to the map
// L.control.layers(baseMaps, overlayMaps, {
//   // collapsed: false
// }).addTo(myMap);


