import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';
import { addTodo, saveTodo, deleteTodo, deleteCompleted } from '../redux/actions';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

class TodoApp extends Component {
    getTodosToShow(viewState) {
        return this.props.todos.filter(todo => {
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

    updateText(id, text) {
        const foundTodo = this.props.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            text,
        };
        this.props.onSave(updatedTodo);
    }

    toggleCompleted(id) {
        const foundTodo = this.props.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            completed: !foundTodo.completed
        };
        this.props.onSave(updatedTodo);
    }

    render() {
        const { todos } = this.props;
        const completedCount = todos.reduce( (acc, todo) => todo.completed ? acc + 1 : acc, 0);
        const activeCount = todos.length - completedCount;

        return (
            <section>
                <article className="todoapp">
                    <header className="header">
                        <h1 style={{ top: "-175px" }}>todos</h1>
                        <NewTodoForm addTodo={this.props.onAdd} />
                    </header>

                    <main className="main">
                        <Route path="/:filter?" render={props => {
                            const filter = props.match.params.filter || 'all';
                            const todosToShow = this.getTodosToShow(filter);
                            return (
                                <TodoList
                                    {...props}
                                    todos={todosToShow}
                                    toggle={this.toggleCompleted.bind(this)}
                                    remove={this.props.onDelete}
                                    save={this.updateText.bind(this)}
                                />
                            );
                        }}/>
                    </main>
                    <TodoFooter
                        activeCount={activeCount}
                        completedCount={completedCount}
                        onClearCompleted={() => this.props.onDeleteCompleted(todos)}
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

const mapStateToProps = state => {
  return {
    todos: state.todos
  };
};

// here we define callbacks so that the component implementation (the code above)
//  does not depend on dispatch (or any of the Redux api)
const mapDispatchToProps = (dispatch, containerProps) => {
  return {
    onAdd: text => {
        dispatch(addTodo(text));
    },
    onSave: todo => {
        dispatch(saveTodo(todo));
    },
    onDelete: id => {
      dispatch(deleteTodo(id));
    },
    onDeleteCompleted: (todos) => {
        dispatch(deleteCompleted(todos));
    }
  };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(TodoApp)
);
