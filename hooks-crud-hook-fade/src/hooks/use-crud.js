import { useState, useEffect } from 'react';
import axios from 'axios';
import toastr from '../toastr';
import 'toastr/build/toastr.min.css';

function useCrud(apiUrl, initialValue, initialLoading) {
    const [items, setItems] = useState(initialValue);
    const [loading, setLoading] = useState(initialLoading);

    // initial load of items
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiUrl);
                setTimeout(() => {
                    console.log('loading done');
                    setLoading(false);
                    setItems(response.data);
                }, 800);
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
            const response = await axios.post(apiUrl, item);
            setItems([...items, response.data]);
        } catch (error) {
            toastr.error(error);
        };
    }

    async function destroy(id) {
        try {
            // Filter all items except the one to be removed
            const remaining = items.filter(item => item.id !== id);
            await axios.delete(apiUrl + '/' + id);
            setItems(remaining);
        } catch (error) {
            toastr.error(error);
        };
    }

    async function destroyMany(filter) {
        const keepers = items.filter(item => !filter(item));
        const losers = items.filter(item => filter(item));
        const promises = losers.map(item => axios.delete(apiUrl + '/' + item.id));
        Promise.all(promises)
            .then(responses => {
                setItems(keepers)
            })
            .catch(error => {
                console.log('HERE');
                toastr.error(error);
            });

    }

    async function update(updatedItem) {
        try {
            const response = await axios.put(apiUrl + '/' + updatedItem.id, updatedItem)
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
