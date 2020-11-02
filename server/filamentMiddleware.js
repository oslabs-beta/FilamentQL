const axios = require('axios')
const serverFilamentQuery = require('./serverFilamentQuery')
const mergeDataFromCacheAndServer = require('./mergeDataFromCacheAndServer')
const querystring = require('querystring');
const fetch = require('node-fetch')

const wrapper = (client) => (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { query } = req.body

  client.get(ip, (err, cacheData) => {
    // ip not found in cache
    if (!cacheData) {

      // fetch('http://localhost:4000/graphql')
      //   .then(res => {
      //     console.log('hi')
      //   })
      //   .catch(err => console.log(err))

      console.log('cacheData:', cacheData)
      console.log(req.url)


      return axios.post('http://localhost:4000/graphql', { query }).then(res => {
        console.log('res.data', res.data)
        // console.log('have we made the post ????')
        // set redis cache
        // set the new data in Redis
        client.set(ip, JSON.stringify({
          todos: res.data.data['todos']
        }), (err, result) => {
          // console.log(result)
        })

        const { data } = res.data
        // return combinedData to client
        return res.status(200).json({ data })
      })
        .catch(err => {
          console.log('error', err)
        })
      console.log('did this fire?')
    }


    // ip found in cache
    // console.log('ip found in cache')
    const [newQuery, data, isMatched] = serverFilamentQuery(query, cacheData)

    if (isMatched) {
      return res.status(200).json({ data })
    } else {
      axios.post('/graphql', { newquery }).then(res => {
        const merged = mergeDataFromCacheAndServer(data['todos'], res.data.data['todos']);
        // set the new data in Redis
        console.log(merged)
        client.set(ip, JSON.stringify({
          todos: merged
        }), (err, result) => {
          console.log(result)
        })
        // return combinedData to client
        return res.status(200).json({ merged })
      })
    }


  })

  // instead of sessionStorage we access client.get, access 'cacheData' as an object
  // add a boolean to check whether we have a perfect match or not


}


module.exports = wrapper