import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

class TodoApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
        };
        this.apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';
    }

    componentDidMount() {
        (async () => {
            try {
                const response = await axios.get(this.apiUrl);
                this.setState({ todos: response.data });
                return response;
            } catch (error) {
                toastr.error(error);
            }
        })();
    }

    getTodosToShow(viewState) {
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

    async onAdd(val) {
        try {
            const todo = {
                text: val,
                completed: false
            };
            const response = await axios.post(this.apiUrl, todo);
            this.setState({
                todos: [...this.state.todos, response.data]
            });
        }
        catch(error) {
            toastr.error(error);
        };
    }

    async onDelete(id) {
        try {
            // Filter all todos except the one to be deleted
            const remaining = this.state.todos.filter(todo => todo.id !== id);
            await axios.delete(this.apiUrl + '/' + id);
            this.setState({
                todos: remaining
            });
        } catch(error) {
            toastr.error(error);
        };
    }

    /* Starting the name with an underscore is a naming convention to indicate
     * that this method is part of the implementation and not intended to be part
     * of the interface. Perhaps better is to hide this method using a closure.
     */
    async _saveTodo(todo) {
        try {
            const response = await axios.put(this.apiUrl + '/' + todo.id, todo);
            const updatedTodoFromServer = response.data;
            const newTodos = this.state.todos.map(todo => (
                todo.id !== updatedTodoFromServer.id ? todo : updatedTodoFromServer
            ));
            this.setState({
                todos: newTodos,
            });
        } catch(error) {
            toastr.error(error);
        };
    }

    onUpdateText(id, text) {
        const foundTodo = this.state.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            text,
        };
        this._saveTodo(updatedTodo);
    }

    onToggleCompleted(id) {
        const foundTodo = this.state.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        this._saveTodo(updatedTodo);
    }

    onDeleteCompleted() {
        // Filter all todos except the ones to be deleted
        const keepers = this.state.todos.filter(todo => !todo.completed);
        const losers = this.state.todos.filter(todo => todo.completed);
        const promises = losers.map( todo => axios.delete(this.apiUrl + '/' + todo.id) );
        Promise.all(promises)
        .then(responses => {
            this.setState({
                todos: keepers
            });
        }).catch(error => {
            toastr.error(error);
        });
    }

    render() {
        const { todos } = this.state;
        const completedCount = todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
        const activeCount = todos.length - completedCount;

        return (
            <section>
                <article className="todoapp">
                    <header className="header">
                        <h1 style={{ top: "-175px" }}>todos</h1>
                        <NewTodoForm addTodo={this.onAdd.bind(this)} />
                    </header>

                    <main className="main">
                        <Route path="/:filter?" render={props => {
                            const filter = props.match.params.filter || ALL_TODOS;
                            const todosToShow = this.getTodosToShow(filter);
                            return (
                                <TodoList
                                    {...props}
                                    todos={todosToShow}
                                    toggle={this.onToggleCompleted.bind(this)}
                                    remove={this.onDelete.bind(this)}
                                    save={this.onUpdateText.bind(this)}
                                />
                            );
                        }}/>
                    </main>
                    <TodoFooter
                        activeCount={activeCount}
                        completedCount={completedCount}
                        onClearCompleted={this.onDeleteCompleted.bind(this)}
                    />
                </article>

                <footer className="info">
                    <p>Double-click to edit a todo</p>
                    <p>Created by <a href="http://github.homedepot.com/mah3093/">Dr. Mike Hopper</a></p>
                    <p>For <a href="http://github.homedepot.com/OrangeMethod">OrangeMethod</a></p>
                </footer>
            </section>
        );
    }
}

export default TodoApp;
