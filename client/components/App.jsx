import React from 'react';

import AddTodo from './AddTodo';
import TodoList from './TodoList';

import { useFilamentQuery } from '../hooks';

/**
 * What to store? What's the key?
 * How to store?
 * How to parse query to get final query?
 * How to combine new data with cache?
 */

// mutations for stretch later:

// const mutation = (text) => `
// mutation {
//   addTodo(input: "${text}") {
//     id
//     text
//     isCompleted
//   }

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
{
  todos {
    id
    number
  }
}
`;

const App = () => {
  // Andrew aglo returns an array which is the query, and

  // return [newQuery, cacheData]
  const { state, makeQuery } = useFilamentQuery(query, []);

  const addTodo = (text) => {};
  // useFilamentMutation(mutation(text), (result) => setTodos(result));

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

  return (
    <div className='App'>
      <h1>Todo App</h1>
      <button onClick={() => sessionStorage.clear()}>
        Clear sessionStorage
      </button>
      <button onClick={() => makeQuery(query2)}>Fetch numbers</button>
      <AddTodo addTodo={addTodo} />
      <TodoList todos={state.todos || state} toggleTodo={toggleTodo} />
    </div>
  );
};

export default App;
