import React from 'react'

const Info = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <div className='infoParentDiv'>
        <div className="Info_Headers">
          <h3>FilamentQL is a lightweight caching library for GraphQL queries that utilizes a parsing algorithm to detect differences between incoming queries and existing data stored within the cache. The library offers tools for both client and server side caching as well as tools for offline mode. </h3>
          <p>FilamentQL's parsing algorithm only selects the fields within the query that are not in the cache. It then constructs a new query to be sent to the GraphQL server as well as packages up the data from the cache. Once the data arrives from the database, FilamentQL combines the data into the same shape that was initially queried.</p>
          <p>Offline mode is a feature of the FilamentQL library. It offers tools to store queries and mutations in a queue which will then detect internet using navigator.onLine. Once detected the queue will then send its contents, one by one, off to the server.</p>
          <h4>Below is a diagram of our client side caching system.</h4>
          <img src="../../../assets/client-diagram.png" alt="" />
          <h4>Below is a diagram of our server side caching system which uses a unique key to give requests access to the correct data within the cache.</h4>
          <img src="../../../assets/server-diagram.png" alt="" />
        </div>
      </div>

    </div>
  )
}


export default Info

