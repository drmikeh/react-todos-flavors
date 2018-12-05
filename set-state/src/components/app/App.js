import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import TodoApp from '../todos/TodoApp';

const App = (props) => (
    <Router>
        <TodoApp />
    </Router>
);

export default App;
