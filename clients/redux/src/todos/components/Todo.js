import React from 'react';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

/* NOTE: this component uses setState instead of Redux
 * because Redux would be overkill for the following reasons:
 *   - the state in this component is never shared
 *   - the state in this component is used to manage the "edit todo" feature
 */

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            editTitle: this.props.todo.title,
        };
        this.editInputRef = React.createRef();  // the ref is used to grab focus
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
