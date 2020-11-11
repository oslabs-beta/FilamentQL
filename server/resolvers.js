<<<<<<< HEAD
const Todo = require('./todoModel');
=======
const axios = require("axios");
const Todo = require("./todoModel");
const Member = require("./memberModel");
>>>>>>> main

const resolvers = {
  Query: {
    async todos() {
      const todos = await Todo.find({});
      return todos;
    },
    async members() {
      const members = await Member.find({});
      return members;
    },
  },
  Mutation: {
    async addTodo(parent, { input }, context) {
      try {
        const newTodo = {
          id: Math.random().toString(),
          text: input.text,
          isCompleted: false,
          difficulty: 99,
        };

        const addedTodo = await Todo.create(newTodo);
        return addedTodo;
      } catch (err) {
<<<<<<< HEAD
        return err
=======
        console.log(err);
>>>>>>> main
      }
    },
    async updateTodo(_, { input }) {
      try {
        const { id, text } = input;
<<<<<<< HEAD
        const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true })
        return updatedTodo
      } catch (err) {
        return err
=======
        // console.log(input)
        const updatedTodo = await Todo.findByIdAndUpdate(
          id,
          { text },
          { new: true }
        );
        return updatedTodo;
        // return axios
        //   .post('http://localhost:4000/todos', updatedTodo)
        //   .then((res) => console.log(res.data))
      } catch (err) {
        console.log(err);
>>>>>>> main
      }
    },
    async deleteTodo(_, { input }) {
      try {
        const { id } = input;
<<<<<<< HEAD
        const deletedTodo = await Todo.findByIdAndDelete(id)
        return deletedTodo
      } catch (err) {
        return err
=======
        console.log("ID:", id);
        const deletedTodo = await Todo.findByIdAndDelete(id);
        return deletedTodo;
      } catch (err) {
        console.log(err);
>>>>>>> main
      }
    },
  },
};

module.exports = resolvers;
