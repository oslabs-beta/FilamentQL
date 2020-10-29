import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useFilamentQuery, mergeDataFromCacheAndServer } from '../hooks';
import { parseFilamentQuery } from '../hooks/utils';
import axios from 'axios';

import './Demo.scss';

const query = `
  {
    todos { 
      id
      text
      completed
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
  const { state, makeQuery } = useFilamentQuery(query, []);
  const [cache, setCache] = useState({ ...sessionStorage });
  const [dataFromDB, setDataFromDB] = useState(null);
  const [desiredQuery, setDesiredQuery] = useState('');
  const [actualQuery, setActualQuery] = useState('');
  const [fetchingTime, setFetchingTime] = useState(0);

  useEffect(() => {
    setCache({ ...sessionStorage });
  }, [state, dataFromDB, sessionStorage]);

  const handleClick = () => {
    const [actualQuery, dataInCache] = parseFilamentQuery(desiredQuery);
    const startTime = performance.now();
    axios.post('/graphql', { query: actualQuery }).then((res) => {
      const mergedData = mergeDataFromCacheAndServer(
        JSON.parse(sessionStorage.getItem('todos')),
        res.data.data.todos
      );
      sessionStorage.setItem('todos', JSON.stringify(mergedData));
      const endTime = performance.now();
      setActualQuery(actualQuery);
      setDataFromDB(res.data.data.todos);
      setFetchingTime(endTime - startTime);
    });
  };

  const displayCode = (cache) => {
    const result = typeof cache === 'string' ? JSON.parse(cache) : cache;
    return JSON.stringify(result, null, 2);
  };

  return (
    <div className="Demo">
      <Link to="/">Dev</Link>
      <div className="query-text-container">
        <label>
          <span>Make a Query</span>
          <textarea
            cols="30"
            rows="10"
            value={desiredQuery}
            onChange={({ target: { value } }) => setDesiredQuery(value)}
          />
        </label>

        <label>
          <span>Updated Query</span>
          <textarea
            cols="30"
            rows="10"
            value={actualQuery}
            onChange={({ target: { value } }) => setActualQuery(value)}
          />
        </label>
      </div>

      <div className="data">
        <span>Data in cache</span>
        <pre>{displayCode(cache.todos || null)}</pre>
      </div>
      <div>
        <p>Data fetched – Took {fetchingTime.toFixed(2)} ms</p>
        <pre>{displayCode(dataFromDB)}</pre>
      </div>
      <button onClick={handleClick}>Fetch</button>
      <button onClick={() => sessionStorage.clear()}>Clear Cache</button>
    </div>
  );
};

export default Demo;
