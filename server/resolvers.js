const axios = require('axios');
const Todo = require('./todoModel');

const resolvers = {
  // Query: {
  //   async todos() {
  //     console.log('hi')
  //     const todos = await Todo.find({});
  //     console.log(todos)
  //     res.send(200).json(todos)
  //     return todos;
  //   },
  // },
  Query: {
    async todos() {

      const todos = await Todo.find({});

      console.log('data:', todos)
      return todos
      // res.status(200).json(todos)
    }

    // return axios.get('http://localhost:4000/todos').then((res) => {
    //   client.set(newID, JSON.stringify(res.data), (err, result) => {
    //     if (err) console.log('errored inside of client.set ' + err)
    //     console.log('client.set ' + result)
    //     // client.get(newID, (err, cachedData) => {
    //     //   console.log(cachedData);
    //     // })
    //   })
    //   return res.data;
    // });
  },
  Mutation: {
    async addTodo(parent, { input }, { client, req }) {

      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


      console.log('QUERY', req.body.query)
      let newTodo = {
        id: Math.random().toString(),
        text: input,
        isCompleted: false,
      }

      await client.set(ip, JSON.stringify(newTodo))
      client.get(newTodo.id, (err, cachedData) => {
        if (err) console.log(err)
        else console.log(cachedData)

      })
      return axios
        .post('http://localhost:4000/todos', newTodo)
        .then((res) => res.data);

    },
  },
};
module.exports = resolvers;