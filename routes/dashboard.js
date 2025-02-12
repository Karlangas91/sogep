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
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.session.user,
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage'),
        layout: 'layout',  // Aquí usamos layout.ejs
        body: '<h1>Bienvenido al Dashboard</h1>'
    });
});

module.exports = router;
