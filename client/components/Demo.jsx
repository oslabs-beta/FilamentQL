import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { mergeTwoArraysById, parseKeyInCache } from '../../filament/utils';
import parseClientFilamentQuery from '../../filament/parseClientFilamentQuery';

import './Demo.scss';

const query = `
  query {
    todos { 
      id
      text
      isCompleted
    }
  }
`;

const queryWantToMake = `
  query {
    todos {
      id
      text
      difficulty
    }
  }
`;

sessionStorage.clear();

const Demo = () => {
  const [cache, setCache] = useState({ ...sessionStorage });
  const [dataFromDB, setDataFromDB] = useState(null);
  const [desiredQuery, setDesiredQuery] = useState(query);
  const [actualQuery, setActualQuery] = useState('');
  const [fetchingTime, setFetchingTime] = useState(0);
  const keyInCache = parseKeyInCache(query);

  useEffect(() => {
    setCache({ ...sessionStorage });
  }, [dataFromDB, sessionStorage]);

  const handleClick = () => {
    const [actualQuery, dataInCache] = parseClientFilamentQuery(desiredQuery);
    console.log('dataInCache', dataInCache);
    console.log('KEY IN CACHE:', keyInCache);
    setActualQuery(actualQuery);

    const startTime = performance.now();
    // Condition: if data being queried for not in cache, go fetch
    axios.post('/filament', { query: actualQuery, keyInCache }).then((res) => {
      const cacheString = sessionStorage.getItem(keyInCache);
      console.log('res.data.data', res.data.data);
      if (cacheString) {
        const mergedData = mergeTwoArraysById(
          JSON.parse(sessionStorage.getItem(keyInCache)),
          res.data.data[keyInCache]
        );

        sessionStorage.setItem(keyInCache, JSON.stringify(mergedData));
      } else {
        sessionStorage.setItem(
          keyInCache,
          JSON.stringify(res.data.data[keyInCache])
        );
      }

      const endTime = performance.now();
      setDataFromDB(res.data.data[keyInCache]);
      setFetchingTime((endTime - startTime).toFixed(2));
    });
    // Else, if data is in cache, set endtime
    //const endTime = performance.now();
    //setFetchingTime((endTime - startTime).toFixed(2));
  };

  const displayCode = (cache) => {
    const result = typeof cache === 'string' ? JSON.parse(cache) : cache;
    return JSON.stringify(result, null, 2);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <div className="Demo">
        <h1 style={{ textAlign: 'center' }}>Filament MVP Demo</h1>
        <div className="query-text-container">
          <label>
            <h4>Desired Query</h4>
            <textarea
              cols="30"
              rows="10"
              value={desiredQuery}
              onChange={({ target: { value } }) => setDesiredQuery(value)}
            />
          </label>

          <label>
            <h4>Actual Query To Be Fetched</h4>
            <textarea
              cols="30"
              rows="10"
              value={actualQuery}
              onChange={({ target: { value } }) => setActualQuery(value)}
            />
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <button onClick={handleClick} disabled={!desiredQuery}>
            Fetch
          </button>
        </div>

        <div style={{ display: 'flex' }}>
          <div className="cache-div">
            <h4>Data in cache</h4>
            <div className="cache-view">
              <pre>
                <code>{displayCode(cache[keyInCache] || null)}</code>
              </pre>
            </div>
          </div>
          <div className="fetched-div">
            <h4>Data fetched – Took {fetchingTime} ms</h4>
            <div className="DB-view">
              <pre>
                <code>{displayCode(dataFromDB)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
