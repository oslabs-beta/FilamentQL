import React from 'react';

const OfflineList = ({ todos, handleDeleteClick, handleUpdateClick }) => {
  return (
    <div>
      <ul>
        {todos.map((elem, i) => {
          return (
            <li key={elem.id}>
              {elem.text}
              <button onClick={() => handleDeleteClick(elem.id)}>delete</button>
              <button onClick={() => handleUpdateClick(elem.text)}>update</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default OfflineList;