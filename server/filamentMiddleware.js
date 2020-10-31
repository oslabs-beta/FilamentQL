
var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
client.get(ip, (err, cacheData) => {
  cacheData = {
    todos: [
      { todo }
    ]
  }

  req.body.query
  // instead of sessionStorage we access client.get
  const data = []parseServerFilimentQuery(query)
})
