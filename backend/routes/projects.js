const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all projects (Admins see all, Members see projects they are assigned to)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await req.prisma.project.findMany({
        include: {
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true, members: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      const memberProjects = await req.prisma.projectMember.findMany({
        where: { userId: req.user.id },
        include: {
          project: {
            include: {
              creator: { select: { id: true, name: true, email: true } },
              _count: { select: { tasks: true, members: true } }
            }
          }
        }
      });
      projects = memberProjects.map(mp => mp.project).sort((a, b) => b.createdAt - a.createdAt);
    }
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create a project (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, members } = req.body; // members is array of userIds
  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = await req.prisma.project.create({
      data: {
        name,
        description,
        creatorId: req.user.id,
        members: members && members.length > 0 ? {
          create: members.map(userId => ({ userId }))
        } : undefined
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Get a single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const project = await req.prisma.project.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check access
    if (req.user.role !== 'ADMIN') {
      const isMember = project.members.some(m => m.userId === req.user.id);
      if (!isMember) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Add members to a project
router.post('/:id/members', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { userIds } = req.body;
  if (!userIds || !Array.isArray(userIds)) return res.status(400).json({ message: 'userIds array is required' });

  try {
    await req.prisma.projectMember.createMany({
      data: userIds.map(userId => ({ projectId: id, userId })),
      skipDuplicates: true
    });
    res.json({ message: 'Members added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding members' });
  }
});

module.exports = router;
