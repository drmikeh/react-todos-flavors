import React from 'react';
import { Route } from 'react-router-dom';
import useReactRouter from '../../hooks/use-react-router';
import useCrud from '../../hooks/use-crud';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const TodoApp = () => {
    const apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';
    const { location } = useReactRouter();
    const todos = useCrud(apiUrl, []);

    console.log('TodoApp');

    function updateText(id, text) {
        const foundTodo = todos.find(id);
        const updatedTodo = {
            ...foundTodo,
            text,
        };
        todos.update(updatedTodo);
    }

    function toggleCompleted(id) {
        const foundTodo = todos.find(id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        todos.update(updatedTodo);
    }

    function clearCompleted() {
        const keepers = todos.filter(todo => !todo.completed);
        const losers = todos.filter(todo => todo.completed);
        const promises = losers.map( todo => todos.destroy(todo.id) );
        Promise.all(promises)
        .then(responses => {
            todos.setData(keepers)
        });
    }

    const completedCount = todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
    const activeCount = todos.length() - completedCount;

    const viewState = location.pathname.slice(1);
    const todosToShow = todos.filter(todo => {
        switch (viewState) {
            case ACTIVE_TODOS:
                return !todo.completed;
            case COMPLETED_TODOS:
                return todo.completed;
            default:
                return true;
        }
    });

    return (
        <section>
            <article className="todoapp">
                <header className="header">
                    <h1 style={{ top: "-175px" }}>todos</h1>
                    <NewTodoForm addTodo={todos.create} />
                </header>

                <main className="main">
                    <Route render={props => {
                        return (todos.loading ? <h3>Loading...</h3> :
                            <TodoList
                                {...props}
                                todos={todosToShow}
                                toggle={toggleCompleted}
                                remove={todos.destroy}
                                save={updateText}
                            />
                        );
                    }}/>
                </main>
                <TodoFooter
                    activeCount={activeCount}
                    completedCount={completedCount}
                    onClearCompleted={clearCompleted}
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
