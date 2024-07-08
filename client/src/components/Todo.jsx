import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useMutation, useQueryClient } from "react-query";
import API_URL from "../index";

function Todo(props) {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation(() => {
    fetch(`${API_URL}/${props.id}`, {
      method: "DELETE",
    }).then(() => {
      queryClient.invalidateQueries("todos");
    });
  });

  const mutationUpdate = useMutation(() => {
    fetch(`${API_URL}/${props.id}`, {
      method: "PUT",
    }).then(() => {
      queryClient.invalidateQueries("todos");
    });
  });

  return (
    <div className="todo">
      <h1
        style={{
          textDecoration: props.done ? "line-through" : "none",
        }}
      >
        {props.title}
      </h1>
      <p
        style={{
          textDecoration: props.done ? "line-through" : "none",
        }}
      >
        {props.content}
      </p>
      <button onClick={mutationDelete.mutate}>
        <DeleteIcon />
      </button>
      <button onClick={mutationUpdate.mutate}>
        {props.done ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
      </button>
    </div>
  );
}

export default Todo;
