const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

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
    saveUninitialized: true
}));

// Middleware para mensajes flash
app.use(flash());

// Middleware para pasar variables globales a las vistas
app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    res.locals.username = req.flash('username');
    next();
});

// Rutas
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const dashboardRoutes = require('./routes/dashboard');

app.use('/dashboard', dashboardRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

const createRolesTable = require('./scripts/createRolesTable');
const updateUsersTable = require('./scripts/updateUsersTable');

app.get('/run-scripts', async (req, res) => {
    try {
        await createRolesTable();
        await updateUsersTable();
        res.send("✅ Scripts ejecutados correctamente.");
    } catch (error) {
        console.error("❌ Error ejecutando scripts:", error);
        res.status(500).send("Error ejecutando los scripts.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
