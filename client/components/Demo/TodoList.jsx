import React from 'react';

const OfflineList = ({ todos, handleDelete, handleUpdate }) => (
  <div>
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button className='deleteButton' onClick={() => handleDelete(todo.id)}>Delete</button>
          <button className='updateButton' onClick={() => handleUpdate(todo.id, todo.text)}>
            Update
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default OfflineList;
