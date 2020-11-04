const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const redis = require("redis");
const client = redis.createClient();
const schema = require('./schema');
const PORT = 4000;
require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Filament',
  })
  .then(() => console.log('Connected to Mongo DB'))
  .catch((err) => console.log(err));


const app = express()

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


