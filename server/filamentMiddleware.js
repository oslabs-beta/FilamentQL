const axios = require('axios')
const serverFilamentQuery = require('./serverFilamentQuery')
const mergeDataFromCacheAndServer = require('./mergeDataFromCacheAndServer')

const wrapper = (client) => (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  client.get(ip, (err, cacheData) => {
    const { query } = req.body
    // ip not found in cache
    if (!cacheData) {
      console.log('cacheData:', cacheData)
      axios.post('/graphql', { query }).then(res => {
        console.log('have we made the post ????')
        // set redis cache
        // set the new data in Redis
        client.set(ip, JSON.stringify({
          todos: res.data.data['todos']
        }), (err, result) => {
          console.log(result)
        })

        const { data } = res.data
        // return combinedData to client
        return res.status(200).json({ data })
      })
    }

    // instead of sessionStorage we access client.get, access 'cacheData' as an object
    // add a boolean to check whether we have a perfect match or not

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
}


module.exports = wrapper