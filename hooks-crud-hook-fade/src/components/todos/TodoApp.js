import React from 'react';
import { Route } from 'react-router-dom';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import useReactRouter from '../../hooks/use-react-router';
import useCrud from '../../hooks/use-crud';
import Spinner from '../spinner/Spinner';
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
    const todos = useCrud(apiUrl, [], true);

    console.log('TodoApp:', todos.loading ? 'true' : 'false');

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

    const spinner = <Spinner key={1} />;

    const todoList = (
        <TodoList
            key={2}
            className='todo-list'
            todos={todosToShow}
            toggle={toggleCompleted}
            remove={todos.destroy}
            save={updateText}
        />
    );
    
    const content = todos.loading ? spinner : (
        <article className="todoapp">
            <header className="header">
                <NewTodoForm addTodo={todos.create} />
            </header>
            <main className="main">
                <Route render={routeProps => {
                    return todoList;
                }}/>
            </main>
            <TodoFooter
                activeCount={activeCount}
                completedCount={completedCount}
                onClearCompleted={clearCompleted}
            />
        </article>
    );

    const content2 = todos.loading ? spinner : <h1 key={2}>Done</h1>;

    return (
        <section>
            <h1 className="title">todos</h1>
            <ReactCSSTransitionReplace
                transitionName="cross-fade"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
                style={{overflow: 'auto'}}
            >
                {content}
            </ReactCSSTransitionReplace>
            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>Created by <a href="http://github.homedepot.com/mah3093/">Dr. Mike Hopper</a></p>
                <p>For <a href="http://github.homedepot.com/OrangeMethod">OrangeMethod</a></p>
            </footer>
        </section>
    );
}

export default TodoApp;
