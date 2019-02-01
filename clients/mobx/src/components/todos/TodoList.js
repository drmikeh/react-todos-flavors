import React from 'react';
import Todo from './Todo';

const TodoList = ({todos, toggle, remove, save}) => {
    const todoList = todos.map((todo) => (
        <Todo todo={todo} key={todo.id} toggle={toggle} remove={remove} save={save}/>
    ));
    return (
        <ul className="todo-list">
            {todoList}
        </ul>
    );
};

export default TodoList;
