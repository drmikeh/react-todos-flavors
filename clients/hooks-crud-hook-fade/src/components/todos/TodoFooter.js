import React from 'react';
import { NavLink } from 'react-router-dom';

const TodoFooter = ({activeCount, completedCount, onClearCompleted}) => {
    const activeTodoWord = activeCount === 1 ? 'item' : 'items';
    const clearButton = completedCount > 0 ? (
        <button
            className = "clear-completed"
            onClick = {onClearCompleted}>
        Clear completed</button>
    ) : null;

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{activeCount}</strong> {activeTodoWord} left
            </span>
            
            <ul className="filters">
                <li><NavLink exact to="/" activeClassName="selected">All</NavLink></li>
                <li><NavLink to="/active" activeClassName="selected">Active</NavLink></li>
                <li><NavLink to="/completed" activeClassName="selected">Completed</NavLink></li>
            </ul>
            {clearButton}
        </footer>
    );
};

export default TodoFooter;
