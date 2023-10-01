//routes
const router = require('express').Router();
const cnx = require('../cnx'); // Ajusta la ruta según la ubicación real del módulo cnx


router.get("/", (req,res) => {
    res.render("index");
});

router.get("/latest", async (req, res) => {
    try {
        // Aquí debes realizar una consulta SQL para obtener el último valor de la base de datos
        // Esto dependerá de la estructura de tu base de datos y de cómo almacenas los datos
        
        // Ejemplo de consulta SQL (debes adaptarla a tu base de datos):
        const sqlQuery = "SELECT LOGINTUD, LATITUD, FECHA, HORA FROM gps_data ORDER BY fecha DESC, hora DESC LIMIT 1";
        
        // Ejecutar la consulta en la base de datos
        cnx.pool.query(sqlQuery, (error, results) => {
            if (error) {
                console.error("Error al obtener el último valor:", error);
                res.status(500).json({ error: "Error al obtener el último valor" });
            } else {
                // Verificar si se obtuvieron resultados
                if (results.length > 0) {
                    // Obtener el último valor de la consulta
                    const latestData = results[0];

                    // Enviar el último valor como respuesta en formato JSON
                    res.json({ latestData });
                } else {
                    // No se encontraron registros en la base de datos
                    res.status(404).json({ error: "No se encontraron registros" });
                }
            }
        });
    } catch (error) {
        console.error("Error al obtener el último valor:", error);
        res.status(500).json({ error: "Error al obtener el último valor" });
    }
});



module.exports = router;
