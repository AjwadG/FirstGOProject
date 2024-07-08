import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Todo from "./Todo";
import CreateArea from "./CreateArea";

function App() {
  const [todos, setTodos] = useState([]);

  function addtodo(newtodo) {
    setTodos((prevtodos) => {
      return [...prevtodos, newtodo];
    });
  }
  function markDone(id) {
    const newtodos = [
      ...todos.map((todoItem, index) => {
        if (index === id) {
          return {
            ...todoItem,
            done: !todoItem.done,
          };
        }
        return todoItem;
      }),
    ];
    setTodos(newtodos);
  }

  function deletetodo(id) {
    setTodos((prevtodos) => {
      return prevtodos.filter((todoItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addtodo} />
      {todos.map((todoItem, index) => {
        return (
          <Todo
            key={index}
            id={index}
            title={todoItem.title}
            content={todoItem.content}
            done={todoItem.done}
            onDelete={deletetodo}
            markDone={markDone}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
