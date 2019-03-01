import React from 'react';
import { Route } from 'react-router-dom';
import { Subscribe } from 'unstated';
import TodosContainer from './TodosContainer';
import { ALL_TODOS } from './TodoViewStates';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const TodosRenderer = todosContainer => {
    const { todos } = todosContainer.state;
    const completedCount = todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
    const activeCount = todos.length - completedCount;

    function onUpdateTitle(id, title) {
        const foundTodo = todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            title,
        };
        todosContainer.save(updatedTodo);
    }

    function onToggleCompleted(id) {
        const foundTodo = todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        todosContainer.save(updatedTodo);
    }

    return (
        <section>
            <article className="todoapp">
                <header className="header">
                    <h1 style={{ top: "-175px" }}>todos</h1>
                    <NewTodoForm addTodo={todosContainer.add} />
                </header>

                <main className="main">
                    <Route path="/:filter?" render={props => {
                        const filter = props.match.params.filter || ALL_TODOS;
                        const todosToShow = todosContainer.filterTodos(filter);
                        return (
                            <TodoList
                                {...props}
                                todos={todosToShow}
                                toggle={onToggleCompleted}
                                remove={todosContainer.delete}
                                save={onUpdateTitle}
                            />
                        );
                    }}/>
                </main>
                <TodoFooter
                    activeCount={activeCount}
                    completedCount={completedCount}
                    onClearCompleted={todosContainer.deleteCompleted}
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

const TodoApp = () => (
    <Subscribe to={[TodosContainer]}>
      {
        todoContainer => TodosRenderer(todoContainer)
      }
    </Subscribe>
);

export default TodoApp;
