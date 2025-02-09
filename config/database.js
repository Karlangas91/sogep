const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido para Render
    }
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL Conectado"))
    .catch(err => console.error("❌ Error conectando a PostgreSQL:", err));

module.exports = pool;
