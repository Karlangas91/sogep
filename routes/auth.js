const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

// Middleware para verificar si el usuario está autenticado
function authMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Página de Login
router.get('/login', (req, res) => {
    res.render('login', { message: req.session.message });
    req.session.message = null; // Limpiar mensaje después de mostrarlo
});

// Procesar Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            req.session.message = '❌ Usuario no encontrado';
            return res.redirect('/login');
        }

        const user = result.rows[0];

        if (!(await bcrypt.compare(password, user.password))) {
            req.session.message = '❌ Contraseña incorrecta';
            return res.redirect('/login');
        }

        // Guardamos la sesión del usuario
        req.session.user = { id: user.id, username: user.username };
        
        // Redirigir al dashboard después del login
        res.redirect('/dashboard');
    } catch (err) {
        console.error("❌ Error en el login:", err);
        req.session.message = '❌ Error en el servidor, intenta de nuevo.';
        res.redirect('/login');
    }
});

// Ruta protegida del Dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
    res.render('dashboard', { username: req.session.user.username });
});

// Cerrar sesión (logout)
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
