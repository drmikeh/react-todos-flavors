import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import toastr from '../../toastr';
import 'toastr/build/toastr.min.css';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const TodoApp = () => {
    const apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';
    const [todos, setTodos] = useState([]);

    console.log('TodoApp');
    
    // initial load of todos data
    useEffect(async () => {
        try {
            const response = await axios.get(apiUrl);
            setTodos(response.data);
        } catch(error) {
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

    function getTodosToShow(viewState) {
        return todos.filter(todo => {
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

    async function onAdd(val) {
        try {
            const todo = {
                text: val,
                completed: false
            };
            const response = await axios.post(apiUrl, todo);
            setTodos([...todos, response.data]);
        } catch(error) {
            toastr.error(error);
        };
    }

    async function onDelete(id) {
        try {
            // Filter all todos except the one to be removed
            const remaining = todos.filter(todo => todo.id !== id);
            await axios.delete(apiUrl + '/' + id);
            setTodos(remaining);
        } catch(error) {
            toastr.error(error);
        };
    }

    async function saveTodo(updatedTodo) {
        try {
            const response = await axios.put(apiUrl + '/' + updatedTodo.id, updatedTodo)
            const updatedTodoFromServer = response.data;
            const newTodos = todos.map(todo => todo.id !== updatedTodoFromServer.id ? todo : updatedTodoFromServer);
            setTodos(newTodos);
        } catch(error) {
            toastr.error(error);
        };
    }

    function onUpdateText(id, text) {
        const foundTodo = todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            text,
        };
        saveTodo(updatedTodo);
    }

    function onToggleCompleted(id) {
        const foundTodo = todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        saveTodo(updatedTodo);
    }

    function onDeleteCompleted() {
        const keepers = todos.filter(todo => !todo.completed);
        const losers = todos.filter(todo => todo.completed);
        const promises = losers.map( todo => axios.delete(apiUrl + '/' + todo.id) );
        Promise.all(promises)
        .then(responses => {
            setTodos(keepers)
        })
        .catch(error => {
            toastr.error(error);
        });
    }

    const completedCount = todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
    const activeCount = todos.length - completedCount;

    return (
        <section>
            <article className="todoapp">
                <header className="header">
                    <h1 style={{ top: "-175px" }}>todos</h1>
                    <NewTodoForm addTodo={onAdd} />
                </header>

                <main className="main">
                        <Route path="/:filter?" render={props => {
                            const filter = props.match.params.filter || ALL_TODOS;
                            const todosToShow = getTodosToShow(filter);
                        return (
                            <TodoList
                                {...props}
                                todos={todosToShow}
                                toggle={onToggleCompleted}
                                remove={onDelete}
                                save={onUpdateText}
                            />
                        );
                    }}/>
                </main>
                <TodoFooter
                    activeCount={activeCount}
                    completedCount={completedCount}
                    onClearCompleted={onDeleteCompleted}
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

export default TodoApp;
