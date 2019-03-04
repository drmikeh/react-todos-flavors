import React, { useState } from 'react';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const Todo = ({ todo, toggle, save, remove }) => {
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const editInputRef = React.createRef();
    
    function onEdit() {
        setEditing(true);
        editInputRef.current.focus();
    }

    function onSave(event) {
        const title = editTitle.trim();
        if (title) {
            save(todo.id, title);
            setEditing(false);
            setEditTitle(title);
        }
    }

    function onKeyDown(event) {
        if (event.which === ESCAPE_KEY) {
            setEditTitle(todo.title);
            setEditing(false);
        } else if (event.which === ENTER_KEY) {
            onSave(event);
        }
    }

    function onChange(event) {
        if (editing) {
            setEditTitle(event.target.value);
        }
    }

    return (
        <li className={classNames({
            completed: todo.completed,
            editing: editing
        })}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {toggle(todo.id)}}
                />
                <label onDoubleClick={onEdit}>{editTitle}</label>
                <button className="destroy" onClick={() => {remove(todo.id)}} />
            </div>
            <input
                ref={editInputRef}
                type="text"
                className="edit"
                value={editTitle}
                onBlur={onSave}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </li>
    );
};

export default Todo;
