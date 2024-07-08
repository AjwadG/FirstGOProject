import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea(props) {
  const [active, setActive] = useState(false);

  function activate() {
    setActive(true);
  }
  const [todo, setTodo] = useState({
    title: "",
    content: "",
    done: false,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setTodo((prevtodo) => {
      return {
        ...prevtodo,
        [name]: value,
      };
    });
  }

  function submitTodo(event) {
    props.onAdd(todo);
    setTodo({
      title: "",
      content: "",
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="create-todo">
        {active && (
          <input
            name="title"
            onChange={handleChange}
            value={todo.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onClick={activate}
          onChange={handleChange}
          value={todo.content}
          placeholder="Add a todo..."
          rows={active ? 3 : 1}
        />
        <Zoom in={active}>
          <Fab onClick={submitTodo}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
