import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  parseKeyInCache,
  mergeTwoArraysById,
  getSessionStorageKey,
} from '../../filament/utils';

import parseClientFilamentQuery from '../../filament/parseClientFilamentQuery';

import { FILAMENT_ROUTE } from '../../filament/constants';

const useFilamentQuery = (query, defaultState = null) => {
  const [state, setState] = useState(defaultState);
  const keyInCache = parseKeyInCache(query);

  useEffect(() => {
    const key = getSessionStorageKey(query);
    const cacheAtKey = sessionStorage.getItem(key);

    // if data is in the cache, return it
    if (cacheAtKey) {
      console.log('inside cache');
      const newState = JSON.parse(cacheAtKey);
      setState(newState);
    } else {
      // otherwise, make a axios request
      console.log('not found in cache, go fetch from server');

      axios.post(FILAMENT_ROUTE, { query, keyInCache }).then((res) => {
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
      const [finalQuery, cacheData] = parseClientFilamentQuery(query);
      console.log('makeQuery(), cache found, finalQuery', finalQuery);
      console.log('makeQuery(), cache found, cacheData', cacheData);

      // note: parsing for dissimilarities later
      axios
        .post('http://localhost:8080/filament', {
          query: finalQuery,
          keyInCache,
        })
        .then((res) => {
          console.log('makeQuery(), data from server', res.data.data);
          const cacheAtKeyState = JSON.parse(cacheAtKey);
          // Merge with data from server
          const newState = mergeTwoArraysById(
            cacheAtKeyState,
            res.data.data[key]
          );
          console.log('makeQuery(), cache found, newState', newState);

          setState(newState);
          sessionStorage.setItem(key, JSON.stringify(newState));
        });
    } else {
      console.log('makeQuery(), cache not found');
      axios.post('http://localhost:8080/filament', { query }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  };

  return { state, makeQuery };
};

export default useFilamentQuery;
