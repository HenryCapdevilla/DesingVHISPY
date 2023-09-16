<?php
$servername = "henrydb.cfsjsehoiurs.us-east-2.rds.amazonaws.com";
$username = "hdcm";
$password = "hdcm02ds";
$dbname = "dbHenry";

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

function sendSSE($data) {
    echo "data: " . json_encode($data) . "\n\n";
    ob_flush();
    flush();
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

while (true) {
    $sql = "SELECT LONGITUD, LATITUD, FECHA, HORA FROM coordenadas ORDER BY FECHA DESC, HORA DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $data = array(
            "longitud" => $row["LONGITUD"],
            "latitud" => $row["LATITUD"],
            "fecha" => $row["FECHA"],
            "hora" => $row["HORA"]
        );

        sendSSE($data);
    }

    sleep(1); // Espera 1 segundo antes de buscar otra actualización
}

$conn->close();
?>
