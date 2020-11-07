import React from 'react';

const AddOfflineItem = ({ handleAddClick, value, handleAddChange }) => {
  return (
    <div>
      <button onClick={handleAddClick}>submit</button>
      <input type="text" value={value} onChange={handleAddChange} />
    </div>
  )
}

export default AddOfflineItem;