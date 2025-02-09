require('dotenv').config(); // Cargar variables de entorno

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Tomar conexión desde .env
    ssl: {
        rejectUnauthorized: false // Permite conexiones SSL sin verificación estricta
    }
});

pool.connect()
    .then(() => console.log("✅ Conectado a PostgreSQL en Render"))
    .catch(err => console.error("❌ Error conectando a PostgreSQL:", err));

module.exports = pool;
