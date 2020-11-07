import React from 'react';

const AddOfflineItem = ({ handleAddClick, value, handleAddChange }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddClick();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={!value}>
          submit
        </button>
        <input type="text" value={value} onChange={handleAddChange} />
      </form>
    </div>
  );
};

export default AddOfflineItem;
