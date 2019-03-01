import React from "react";

const NewTodoForm = ({ addTodo }) => {
    let input = null;
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const val = input.value.trim();
                if (val) {
                    addTodo(val);
                    input.value = '';
                }
            }}
        >
            <input
                type="text"
                autoFocus
                className = "new-todo"
                placeholder = "What needs to be done?"
                ref={node => {
                    input = node;
                }}
            />
        </form>
    );
};

export default NewTodoForm;
