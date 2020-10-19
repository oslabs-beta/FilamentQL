const axios = require('axios');

const resolvers = {
  Query: {
    todos() {
      return axios.get('http://localhost:3000/todos').then((res) => res.data);
    },
  },
};

module.exports = resolvers;
