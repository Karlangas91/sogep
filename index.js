const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require('path');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));  // Para procesar datos del formulario
app.use(express.static(path.join(__dirname, 'public')));  // Archivos estáticos (CSS, JS)

// Sesiones
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

// Mensajes flash
app.use(flash());

// Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
app.use('/', indexRoutes);
app.use('/', authRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
