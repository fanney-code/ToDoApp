require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Failed to connect to MongoDB', err);
});

// ToDo Schema
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const ToDo = mongoose.model('ToDo', todoSchema);

// Routes

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await ToDo.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error retrieving tasks');
  }
});

// POST a new task
app.post('/tasks', async (req, res) => {
  const newTask = new ToDo({
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
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await ToDo.findByIdAndUpdate(req.params.id, {
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

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await ToDo.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send('Task deleted');
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
