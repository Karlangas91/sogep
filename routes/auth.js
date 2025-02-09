const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const router = express.Router();

// Middleware para verificar sesión
function authMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Intentos fallidos por usuario (temporal en sesión)
const failedAttempts = {};

// Página de Login
router.get('/login', (req, res) => {
    res.render('login', { 
        message: req.session.message, 
        username: req.session.username || '' 
    });
    req.session.message = null;
});

// Procesar Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        // Si el usuario no existe
        if (result.rows.length === 0) {
            req.session.message = '❌ Usuario no encontrado.';
            req.session.username = username;
            return res.redirect('/login');
        }

        const user = result.rows[0];

        // Verificar si el usuario ha excedido intentos fallidos
        if (failedAttempts[username] && failedAttempts[username].attempts >= 3) {
            const diff = (Date.now() - failedAttempts[username].time) / 1000;
            if (diff < 300) {
                req.session.message = `⚠ Demasiados intentos fallidos. Intenta nuevamente en ${Math.ceil(300 - diff)} segundos.`;
                return res.redirect('/login');
            } else {
                failedAttempts[username] = { attempts: 0, time: null };
            }
        }

        // Comparar contraseña
        if (!(await bcrypt.compare(password, user.password))) {
            // Registrar intento fallido
            if (!failedAttempts[username]) {
                failedAttempts[username] = { attempts: 0, time: null };
            }
            failedAttempts[username].attempts++;
            failedAttempts[username].time = Date.now();

            req.session.message = `❌ Contraseña incorrecta. Intento ${failedAttempts[username].attempts}/3`;
            req.session.username = username;
            return res.redirect('/login');
        }

        // Si el login es exitoso, resetear intentos fallidos
        failedAttempts[username] = { attempts: 0, time: null };

        // Guardamos la sesión del usuario
        req.session.user = { id: user.id, username: user.username };
        
        // Redirigir al dashboard
        res.redirect('/dashboard');
    } catch (err) {
        console.error("❌ Error en el login:", err);
        req.session.message = '❌ Error en el servidor, intenta de nuevo.';
        res.redirect('/login');
    }
});

// Cerrar sesión (logout)
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
