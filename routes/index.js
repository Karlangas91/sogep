const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { message: null }); // Asegura que 'message' siempre está definido
});

module.exports = router;
