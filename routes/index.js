const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);  // Aquí aseguramos que las rutas se cargan

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
