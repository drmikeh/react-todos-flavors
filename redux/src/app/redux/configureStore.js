import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';
import { fetchTodos } from '../../todos/redux/actions';

const configureStore = () => {
    // create and populate the Redux store
    const store = createStore(rootReducer, applyMiddleware(thunk));
    store.dispatch(fetchTodos());
    return store;
}

export default configureStore;
