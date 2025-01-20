const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = 3112;

const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Define routes
app.get('/api/tasks', async (req, res) => {
    console.log('GET /api/tasks called');
    try {
        const tasks = await prisma.tasks.findMany();
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/tasks', async (req, res) => {
    console.log('POST /api/tasks called with body:', req.body);
    const { title, description } = req.body;
    try {
        const task = await prisma.tasks.create({
            data: { title, description },
        });
        res.json(task);
    } catch (err) {
        console.error('Error creating task:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    console.log(`GET /api/tasks/${req.params.id} called`);
    const { id } = req.params;
    try {
        const task = await prisma.tasks.findUnique({
            where: { id: parseInt(id) },
        });
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.json(task);
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
        const task = await prisma.tasks.update({
            where: { id: parseInt(id) },
            data: { title, description },
        });
        res.json(task);
    } catch (err) {
        console.error('Error updating task:', err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    console.log(`DELETE /api/tasks/${req.params.id} called`);
    const { id } = req.params;
    try {
        const task = await prisma.tasks.delete({
            where: { id: parseInt(id) },
        });
        res.json(task);
    } catch (err) {
        console.error('Error deleting task:', err.message);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
