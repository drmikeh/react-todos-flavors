import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'unstated';
import TodoApp from '../todos/TodoApp';

const App = (props) => (
    <Router>
        <Provider><TodoApp /></Provider>
    </Router>
);

export default App;
