const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, projectId, assigneeId, dueDate } = req.body;
  if (!title || !projectId) {
    return res.status(400).json({ message: 'Title and projectId are required' });
  }

  try {
    // Check if user has access to the project
    const project = await req.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'ADMIN') {
      const isMember = project.members.some(m => m.userId === req.user.id);
      if (!isMember) return res.status(403).json({ message: 'Access denied' });
    }

    const task = await req.prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        creatorId: req.user.id
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update a task (status, assignee, etc.)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assigneeId, dueDate } = req.body;

  try {
    const existingTask = await req.prisma.task.findUnique({
      where: { id },
      include: { project: { include: { members: true } } }
    });

    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    // Check permissions
    if (req.user.role !== 'ADMIN') {
      const isMember = existingTask.project.members.some(m => m.userId === req.user.id);
      if (!isMember) return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await req.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task (Admin only, or creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await req.prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await req.prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Get tasks assigned to me
router.get('/my-tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await req.prisma.task.findMany({
      where: { assigneeId: req.user.id },
      include: {
        project: { select: { id: true, name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching my tasks' });
  }
});

module.exports = router;
