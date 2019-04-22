import React from 'react';
import { Route } from 'react-router-dom';
import TodoService from '../../services/TodoService';
import useCrud from '../../hooks/use-crud';
import 'toastr/build/toastr.min.css';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const TodoApp = () => {
    const todos = useCrud(TodoService, []);

    function onUpdateTitle(id, title) {
        const foundTodo = todos.find(id);
        const updatedTodo = {
            ...foundTodo,
            title,
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
    
    function filterTodos(viewState) {
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

    const create = title => {
        const todo = {
            title: title,
            completed: false
        };
        todos.create(todo);
    }

    return (
        <section>
            <article className="todoapp">
                <header className="header">
                    <h1 style={{ top: "-175px" }}>todos</h1>
                    <NewTodoForm addTodo={create} />
                </header>

                <main className="main">
                    <Route path="/:filter?" render={props => {
                        const filter = props.match.params.filter || ALL_TODOS;
                        const todosToShow = filterTodos(filter);
                        return (todos.loading ? <h3>Loading...</h3> :
                            <TodoList
                                {...props}
                                todos={todosToShow}
                                toggle={onToggleCompleted}
                                remove={todos.destroy}
                                save={onUpdateTitle}
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
