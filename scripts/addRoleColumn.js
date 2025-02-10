const pool = require('../config/database');

async function addRoleColumn() {
    try {
        // Verificar si la columna ya existe
        const result = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='role_id';
        `);

        if (result.rows.length === 0) {
            console.log("ℹ️ La columna 'role_id' no existe. Creándola...");

            // Asegurar que la tabla roles ya tiene datos
            await pool.query(`
                INSERT INTO roles (id, name) VALUES (1, 'Administrador') 
                ON CONFLICT (id) DO NOTHING;
            `);

            // Agregar la columna role_id con clave foránea
            await pool.query(`
                ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id) DEFAULT 1;
            `);

            consol
