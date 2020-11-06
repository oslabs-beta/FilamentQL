import React, { useState, useEffect } from 'react';
import UpdateForm from './UpdateForm'
import OfflineList from './DisplayOfflineList'
import AddOfflineItem from './AddOfflineItem'
import axios from 'axios'





const Offline = () => {
  const [updated, setUpdated] = useState('')
  const [requiresUpdate, setRequiresUpdate] = useState('')
  const [wantsUpdate, setWantsUpdate] = useState(false)
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([])



  useEffect(() => {
    // set all the todos that come from the database.
    const query = `
          {
            todos { 
              id
              text
              isCompleted
            }
          }
          `;

    axios.post('/graphql', { query })
      .then((res) => {
        setTodos(res.data.data.todos);
      })
  }, [])

  const handleAddChange = (e) => {
    const newValue = e.target.value
    setValue(newValue);
  }

  const handleAddClick = (e) => {
    e.preventDefault();

    const query = `
    mutation {
      addTodo(input: { text: "${value}" }){
        id
        text
      }
    }
      `
    axios.post('/graphql', { query })
      .then(res => {
        console.log(res.data.data.addTodo)
        setTodos(todos.concat(res.data.data.addTodo))
      })

    // setValue('');
  }

  const handleDeleteClick = (id) => {
    console.log(id)
    const query = `
      mutation {
        deleteTodo(input: {id:"${id}"}) {
          id
        }
      }
    `

    axios.post('/graphql', { query })
      .then(res => {
        console.log(res)
        const filteredTodos = todos.filter(item => {
          item.id !== id

        })
        setTodos(filteredTodos);
      })


  }
  const handleUpdateClick = (text) => {
    setRequiresUpdate(text);
    setUpdated(text)
    setWantsUpdate(true);
  }

  const handleUpdateChange = (e) => {
    setUpdated(e.target.value)
  }

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].text === requiresUpdate) {
        todos[i].text = updated;
        const { text, id } = todos[i]
        console.log(id)
        const query = `
                mutation {
                  updateTodo(input: { id: "${id}" , text: "${text}" }){
                    id
                    text
                  }
                }
                  `
        axios.post('/graphql', { query })
          .then(res => {
            console.log(res.data.data.updateTodo.text)
            setTodos(todos)
          })
        setWantsUpdate(false);
        break;
      }
    }

  }

  return (
    <div>
      <h1>
        Online mode
    </h1>
      <AddOfflineItem
        handleAddClick={handleAddClick}
        value={value}
        handleAddChange={handleAddChange}
      />
      {
        wantsUpdate &&
        <UpdateForm
          handleUpdateSubmit={handleUpdateSubmit}
          updated={updated}
          handleUpdateChange={handleUpdateChange}
        />
      }
      <OfflineList
        todos={todos}
        handleDeleteClick={handleDeleteClick}
        handleUpdateClick={handleUpdateClick}
      />
    </div>
  )
}

export default Offline; 