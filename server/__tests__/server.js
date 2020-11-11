const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema')

const app = express();

const server = "http://localhost:8080";

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

describe('initial server test', () => {
  it('should not get status 200', () => {
    return request(server)
      .post('/graphql')
      .send({
        query: `
              {
                todos { 
              
                }
              }
              `
      })
      .set('Accept', 'application/incorrect')
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('should pass the test', () => {
    return request(server)
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
      .expect(200)
  })
})
