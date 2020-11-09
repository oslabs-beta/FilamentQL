import React from 'react';

const UpdateForm = ({ handleUpdateTodo, updatedText, handleUpdateChange }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateTodo();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">submit change</button>
        <input
          type="text"
          value={updatedText}
          onChange={handleUpdateChange}
          autoFocus
        />
      </form>
    </div>
  );
};

export default UpdateForm;
