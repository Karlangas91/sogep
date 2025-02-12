const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

// Página de login
router.get('/login', (req, res) => {
    res.render('login', {
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage'),
        username: req.flash('username') || ''
    });
});

// Procesar login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simula la validación de usuario y contraseña
    if (username === 'admin' && password === 'admin') {
        req.session.user = { username };
        req.flash('successMessage', '¡Bienvenido!');
        res.redirect('/dashboard');
    } else {
        req.flash('errorMessage', 'Usuario o contraseña incorrectos');
        res.redirect('/login');
    }
});

// Dashboard (protege esta ruta con un middleware)
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

module.exports = router;
