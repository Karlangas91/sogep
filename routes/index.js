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

// 📌 Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login', { 
        errorMessage: res.locals.errorMessage, 
        successMessage: res.locals.successMessage, 
        username: ''
    });
});

// Ruta principal (root) para redirigir al dashboard
router.get('/', (req, res) => {
    if (!req.session.user) {
        req.flash('errorMessage', '⚠ Debes iniciar sesión para acceder al dashboard.');
        return res.redirect('/login');
    }
    res.redirect('/dashboard');  // Redirige al dashboard si el usuario está logueado
});

// 📌 Ruta para procesar el inicio de sesión
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

        // Guardar usuario en sesión
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        req.flash('successMessage', '✅ Inicio de sesión exitoso.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error("❌ Error en el login:", error);
        req.flash('errorMessage', '❌ Error en el servidor, intenta nuevamente.');
        res.redirect('/login');
    }
});

// 📌 Ruta del Dashboard (protegida)
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        req.flash('errorMessage', '⚠ Debes iniciar sesión para acceder al dashboard.');
        return res.redirect('/login');
    }
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.session.user,
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage')
    });
});

// 📌 Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
