import { useState, useEffect } from 'react';
import axios from 'axios';
import toastr from '../toastr';

function useCrud(apiUrl, initialValue) {
    const [data, setData] = useState(initialValue);

    // initial load of data
    useEffect(() => {
        try {
            (async () => {
                const response = await axios.get(apiUrl);
                setData(response.data);
            })();
        } catch (error) {
            toastr.error(error);
        }
    }, []);
    /* The 2nd arg above is a watch list of variables that trigger the effect.
     * If the list is empty, the effect only executes once (cDM).
     * If the list is not provided, the effect executes with every change
     * to props or state (cDM + cDU).
     * If the list contains some variables, the effect executes whenever any of
     * those variables are reassigned.
     */

    async function create(val) {
        try {
            const todo = {
                text: val,
                completed: false
            };
            const response = await axios.post(apiUrl, todo);
            setData([...data, response.data]);
        } catch (error) {
            toastr.error(error);
        };
    }

    async function destroy(id) {
        try {
            // Filter all data except the one to be removed
            const remaining = data.filter(todo => todo.id !== id);
            await axios.delete(apiUrl + '/' + id);
            setData(remaining);
        } catch (error) {
            toastr.error(error);
        };
    }

    async function update(updatedTodo) {
        try {
            const response = await axios.put(apiUrl + '/' + updatedTodo.id, updatedTodo)
            const updatedTodoFromServer = response.data;
            const newTodos = data.map(todo => todo.id !== updatedTodoFromServer.id ? todo : updatedTodoFromServer);
            setData(newTodos);
        } catch (error) {
            toastr.error(error);
        };
    }

    function length() {
        return data ? data.length : 0;
    }

    function find(id) {
        return data.find(todo => todo.id === id);
    }

    function filter(fn) {
        return data.filter(fn);
    }

    function reduce(fn) {
        return data.reduce(fn, []);
    }

    return {
        data,
        setData,
        create,
        destroy,
        update,
        length,
        find,
        filter,
        reduce
    }
}

export default useCrud;
