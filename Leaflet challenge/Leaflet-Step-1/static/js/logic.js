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
/ Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
