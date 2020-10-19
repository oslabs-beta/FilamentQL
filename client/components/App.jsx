import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AddTodo from './AddTodo';
import TodoList from './TodoList';
import data from './data';

const App = () => {
  const [todos, setTodos] = useState(data);

  useEffect(() => {
    axios
      .post('/api', {
        query: `
        {
          todos {
            id
            text
            isCompleted
          }
        }
      `,
      })
      .then((res) => {
        setTodos(res.data.data.todos);
      });
  }, []);

  const addTodo = (todoText) => {
    const todo = {
      id: Math.random(),
      todoText,
      isCompleted: false,
    };

    setTodos([...todos, todo]);
  };

  const toggleTodo = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });

    setTodos(newTodos);
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <AddTodo addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} />
    </div>
  );
};

export default App;
