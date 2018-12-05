import React from 'react';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            editText: this.props.todo.text,
        };
        this.editInputRef = React.createRef();
    }

    onEdit = () => {
        this.setState({
            editText: this.props.todo.text,
            editing: true,
        }, () => {
            this.editInputRef.current.focus();
        });
    }

    onSave = (event) => {
        const text = this.state.editText.trim();
        if (text) {
            this.props.save(this.props.todo.id, text);
            this.setState({
                editing: false,
                editText: text,
            });
        } else {
            this.props.onDestroy();
        }
    }

    onKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.setState({
                editText: this.props.todo.text,
                editing: false
            });
        } else if (event.which === ENTER_KEY) {
            this.onSave(event);
        }
    }

    onChange = (event) => {
        if (this.state.editing) {
            this.setState({editText: event.target.value});
        }
    }

    render() {
        const { todo, toggle, remove } = this.props;
        const { editing, editText } = this.state;

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
                    <label onDoubleClick={this.onEdit}>{editText}</label>
                    <button className="destroy" onClick={() => {remove(todo.id)}} />
                </div>
                <input
                    ref={this.editInputRef}
                    type="text"
                    className="edit"
                    value={this.state.editText}
                    onBlur={this.onSave}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
            </li>
        );
    }
}

export default Todo;
