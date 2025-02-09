const pool = require('../config/database');

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                failed_attempts INT DEFAULT 0,
                reset_token TEXT,
                reset_token_exp TIMESTAMP
            );
        `);

        console.log("✅ Tabla 'users' creada correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creando la tabla 'users':", error);
        process.exit(1);
    }
}

createTables();
