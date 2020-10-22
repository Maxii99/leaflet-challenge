// Store given API endpoint in queryURL
var earthquakeURL = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson;
var tectonicURL = https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json;

// Perform a GET request to the  earthquakeURL
d3.json(earthquakeURL, function(data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
});