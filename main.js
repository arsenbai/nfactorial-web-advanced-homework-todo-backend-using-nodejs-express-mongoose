const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/ToDoDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Define a user schema and model using Mongoose
const toDoSchema = new mongoose.Schema({
  toDoTitle: String,
  toDoIsDone: Boolean,
  toDoStatus: {
    type: String,
    enum: ['ToDo', 'Done', 'Deleted'],
    default: 'ToDo'
  },
});

const ToDo = mongoose.model('ToDo', toDoSchema);

// Create a new ToDo
app.post('/api/todos', async (req, res) => {
  const { toDoTitle, toDoIsDone, toDoStatus } = req.body;

  const todo = new ToDo({
    toDoTitle,
    toDoIsDone,
    toDoStatus,
  });

  await todo.save();

  res.send(todo);
});

// Get a list of all ToDos
app.get('/api/todos', async (req, res) => {
  const todos = await ToDo.find();

  res.send(todos);
});

// Get a single ToDo by ID
app.get('/api/todos/:id', async (req, res) => {
  const todo = await ToDo.findById(req.params.id);

  if (!todo) return res.status(404).send('ToDo is not found');

  res.send(todo);
});

// Update a ToDo by ID
app.put('/api/todos/:id', async (req, res) => {
  const todo = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!todo) return res.status(404).send('ToDo is not found');

  res.send(todo);
});

// Delete a ToDo by ID
app.delete('/api/todos/:id', async (req, res) => {
  const todo = await ToDo.findByIdAndRemove(req.params.id);

  if (!todo) return res.status(404).send('ToDo is not found');

  res.send(todo);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
