//routes
const router = require('express').Router();

router.get("/", (req,res) => {
    res.render("index");
});

router.get("/latest", async (req, res) => {
    // Aquí debes agregar la lógica para obtener el último valor de la base de datos
    // y luego enviarlo como respuesta en formato JSON
    try {
        // Lógica para obtener el último valor de la base de datos
        const latestData = await getLastValue();

        // Enviar el último valor como respuesta en formato JSON
        res.json({ latestData });
    } catch (error) {
        console.error("Error al obtener el último valor:", error);
        res.status(500).json({ error: "Error al obtener el último valor" });
    }
});


module.exports = router;
