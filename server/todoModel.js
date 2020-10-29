const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('todo', todoSchema);
