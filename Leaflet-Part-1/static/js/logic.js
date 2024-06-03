const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Tile Layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Map Object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street]
});

// Map Layers
let baseMaps = {Street: street};
let eq_data = new L.LayerGroup();
let overlays = {"Earthquakes": eq_data};
L.control.layers(baseMaps, overlays).addTo(myMap);

// Styling
function styleInfo(feature) {
    return {
        color: depth_color(feature.geometry.coordinates[2]),
        fillColor: depth_color(feature.geometry.coordinates[2]),
        radius: mag_radius(feature.properties.mag)
    }
};

// Color according to depth
function depth_color(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 & depth <= 30) return "orange";
    else if (depth > 30 & depth <= 50) return "yellow";
    else if (depth > 50 & depth <= 70) return "green";
    else if (depth > 70 & depth <= 90) return "lue";
    else return "purple";
};

// Radius according to magnitude
function mag_radius(magnitude) {
    return magnitude*8;
};

// GeoJSON Layer
d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon).bindPopup(`<h3>ID: ${(feature.id)}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Place: ${feature.properties.place}</p>`);
        },
        style: styleInfo
    }).addTo(eq_data);
    eq_data.addTo(myMap);
});

// Legend (https://codepen.io/haakseth/pen/KQbjdO)
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
       div.innerHTML += '<i style="background: red"></i><span><10</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>10-30</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>30-50</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>50-70</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>70-90</span><br>';
       div.innerHTML += '<i style="background: purple"></i><span>>90</span><br>';
  
    return div;
  };

  legend.addTo(myMap);