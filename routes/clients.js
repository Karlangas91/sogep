const express = require('express');
const router = express.Router();
const { createClient, checkClientExistence, getAllClients } = require('../models/client');
const { isAuthenticated } = require('../middlewares/auth');

// Ruta para listar clientes con búsqueda
router.get('/', isAuthenticated, async (req, res) => {
    const search = req.query.search || '';
    try {
        const clients = await getAllClients(search);
        res.render('clients/index', { clients, search });
    } catch (error) {
        console.error("❌ Error al listar los clientes:", error);
        res.redirect('/dashboard');
    }
});

// Ruta para crear un nuevo cliente
router.post('/create', isAuthenticated, async (req, res) => {
    const { codigo, nombre_comercial, razon_social, cedula, direccion_oficina, direccion_entrega1, direccion_entrega2, plazo_credito, estado, vendedor, asistente } = req.body;
    
    // Verificar si el código o la cédula ya existen
    const exists = await checkClientExistence(codigo, cedula);
    if (exists) {
        req.flash('errorMessage', 'El código o la cédula ya están registrados.');
        return res.redirect('/clients');
    }

    try {
        const newClient = await createClient(req.body);
        req.flash('successMessage', 'Cliente creado correctamente');
        res.redirect('/clients');
    } catch (error) {
        console.error("❌ Error al crear el cliente:", error);
        req.flash('errorMessage', 'Hubo un error al crear el cliente.');
        res.redirect('/clients');
    }
});

module.exports = router;
