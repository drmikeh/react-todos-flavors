import {
    FETCH_TODOS,
    ADD_TODO,
    SAVE_TODO,
    DELETE_TODO,
    DELETE_COMPLETED
} from './types';

export default function todosReducer(state = [], action) {
    switch (action.type) {
        case FETCH_TODOS:
            return action.todos;
        case ADD_TODO:
            return [...state, action.todo];
        case SAVE_TODO:
            return state.map(todo => (
                todo.id !== action.todo.id ? todo : action.todo
            ));
        case DELETE_TODO:
            return state.filter(todo => todo.id !== action.payload.id);
        case DELETE_COMPLETED:
            return action.todos;
        default:
            return state;
    }
}
