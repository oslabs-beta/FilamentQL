const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { join } = require('path');

const schema = loadSchemaSync(join(__dirname, 'schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const resolvers = require('./resolvers');

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

module.exports = schemaWithResolvers;
