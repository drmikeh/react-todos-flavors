import React from 'react';
import classNames from 'classnames';
import { decorate, observable } from 'mobx';
import { observer } from 'mobx-react';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.editTitle = this.props.todo.title;
        this.editing = false;
        this.editInputRef = React.createRef();
    }

    onEdit = () => {
        this.editTitle = this.props.todo.title;
        this.editing = true;
        this.editInputRef.current.focus();
    }

    onSave = (event) => {
        const title = this.editTitle.trim();
        if (title) {
            this.props.save(this.props.todo.id, title);
            this.editing = false;
            this.editTitle = title;
        } else {
            this.props.onDestroy();
        }
    }

    onKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.editTitle = this.props.todo.title;
            this.editing = false;
        } else if (event.which === ENTER_KEY) {
            this.onSave(event);
        }
    }

    onChange = (event) => {
        if (this.editing) {
            this.editTitle = event.target.value;
        }
    }

    render() {
        const { todo, toggle, remove } = this.props;
        const { editing, editTitle } = this;

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
                    <label onDoubleClick={this.onEdit}>{editTitle}</label>
                    <button className="destroy" onClick={() => {remove(todo.id)}} />
                </div>
                <input
                    ref={this.editInputRef}
                    type="text"
                    className="edit"
                    value={this.editTitle}
                    onBlur={this.onSave}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </li>
        );
    }
}

decorate(Todo, {
    editTitle: observable,
    editing: observable
});

export default observer(Todo);
