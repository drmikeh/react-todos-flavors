import { useState, useEffect } from 'react';
import TodoService from '../services/TodoService';
import toastr from '../toastr';
import 'toastr/build/toastr.min.css';

function useCrud(service, initialValue) {
    const [items, setItems] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    // initial load of items
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await TodoService.get();
                setItems(response.data);
                setLoading(false);
            } catch (error) {
                toastr.error(error);
            }
        })();
    }, []);
    /* The 2nd arg above is a watch list of variables that trigger the effect.
     * If the list is empty, the effect only executes once (cDM).
     * If the list is not provided, the effect executes with every change
     * to props or state (cDM + cDU).
     * If the list contains some variables, the effect executes whenever any of
     * those variables are reassigned.
     */

    async function create(item) {
        try {
            const response = await TodoService.post(item);
            setItems([...items, response.data]);
        } catch (error) {
            toastr.error(error);
        };
    }

    async function destroy(id) {
        try {
            // Filter all items except the one to be removed
            const remaining = items.filter(item => item.id !== id);
            await TodoService.delete(id);
            setItems(remaining);
        } catch (error) {
            toastr.error(error);
        };
    }

    async function destroyMany(filter) {
        const keepers = items.filter(item => !filter(item));
        const losers = items.filter(item => filter(item));
        const promises = losers.map(item => TodoService.delete(item.id));
        Promise.all(promises)
            .then(responses => {
                setItems(keepers)
            })
            .catch(error => {
                toastr.error(error);
            });

    }

    async function update(updatedItem) {
        try {
            const response = await TodoService.put(updatedItem)
            const updatedItemFromServer = response.data;
            const newItems = items.map(item => item.id !== updatedItemFromServer.id ? item : updatedItemFromServer);
            setItems(newItems);
        } catch (error) {
            toastr.error(error);
        };
    }

    function length() {
        return items ? items.length : 0;
    }

    function find(id) {
        return items.find(item => item.id === id);
    }

    function filter(fn) {
        return items.filter(fn);
    }

    function reduce(fn, initialValue) {
        return items.reduce(fn, initialValue);
    }

    return {
        loading,
        items,
        setItems,
        create,
        destroy,
        destroyMany,
        update,
        length,
        find,
        filter,
        reduce
    }
}

export default useCrud;
