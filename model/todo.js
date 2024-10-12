const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  title:{
    type: String,
    required: true
  },
  dueDate:{
    type: Date,
    required: true
  },
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
