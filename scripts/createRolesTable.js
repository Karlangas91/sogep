const pool = require('../config/database');

async function createRolesTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS roles (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );
    `;

    try {
        await pool.query(query);
        console.log("✅ Tabla 'roles' creada correctamente.");
    } catch (error) {
        console.error("❌ Error creando la tabla 'roles':", error);
    }
}

module.exports = createRolesTable;
