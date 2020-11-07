import React from 'react';

const OfflineList = ({ todos, handleDeleteClick, handleUpdateClick }) => (
  <div>
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => handleDeleteClick(todo.id)}>Delete</button>
          <button onClick={() => handleUpdateClick(todo.id, todo.text)}>
            Update
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default OfflineList;
