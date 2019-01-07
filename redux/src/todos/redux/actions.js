import {
    FETCH_TODOS,
    ADD_TODO,
    SAVE_TODO,
    DELETE_TODO,
    DELETE_COMPLETED
} from './types';
import axios from 'axios';
import toastr from '../../toastr';

const apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';

export const fetchTodosSuccess = todos => {
    return {
        type: FETCH_TODOS,
        todos
    }
};
export const fetchTodos = () => {
    return async dispatch => {
        try {
            const response = await axios.get(apiUrl);
            dispatch(fetchTodosSuccess(response.data));
        } catch (error) {
            toastr.error(error);
        }
    }
};

export const addTodoSuccess = todo => {
    return {
        type: ADD_TODO,
        todo
    }
};
export const addTodo = text => {
    return async dispatch => {
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
};

export const saveTodoSuccess = todo => {
    return {
        type: SAVE_TODO,
        todo
    };
};
export const saveTodo = todo => {
    return async dispatch => {
        try {
            const response = await axios.put(apiUrl + '/' + todo.id, todo);            
            dispatch(saveTodoSuccess(response.data));
        } catch (error) {
            toastr.error(error);
        };
    }
};

export const deleteTodoSuccess = id => {
    return {
        type: DELETE_TODO,
        payload: {
            id
        }
    }
};
export const deleteTodo = id => {
    return async dispatch => {
        try {
            const response = await axios.delete(`${apiUrl}/${id}`);
            dispatch(deleteTodoSuccess(response.data.id))
        } catch (error) {
            toastr.error(error);
        }
    };
};

export const deleteCompletedSuccess = todos => {
    return {
        type: DELETE_COMPLETED,
        todos
    };
};
export const deleteCompleted = (todos) => {
    return dispatch => {
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
};
