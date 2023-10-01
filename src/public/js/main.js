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
// build leaflet map with a specific template
var map = L.map('map-template', {zoomControl: true}).setView([10.965633, -74.8215339], 12);
const tileURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

// Variable para rastrear el marcador del último valor
let lastMarker = null;

// Función para obtener y mostrar el último valor en el mapa
async function getLastValue() {
    try {
        const response = await fetch("/latest"); // Reemplaza "/latest" con la ruta correcta en tu servidor
        if (!response.ok) {
            throw new Error("Error al obtener el último valor");
        }
        const latestData = await response.json();

        if (latestData) {
            const lat = parseFloat(latestData.latitud);
            const lon = parseFloat(latestData.longitud);
            const date = latestData.fecha;
            const time = latestData.hora;

            // Elimina el marcador anterior del último valor
            if (lastMarker) {
                map.removeLayer(lastMarker);
            }

            // Crea un nuevo marcador para el último valor
            lastMarker = L.marker([lat, lon]).addTo(map);
            lastMarker.bindPopup(`Fecha: ${date}<br>Hora: ${time}`).openPopup();

            // Crea una polilínea si hay coordenadas anteriores
            if (prelat !== 0 && prelon !== 0) {
                const polyline = L.polyline([[prelat, prelon], [lat, lon]], { color: 'blue' }).addTo(map);
                polylines.push(polyline);
            }

            // Actualiza las coordenadas anteriores
            prelat = lat;
            prelon = lon;
        }
    }catch (error) {
        console.error("Error al obtener el último valor:", error);
    }
}

// Establece un intervalo para obtener el último valor cada X segundos (por ejemplo, cada 5 segundos)
setInterval(() => {
    getLastValue();
}, 5000); // Cambia el valor 5000 por el intervalo deseado en milisegundos


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