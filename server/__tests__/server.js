const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema');

const app = express();

const server = 'http://localhost:8080';

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true
//   })
// );

xdescribe('initial server test', () => {
  it('should fail', () => {
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
              `,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(9999);
    // .end((err, res) => {
    //   if (err) throw err;
    // })
  });

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
              `,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    // .end((err, res) => {
    //   if (err) throw err;
    // })
  });
});
