import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

function Todo(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  function handleDone() {
    props.markDone(props.id);
  }

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
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
      <button onClick={handleDone}>
        {props.done ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
      </button>
    </div>
  );
}

export default Todo;
