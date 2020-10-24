import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Demo from './Demo';

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
query {
  todos {
    id
    text
    number
  }
}
`;

sessionStorage.clear();

const App = () => {
  // Andrew aglo returns an array which is the query, and

  // return [newQuery, cacheData]
  const { state, makeQuery } = useFilamentQuery(query, []);

  const addTodo = () => {};

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
      <Switch>
        <Route exact path='/'>
          <Link to='/demo'>Demo</Link>
          <h1>Todo App</h1>
          <button onClick={() => sessionStorage.clear()}>
            Clear sessionStorage
          </button>
          <button onClick={() => makeQuery(query2)}>Fetch numbers</button>
          <AddTodo addTodo={addTodo} />
          <TodoList todos={state.todos || state} toggleTodo={toggleTodo} />
        </Route>

        <Route path='/demo'>
          <Demo />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
