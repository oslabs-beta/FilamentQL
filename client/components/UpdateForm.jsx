import React from 'react';

const UpdateForm = ({
  handleUpdateSubmit,
  updatedText,
  handleUpdateChange,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateSubmit();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">submit change</button>
        <input type="text" value={updatedText} onChange={handleUpdateChange} />
      </form>
    </div>
  );
};

export default UpdateForm;
