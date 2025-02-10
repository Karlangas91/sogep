const express = require('express');
const router = express.Router();

// Ruta para la página de inicio de sesión
router.get('/login/', (req, res) => {
    res.render('login', { title: 'Inicio de Sesión' });
});

module.exports = router;
