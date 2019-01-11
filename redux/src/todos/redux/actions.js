import {
    FETCH_TODOS,
    ADD_TODO,
    SAVE_TODO,
    DELETE_TODO,
    DELETE_COMPLETED
} from './types';
import axios from 'axios';
import toastr from '../../toastr';
import 'toastr/build/toastr.min.css';

const apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';

export const fetchTodosSuccess = todos => ({
    type: FETCH_TODOS,
    todos
});
export const fetchTodos = () => (
    async dispatch => {
        try {
            const response = await axios.get(apiUrl);
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
export const addTodo = text => (
    async dispatch => {
        try {
            const todo = {
                text: text,
                completed: false
            };
            const response = await axios.post(apiUrl, todo);
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
            const response = await axios.put(apiUrl + '/' + todo.id, todo);            
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
            const response = await axios.delete(`${apiUrl}/${id}`);
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
        const promises = losers.map(todo => axios.delete(apiUrl + '/' + todo.id));
        Promise.all(promises).then(responses => {
            dispatch(deleteCompletedSuccess(keepers));
        }).catch(error => {
            toastr.error(error);
        });
    }
);
