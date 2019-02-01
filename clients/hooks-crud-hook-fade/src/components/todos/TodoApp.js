import React from 'react';
import { Route } from 'react-router-dom';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import useCrud from '../../hooks/use-crud';
import Spinner from '../spinner/Spinner';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const TodoApp = () => {
    const apiUrl = 'https://59b3446095ddb9001143e95f.mockapi.io/api/todos';
    const todos = useCrud(apiUrl, [], true);

    console.log('TodoApp:', todos.loading ? 'true' : 'false');

    function onUpdateText(id, text) {
        const foundTodo = todos.find(id);
        const updatedTodo = {
            ...foundTodo,
            text,
        };
        todos.update(updatedTodo);
    }

    function onToggleCompleted(id) {
        const foundTodo = todos.find(id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        todos.update(updatedTodo);
    }

    function onDeleteCompleted() {
        todos.destroyMany(todo => todo.completed);
    }
    
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

    const completedCount = todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
    const activeCount = todos.length() - completedCount;

    const create = text => {
        const todo = {
            text: text,
            completed: false
        };
        todos.create(todo);
    }

    const spinner = <Spinner key={1} />;
    
    const content = todos.loading ? spinner : (
        <article className="todoapp">
            <header className="header">
                <NewTodoForm addTodo={create} />
            </header>
            <main className="main">
                <Route
                    path="/:filter?"
                    render={props => {
                        const filter = props.match.params.filter || ALL_TODOS;
                        const todosToShow = getTodosToShow(filter);
                        return (
                            <TodoList
                                key={2}
                                className='todo-list'
                                todos={todosToShow}
                                toggle={onToggleCompleted}
                                remove={todos.destroy}
                                save={onUpdateText}
                            />
                        );
                    }}
                />
            </main>
            <TodoFooter
                activeCount={activeCount}
                completedCount={completedCount}
                onClearCompleted={onDeleteCompleted}
            />
        </article>
    );

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
