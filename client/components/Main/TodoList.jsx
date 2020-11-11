import React from "react";

import TodoItem from "./TodoItem";

const TodoList = ({ todos, toggleTodo }) => {
  return (
    <div className='TodoList'>
      {todos.map((item) => (
        <TodoItem
          key={item.id}
          id={item.id}
          text={item.text}
          isCompleted={item.isCompleted}
          number={item.number}
          toggleTodo={toggleTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
