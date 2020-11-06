import React from 'react';

const UpdateForm = ({ handleUpdateSubmit, updated, handleUpdateChange }) => {
  return (
    <div>
      <button onClick={handleUpdateSubmit}>submit change</button>
      <input type="text" value={updated} onChange={handleUpdateChange} />
    </div>
  )
}

export default UpdateForm;