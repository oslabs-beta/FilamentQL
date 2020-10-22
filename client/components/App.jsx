import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
const query = `
{
  todos { 
    id
    text
    isCompleted
  }
}
`;
const App = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    axios.post('/api', { query }).then((res) => {
      localStorage.setItem('todos', JSON.stringify(res.data.data.todos));
      setTodos(res.data.data.todos);
    });
  }, []);
  const addTodo = (text) => {
    axios
      .post('/api', {
        query: `
          mutation {
            addTodo(input: "${text}") {
              id
              text
              isCompleted
            }
          }
        `,
      })
      .then((res) => {
        setTodos([...todos, res.data.data.addTodo]);
      });
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