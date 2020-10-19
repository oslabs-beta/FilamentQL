const { makeExecutableSchema } = require('graphql-tools');
const { importSchema } = require('graphql-import');

const typeDefs = importSchema('schema.graphql');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;

// const {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLSchema,
//   GraphQLList,
//   GraphQLNonNull,
// } = require('graphql');

// const axios = require('axios');
// // const { gql } = require()

// const CodeSmithType = new GraphQLObjectType({
//   name: 'Resident',
//   fields: () => ({
//     id: { type: GraphQLString },
//     name: { type: GraphQLString },
//     email: { type: GraphQLString },
//     age: { type: GraphQLInt },
//     //isCompleted: true/false
//     //todoText: string
//   }),
// });

// // Root Query
// const RootQuery = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     // careful resident(s) plural vs singular when making queries
//     resident: {
//       type: CodeSmithType,
//       args: {
//         id: { type: GraphQLString },
//       },
//       resolve(parentValue, args) {
//         return (
//           axios
//             .get(`http://localhost:3000/residents/${args.id}`)
//             // Axios: careful our data will be returned as a "data" object--map it to response
//             .then((res) => res.data)
//         );
//       },
//     },
//     residents: {
//       type: new GraphQLList(CodeSmithType),
//       resolve() {
//         return axios
//           .get(`http://localhost:3000/residents`)
//           .then((res) => res.data);
//       },
//     },
//   },
// });

// // Mutations

// const mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     addResident: {
//       type: CodeSmithType,
//       args: {
//         name: { type: new GraphQLNonNull(GraphQLString) },
//         email: { type: new GraphQLNonNull(GraphQLString) },
//         age: { type: new GraphQLNonNull(GraphQLInt) },
//       },
//       resolve(parentValue, args) {
//         return axios
//           .post('http://localhost:3000/residents', {
//             name: args.name,
//             email: args.email,
//             age: args.age,
//           })
//           .then((res) => res.data);
//       },
//     },
//     deleteResident: {
//       type: CodeSmithType,
//       args: {
//         id: { type: new GraphQLNonNull(GraphQLString) },
//       },
//       resolve(parentValue, args) {
//         return axios
//           .delete(`http://localhost:3000/residents/${args.id}`)
//           .then((res) => res.data);
//       },
//     },
//     updateResident: {
//       type: CodeSmithType,
//       args: {
//         id: { type: new GraphQLNonNull(GraphQLString) },
//         name: { type: GraphQLString },
//         email: { type: GraphQLString },
//         age: { type: GraphQLInt },
//       },
//       resolve(parentValue, args) {
//         return axios
//           .patch(`http://localhost:3000/residents/${args.id}`, args)
//           .then((res) => res.data);
//       },
//     },
//   },
// });

// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   mutation,
// });
