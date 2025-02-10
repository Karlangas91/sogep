const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Middleware para manejar sesiones
router.use((req, res, next) => {
    res.locals.message = req.session.message || null;
    req.session.message = null;
    next();
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { message: res.locals.message, username: '' });
});

// Ruta para procesar el inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            req.session.message = '⚠ Usuario no encontrado';
            return res.redirect('/login');
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            req.session.message = '❌ Contraseña incorrecta';
            return res.redirect('/login');
        }

        req.session.userId = user.rows[0].id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error en el login:", error);
        req.session.message = '❌ Error en el servidor, intenta nuevamente';
        res.redirect('/login');
    }
});

// Ruta del Dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard', { username: "admin" });
});

module.exports = router;
