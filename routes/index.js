const express = require('express');
const router = express.Router();

// Ruta del Dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
