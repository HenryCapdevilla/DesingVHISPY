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
    let query = "INSERT INTO coordenadas (LATITUD, LONGITUD, FECHA, HORA) VALUES (%s, %s, %s, %s)"
        +"VALUES ('"+longitude+"','"+latitude+"','"+date+"','"+time+"')";
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

module.exports = {
    pool,
    connect,
    addGpsData
}