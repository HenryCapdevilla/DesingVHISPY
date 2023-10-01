// Required Modules
require('dotenv').config();
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const dgram = require('dgram');

const cnx = require('./cnx');
const moment = require("moment");
const { addGpsData } = require('./cnx');

const app = express();

// setting the server
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views' ));


// Setting UDP Sniffer
const udp = dgram.createSocket('udp4');
const udpHost = "";
const udpPort = parseInt(process.env.UDP_PORT);


// initialization
udp.on('listening', () => {
console.log("UDP Server:  ", udpPort);
});

let data = [0, 0, 0, 0];
let data_bk = [0, 0, 0, 0];
udp.on('message', (msg) =>{
    data = msg.toString().split("\n");
    console.log(data)
    if (data_bk[2] !== data[2]){
        cnx.addGpsData(data[3],data[2],data[0],data[1]);}
    data_bk = data;
});
udp.bind(udpPort,udpHost);

// Ruta para agregar datos GPS desde el servidor UDP
app.get('/data', (req, res) => {
    // Usa los valores del último mensaje UDP recibido
    const longitude = parseFloat(data[0]); // Convierte a número flotante
    const latitude = parseFloat(data[1]); // Convierte a número flotante
    const date = data[2];
    const time = data[3];
    
    // Llama a la función addGpsData con los valores del último mensaje UDP
    addGpsData(longitude, latitude, date, time);
    console.log("Longitud: " + longitude)
    console.log("Latitud: " + latitude)
    console.log("Fecha: " + date)
    console.log("Tiempo: " + time)
    // Envía una respuesta con los valores recibidos
    res.json({
        lon: longitude,
        lat: latitude,
        dt: date,
        tm: time,
    });
});


app.use(express.json({limit: '1mb'}));
app.post("/moment", (req,res) =>{

    let btwDateQuery =  "SELECT latitud, longitud FROM gps_data WHERE ( fecha = '"+req.body.sdate+"' AND hora > '"+req.body.stime+":00' )"
                        + "OR ( fecha > '" +req.body.sdate+"' AND fecha < '"+req.body.edate+"' )"
                        + "OR ( fecha = '"+req.body.edate+"' AND hora < '"+req.body.etime+":00' )";

    cnx.pool.query(btwDateQuery, (err,rows) => {
        if (err) throw err;
        res.json({
            "data" : rows
        })
    });
});

app.post("/place", (req,res) =>{
    let querym=     "SELECT DISTINCT fecha, hora FROM gps_data WHERE latitud BETWEEN "
                    + "('"+req.body.latp+"'*0.99997) and ('"+req.body.latp+"'*1.00005) and longitud BETWEEN "
                    + "('"+req.body.longp+"'*1.00005) and ('"+req.body.longp+"'*0.99997)"


    cnx.pool.query(querym, (err,rows) => {
        if (err) throw err;
        res.json({
            "datap" : rows
        })
    });
});


//routes
app.use(require('./routes/index'));
//static files
app.use(express.static( path.join(__dirname, 'public' )));

// starting the server
const port = 80;
app.listen(port, () => {
    console.log("server on port: ",port)
});

cnx.connect();
