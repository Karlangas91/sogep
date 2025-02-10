const pool = require('../config/database');

async function updateUsersTable() {
    const query = `
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id) DEFAULT 1;
    `;

    try {
        await pool.query(query);
        console.log("✅ Campo 'role_id' agregado a la tabla 'users'.");
    } catch (error) {
        console.error("❌ Error actualizando la tabla 'users':", error);
    }
}

module.exports = updateUsersTable;
