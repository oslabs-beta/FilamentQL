const Todo = require('./todoModel');

const resolvers = {
  Query: {
    async todos() {
      const todos = await Todo.find({});
      return todos;
    },
  },
  Mutation: {
    async addTodo(parent, { input }, context) {
      try {
        const newTodo = {
          id: Math.random().toString(),
          text: input.text,
          isCompleted: false,
          difficulty: 99
        };

        const addedTodo = await Todo.create(newTodo)
        return addedTodo
      } catch (err) {
        return err
      }
    },
    async updateTodo(_, { input }) {
      try {
        const { id, text } = input;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true })
        return updatedTodo
      } catch (err) {
        return err
      }
    },
    async deleteTodo(_, { input }) {
      try {
        const { id } = input;
        const deletedTodo = await Todo.findByIdAndDelete(id)
        return deletedTodo
      } catch (err) {
        return err
      }
    }
  },
};

module.exports = resolvers;
