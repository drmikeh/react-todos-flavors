import {
    FETCH_TODOS,
    ADD_TODO,
    SAVE_TODO,
    DELETE_TODO,
    DELETE_COMPLETED
} from './types';
import TodoService from '../../services/TodoService';
import toastr from '../../toastr';
import 'toastr/build/toastr.min.css';

export const fetchTodosSuccess = todos => ({
    type: FETCH_TODOS,
    todos
});
export const fetchTodos = () => (
    async dispatch => {
        try {
            const response = await TodoService.get();
            dispatch(fetchTodosSuccess(response.data));
            return response; // allows calling code to know when the data is available (i.e. perhaps for an animation effect)
        } catch (error) {
            toastr.error(error);
        }
    }
);

export const addTodoSuccess = todo => ({
        type: ADD_TODO,
        todo
    }
);
export const addTodo = title => (
    async dispatch => {
        try {
            const todo = {
                title,
                completed: false
            };
            const response = await TodoService.post(todo);
            dispatch(addTodoSuccess(response.data));
        } catch (error) {
            toastr.error(error);
        };
    }
);

export const saveTodoSuccess = todo => ({
    type: SAVE_TODO,
    todo
});
export const saveTodo = todo => (
    async dispatch => {
        try {
            const response = await TodoService.put(todo);            
            dispatch(saveTodoSuccess(response.data));
        } catch (error) {
            toastr.error(error);
        };
    }
);

export const deleteTodoSuccess = id => ({
    type: DELETE_TODO,
    payload: {
        id
    }
});
export const deleteTodo = id => (
    async dispatch => {
        try {
            console.log('deleteTodo')
            const response = await TodoService.delete(id);
            console.log('dispatching deleteTodoSuccess:', response)
            dispatch(deleteTodoSuccess(response.data.id))
        } catch (error) {
            toastr.error(error);
        }
    }
);

export const deleteCompletedSuccess = todos => ({
    type: DELETE_COMPLETED,
    todos
});
export const deleteCompleted = todos => (
    dispatch => {
        // Filter all todos except the ones to be removed
        const keepers = todos.filter(todo => !todo.completed);
        const losers = todos.filter(todo => todo.completed);
        const promises = losers.map(todo => TodoService.delete(todo.id));
        Promise.all(promises).then(responses => {
            dispatch(deleteCompletedSuccess(keepers));
        }).catch(error => {
            toastr.error(error);
        });
    }
);
