const { pool } = require('../config/db');

const User = {
  // Find a user by email (used for login + duplicate-check on register)
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  // Find a user by id
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  // Create a new user. `password` should already be bcrypt-hashed.
  async create({ name, email, phone, password }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, password]
    );
    return { id: result.insertId, name, email, phone };
  },
};

module.exports = User;
