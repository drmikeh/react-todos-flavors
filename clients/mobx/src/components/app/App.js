import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import TodoState from '../../state/TodoState';
import TodoApp from '../todos/TodoApp';
import './App.css';

const App = (props) => (
    <Router>
        <TodoApp todoState={TodoState} />
    </Router>
);

export default App;
