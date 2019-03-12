import React from 'react';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            editTitle: this.props.todo.title,
        };
        this.editInputRef = React.createRef();
    }

    onEdit = () => {
        this.setState({
            editTitle: this.props.todo.title,
            editing: true,
        }, () => {
            this.editInputRef.current.focus();
        });
    }

    onSave = (event) => {
        const title = this.state.editTitle.trim();
        if (title) {
            this.props.save(this.props.todo.id, title);
            this.setState({
                editing: false,
                editTitle: title,
            });
        } else {
            this.props.onDestroy();
        }
    }

    onKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.setState({
                editTitle: this.props.todo.title,
                editing: false
            });
        } else if (event.which === ENTER_KEY) {
            this.onSave(event);
        }
    }

    onChange = (event) => {
        if (this.state.editing) {
            this.setState({editTitle: event.target.value});
        }
    }

    render() {
        const { todo, toggle, remove } = this.props;
        const { editing, editTitle } = this.state;

        return (
            <li className={classNames({
                completed: todo.completed,
                editing: editing
            })}>
                <div className="view">
                    <input
                        data-testid={`toggle-button-${todo.id}`}
                        className="toggle"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {toggle(todo.id)}}
                    />
                    <label onDoubleClick={this.onEdit}>{editTitle}</label>
                    <button
                        data-testid={`delete-button-${todo.id}`}
                        className="destroy"
                        onClick={() => {remove(todo.id)}}
                    />
                </div>
                <input
                    data-testid={`title-input-${todo.id}`}
                    ref={this.editInputRef}
                    type="text"
                    className="edit"
                    value={this.state.editTitle}
                    onBlur={this.onSave}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </li>
        );
    }
}

export default Todo;
