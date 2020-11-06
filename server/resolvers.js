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
    async addTodo(_, { input }) {
      try {
        const { text } = input;
        const newTodo = {
          id: Math.random().toString(),
          text: text,
          isCompleted: false,
          difficulty: 5
        }

        const createdTodo = await Todo.create(newTodo)
        console.log(createdTodo)
        return createdTodo
      } catch (err) {
        console.log(err)
      }


    },
    async updateTodo(_, { input }) {
      try {
        const { id, text } = input;
        // console.log(input)
        const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true })
        return updatedTodo
        // return axios
        //   .post('http://localhost:4000/todos', updatedTodo)
        //   .then((res) => console.log(res.data))
      } catch (err) {
        console.log(err)
      }
    },
    async deleteTodo(_, { input }) {
      try {
        const { id } = input;
        console.log('ID:', id)
        const deletedTodo = await Todo.findByIdAndDelete(id)
        return deletedTodo
      } catch (err) {
        console.log(err)
      }
    }
  },
};

module.exports = resolvers;