const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema.js')

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

describe('initial server test', () => {
  it('should fail', () => {
    return request(app)
      .post('/graphql')
      .send({
        query: `
        {
          todos { 
            id
            text
            isCompleted
          }
        }
        `
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(300)
    // .end((err, res) => {
    //   if (err) throw err;
    // })
  })
})
