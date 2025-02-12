const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Middleware para manejar sesiones y mensajes Flash
router.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    next();
});

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('errorMessage', '⚠ Debes iniciar sesión para acceder.');
    res.redirect('/login');
}

// Ruta principal: Redirige a dashboard o login
router.get('/', (req, res) => {
    if (!req.session.user) {
        req.flash('errorMessage', '⚠ Debes iniciar sesión para acceder al dashboard.');
        return res.redirect('/login');
    }
    res.redirect('/dashboard');
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { 
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage'),
        username: req.flash('username') || '' // Asegura que 'username' nunca sea undefined
    });
});

// Ruta para procesar el inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            req.flash('errorMessage', '⚠ Usuario no encontrado.');
            return res.redirect('/login');
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            req.flash('errorMessage', '❌ Contraseña incorrecta.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        req.flash('successMessage', `✅ Bienvenido, ${user.username}`);
        res.redirect('/dashboard');
    } catch (error) {
        console.error("❌ Error en el login:", error);
        req.flash('errorMessage', '❌ Error en el servidor, intenta nuevamente.');
        res.redirect('/login');
    }
});

// Ruta del Dashboard (protegida)
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.session.user,
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage'),
        layout: 'layout'
    });
});

// Ruta para gestionar clientes
router.get('/clients', isAuthenticated, (req, res) => {
    res.render('clients', {
        title: 'Gestión de Clientes',
        layout: 'layout'  // Asegurándonos de pasar layout.ejs
    });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
