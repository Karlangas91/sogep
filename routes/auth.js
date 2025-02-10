const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const router = express.Router();

// Ruta para procesar el inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            req.flash('message', 'Usuario o contraseña incorrectos.');
            return res.redirect('/login');
        }

        const user = result.rows[0];

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            req.flash('message', 'Usuario o contraseña incorrectos.');
            return res.redirect('/login');
        }

        // Guardar usuario en la sesión
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error autenticando usuario:", error);
        req.flash('message', 'Ocurrió un error. Inténtalo de nuevo.');
        res.redirect('/login');
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
