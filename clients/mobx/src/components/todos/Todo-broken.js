import React from 'react';
import { decorate, observable, when, autorun, action } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const Todo = ({ todo, toggle, save, remove }) => {
    let editing = false;
    let editTitle = todo.title;
    let editInputRef = React.createRef();

    autorun(() => {
        console.log("editing value changed: ", editing ? 'YES' : 'NO');
    });
    
    function onEdit() {
        editTitle = todo.title;
        editing = true;
        console.log('onEdit:', editTitle, editing ? 'YES' : 'NO');
        editInputRef.current.focus();
    }

    when(() => editing, () => editInputRef.current.focus());

    function onSave(event) {
        const title = editTitle.trim();
        if (title) {
            save(todo.id, title);
            editing = false;
            editTitle = title;
        }
    }

    function onKeyDown(event) {
        if (event.which === ESCAPE_KEY) {
            editTitle = todo.title;
            editing = false;
        } else if (event.which === ENTER_KEY) {
            onSave(event);
        }
    }

    function onChange(event) {
        if (editing) {
            editTitle = event.target.value;
        }
    }

    console.log(editTitle, editing);
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
                <label onDoubleClick={onEdit}>{editTitle} - {editing ? 'YES' : 'NO'}</label>
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
}

decorate(Todo, {
    editing: observable,
    editTitle: observable,
    onEdit: action,
    onSave: action,
    onKeyDown: action,
    onChange: action

});

export default observer(Todo);
