import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

class TodoApp extends Component {
    componentDidMount() {
        this.props.todoState.fetchTodos();
    }

    render() {
        const completedCount = this.props.todoState.todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
        const activeCount = this.props.todoState.todos.length - completedCount;

        return (
            <section>
                <article className="todoapp">
                    <header className="header">
                        <h1 style={{ top: "-175px" }}>todos</h1>
                        <NewTodoForm addTodo={this.props.todoState.addTodo} />
                    </header>

                    <main className="main">
                        <Route path="/:filter?" render={props => {
                            const filter = props.match.params.filter || ALL_TODOS;
                            const todosToShow = this.props.todoState.filter(filter);
                            return (
                                <TodoList
                                    {...props}
                                    todos={todosToShow}
                                    toggle={this.props.todoState.toggleCompleted}
                                    remove={this.props.todoState.removeTodo}
                                    save={this.props.todoState.updateText}
                                />
                            );
                        }}/>
                    </main>
                    <TodoFooter
                        activeCount={activeCount}
                        completedCount={completedCount}
                        onClearCompleted={this.props.todoState.clearCompleted}
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

/* 
 * To ensure that routing continues to work correctly, we need to wrap the MobX observer with a `withRouter` HOC.
 * See https: //github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md#the-solution
 */
export default withRouter(observer(TodoApp));
