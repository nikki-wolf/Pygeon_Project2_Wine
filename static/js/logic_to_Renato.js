const maxCircleRadius= 500000;

//D3 range slider
var dataTime = d3.range(0, 155, 5).map(function(d) {
  return new Date(1865 + d, 10, 3);
});


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
  var sliderTime = d3.sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(1000 * 60 * 60 * 24 * 365 * 5)
  .width(1200)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(dataTime)
  .default(new Date(1980, 10, 3))
  .on('onchange', function(val){
    let value=parseInt(d3.timeFormat('%Y')(val))
    d3.select('#value-time').text(d3.timeFormat('%Y')(val))
    productionVolumeMark.forEach((d,i)=> d.setRadius(featureLogScale(productionVolumeRange)(productionVolume[i][years.indexOf(value)])))
    consumptionVolumeMark.forEach((d,i) => d.setRadius(featureScale(consumptionVolumeRange)(consumptionVolume[i][years.indexOf(value)])))
    // productionVolumeMark.forEach(d => d.setRadius(parseInt(d3.timeFormat('%Y')(val)*500)))
    // consumptionVolumeMark.forEach(d => d.setRadius(parseInt(d3.timeFormat('%Y')(val)*500)))
  })
  .on('click',function(val){
    
  })

  //action to change circle sizes based on chagning zoom level
  // myMap.on('zoomend', function() {
  //   console.log(this.getZoom())
  //   allMarkerCircle(yearSlider, this.getZoom(), false)
  // })

  var gTime = d3
  .select('#slider-time')
  .append('svg')
  .attr('width', 1300)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');
  gTime.call(sliderTime);

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