<?php
$servername = "henrydb.cfsjsehoiurs.us-east-2.rds.amazonaws.com";
$username = "hdcm";
$password = "hdcm02ds";
$dbname = "dbHenry";

// Obtener las fechas de inicio y fin desde la solicitud POST (puedes usar GET si lo prefieres)
$fechaInicial = $_POST["fecha_inicial"];
$fechaFinal = $_POST["fecha_final"];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Construir la consulta SQL con las fechas de inicio y fin
$sql = "SELECT LONGITUD, LATITUD, FECHA, HORA FROM coordenadas 
        WHERE FECHA BETWEEN '$fechaInicial' AND '$fechaFinal' 
        ORDER BY FECHA DESC, HORA DESC";

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
