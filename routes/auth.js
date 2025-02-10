const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
});

// Ruta para procesar el inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            req.flash('message', 'Usuario no encontrado');
            req.flash('username', username);
            return res.redirect('/login');
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            req.flash('message', 'Contraseña incorrecta');
            req.flash('username', username);
            return res.redirect('/login');
        }

        req.session.userId = user.rows[0].id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error en el login:", error);
        req.flash('message', 'Error en el servidor');
        req.flash('username', username);
        res.redirect('/login');
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
