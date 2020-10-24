import React, { useState, useEffect } from 'react';

import AddTodo from './AddTodo';
import TodoList from './TodoList';

import { useFilamentQuery, mergeDataFromCacheAndServer } from '../hooks';
import { parseFilamentQuery } from '../hooks/utils';
import axios from 'axios';

const query = `
{
  todos { 
    id
    text
    isCompleted
  }
}
`;

const query2 = `
query {
  todos {
    id
    text
    number
  }
}
`;

const query3 = `
query {
  todos {
    id
    number
  }
}
`;

const cache = {
  todos: [
    {
      id: '1',
      text: 'Build GraphQL server',
      isCompleted: false,
      number: 1,
    },
    {
      id: '2',
      text: 'Build Frontend App',
      isCompleted: true,
      number: 12,
    },
    {
      id: '3',
      text: 'Develop caching system',
      isCompleted: false,
      number: 15,
    },
  ],
};

sessionStorage.clear();

const App = () => {
  const { state, makeQuery } = useFilamentQuery(query, []);
  const [isOpen, setIsOpen] = useState(false);
  const [dataFromDB, setDataFromDB] = useState('');

  const toggleTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            isCompleted: !todo.isCompleted,
          }
        : todo
    );

    setTodos(newTodos);
  };

  const handleClick = () => {
    const [finalQuery, dataInCache] = parseFilamentQuery(query2);
    setIsOpen(!isOpen);
    axios.post('/graphql', { query: finalQuery }).then((res) => {
      setDataFromDB(res.data.data.todos);
    });
  };

  const displayCode = (cacheString) => {
    return JSON.stringify(JSON.parse(cacheString), null, 2);
  };

  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <label>
          Make a Query
          <textarea cols="30" rows="10" value={query2}></textarea>
        </label>
        <br />

        <label>
          Updated Query
          <textarea cols="30" rows="10" value={isOpen ? query3 : ''}></textarea>
        </label>
      </div>

      <div>
        <span>Data in cache</span>
        <pre>{displayCode(sessionStorage.getItem('todos'))}</pre>
      </div>
      <div>
        <p>Data fetched:</p>
        <pre>{displayCode(JSON.stringify(dataFromDB))}</pre>
      </div>
      <button onClick={handleClick}>Fetch</button>

      {/* <h1>Todo App</h1>
      <button onClick={() => sessionStorage.clear()}>
        Clear sessionStorage
      </button>
      <button onClick={() => makeQuery(query2)}>Fetch numbers</button>
      <AddTodo addTodo={addTodo} />
      <TodoList todos={state.todos || state} toggleTodo={toggleTodo} /> */}
    </div>
  );
};

export default App;
