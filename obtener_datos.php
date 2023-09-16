<?php
$servername = "henrydb.cfsjsehoiurs.us-east-2.rds.amazonaws.com";
$username = "hdcm";
$password = "hdcm02ds";
$dbname = "dbHenry";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT LONGITUD, LATITUD, FECHA, HORA FROM coordenadas ORDER BY FECHA DESC, HORA DESC";
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

$data = array_slice($data, 0, 10); // Get the last 10 values

$conn->close();

header("Content-Type: application/json");
echo json_encode($data);
?>
