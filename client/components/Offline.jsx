import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useFilamentMutation } from '../../filament/hooks';

import {
  getTodosQuery,
  addTodoMutation,
  deleteTodoMutation,
  updateTodoMutation,
} from '../query';

import UpdateForm from './UpdateForm';
import OfflineList from './DisplayOfflineList';
import AddOfflineItem from './AddOfflineItem';

const Offline = () => {
  const [updatedText, setUpdated] = useState('');
  const [todoIdToUpdate, setTodoIdToUpdate] = useState(null);
  const [wantsUpdate, setWantsUpdate] = useState(false);
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([]);

  const [
    callAddTodoMutation,
    addTodoResponse,
  ] = useFilamentMutation(addTodoMutation, () =>
    setTodos([...todos, addTodoResponse.addTodo])
  );
  const [callDeleteTodoMutation] = useFilamentMutation(deleteTodoMutation);
  const [callUpdateTodoMutation] = useFilamentMutation(updateTodoMutation);

  // ComponentDidMount | fetch all todos from database
  useEffect(() => {
    axios
      .post('/graphql', { query: getTodosQuery })
      .then((response) => setTodos(response.data.data.todos));
  }, []);

  const handleAddChange = (e) => setValue(e.target.value);

  const handleAddClick = () => {
    if (!value) return;
    callAddTodoMutation(value);
    setValue('');
  };

  const handleDeleteClick = async (id) => {
    callDeleteTodoMutation(id);
    const filteredTodos = todos.filter((item) => item.id !== id);
    setTodos(filteredTodos);
  };

  const handleUpdateClick = (id, text) => {
    setWantsUpdate(true);
    setTodoIdToUpdate(id);
    setUpdated(text);
  };

  const handleUpdateChange = (e) => setUpdated(e.target.value);

  const handleUpdateSubmit = async () => {
    callUpdateTodoMutation(todoIdToUpdate, updatedText);

    const updatedTodos = todos.map((todo) =>
      todo.id === todoIdToUpdate ? { ...todo, text: updatedText } : todo
    );

    setTodos(updatedTodos);
    setWantsUpdate(false);
    setTodoIdToUpdate(null);
  };

  return (
    <div>
      <h1>Online mode</h1>
      <AddOfflineItem
        handleAddClick={handleAddClick}
        value={value}
        handleAddChange={handleAddChange}
      />

      {wantsUpdate && (
        <UpdateForm
          handleUpdateSubmit={handleUpdateSubmit}
          updatedText={updatedText}
          handleUpdateChange={handleUpdateChange}
        />
      )}

      <OfflineList
        todos={todos}
        handleDeleteClick={handleDeleteClick}
        handleUpdateClick={handleUpdateClick}
      />
    </div>
  );
};

export default Offline;
