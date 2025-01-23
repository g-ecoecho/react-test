const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title, description, userIds } = req.body;
    try {
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                status: 'to pend',
                users: {
                    create: userIds.map((userId) => ({
                        user: {
                            connect: { id: parseInt(userId) }
                        }
                    })),
                },
            },
        });
        res.json(task);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
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
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

describe('Tasks API', () => {
    let token;
    let userId;

    beforeAll(async () => {
        const user = await prisma.users.create({
            data: {
                email: 'test@example.com',
                passwordHash: 'hashedpassword',
                role: 'user',
            },
        });
        userId = user.id;
        token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
    });

    afterAll(async () => {
        await prisma.userTasks.deleteMany(); // Delete related records in UserTasks first
        await prisma.tasks.deleteMany();
        await prisma.users.deleteMany();
        await prisma.$disconnect();
    });

    test('Can create a task', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                userIds: [userId],
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Test Task');
        expect(response.body.description).toBe('This is a test task');
        expect(response.body.status).toBe('to pend');
    });

    test('Can fetch tasks', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].title).toBe('Test Task');
    });
});
