import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Todo from "./Todo";
import CreateArea from "./CreateArea";
import { useQuery } from "react-query";
import API_URL from "../index";

function App() {
  const [todos, setTodos] = useState([]);

  useQuery("todos", () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  });

  return (
    <div>
      <Header />
      <CreateArea />
      {todos.map((todoItem, index) => {
        return (
          <Todo
            key={todoItem.id}
            id={todoItem.id}
            title={todoItem.title}
            content={todoItem.body}
            done={todoItem.done}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
