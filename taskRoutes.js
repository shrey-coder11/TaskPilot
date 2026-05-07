import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create task (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    // Validation
    if (!title || !description || !project || !assignedTo || !dueDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user.id,
      dueDate,
    });

    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // Admin sees all tasks
      tasks = await Task.find().populate(['project', 'assignedTo', 'createdBy']);
    } else {
      // Member sees only tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user.id }).populate(['project', 'assignedTo', 'createdBy']);
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(['project', 'assignedTo', 'createdBy']);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Validation
    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    task.status = status;
    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
