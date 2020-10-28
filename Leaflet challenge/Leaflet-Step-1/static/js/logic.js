// Store given API endpoint in query
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request with d3 to grab the earthquake data
d3.json(earthquakeURL, function(data) {
  console.log(data);

// Send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData){
// Define function to run for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakeLayer = new L.LayerGroup();

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br> + Location: " + feature.properties.place);
    }
  });
  // addTo(earthquakeLayer);


  // Create map function and send earthquakes layer to the function
  createMap(earthquakes);
}
function createMap(earthquakes){
  // Define map layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

  // Create overlay object to hold our overlay layer
var overlayMaps = {
    Earthquakes: earthquakes
};

// Create a map giving streetmap nd earthquake layers
var myMap = L.map("mapid", {
  center: [51.505, -0.09],
  zoom: 3,
  layers: [streetmap, earthquakes]
});

//Function to determine radius of earthquake marker based on earthquake magnitude
function quakeRadius(magnitude) 
{

  if (magnitude == 0) 
    {
      return 1
    };

  return magnitude * 4;

};

// Function to determine the color of the earthquake based on its magnitude
function chooseColor(magnitude) 
{

  switch (true) 
  {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "orange";
    case magnitude > 3:
      return "yellow";
    case magnitude > 2:
      return "green";
    case magnitude > 5:
      return "blue";
    default:
      return "purple";
  }

};

//Function to format circle marker for each earthquake
function styleInfo(feature) 
{
  return {
    opacity: 1,
    fillOpacity: 0.75,
    fillColor: chooseColor(feature.properties.mag),
    color: "#000000",
    radius: quakeRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  }
};


  //Place legend in bottom right
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
    //Add legend details
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors =
    [
      "purple",
      "blue",
      "green",
      "yellow",
      "orange",
      "red"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) 
    {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
        
    return div;

  };

  //Add legend to map
  legend.addTo(myMap);



// Pass in baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
};



