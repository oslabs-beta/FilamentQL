import React from 'react';

import AddTodo from './AddTodo';
import TodoList from './TodoList';

import { useFilamentQuery } from '../../../filament';
import { parseKeyInCache } from '../../../filament/utils';

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
      difficulty
    }
  }
`;

sessionStorage.clear();

const Test = () => {
  const { state, makeQuery } = useFilamentQuery(query, []);
  const keyInCache = parseKeyInCache(query);
  const addTodo = () => {};

  const toggleTodo = (id) => {
    const newTodos = state[keyInCache].map((todo) =>
      todo.id === id
        ? {
            ...todo,
            isCompleted: !todo.isCompleted,
          }
        : todo
    );

    setTodos(newTodos);
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <button onClick={() => sessionStorage.clear()}>
        Clear sessionStorage
      </button>
      <button onClick={() => makeQuery(query2)}>Fetch dificulty</button>
      <AddTodo addTodo={addTodo} />
      <TodoList todos={state[keyInCache] || state} toggleTodo={toggleTodo} />
    </div>
  );
};

export default Test;
