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
  priority:{
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
    required: true
  },
  attachments: {type: String}
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
