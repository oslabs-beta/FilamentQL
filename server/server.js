const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();
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

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () =>
  console.log(`GraphQL server is running on port: ${PORT}`)
);
