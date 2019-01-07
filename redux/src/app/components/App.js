import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from '../redux/configureStore';
import TodoApp from '../../todos/components/TodoApp';

const store = configureStore();

const App = props => (
    <Provider store={store}>
        <Router>
            <TodoApp />
        </Router>
    </Provider>
);

export default App;
