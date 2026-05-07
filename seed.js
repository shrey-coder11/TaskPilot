import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@taskpilot.com',
      password: 'password123',
      role: 'admin',
    });

    const memberUser1 = await User.create({
      name: 'John Doe',
      email: 'john@taskpilot.com',
      password: 'password123',
      role: 'member',
    });

    const memberUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@taskpilot.com',
      password: 'password123',
      role: 'member',
    });

    console.log('Created sample users');

    // Create sample projects
    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI/UX',
      createdBy: adminUser._id,
      members: [adminUser._id, memberUser1._id, memberUser2._id],
    });

    const project2 = await Project.create({
      name: 'Mobile App Development',
      description: 'Build a mobile app for iOS and Android',
      createdBy: adminUser._id,
      members: [adminUser._id, memberUser1._id],
    });

    console.log('Created sample projects');

    // Create sample tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await Task.create({
      title: 'Homepage Design',
      description: 'Design the homepage mockups',
      project: project1._id,
      assignedTo: memberUser1._id,
      createdBy: adminUser._id,
      status: 'In Progress',
      dueDate: tomorrow,
    });

    await Task.create({
      title: 'Database Setup',
      description: 'Setup MongoDB database',
      project: project2._id,
      assignedTo: memberUser1._id,
      createdBy: adminUser._id,
      status: 'Completed',
      dueDate: nextWeek,
    });

    await Task.create({
      title: 'API Integration',
      description: 'Integrate payment API',
      project: project1._id,
      assignedTo: memberUser2._id,
      createdBy: adminUser._id,
      status: 'Pending',
      dueDate: yesterday,
    });

    await Task.create({
      title: 'User Authentication',
      description: 'Implement JWT authentication',
      project: project2._id,
      assignedTo: memberUser2._id,
      createdBy: adminUser._id,
      status: 'Pending',
      dueDate: nextWeek,
    });

    console.log('Created sample tasks');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@taskpilot.com');
    console.log('  Password: password123');
    console.log('\nMember 1:');
    console.log('  Email: john@taskpilot.com');
    console.log('  Password: password123');
    console.log('\nMember 2:');
    console.log('  Email: jane@taskpilot.com');
    console.log('  Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
