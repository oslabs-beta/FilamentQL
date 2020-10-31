import { useState, useEffect } from 'react';
import axios from 'axios';

import { parseFilamentQuery } from './utils';

const getSessionStorageKey = (query) => {
  const res = query
    .split('\n')
    .filter((part) => part)
    .map((part) => part.trim());
  const key = res[1].replace(' {', '');

  return key;
};

export const mergeDataFromCacheAndServer = (dataFromCache, dataFromServer) => {
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
    const cacheAtKey = sessionStorage.getItem(key); // null || [{}, {},...]

    // if data is in the cache, return it
    if (cacheAtKey) {
      console.log('inside cache');
      const newState = JSON.parse(cacheAtKey);
      setState(newState);
    } else {
      // otherwise, make a axios request
      console.log('not found in cache, go fetch from server');

      axios.post('/filament', { query }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  }, []);

  const makeQuery = (query) => {
    const key = getSessionStorageKey(query);
    const cacheAtKey = sessionStorage.getItem(key);
    console.log('cacheAtKey', cacheAtKey);

    if (cacheAtKey) {
      const [finalQuery, cacheData] = parseFilamentQuery(query);
      console.log('makeQuery(), cache found, finalQuery', finalQuery);
      console.log('makeQuery(), cache found, cacheData', cacheData);

      // note: parsing for dissimilarities later
      axios.post('/filament', { query: finalQuery }).then((res) => {
        console.log('makeQuery(), data from server', res.data.data);
        const cacheAtKeyState = JSON.parse(cacheAtKey);
        // Merge with data from server
        const newState = mergeDataFromCacheAndServer(
          cacheAtKeyState,
          res.data.data[key]
        );
        console.log('makeQuery(), cache found, newState', newState);

        setState(newState);
        sessionStorage.setItem(key, JSON.stringify(newState));
      });
    } else {
      console.log('makeQuery(), cache not found');
      axios.post('/filament', { query }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  };

  return { state, makeQuery };
};
