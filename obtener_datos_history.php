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

$conn = new mysqli($database_host, $database_user, $database_password, $database_name);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Construir la consulta SQL con las fechas de inicio y fin
$sql = $config['sql_h'];
$result = $conn->query($sql);

$data = array();

while ($row = $result->fetch_assoc()) {
    $data[] = array(
        "longitud" => $row["LONGITUD"],
        "latitud" => $row["LATITUD"],
        "fecha" => $row["FECHA"],
        "hora" => $row["HORA"]
    );
}

$conn->close();

header("Content-Type: application/json");
echo json_encode($data);
?>
