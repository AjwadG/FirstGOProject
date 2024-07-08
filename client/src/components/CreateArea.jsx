import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import API_URL from "../index";

function CreateArea(props) {
  const [active, setActive] = useState(false);

  const queryClient = useQueryClient();

  function activate() {
    setActive(true);
  }
  const [todo, setTodo] = useState({
    title: "",
    body: "",
    done: false,
  });

  const mutationCreate = useMutation(() => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then(() => {
      queryClient.invalidateQueries("todos");
    });
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
    if (todo.title !== "" && todo.body !== "") {
      mutationCreate.mutate();
      setTodo({
        title: "",
        body: "",
      });
    }
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
          name="body"
          onClick={activate}
          onChange={handleChange}
          value={todo.body}
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
