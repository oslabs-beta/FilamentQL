const axios = require('axios')
const serverFilamentQuery = require('./serverFilamentQuery')
const mergeDataFromCacheAndServer = require('./mergeDataFromCacheAndServer')
const querystring = require('querystring');
const fetch = require('node-fetch')
const transformQuery = require('./transformQuery')

const wrapper = (client) => (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { query } = req.body

  client.get(ip, (err, cacheData) => {
    // ip not found in cache
    console.log('cache data: ', cacheData)
    if (!cacheData) {

      return axios.post('http://localhost:4000/graphql', { query }).then(response => {
        client.set(ip, JSON.stringify({
          todos: response.data.data['todos']
        }), (err, result) => {
          // console.log(result)
          console.log('data in cache', result)
        })

        const { data } = res.data
        // return combinedData to client
        return res.status(200).json({ data })
      })
        .catch(err => {
          console.log('error', err)
        })
    }


    // ip found in cache
    // console.log('ip found in cache')

    const cacheDataParsed = JSON.parse(cacheData)
    const transformedQuery = transformQuery(query)
    const [parsedQuery, data, isMatched] = serverFilamentQuery(transformedQuery, cacheDataParsed)
    console.log('newQUERY', parsedQuery)
    if (isMatched) {
      console.log('we are in isMatched conditional')
      console.log(data)
      return res.status(200).json({ data })
    } else {
      console.log('we have received a parsed query')
      return axios.post('http://localhost:4000/graphql', { query: parsedQuery }).then(response => {
        const todos = mergeDataFromCacheAndServer(data.todos, response.data.data.todos);
        // set the new data in Redis
        client.set(ip, JSON.stringify({
          todos: todos
        }), (err, result) => {
          console.log(result)
        })
        const newTodos = {
          todos
        }
        // return combinedData to client
        console.log('merged', todos)
        return res.status(200).json({ data: newTodos })
      })
        .catch(err => {
          console.log('has there been an error????,', err)
        })
    }
  })

  // instead of sessionStorage we access client.get, access 'cacheData' as an object
  // add a boolean to check whether we have a perfect match or not


}


module.exports = wrapper