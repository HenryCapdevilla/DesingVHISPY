var date = new Date();

start_time = document.getElementById('start_time');
start_date = document.getElementById('start_date');
end_time = document.getElementById('end_time');
end_date = document.getElementById('end_date');

var todaysDate = date.toISOString().slice(0,10);

hours = date.getHours();
if(parseInt(hours) < 10){
    hours = '0'+date.getHours();
}
minutes = date.getMinutes();
if(parseInt(minutes)<9){
    minutes = '0'+date.getMinutes();
}
nowTime = hours+':'+minutes;

end_date.value = todaysDate;
end_time.value = nowTime;

start_date.max = todaysDate;
start_time.max = nowTime;
end_date.max = todaysDate;
end_time.max = nowTime;

start_date.addEventListener('click', function (){
    start_date.max = end_date.value;
});

end_date.addEventListener('click', function (){
    end_date.min = start_date.value;
})

// LEAFLET SETTINGS
// Variables para mantener un seguimiento de marcadores y polilíneas
let markers = [];
let polylines = [];
let prelat = 0;
let prelon = 0;
let marker = null;
// build leaflet map with a specific template
var map = L.map('map-template', {zoomControl: true}).setView([10.965633, -74.8215339], 12);
const tileURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

// Función para agregar marcadores y polilíneas
function addMarkerAndPolyline(lat, lon, date, time) {
    // Crea un marcador
    const newMarker = L.marker([lat, lon]).addTo(map);
    newMarker.bindPopup(`Fecha: ${date}<br>Hora: ${time}`).openPopup();

    // Agrega el marcador a la lista de marcadores
    markers.push(newMarker);

    // Crea una polilínea si hay coordenadas anteriores
    if (prelat !== 0 && prelon !== 0) {
        const polyline = L.polyline([[prelat, prelon], [lat, lon]], { color: 'blue' }).addTo(map);
        polylines.push(polyline);
    }

    // Actualiza las coordenadas anteriores
    prelat = lat;
    prelon = lon;
}

// Función para eliminar todos los marcadores y polilíneas
function clearMarkersAndPolylines() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];

    polylines.forEach(polyline => {
        map.removeLayer(polyline);
    });
    polylines = [];
}

/* CREATING MARKERS */
//Last position marker
var penguinMarker = L.icon({
    iconUrl: './marker.png',
    iconSize: [35,50],
    shadowSize:   [50, 64],
    iconAnchor:   [20,40],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
});

// Historic onClick marker
var histPenguinMarker = L.icon({
    iconUrl: './marker2.png',
    iconSize: [35,39.5],
    shadowSize:   [50, 64],
    iconAnchor:   [20,40],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
})

// Custom Leaflet control to clear the map
var clearButtonControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            var button = L.DomUtil.create('a', 'leaflet-control-button', container);
            button.href = '#';
            button.title = 'Limpiar Mapa';
            button.innerHTML = ''; // No text inside the button, just the icon
    
            L.DomEvent.on(button, 'click', function () {
                for (var i = 0; i < polylines.length; i++) {
                    map.removeLayer(polylines[i]);
                }
                polylines = [];
            });
    
            return container;
        }
});

map.addControl(new clearButtonControl());

    // Custom Leaflet control for info tab
var infoTabControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control-info');
            container.innerHTML = '<b>Latitud:</b> <span id="latitud"></span><br><b>Longitud:</b> <span id="longitud"></span><br><b>Timestamp:</b> <span id="timestamp"></span>';
            return container;
        }
});

var infoTab = new infoTabControl();
infoTab.addTo(map);

// Create additional Control placeholders
function addControlPlaceholders(map) {
    var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

        function createCorner(vSide, hSide) {
            var className = l + vSide + ' ' + l + hSide;

            corners[vSide + hSide] = L.DomUtil.create('div', className, container);
        }

    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
}
addControlPlaceholders(map);

// Change the position of the Zoom Control to a newly created placeholder.
map.zoomControl.setPosition('bottomright');
//Giving an initial value to the marker
marker = L.marker([11, -74], {iconUrl: './marker.png'})

var polyline;
var polylinePoints;
let lat = 0;
let lon = 0;

