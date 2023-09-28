<?php
$servername = "diselec-db.cccbupvd7g7d.us-east-2.rds.amazonaws.com";
$username = "robin";
$password = "Metallica9801.";
$dbname = "diselec";

// Obtener las fechas de inicio y fin desde la solicitud POST (puedes usar GET si lo prefieres)
$fechaInicial = $_POST["fecha_inicial"];
$fechaFinal = $_POST["fecha_final"];

$conn = new mysqli($database_host, $database_user, $database_password, $database_name);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Construir la consulta SQL con las fechas de inicio y fin
$sql = str_replace('$fechaInicial', $fechaInicial, str_replace('$fechaFinal', $fechaFinal, $config['sql_h']));
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
