const pool = require('../config/database');

async function addRoles() {
    try {
        console.log("🔄 Agregando roles si no existen...");

        await pool.query(`
            INSERT INTO roles (id, name) VALUES 
            (1, 'Administrador'),
            (2, 'Usuario'),
            (3, 'Operador')
            ON CONFLICT (id) DO NOTHING;
        `);

        console.log("✅ Roles agregados correctamente.");
    } catch (error) {
        console.error("❌ Error al agregar roles:", error);
    }
}

module.exports = addRoles;
