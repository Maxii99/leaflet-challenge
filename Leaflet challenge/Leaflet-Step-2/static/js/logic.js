// Create base layer
var initialLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 3,

});

initialLayer.addTo(myMap);

//Creating layer groups for control chekcboxes
var quakeLayer = new L.LayerGroup() ;
var plateLayer = new L.LayerGroup() ;

// Store given API endpoint inside query Url
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(earthquakeUrl, function(data) {
  console.log(data);

  // Create functions for style, color and radiues

  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.properties.mag),
      color: "#000000",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  function mapColor(mag) {
    switch (true) {
      case mag > 5:
        return "#ea2c2c";
      case mag > 4:
        return "#eaa92c";
      case mag > 3:
        return "#d5ea2c";
      case mag > 2:
        return "#92ea2c";
      case mag > 1:
        return "#2ceabf";
      default:
        return "#2c99ea";
    }
  }
// Create map radius
  function mapRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 4;
  }
  
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array

  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: mapStyle,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    }
    // Add to myMap
  }).addTo(myMap);

 //Place legend in bottom right
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),

    grades = [0, 1, 2, 3, 4, 5],
    colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c", "#ea2c2c"];


  // Loop through our intervals to generate a label with a colored square for each interval
    for (var i = 0; i<grades.length; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

  };
// Add legend to myMap
  legend.addTo(myMap) 
});

//Tectonic Plate Data

var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonicPlatesURL, function (data) 
  {
    // console.log(data) ;

    L.geoJson(data,  {color: "#FF1493"}).addTo(plateLayer) ;
  
    plateLayer.addTo(myMap) ;

  });


//Add cool basemap options such as dark, topography, terrain and satelitte

// First add dark nacground map option
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});
//  Add terrain background map option
var terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
});
// Add topographic map option
var topography = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
// Add street map option
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// Add satellite map option
var satellite = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

//Create basemaps for control
var baseMaps =
{
  Country: initialLayer,
  Street: street,
  Dark: darkmap,
  Terrain: terrain,
  Topography: topography,
  Satellite: satellite
};

//Create overlaymaps for control
var overlayMaps = 
    {
        "Tectonic Plates" : plateLayer,
        Earthquakes : quakeLayer
    } ;


// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
