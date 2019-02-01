import { combineReducers } from 'redux';
import todosReducer from '../../todos/redux/reducer';

export default combineReducers({
    todos: todosReducer
});
