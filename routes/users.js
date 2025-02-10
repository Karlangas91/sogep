const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const router = express.Router();

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('message', 'Debes iniciar sesión para acceder a esta página.');
    res.redirect('/login');
}

// 📌 Listar Usuarios (GET)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const users = await pool.query(`
            SELECT users.id, users.username, users.email, roles.name AS role 
            FROM users 
            LEFT JOIN roles ON users.role_id = roles.id
        `);
        res.render('users/index', { users: users.rows, message: req.flash('message') });
    } catch (error) {
        console.error("❌ Error obteniendo usuarios:", error);
        res.redirect('/dashboard');
    }
});

// 📌 Mostrar formulario para Crear Usuario (GET)
router.get('/create', isAuthenticated, async (req, res) => {
    const roles = await pool.query("SELECT * FROM roles");
    res.render('users/create', { roles: roles.rows, message: req.flash('message') });
});

// 📌 Crear Usuario (POST)
router.post('/create', isAuthenticated, async (req, res) => {
    const { username, email, password, role_id } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, email, password, role_id) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, role_id]
        );

        req.flash('message', '✅ Usuario creado exitosamente.');
        res.redirect('/users');
    } catch (error) {
        console.error("❌ Error creando usuario:", error);
        req.flash('message', 'Error al crear el usuario.');
        res.redirect('/users/create');
    }
});

// 📌 Mostrar formulario para Editar Usuario (GET)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
        const roles = await pool.query("SELECT * FROM roles");
        if (user.rows.length === 0) {
            req.flash('message', 'Usuario no encontrado.');
            return res.redirect('/users');
        }

        res.render('users/edit', { user: user.rows[0], roles: roles.rows, message: req.flash('message') });
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.redirect('/users');
    }
});

// 📌 Actualizar Usuario (POST)
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const { username, email, role_id } = req.body;
    try {
        await pool.query("UPDATE users SET username = $1, email = $2, role_id = $3 WHERE id = $4",
            [username, email, role_id, req.params.id]);

        req.flash('message', '✅ Usuario actualizado correctamente.');
        res.redirect('/users');
    } catch (error) {
        console.error("❌ Error actualizando usuario:", error);
        req.flash('message', 'Error al actualizar el usuario.');
        res.redirect(`/users/edit/${req.params.id}`);
    }
});

// 📌 Eliminar Usuario (GET)
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
        req.flash('message', '✅ Usuario eliminado correctamente.');
    } catch (error) {
        console.error("❌ Error eliminando usuario:", error);
        req.flash('message', 'Error al eliminar el usuario.');
    }
    res.redirect('/users');
});

module.exports = router;


router.get('/debug-db-roles', async (req, res) => {
    try {
        const roles = await pool.query("SELECT * FROM roles");
        res.json(roles.rows);
    } catch (error) {
        console.error("❌ Error obteniendo roles:", error);
        res.status(500).send("Error obteniendo roles.");
    }
});
