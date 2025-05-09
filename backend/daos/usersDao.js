const pool = require('../config/db');

// Create a new user
const createUser = async (username, email, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (username,email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error creating user');
  }
};


// Find a user by their email
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT id,username	FROM users');
    return result.rows;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};


module.exports = { createUser, findUserByEmail, findUserByUsername, getAllUsers };

