const axios = require('axios')

const BASE_URL = 'http://localhost:4000/graphql'

const { mergeTwoArraysById, transformQuery } = require('./utils')
const serverFilamentQuery = require('./serverFilamentQuery')

const wrapper = (client) => async (req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { query, keyInCache } = req.body
  console.log('KEY IN CACHE', keyInCache)
  client.get(clientIP, async (err, redisCacheAtIP) => {
    // clientIP not found in cache
    console.log('redisCacheAtIP: ', redisCacheAtIP)
    if (!redisCacheAtIP) {
      try {
        const resFromGraphQL = await axios.post(BASE_URL, { query })

        client.set(clientIP, JSON.stringify({
          [keyInCache]: resFromGraphQL.data.data[keyInCache]
        }), (err, redisCacheAtIPAfterWrite) => {
          console.log('redisCacheAtIP after write', redisCacheAtIPAfterWrite)
        })

        const { data } = resFromGraphQL.data

        return res.status(200).json({ data })
      } catch (err) {
        console.log('error', err)
      }
      return
    }

    // clientIP found in cache
    const redisCacheParsed = JSON.parse(redisCacheAtIP)
    const transformedQuery = transformQuery(query)
    const [parsedQuery, dataInRedisCache, isMatched] = serverFilamentQuery(transformedQuery, redisCacheParsed)

    if (isMatched) return res.status(200).json({ data: dataInRedisCache })

    // isMatched === false
    try {
      const response = await axios.post(BASE_URL, { query: parsedQuery })
      console.log('response', response)
      const resTodos = mergeTwoArraysById(dataInRedisCache[keyInCache], response.data.data[keyInCache]);
      // set the new data in Redis
      const cacheTodos = mergeTwoArraysById(JSON.parse(redisCacheAtIP)[keyInCache], response.data.data[keyInCache])

      client.set(clientIP, JSON.stringify({
        [keyInCache]: cacheTodos
      }))

      const dataSendToClient = {
        [keyInCache]: resTodos
      }

      return res.status(200).json({ data: dataSendToClient })
    } catch (err) {
      console.log('has there been an error????,', err)
    }
  })
}

module.exports = wrapper

// const axios = require('axios')
// const serverFilamentQuery = require('./serverFilamentQuery')
// const mergeTwoArraysById = require('./mergeTwoArraysById')
// const querystring = require('querystring');
// const fetch = require('node-fetch')
// const transformQuery = require('./transformQuery')

// const wrapper = (client) => (req, res, next) => {
//   const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   const { query } = req.body

//   client.get(clientIP, (err, redisCacheAtIP) => {
//     // clientIP not found in cache
//     console.log('cache data: ', redisCacheAtIP)
//     if (!redisCacheAtIP) {

//       return axios.post('http://localhost:4000/graphql', { query }).then(response => {
//         client.set(clientIP, JSON.stringify({
//           todos: response.data.data['todos']
//         }), (err, result) => {
//           // console.log(result)
//           console.log('data in cache', result)
//         })

//         const { data } = res.data
//         // return combinedData to client
//         return res.status(200).json({ data })
//       })
//         .catch(err => {
//           console.log('error', err)
//         })
//     }


//     // clientIP found in cache
//     // console.log('clientIP found in cache')
//     const redisCacheParsed = JSON.parse(redisCacheAtIP)
//     const transformedQuery = transformQuery(query)
//     const [parsedQuery, data, isMatched] = serverFilamentQuery(transformedQuery, redisCacheParsed)
//     if (isMatched) {
//       return res.status(200).json({ data })
//     } else {

//       return axios.post('http://localhost:4000/graphql', { query: parsedQuery }).then(response => {
//         const resTodos = mergeTwoArraysById(data.todos, response.data.data.todos);
//         // set the new data in Redis
//         const cacheTodos = mergeTwoArraysById(JSON.parse(redisCacheAtIP).todos, response.data.data.todos)
//         client.set(clientIP, JSON.stringify({
//           todos: cacheTodos
//         }), (err, result) => {
//         })

//         const newTodos = {
//           todos: resTodos
//         }

//         // return combinedData to client
//         return res.status(200).json({ data: newTodos })
//       })
//         .catch(err => {
//           console.log('has there been an error????,', err)
//         })
//     }
//   })

//   // instead of sessionStorage we access client.get, access 'redisCacheAtIP' as an object
//   // add a boolean to check whether we have a perfect match or not
// }


// module.exports = wrapper