require('dotenv').config();
const express = require('express');
const mongoose = require('./config/database');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar datos en formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar sesiones
app.use(session({
  secret: 'sogep_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Importar y usar rutas
app.use('/', require('./routes/auth'));
app.use('/clientes', require('./routes/clientes'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
