const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { message: '' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length === 0 || !(await bcrypt.compare(password, result.rows[0].password))) {
            return res.render('login', { message: '❌ Usuario o contraseña incorrectos' });
        }
        req.session.user = result.rows[0];
        res.redirect('/dashboard');
    } catch (err) {
        console.error("❌ Error en el login:", err);
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
