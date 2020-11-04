import React, { useState, useEffect } from 'react';

import { mergeDataFromCacheAndServer } from '../hooks';
import { parseFilamentQuery } from '../hooks/utils';
import axios from 'axios';

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
  const [desiredQuery, setDesiredQuery] = useState('');
  const [actualQuery, setActualQuery] = useState('');
  const [fetchingTime, setFetchingTime] = useState(0);

  useEffect(() => {
    setCache({ ...sessionStorage });
  }, [dataFromDB, sessionStorage]);

  const handleClick = () => {
    const [actualQuery, dataInCache] = parseFilamentQuery(desiredQuery);
    console.log('dataInCache', dataInCache);
    setActualQuery(actualQuery);

    const startTime = performance.now();
    // Condition: if data being queried for not in cache, go fetch
    axios.post('/filament', { query: actualQuery }).then((res) => {
      const cacheString = sessionStorage.getItem('todos');
      console.log('res.data.data', res.data.data)
      if (cacheString) {
        const mergedData = mergeDataFromCacheAndServer(
          JSON.parse(sessionStorage.getItem('todos')),
          res.data.data.todos
        );

        sessionStorage.setItem('todos', JSON.stringify(mergedData));
      } else {
        sessionStorage.setItem('todos', JSON.stringify(res.data.data.todos));
      }

      const endTime = performance.now();
      setDataFromDB(res.data.data.todos);
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
                <code>{displayCode(cache.todos || null)}</code>
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
