const axios = require('axios');
const Todo = require('./todoModel');

const resolvers = {
  Query: {
    async todos() {
      const todos = await Todo.find({});
      return todos
    }
  },
  Mutation: {
    async addTodo(parent, { input }, context) {
      const newTodo = {
        id: Math.random().toString(),
        text: input,
        isCompleted: false,
      }

      return axios
        .post('http://localhost:4000/todos', newTodo)
        .then((res) => res.data);
    },
  },
};

module.exports = resolvers;