const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const redis = require('redis');
require('dotenv').config();

// Mongo DB Setup
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Filament',
  })
  .then(async () => console.log('Connected to Mongo DB'))
  .catch((err) => console.log(err));

// Redis Setup
const client = redis.createClient();
client
  .on('error', (err) => console.log('Error ' + err))
  .on('connect', () => console.log('Redis client connected'));

// Filament Setup
const filamentMiddlewareWrapper = require('filamentql/server');
const filamentMiddleware = filamentMiddlewareWrapper(client);

// Express setup
const app = express();
const PORT = 4000;
const schema = require('./schema');

app.use(express.json());
app.use('/filament', filamentMiddleware);
app.use(
  '/graphql',
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: {
      req,
    },
  }))
);

app.listen(PORT, () => console.log(`GraphQL server is on port: ${PORT}`));
