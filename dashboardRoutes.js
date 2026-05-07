import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get dashboard data
router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      tasks = await Task.find().populate(['project', 'assignedTo', 'createdBy']);
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate(['project', 'assignedTo', 'createdBy']);
    }

    // Calculate statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    const overdueTasks = tasks.filter(
      (task) => new Date(task.dueDate) < today && task.status !== 'Completed'
    ).length;

    // Recent tasks (last 5)
    const recentTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    res.status(200).json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
