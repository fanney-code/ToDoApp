// routes/todoRoutes.js
const express = require('express');
const Todo = require('../models/todo');
const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Todo.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error retrieving tasks');
  }
});

// POST a new task
router.post('/', async (req, res) => {
  const newTask = new Todo({
    task: req.body.task
  });

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).send('Error adding task');
  }
});

// PUT to update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Todo.findByIdAndUpdate(req.params.id, {
      task: req.body.task
    }, { new: true });

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.json(task);
  } catch (err) {
    res.status(500).send('Error updating task');
  }
});

// Update task completion status
router.put('/:id/toggle', async (req, res) => {
  try {
    const task = await Todo.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = req.body.completed;
    await task.save();

    res.json(task); // Return the updated task
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Todo.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send('Task deleted');
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

module.exports = router;
