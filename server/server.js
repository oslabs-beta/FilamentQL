const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const fetch = require("node-fetch");
const redis = require("redis");
const Todos = require('./todoModel');

const PORT = process.env.PORT || 4000;
// const REDIS_PORT = process.env.REDIS_PORT || 6379;
//Create Redis client on Redis port (optional)
const client = redis.createClient();
const schema = require('./schema');
const bluebird = require('bluebird')
const app = express()

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
app.use(express.json())

client.on("error", err => {
  console.log("Error " + err);
});

client.on('connect', () => {
  console.log('Redis client connected');
});
// pass redis as context so our schema can use Redis methods

const wrapper = require('./filamentMiddleware')

app.use('/filament',
  wrapper(client), // filamentMiddleware with access to client
)

app.use(
  '/graphql',
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: {
      client,
      req: req,
    }
  })),
  // addToCacheWrapper(res.data)
);

app.listen(PORT, () =>
  console.log(`GraphQL server is running on port: ${PORT}`)
);


