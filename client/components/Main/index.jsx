import React from 'react';

import AddTodo from './AddTodo';
import TodoList from './TodoList';

import { useFilamentQuery } from '../../../filament';
import { parseKeyInCache } from '../../../filament/utils';

const Main = () => {

  return (
    <div className='mainDisplay'>
      <h1 className='filamentTitle'>Filament</h1>
      <h3 className='subtitle'>A GraphQL Library for client, server and offline caching that includes custom hooks, and a query parsing algorithm.</h3>
      <p className='developedBy'>Developed by: Nelson Wu - Andrew Lovato - Duy Nguyen - Chan Choi</p>
    </div>
  );
};

export default Main;
