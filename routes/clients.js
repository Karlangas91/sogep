// routes/clients.js
const express = require('express');
const router = express.Router();
const { getAllClients } = require('../models/client');  // Aquí llamamos al modelo de cliente para obtener los datos

const authMiddleware = require('../routes/auth');  // Corregido: la ruta ahora es correcta

router.use(authMiddleware);  // Aplica el middleware en todas las rutas de clientes


// Ruta para mostrar todos los clientes
router.get('/', async (req, res) => {
    try {
        const clients = await getAllClients();  // Esta función obtiene todos los clientes de la base de datos
        res.render('clients/index', { clients });  // Renderiza la vista 'clients/index.ejs' y pasa los datos de los clientes
    } catch (error) {
        console.error("❌ Error al obtener los clientes:", error);
        res.status(500).send('Error al obtener los clientes.');
    }
});

module.exports = router;
