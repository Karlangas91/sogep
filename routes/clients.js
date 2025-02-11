// routes/clients.js
const express = require('express');
const router = express.Router();
const { getAllClients, createClient, checkClientExistence } = require('../models/client'); // Traemos el modelo de cliente para interactuar con la base de datos

const authMiddleware = require('../routes/auth'); // Middleware para autenticación

// Aplica el middleware para verificar la autenticación antes de acceder a las rutas de clientes
router.use(authMiddleware);

// Ruta para mostrar todos los clientes
router.get('/', async (req, res) => {
    try {
        const clients = await getAllClients();  // Llama a la función getAllClients para obtener todos los clientes
        res.render('clients/index', { clients });  // Renderiza la vista de clientes y pasa los datos obtenidos
    } catch (error) {
        console.error("❌ Error al obtener los clientes:", error);
        res.status(500).send('Error al obtener los clientes.');
    }
});

// Ruta para crear un nuevo cliente (POST)
router.post('/create', async (req, res) => {
    const { codigo, nombre_comercial, razon_social, cedula, direccion_oficina, direccion_entrega1, direccion_entrega2, plazo_credito, estado, vendedor, asistente } = req.body;

    // Validación: El código y la cédula deben ser solo numéricos
    if (!/^\d+$/.test(codigo)) {
        return res.status(400).json({ message: 'El código debe ser numérico.' });  // Si el código no es numérico, devolvemos un error
    }

    if (!/^\d+$/.test(cedula)) {
        return res.status(400).json({ message: 'La cédula debe ser numérica.' });  // Si la cédula no es numérica, devolvemos un error
    }

    // Verificar si el código o la cédula ya existen en la base de datos
    const exists = await checkClientExistence(codigo, cedula);
    if (exists) {
        return res.status(400).json({ message: 'El código o la cédula ya están registrados.' });  // Si el cliente ya existe, devolvemos un error
    }

    try {
        // Crear el cliente en la base de datos
        const newClient = await createClient(req.body);

        // Responder con el cliente recién creado
        res.status(200).json({
            message: 'Cliente creado correctamente',
            client: newClient  // Devolvemos los datos del cliente recién creado
        });
    } catch (error) {
        console.error("❌ Error al crear el cliente:", error);
        res.status(500).json({ message: 'Error al crear el cliente' });  // Si hay un error al crear el cliente, devolvemos un error
    }
});

module.exports = router;
