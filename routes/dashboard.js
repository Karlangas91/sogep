const express = require('express');
const router = express.Router();

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('errorMessage', 'Debes iniciar sesión para acceder al dashboard.');
    res.redirect('/login');
}

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
        errorMessage: req.flash('errorMessage'),
        layout: 'layout'  // Aquí usamos layout.ejs
    });
});


module.exports = router;
