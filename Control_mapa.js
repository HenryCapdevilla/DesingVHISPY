// Variable para rastrear el índice del dato actual
var currentIndex = 0;
var marker; // Variable para almacenar el marcador actual

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
// Llama a la función inicial para mostrar el primer dato
mostrarDatoActual();

// Event listener para avanzar al siguiente dato con la flecha derecha
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        avanzarDato();
    }
});

// Event listener para retroceder al dato anterior con la flecha izquierda
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        retrocederDato();
    }
});
