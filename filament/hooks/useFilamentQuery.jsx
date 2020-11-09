import { useState, useEffect } from 'react';
import axios from 'axios';

import { FILAMENT_ROUTE } from '../constants';
import parseClientFilamentQuery from '../parseClientFilamentQuery';
import {
  parseKeyInCache,
  mergeTwoArraysById,
  getSessionStorageKey,
} from '../utils';

const useFilamentQuery = (query, defaultState = null) => {
  const [state, setState] = useState(defaultState);
  const keyInCache = parseKeyInCache(query);

  useEffect(() => {
    const key = getSessionStorageKey(query);
    const cacheAtKey = sessionStorage.getItem(key);

    // if data is in the cache, return it
    if (cacheAtKey) {
      const newState = JSON.parse(cacheAtKey);
      setState(newState);
    } else {
      // otherwise, make a axios request

      axios.post(FILAMENT_ROUTE, { query, keyInCache }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  }, []);

  const makeQuery = (query) => {
    const key = getSessionStorageKey(query);
    const cacheAtKey = sessionStorage.getItem(key);

    if (cacheAtKey) {
      const [finalQuery, cacheData] = parseClientFilamentQuery(query);

      // note: parsing for dissimilarities later
      axios
        .post(FILAMENT_ROUTE, {
          query: finalQuery,
          keyInCache,
        })
        .then((res) => {
          const cacheAtKeyState = JSON.parse(cacheAtKey);
          // Merge with data from server
          const newState = mergeTwoArraysById(
            cacheAtKeyState,
            res.data.data[key]
          );

          setState(newState);
          sessionStorage.setItem(key, JSON.stringify(newState));
        });
    } else {
      axios.post(FILAMENT_ROUTE, { query }).then((res) => {
        setState(res.data.data);
        sessionStorage.setItem(key, JSON.stringify(res.data.data[key]));
      });
    }
  };

  return { state, makeQuery };
};

export default useFilamentQuery;
