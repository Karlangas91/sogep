const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Gestión de clientes - Próximamente");
});

module.exports = router;
