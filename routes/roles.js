const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('errorMessage', 'Debes iniciar sesión para acceder a esta página.');
    res.redirect('/login');
}

// 📌 Listar Roles (GET)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const roles = await pool.query("SELECT * FROM roles");
        res.render('roles/index', { 
            roles: roles.rows, 
            currentPage: 'roles',
            message: req.flash('message') || '', // 🔹 Asegura que siempre haya un valor
            successMessage: req.flash('successMessage') || '',
            errorMessage: req.flash('errorMessage') || ''
        });
    } catch (error) {
        console.error("❌ Error obteniendo roles:", error);
        res.redirect('/dashboard');
    }
});


// 📌 Mostrar formulario para Crear Rol (GET)
router.get('/create', isAuthenticated, (req, res) => {
    res.render('roles/create', { 
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage') 
    });
});

// 📌 Crear un nuevo Rol (POST)
router.post('/create', isAuthenticated, async (req, res) => {
    const { name } = req.body;

    try {
        await pool.query("INSERT INTO roles (name) VALUES ($1)", [name]);
        req.flash('successMessage', '✅ Rol creado exitosamente.');
        res.redirect('/roles');
    } catch (error) {
        console.error("❌ Error creando rol:", error);
        req.flash('errorMessage', 'Error al crear el rol.');
        res.redirect('/roles/create');
    }
});

// 📌 Mostrar formulario para Editar Rol (GET)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const role = await pool.query("SELECT * FROM roles WHERE id = $1", [req.params.id]);

        if (role.rows.length === 0) {
            req.flash('errorMessage', 'Rol no encontrado.');
            return res.redirect('/roles');
        }

        res.render('roles/edit', { 
            role: role.rows[0], 
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage') 
        });
    } catch (error) {
        console.error("❌ Error obteniendo rol:", error);
        req.flash('errorMessage', 'Error al obtener el rol.');
        res.redirect('/roles');
    }
});

// 📌 Actualizar Rol (POST)
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const { name } = req.body;
    try {
        await pool.query("UPDATE roles SET name = $1 WHERE id = $2", [name, req.params.id]);
        req.flash('successMessage', '✅ Rol actualizado correctamente.');
        res.redirect('/roles');
    } catch (error) {
        console.error("❌ Error actualizando rol:", error);
        req.flash('errorMessage', 'Error al actualizar el rol.');
        res.redirect(`/roles/edit/${req.params.id}`);
    }
});

// 📌 Eliminar Rol (GET)
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const roleExists = await pool.query("SELECT * FROM users WHERE role_id = $1", [req.params.id]);

        if (roleExists.rows.length > 0) {
            req.flash('errorMessage', '❌ No puedes eliminar este rol porque está asignado a usuarios.');
        } else {
            await pool.query("DELETE FROM roles WHERE id = $1", [req.params.id]);
            req.flash('successMessage', '✅ Rol eliminado correctamente.');
        }
    } catch (error) {
        console.error("❌ Error eliminando rol:", error);
        req.flash('errorMessage', 'Error al eliminar el rol.');
    }
    res.redirect('/roles');
});

module.exports = router;
