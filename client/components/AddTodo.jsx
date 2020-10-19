import React, { useState } from 'react';

const AddTodo = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleChange = ({ target: { value } }) => setValue(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodo(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="New todo..."
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodo;
