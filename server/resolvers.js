const Todo = require('./todoModel');

const resolvers = {
  Query: {
    async todos() {
      const todos = await Todo.find({});
      return todos;
    },
  },
};

module.exports = resolvers;
