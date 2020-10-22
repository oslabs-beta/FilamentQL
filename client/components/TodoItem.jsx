import React from 'react';

const TodoItem = ({ id, text, isCompleted, number, toggleTodo }) => (
  <div className="TodoItem" style={{ display: 'flex' }}>
    <div style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
      {text} - {number}
    </div>
    <button onClick={() => toggleTodo(id)}>Toggle</button>
    <button>Delete</button>
  </div>
);

export default TodoItem;
