const express = require('express');
const router = express.Router();

// Ruta de inicio
router.get('/', (req, res) => {
    res.send('Bienvenido a SOGEP - Página de inicio.');
});

module.exports = router;
