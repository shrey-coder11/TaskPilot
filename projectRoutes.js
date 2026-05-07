import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create project (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Please provide name and description' });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await project.populate(['createdBy', 'members']);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'admin') {
      // Admin sees all projects
      projects = await Project.find().populate(['createdBy', 'members']);
    } else {
      // Member sees only projects they're part of
      projects = await Project.find({ members: req.user.id }).populate(['createdBy', 'members']);
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(['createdBy', 'members']);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      !project.members.some((member) => member._id.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to project (admin only)
router.put('/:id/add-member', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find project
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is already a member
    if (project.members.some((member) => member.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add member
    project.members.push(user._id);
    await project.save();
    await project.populate(['createdBy', 'members']);

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
