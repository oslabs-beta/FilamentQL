import React from 'react';

import { useInput } from '../../hooks';

const AddTodo = ({ handleAddTodo }) => {
  const [value, setValue, handleChange] = useInput();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddTodo(value);
    setValue('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button className='submitButton' type="submit" disabled={!value}>
          submit
        </button>
        <input type="text" value={value} onChange={handleChange} />
      </form>
    </div>
  );
};

export default AddTodo;
