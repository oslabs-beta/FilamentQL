import { useState, useEffect } from 'react';
import axios from 'axios';

// `
// {
//   todos {
//     id
//     text
//     isCompleted
//   }
// }
// `;
// `
// {
//   todos {
//     id
//     isAwesome
//   }
// }
// `;

// const dataFromCache = [
//   {
//     id: 'todo-1',
//     text: 'hey',
//     isCompleted: false,
//   },
//   {
//     id: 'todo-2',
//     text: 'ho',
//     isCompleted: true,
//   },
// ];

// const dataFromServer = [
//   {
//     id: 'todo-1',
//     isAwesome: false,
//   },
//   {
//     id: 'todo-2',
//     isAwesome: true,
//   },
// ];
// // Merge dataFromServer and dataFromCache
// const res = dataFromCache.map((dataCache) => {
//   const matchObj = dataFromServer.find(
//     (dataServer) => dataServer.id === dataCache.id
//   );
//   const newData = { ...dataCache, ...matchObj };
//   return newData;
// });

// // Store them back in cache
// sessionStorage.setItem('todos', JSON.stringify(res));

`
{
  todos {
    id
    text
    isCompleted
    number
  }
}
`;

`
{
  todos {
    id
    number
  }
}
`;

// construct new query
// should return key - "todos"
const getSessionStorageKey = (query) => {
  const res = query
    .split('\n')
    .filter((part) => part)
    .map((part) => part.trim());
  const key = res[1].replace(' {', '');
  return key;
};

const mergeDataFromCacheAndServer = (dataFromCache, dataFromServer) => {
  const mergedData = dataFromCache.map((dataCache) => {
    const matchedObj = dataFromServer.find(
      (dataServer) => dataServer.id === dataCache.id
    );
    const newData = { ...dataCache, ...matchedObj };
    return newData;
  });
  return mergedData;
};

export const useFilamentQuery = (query, defaultState = null) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const key = getSessionStorageKey(query); // todos
    const cacheAtKey = sessionStorage.getItem(key); // [{}, {}]

    // if data is in the cache, return it
    if (cacheAtKey) {
      console.log('inside cache');
      const newState = JSON.parse(cacheAtKey);
      setState(newState);
    } else {
      // otherwise, make a axios request
      console.log('not found in cache, go fetch from server');

      axios.post('/graphql', { query }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  }, []);

  const makeQuery = (query) => {
    const key = getSessionStorageKey(query);
    const cacheAtKey = sessionStorage.getItem(key);

    if (cacheAtKey) {
      // note: parsing for dissimilarities later
      axios.post('/graphql', { query }).then((res) => {
        const cacheAtKeyState = JSON.parse(cacheAtKey);
        // Merge with data from server
        const newState = mergeDataFromCacheAndServer(
          cacheAtKeyState,
          res.data.data[key]
        );

        setState(newState);
        sessionStorage.setItem(key, JSON.stringify(newState));
      });
    } else {
      axios.post('/graphql', { query }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  };

  return { state, makeQuery };
};
