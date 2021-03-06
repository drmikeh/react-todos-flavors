import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';
import { fetchTodos } from '../../todos/redux/actions';

const configureStore = () => {
    const middlewares = [thunk];
    if (process.env.NODE_ENV === 'development') {
        const { logger } = require('redux-logger');
        middlewares.push(logger);
    }

    // create and populate the Redux store
    // const store = createStore(rootReducer, applyMiddleware(thunk, logger));
    const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer);
    
    // Give some time for the axios mock to be configured by the integration test
    setTimeout(() => {
        store.dispatch(fetchTodos());
    }, 50);
    return store;
}

export default configureStore;
