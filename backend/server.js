const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3112;

const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Define routes
app.post('/api/auth/register', async (req, res) => {
    console.log('POST /api/auth/register called with body:', req.body);
    const { email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: { email, passwordHash: hashedPassword, role },
        });
        res.json(user);
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log('POST /api/auth/login called with body:', req.body);
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({ token });
    } catch (err) {
        console.error('Error logging in user:', err.message);
        res.status(500).send('Server error');
    }
});

// Protect task routes with JWT middleware
app.get('/api/tasks', authenticateToken, async (req, res) => {
    console.log('GET /api/tasks called');
    try {
        const tasks = await prisma.tasks.findMany();
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
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

app.get('/api/tasks/:id', authenticateToken, async (req, res) => {
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

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
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

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
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
