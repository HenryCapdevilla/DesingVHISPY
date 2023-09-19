// Variable para rastrear el índice del dato actual
var currentIndex = 0;
var marker; // Variable para almacenar el marcador actual

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

// Función para avanzar al siguiente dato
function avanzarDato() {
    if (currentIndex < data.length - 1) {
        currentIndex++;
        mostrarDatoActual();
    }
}

// Función para retroceder al dato anterior
function retrocederDato() {
    if (currentIndex > 0) {
        currentIndex--;
        mostrarDatoActual();
    }
}

// Agregar botones para avanzar y retroceder en el control de información
var infoControl = L.DomUtil.create('div', 'leaflet-control-info');
infoControl.innerHTML = '<b>Latitud:</b> <span id="latitud"></span><br><b>Longitud:</b> <span id="longitud"></span><br><b>Timestamp:</b> <span id="timestamp"></span><br><br><button onclick="retrocederDato()">Retroceder</button> <button onclick="avanzarDato()">Avanzar</button>';

// Agregar el control de información al mapa
infoControl.addTo(map);

// Llama a la función inicial para mostrar el primer dato
mostrarDatoActual();
