import React from 'react';

const OfflineList = ({ todos, handleDelete, handleUpdate }) => (
  <div>
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
          <button onClick={() => handleUpdate(todo.id, todo.text)}>
            Update
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default OfflineList;
