const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3112;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Define routes
app.get('/api/tasks', async (req, res) => {
    console.log('GET /api/tasks called');
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/tasks', async (req, res) => {
    console.log('POST /api/tasks called with body:', req.body);
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating task:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    console.log(`GET /api/tasks/${req.params.id} called`);
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching task:', err.message);
        res.status(500).send('Server error');
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    console.log(`PUT /api/tasks/${req.params.id} called with body:`, req.body);
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
            [title, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating task:', err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    console.log(`DELETE /api/tasks/${req.params.id} called`);
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error deleting task:', err.message);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
