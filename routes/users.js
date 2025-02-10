const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const router = express.Router();

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('errorMessage', 'Debes iniciar sesión para acceder a esta página.');
    res.redirect('/login');
}

// 📌 Listar Usuarios (GET)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        let search = req.query.search || '';  
        let query = `
            SELECT users.*, roles.name AS role_name 
            FROM users 
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE users.username ILIKE $1 OR users.email ILIKE $1 OR roles.name ILIKE $1
        `;

        const users = await pool.query(query, [`%${search}%`]);

        res.render('users/index', { 
            users: users.rows, 
            currentPage: 'users',
            search 
        });
    } catch (error) {
        console.error("❌ Error buscando usuarios:", error);
        res.redirect('/dashboard');
    }
});

// 📌 Ruta para obtener los datos de un usuario en formato JSON
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 📌 Actualizar Usuario con AJAX (PATCH)
router.patch('/:id', isAuthenticated, async (req, res) => {
    const { username, email, role_id } = req.body;
    try {
        await pool.query("UPDATE users SET username = $1, email = $2, role_id = $3 WHERE id = $4",
            [username, email, role_id, req.params.id]);

        res.json({ success: true, message: "✅ Usuario actualizado correctamente." });
    } catch (error) {
        console.error("❌ Error actualizando usuario:", error);
        res.status(500).json({ success: false, message: "❌ Error al actualizar el usuario." });
    }
});

module.exports = router;
