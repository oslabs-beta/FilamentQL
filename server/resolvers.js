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
    addTodo(_, { input }) {
      const newTodo = {
        id: Math.random().toString(),
        text: input,
        isCompleted: false,
      }

      return axios
        .post('http://localhost:4000/todos', newTodo)
        .then((res) => res.data);
    },
    async updateTodo(_, { input }) {
      try {
        const { id, text } = input;

        const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true })
        res.status(200).json(updatedTodo)
        // return axios
        //   .post('http://localhost:4000/todos', updatedTodo)
        //   .then((res) => console.log(res.data))
      } catch (err) {
        console.log(err)
        res.status(401).send(err);
      }
    }
  },
};

module.exports = resolvers;