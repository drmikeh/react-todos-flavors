import axios from 'axios';

// const apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';
const apiUrl = 'http://localhost:3000/todos';

const TodosFetcher = {
    reset: () => axios.delete(apiUrl + '/reset'),
    get: () => axios.get(apiUrl),
    put: todo => axios.put(apiUrl + '/' + todo.id, todo),
    post: todo => axios.post(apiUrl, todo),
    delete: id => axios.delete(apiUrl + '/' + id)
};

export default TodosFetcher;
