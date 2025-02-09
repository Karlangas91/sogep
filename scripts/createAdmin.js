const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function crearAdmin() {
    const username = 'admin';
    const email = 'cbadillarjl@gmail.com';
    const password = 'carlosloscar2214'; // Nueva contraseña

    try {
        // Verificar si el usuario admin ya existe
        const userExists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (userExists.rows.length > 0) {
            console.log("⚠ El usuario 'admin' ya existe. Eliminándolo...");
            await pool.query("DELETE FROM users WHERE username = $1", [username]);
            console.log("✅ Usuario 'admin' eliminado.");
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario admin
        await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]
        );

        console.log("✅ Usuario 'admin' creado con éxito.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creando usuario admin:", error);
        process.exit(1);
    }
}

// Ejecutar la función
crearAdmin();
