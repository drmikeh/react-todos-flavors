import { Container } from 'unstated';
import axios from 'axios';
import toastr from '../../toastr';
import 'toastr/build/toastr.min.css';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';

class TodosContainer extends Container {
    apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos'

    state = {
        todos: []
    }

    constructor() {
        super();
        this.fetchTodos();
    }

    fetchTodos = () => {
        console.log('fetchTodos');
        (async () => {
            try {
                const response = await axios.get(this.apiUrl)
                this.setState({
                    todos: response.data
                })
            } catch (error) {
                toastr.error(error)
            }
        })();
    }

    getTodosToShow = viewState => {
        return this.state.todos.filter(todo => {
            switch (viewState) {
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

    add = async val => {
        try {
            const todo = {
                text: val,
                completed: false
            };
            const response = await axios.post(this.apiUrl, todo);
            this.setState({
                todos: [...this.state.todos, response.data]
            });
        } catch (error) {
            console.log('ERROR:', error);
            toastr.error(error);
        };
    }

    delete = async id => {
        try {
            // Filter all todos except the one to be deleted
            const remaining = this.state.todos.filter(todo => todo.id !== id);
            await axios.delete(this.apiUrl + '/' + id);
            this.setState({
                todos: remaining
            });
        } catch (error) {
            toastr.error(error);
        };
    }

    /* Starting the name with an underscore is a naming convention to indicate
     * that this method is part of the implementation and not intended to be part
     * of the interface. Perhaps better is to hide this method using a closure.
     */
    save = async todo => {
        try {
            const response = await axios.put(this.apiUrl + '/' + todo.id, todo);
            const updatedTodoFromServer = response.data;
            const newTodos = this.state.todos.map(todo => (
                todo.id !== updatedTodoFromServer.id ? todo : updatedTodoFromServer
            ));
            this.setState({
                todos: newTodos,
            });
        } catch (error) {
            toastr.error(error);
        };
    }

    deleteCompleted = async () => {
        // Filter all todos except the ones to be deleted
        const keepers = this.state.todos.filter(todo => !todo.completed);
        const losers = this.state.todos.filter(todo => todo.completed);
        const promises = losers.map(todo => axios.delete(this.apiUrl + '/' + todo.id));
        return Promise.all(promises)
        .then(responses => {
            this.setState({
                todos: keepers
            });
        }).catch(error => {
            toastr.error(error);
        });
    }
}

export default TodosContainer;