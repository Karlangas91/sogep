require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar sesiones
app.use(session({
    secret: 'sogep_secret_key',
    resave: false,
    saveUninitialized: false, // No crear sesiones vacías
    cookie: { secure: false } // Cambiar a `true` si usas HTTPS
}));

// Middleware para pasar datos de sesión a todas las vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Importar y usar rutas
app.use('/', require('./routes/auth'));
app.use('/clientes', require('./routes/clientes'));

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
