import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors

dotenv.config();

const app = express();
const port = 3112;

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors()); // Enable CORS

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log('Token verified, user:', user);
        next();
    });
};

// Define routes
app.post('/api/auth/register', async (req, res) => {
    console.log('POST /api/auth/register called with body:', req.body);
    const { email, password, role } = req.body;
    try {
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed:', hashedPassword);
        console.log('Creating user in database...');
        const user = await prisma.users.create({
            data: { email, passwordHash: hashedPassword, role },
        });
        console.log('User created:', user);
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Generated token:', token);
        res.json({ token, userId: user.id }); // Return the JWT token and userId
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log('POST /api/auth/login called with body:', req.body);
    const { email, password } = req.body;
    try {
        console.log('Finding user in database...');
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }
        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            console.log('Invalid credentials');
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Generated token:', token);
        res.json({ token, userId: user.id });
    } catch (err) {
        console.error('Error logging in user:', err.message);
        res.status(500).send('Server error');
    }
});

// Protect task routes with JWT middleware
app.get('/api/tasks', authenticateToken, async (req, res) => {
    console.log('GET /api/tasks called');
    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                users: {
                    some: {
                        userId: req.user.userId,
                    },
                },
            },
        });
        console.log('Tasks fetched:', tasks);
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
    console.log('POST /api/tasks called with body:', req.body);
    const { title, description, userIds } = req.body;
    try {
        console.log('Creating task in database with:', { title, description, userIds });
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                users: {
                    create: userIds.map((userId) => ({
                        user: {
                            connect: { id: parseInt(userId) }
                        }
                    })),
                },
            },
        });
        console.log('Task created:', task);
        res.json(task);
    } catch (err) {
        console.error('Error creating task:', err.message);
        console.error('Request body:', req.body);
        console.error('User ID:', req.user.userId);
        res.status(500).send('Server error');
    }
});

app.get('/api/tasks/:id', authenticateToken, async (req, res) => {
    console.log(`GET /api/tasks/${req.params.id} called`);
    const { id } = req.params;
    try {
        const task = await prisma.tasks.findUnique({
            where: { id: parseInt(id) },
            include: { users: true },
        });
        if (!task || !task.users.some((user) => user.id === req.user.userId)) {
            console.log('Task not found or user not authorized');
            return res.status(404).send('Task not found');
        }
        console.log('Task fetched:', task);
        res.json(task);
    } catch (err) {
        console.error('Error fetching task:', err.message);
        console.error('Task ID:', id);
        console.error('User ID:', req.user.userId);
        res.status(500).send('Server error');
    }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    console.log(`PUT /api/tasks/${req.params.id} called with body:`, req.body);
    const { id } = req.params;
    const { title, description, userIds } = req.body;
    try {
        const task = await prisma.tasks.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                users: {
                    set: userIds.map((userId) => ({
                        user: {
                            connect: { id: parseInt(userId) }
                        }
                    })),
                },
            },
        });
        console.log('Task updated:', task);
        res.json(task);
    } catch (err) {
        console.error('Error updating task:', err.message);
        console.error('Task ID:', id);
        console.error('Request body:', req.body);
        console.error('User ID:', req.user.userId);
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
        console.log('Task deleted:', task);
        res.json(task);
    } catch (err) {
        console.error('Error deleting task:', err.message);
        console.error('Task ID:', id);
        console.error('User ID:', req.user.userId);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
