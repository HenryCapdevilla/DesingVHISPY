<?php
$servername = "database-1.cvdwcehcq5em.us-east-2.rds.amazonaws.com";
$username = "Buabs";
$password = "buabs123";
$dbname = "BuabsBD";

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

<<<<<<< HEAD
while (true) {
    $sql = "SELECT LONGITUD, LATITUD, FECHA, HORA FROM coordenadas ORDER BY FECHA DESC, HORA DESC LIMIT 1";
    $result = $conn->query($sql);
=======
$sql = "SELECT LONGITUD, LATITUD, FECHA, HORA FROM tabla ORDER BY FECHA DESC, HORA DESC";
$result = $conn->query($sql);
>>>>>>> parent of f236c2c (Actualización de credenciales)

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
