import {
    FETCH_TODOS,
    ADD_TODO,
    SAVE_TODO,
    DELETE_TODO,
    DELETE_COMPLETED
} from './types';

import {
    ALL_TODOS,
    ACTIVE_TODOS,
    COMPLETED_TODOS
} from './filters';

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

export const filterTodos = (todos, filter) => {
    return todos.filter(todo => {
        switch (filter) {
            case ALL_TODOS:
                return true;
            case ACTIVE_TODOS:
                return !todo.completed;
            case COMPLETED_TODOS:
                return todo.completed;
            default:
                return false;
        }
    });
}