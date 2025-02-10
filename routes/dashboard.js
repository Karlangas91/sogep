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
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.session.user, 
        currentPage: 'dashboard'  // Definición de currentPage
    });
});


module.exports = router;
