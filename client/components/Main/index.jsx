import React from "react";

import { useFilamentQuery } from '../../../filament';

sessionStorage.clear();

const query = `
  {
    todos { 
      id
      text
      isCompleted
    }
  }
`;

const Main = () => {
  const { state, makeQuery } = useFilamentQuery(query, []);
  return (
    <div className='mainDisplay'>
      <h1 className='filamentTitle'>FilamentQL</h1>
      <h3 className='subtitle'>
        A GraphQL Library for client, server and offline caching that includes
        custom hooks, and a query parsing algorithm.
      </h3>
      <p className='developedBy'>
        Developed by: Andrew Lovato - Chan Choi - Duy Nguyen - Nelson Wu
      </p>
    </div>
  );
};

export default Main;
