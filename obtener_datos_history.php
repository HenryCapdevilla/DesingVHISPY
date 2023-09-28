<?php
// Cargar el contenido de config.json
$config_json = file_get_contents('config.json');
$config = json_decode($config_json, true);

// Acceder a los valores específicos
$database_host = $config['database']['host'];
$database_user = $config['database']['user'];
$database_password = $config['database']['password'];
$database_name = $config['database']['name'];

// Obtener las fechas de inicio y fin desde la solicitud POST (puedes usar GET si lo prefieres)
$fechaInicial = $_POST["fecha_inicial"];
$fechaFinal = $_POST["fecha_final"];
$horaInicio = $_POST["hora_inicio"];
$horaFin = $_POST["hora_fin"];

$conn = new mysqli($database_host, $database_user, $database_password, $database_name);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Construir la consulta SQL con las fechas y horas de inicio y fin
$sql = "SELECT LONGITUD, LATITUD, FECHA, HORA FROM coordenadas 
        WHERE FECHA BETWEEN ? AND ? 
        AND HORA BETWEEN ? AND ?
        ORDER BY FECHA DESC, HORA DESC";
// Preparar la declaración SQL
$stmt = $conn->prepare($sql);
// Asociar los valores de las fechas y horas a los marcadores de posición en la consulta SQL
$stmt->bind_param("ssss", $fechaInicial, $fechaFinal, $horaInicio, $horaFin);
// Ejecutar la consulta SQL
$stmt->execute();
// Obtener el resultado de la consulta
$result = $stmt->get_result();


$data = array();

while ($row = $result->fetch_assoc()) {
    $data[] = array(
        "longitud" => $row["LONGITUD"],
        "latitud" => $row["LATITUD"],
        "fecha" => $row["FECHA"],
        "hora" => $row["HORA"]
    );
}

// Cerrar la conexión y liberar los recursos
$stmt->close();
$conn->close();

// Devolver los datos en formato JSON
header("Content-Type: application/json");
echo json_encode($data);
?>