const pool = require('../config/database');

// Crear cliente
const createClient = async (clientData) => {
    const { codigo, nombre_comercial, razon_social, cedula, direccion_oficina, direccion_entrega1, direccion_entrega2, plazo_credito, estado, vendedor, asistente } = clientData;
    const result = await pool.query(
        `INSERT INTO clients (codigo, nombre_comercial, razon_social, cedula, direccion_oficina, direccion_entrega1, direccion_entrega2, plazo_credito, estado, vendedor, asistente) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [codigo, nombre_comercial, razon_social, cedula, direccion_oficina, direccion_entrega1, direccion_entrega2, plazo_credito, estado, vendedor, asistente]
    );
    return result.rows[0];
};

// Verificar si existe un cliente con el mismo código o cédula
const checkClientExistence = async (codigo, cedula) => {
    const result = await pool.query(
        `SELECT * FROM clients WHERE codigo = $1 OR cedula = $2`,
        [codigo, cedula]
    );
    return result.rows.length > 0;
};

// Obtener todos los clientes
const getAllClients = async (search = '') => {
    const result = await pool.query(
        `SELECT * FROM clients WHERE nombre_comercial ILIKE $1 OR razon_social ILIKE $1 OR cedula ILIKE $1`,
        [`%${search}%`]
    );
    return result.rows;
};

module.exports = { createClient, checkClientExistence, getAllClients };
