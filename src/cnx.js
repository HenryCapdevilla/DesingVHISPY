const mysql = require("mysql2");
const pool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASS,
    database: process.env.RDS_DB,
});

const connect = () =>{
    pool.getConnection(err => {
        if(err) throw err;
        console.log("Successful database connection!");
    });
}

const addGpsData = (longitude, latitude, date, time) => {
    cnx.pool.query(
        "INSERT INTO gps_data (LATITUD, LONGITUD, FECHA, HORA) VALUES (?, ?, ?, ?)",
        [latitude, longitude, date, time],
        (err, rows) => {
            if (err) {
                console.error("Error al insertar datos en la base de datos:", err);
                // Manejar el error de alguna manera, por ejemplo, enviar una respuesta de error HTTP
            } else {
                console.log("Datos insertados correctamente:", rows);
                // Los datos se insertaron correctamente, puedes realizar otras acciones aquí
            }
        }
    );
}

module.exports = {
    pool,
    connect,
    addGpsData
}