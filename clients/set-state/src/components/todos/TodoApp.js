import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import TodoService from '../../services/TodoService';
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async componentDidMount() {
        try {
            this._isMounted = true;
            const response = await TodoService.get();
            this.setState({ todos: response.data });
            return response;
        } catch (error) {
            toastr.error(error);
        }
    }

    filterTodos(viewState) {
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
                title: val,
                completed: false
            };
            const response = await TodoService.post(todo);
            this.setState({
                todos: [...this.state.todos, response.data]
            });
            return response;
        }
        catch(error) {
            toastr.error(error);
        };
    }

    async onDelete(id) {
        try {
            // Filter all todos except the one to be deleted
            const remaining = this.state.todos.filter(todo => todo.id !== id);
            const response = await TodoService.delete(id);
            this.setState({
                todos: remaining
            });
            return response;
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
            const response = await TodoService.put(todo);
            const updatedTodoFromServer = response.data;
            const newTodos = this.state.todos.map(todo => (
                todo.id !== updatedTodoFromServer.id ? todo : updatedTodoFromServer
            ));
            return new Promise( (resolve, reject) => {
                this.setState({
                    todos: newTodos,
                }, () => {
                    resolve(updatedTodoFromServer);
                });
            });
        } catch(error) {
            toastr.error(error);
        };
    }

    onUpdateTitle(id, title) {
        const foundTodo = this.state.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            title,
        };
        return this._saveTodo(updatedTodo);
    }

    onToggleCompleted(id) {
        const foundTodo = this.state.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        return this._saveTodo(updatedTodo);
    }

    onDeleteCompleted() {
        // Filter all todos except the ones to be deleted
        const keepers = this.state.todos.filter(todo => !todo.completed);
        const losers = this.state.todos.filter(todo => todo.completed);
        const promises = losers.map( todo => TodoService.delete(todo.id) );
        return Promise.all(promises)
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
                            const todosToShow = this.filterTodos(filter);
                            return (
                                <TodoList
                                    {...props}
                                    todos={todosToShow}
                                    toggle={this.onToggleCompleted.bind(this)}
                                    remove={this.onDelete.bind(this)}
                                    save={this.onUpdateTitle.bind(this)}
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
