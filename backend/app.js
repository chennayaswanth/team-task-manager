const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config();

const app = express();

// Prisma singleton — prevents "too many connections" in serverless
const globalForPrisma = global;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

app.use(cors());
app.use(express.json());

// Attach prisma to every request
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Team Task Manager API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Serve static frontend (used in local/Railway mode only)
if (process.env.SERVE_STATIC === 'true') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

module.exports = app;
