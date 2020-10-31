


const axios = require('axios');
const resolvers = {
  Query: {
    async todos(_, __, context) {
      try {
        // we have an incoming query
        // we parse the query to find out what it is asking for:
        // Case 1: if the incoming query is exactly same as a previous query, then return just from cache.\
        // Case 2: if the incoming query is completely different...
        // Case 3 (hardest): incoming query is partially different than a previous query:
        // // we check the cache for the info
        // // any info that isnt there, we check the database
        // // if our cache is empty or is misisng info from the database
        // // we then need to update the cache with what was returned from the database
        // // ship off the data back to the client
        // console.log(query)

        // let newID = Math.random().toString();

        console.log(query)

        const todos = await context.models.findMany({})

        // get the data from the database

        // todos
        res.locals.todos = todos;
        next()





        return axios.get('http://localhost:3000/todos').then((res) => {
          client.set(newID, JSON.stringify(res.data), (err, result) => {
            if (err) console.log('errored inside of client.set ' + err)
            console.log('client.set ' + result)
            // client.get(newID, (err, cachedData) => {
            //   console.log(cachedData);
            // })
          })
          return res.data;
        });

      } catch (err) {
        console.log(err)
        return false
      }
    },
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
        .post('http://localhost:3000/todos', newTodo)
        .then((res) => res.data);

    },
  },
};
module.exports = resolvers;