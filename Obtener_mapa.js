// Función para mostrar una secuencia de marcadores y polilíneas en el mapa
function mostrarMarcadoresEnMapa(data) {
    // Borra los marcadores existentes en el mapa y las polilíneas
    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];

    for (var i = 0; i < polylines.length; i++) {
        map.removeLayer(polylines[i]);
    }
    polylines = [];

    var coordenadas = [];
    var blueIcon = L.divIcon({ className: 'blue-icon' });

    // Filtra las coordenadas que están dentro del rango de fechas seleccionado
    var coordenadasFiltradas = data.filter(function(coordenada) {
        return coordenada.fecha >= fechaInicial.value && coordenada.fecha <= fechaFinal.value;
    });

    // Ordena las coordenadas por fecha
    coordenadasFiltradas.sort(function(a, b) {
        return a.fecha.localeCompare(b.fecha);
    });

    // Crea marcadores y polilíneas para la secuencia de coordenadas
    for (var i = 0; i < coordenadasFiltradas.length; i++) {
        var latitud = coordenadasFiltradas[i].latitud;
        var longitud = coordenadasFiltradas[i].longitud;
        var fecha = coordenadasFiltradas[i].fecha;
        var hora = coordenadasFiltradas[i].hora;
        
        var marker = L.marker([latitud, longitud], { icon: blueIcon });
        marker.bindPopup("Fecha: " + fecha + "<br>Hora: " + hora);
        markers.push(marker);

        coordenadas.push([latitud, longitud]);

        // Conecta las coordenadas con polilíneas, excepto para la última coordenada
        if (i < coordenadasFiltradas.length - 1) {
            var nextLatitud = coordenadasFiltradas[i + 1].latitud;
            var nextLongitud = coordenadasFiltradas[i + 1].longitud;

            var polyline = L.polyline([[latitud, longitud], [nextLatitud, nextLongitud]], { color: 'blue' });
            polylines.push(polyline);
        }
    }

    // Agrega todos los marcadores al mapa
    var markersLayer = L.layerGroup(markers);
    map.addLayer(markersLayer);

    // Agrega todas las polilíneas al mapa
    var polylinesLayer = L.layerGroup(polylines);
    map.addLayer(polylinesLayer);
}
