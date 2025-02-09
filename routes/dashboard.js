const express = require('express');
const router = express.Router();

// Ruta para el Dashboard
router.get('/', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
