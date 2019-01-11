import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import { ALL_TODOS } from '../redux/filters';

import { getTodosToShow } from '../redux/reducer';
import { addTodo, saveTodo, deleteTodo, deleteCompleted } from '../redux/actions';
import 'font-awesome/css/font-awesome.min.css';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

class TodoApp extends Component {
    onUpdateText(id, text) {
        const foundTodo = this.props.todos.find(todo => todo.id === id);
        const updatedTodo = {
            ...foundTodo,
            text,
        };
        this.props.onSave(updatedTodo);
    }

    onToggleCompleted(id) {
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
                            const filter = props.match.params.filter || ALL_TODOS;
                            const todosToShow = getTodosToShow(todos, filter);
                            return (
                                <TodoList
                                    {...props}
                                    todos={todosToShow}
                                    toggle={this.onToggleCompleted.bind(this)}
                                    remove={this.props.onDelete}
                                    save={this.onUpdateText.bind(this)}
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
/*
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
*/

/* Below we use a short-hand notation for the mapDispatchToProps config.
 * The rule here is that if the prop callback and the function being passed
 * to `dispatch` take the exact same args, we can simply pass a "mapping"
 * object for the mapDispatchToProps config.
 */ 
export default withRouter(
    connect(
        mapStateToProps,
        // mapDispatchToProps
        {
            onAdd: addTodo,
            onSave: saveTodo,
            onDelete: deleteTodo,
            onDeleteCompleted: deleteCompleted
        }
    )(TodoApp)
);
