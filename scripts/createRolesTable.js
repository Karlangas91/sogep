const pool = require('../config/database');

async function addRoleColumn() {
    try {
        await pool.query(`
            ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id) DEFAULT 1;
        `);
        console.log("✅ Columna 'role_id' añadida con éxito.");
    } catch (error) {
        console.error("❌ Error al añadir la columna 'role_id':", error);
    }
}

addRoleColumn();
