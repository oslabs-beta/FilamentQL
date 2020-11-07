export const getTodosQuery = `
  {
    todos { 
      id
      text
      isCompleted
    }
  }
`;

export const addTodoMutation = (value) => `
  mutation {
    addTodo(input: { text: "${value}" }){
      id
      text
    }
  }
`;

export const deleteTodoMutation = (id) => `
  mutation {
    deleteTodo(input: { id: "${id}" }) {
      id
    }
  }
`;

export const updateTodoMutation = (id, text) => `
  mutation {
    updateTodo(input: { id: "${id}" , text: "${text}" }){
      id
      text
    }
  }
`;
