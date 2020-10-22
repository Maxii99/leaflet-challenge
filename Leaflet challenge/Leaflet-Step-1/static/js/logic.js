// Store given API endpoint in queryURL
var earthquakeURL = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson;
var tectonicURL = https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json;

// Perform a GET request to the  earthquakeURL
d3.json(earthquakeURL, function(data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
});
// Define function to run for each feature in the features array
function createFeatures(earthquakeData){
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

}
// Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  // Create map function and send earthquakes layer to the function
  createMap(earthquakes);
}
function createMap(earthquakes){
  // Define map layers
  var airmap = = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

}
