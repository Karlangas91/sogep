const express = require('express');
const router = express.Router();

// Ruta para el dashboard
router.get('/', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
