const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    let taskWhere = {};
    if (req.user.role !== 'ADMIN') {
      taskWhere = { assigneeId: req.user.id };
    }

    const tasks = await req.prisma.task.findMany({
      where: taskWhere,
      select: { status: true, dueDate: true }
    });

    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const review = tasks.filter(t => t.status === 'REVIEW').length;
    const done = tasks.filter(t => t.status === 'DONE').length;

    const now = new Date();
    const overdue = tasks.filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now).length;

    res.json({
      metrics: {
        total,
        todo,
        inProgress,
        review,
        done,
        overdue
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard metrics' });
  }
});

module.exports = router;
