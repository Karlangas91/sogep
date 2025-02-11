const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const pool = require('./config/database');

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para analizar datos de formularios
app.use(express.urlencoded({ extended: false }));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false // 🔹 Evita crear sesiones vacías
}));

// Middleware para mensajes flash
app.use(flash());

// Middleware global para manejar los mensajes flash correctamente
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage') || null;
    res.locals.errorMessage = req.flash('errorMessage') || null;
    res.locals.currentPage = '';
    next();
});
app.use(express.static('public'));

// Rutas
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/dashboard', dashboardRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const rolesRoutes = require('./routes/roles');
app.use('/roles', rolesRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
