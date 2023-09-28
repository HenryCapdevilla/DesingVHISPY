<?php
// Cargar el contenido de config.json
$config_json = file_get_contents('config.json');
$config = json_decode($config_json, true);

// Acceder a los valores específicos
$database_host = $config['database']['host'];
$database_user = $config['database']['user'];
$database_password = $config['database']['password'];
$database_name = $config['database']['name'];

$fechaInicial = $_POST["fecha_inicial"];
$fechaFinal = $_POST["fecha_final"];

$conn = new mysqli($database_host, $database_user, $database_password, $database_name);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

while ($row = $result->fetch_assoc()) {
    $data[] = array(
        "longitud" => $row["LONGITUD"],
        "latitud" => $row["LATITUD"],
        "fecha" => $row["FECHA"],
        "hora" => $row["HORA"]
    );
}

$sql = str_replace('$fechaInicial', $fechaInicial, str_replace('$fechaFinal', $fechaFinal, $config['sql_h']));
$result = $conn->query($sql);

// Devolver los datos en formato JSON
header("Content-Type: application/json");
echo json_encode($data);
?>