async function getData() {
    const response = await fetch("./data", {});
    let responseJson = await response.json();

    if (responseJson && responseJson.length >= 4) {
        // Divide la cadena en partes separadas
        const parts = responseJson[0].split(", ");

        // Verifica que haya al menos 4 partes
        if (parts.length >= 4) {
            const lat = parseFloat(parts[0]);
            const lon = parseFloat(parts[1]);
            const date = parts[2];
            const time = parts[3];

            document.getElementById("date").innerHTML = date;
            document.getElementById("time").innerHTML = time;

            if (!isNaN(lat) && !isNaN(lon)) {
                clearMarkersAndPolylines(); // Borra los marcadores y polilíneas existentes
                addMarkerAndPolyline(lat, lon, date, time);
            }
        }
    }
}

setInterval(() => {
    getData();
}, 5000);

// Variable para rastrear el índice del dato actual
var currentIndex = 0;

// Definir data como una variable global
var data = []; // Aquí asigna tus datos JSON a esta variable

// Función para mostrar el dato actual y el marcador en el mapa
function mostrarDatoActual() {
    if (data.length > 0 && currentIndex >= 0 && currentIndex < data.length) {
        var datoActual = data[currentIndex];
        var latitud = datoActual.latitud;
        var longitud = datoActual.longitud;
        var fecha = datoActual.fecha;
        var hora = datoActual.hora;

        // Actualiza el contenido del control de información con el dato actual
        document.getElementById('latitud').textContent = latitud;
        document.getElementById('longitud').textContent = longitud;
        document.getElementById('timestamp').textContent = fecha + ' ' + hora;

        // Elimina el marcador anterior (si existe)
        if (marker) {
            map.removeLayer(marker);
        }

        // Crea un nuevo marcador en la ubicación actual
        marker = L.marker([latitud, longitud]).addTo(map);
        marker.bindPopup("Fecha: " + fecha + "<br>Hora: " + hora).openPopup();
    }
}


function centerMap() {
    map.setView([10.965633, -74.8215339], 12);
}

button = document.getElementById('historics');
button.addEventListener("click", async (event) =>{
    var data = {
        sdate: start_date.value,
        stime: start_time.value,
        edate: end_date.value,
        etime: end_time.value};

    const res  = await fetch("/moment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const historicData = await res.json();
    gpsHistoricData = historicData.data
    
    var arr1 = [];
    var arr2 = [];
    for (var i = 1; i < gpsHistoricData.length; i++){
        origin = [parseFloat(gpsHistoricData[i-1].latitud),parseFloat(gpsHistoricData[i-1].longitud)];
        destin = [parseFloat(gpsHistoricData[i].latitud),parseFloat(gpsHistoricData[i].longitud)];
        var polylineHistPoints = [origin,destin];
        L.polyline(polylineHistPoints, { color: 'black', with: 2.0 }).addTo(map);
    }
 })

histMarker = L.marker([11.027, -74.669], {icon: histPenguinMarker});
map.on('click', async(e) => {
    if(pickingMap){
        histMarker = histMarker.setLatLng(e.latlng);
        map.addLayer(histMarker);

        const data = {
            latp    : e.latlng.lat,
            longp   : e.latlng.lng
        };

        const res  = await fetch("/place", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const historicPlace = await res.json();
        placeHistoricData = historicPlace.datap
        console.log(placeHistoricData.length);

       try{
            document.getElementById('RegisterDiv').remove();
        } catch (err){

        }

        var div = document.createElement("ul");
        div.setAttribute("id", "RegisterDiv");
        div.append(document.createElement('br'))

        document.getElementById('boxTitle').innerHTML = "El móvil estuvo en el punto seleccionado: "

        if(placeHistoricData.length === 0){
            document.getElementById('boxTitle').innerHTML = "El móvil NO ha estado en el punto seleccionado "
        }

        let cont = 0;
        for (var i = 0; i < placeHistoricData.length; i++){
            var item = document.createElement('li');

            let date = new Date(placeHistoricData[i].fecha);
            item.innerHTML = "El día " +date.toLocaleDateString('en-ZA')+ " a las " + placeHistoricData[i].hora;
            div.append(item);
            cont++;
            if(cont===20){
                break;
            }
        }
        document.getElementById('register').append(div);
    }
});