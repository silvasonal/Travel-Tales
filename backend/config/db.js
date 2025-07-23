const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});


// Test database connection
pool.connect()
    .then(client => {
        console.log('Connected to the PostgreSQL database.');
        client.release();   
    })
    .catch(err => 
        console.error('Database connection error:', err));

module.exports = pool;
