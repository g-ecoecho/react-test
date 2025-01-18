console.log('db.js script started');

const { Pool } = require('pg');
require('dotenv').config();

console.log('Environment variables loaded');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

console.log('PostgreSQL pool created');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to PostgreSQL...');
        await pool.connect();
        console.log('PostgreSQL connected successfully...');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
        process.exit(1);
    }
};

console.log('connectDB function defined');

// Execute connectDB to establish the database connection
(async () => {
    await connectDB();
    console.log('db.js script finished');
})();

module.exports = {
    query: (text, params) => {
        console.log(`Executing query: ${text}`);
        return pool.query(text, params);
    },
    connectDB,
};
