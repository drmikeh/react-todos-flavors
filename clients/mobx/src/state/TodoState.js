import { action, observable } from 'mobx';
import TodoService from '../services/TodoService';
import toastr from '../toastr';
import 'toastr/build/toastr.min.css';
import { ACTIVE_TODOS, COMPLETED_TODOS } from './TodoViewStates';

const todoState = observable({
    todos: []
});

todoState.fetchTodos = action(function fetchTodos() {
    (async () => {
        try {
            const response = await TodoService.get();
            todoState.setTodos(response.data);
        } catch (error) {
            toastr.error(error);
        }
    })();
});

todoState.filter = function (viewState) {
    return todoState.todos.filter(todo => {
        switch (viewState) {
            case ACTIVE_TODOS:
                return !todo.completed;
            case COMPLETED_TODOS:
                return todo.completed;
            default:
                return true;
        }
    });
};

todoState.setTodos = action(function setTodos(todos) {
    todoState.todos = todos;
});

todoState.addTodo = async (val) => {
    try {
        const todo = {
            title: val,
            completed: false
        };
        const response = await TodoService.post(todo);
        todoState.todos.push(response.data);
    } catch (error) {
        toastr.error(error);
    };
}

todoState.removeTodo = async (id) => {
    try {
        // Filter all todos except the one to be removed
        todoState.setTodos(todoState.todos.filter(todo => todo.id !== id));
        await TodoService.delete(id);
    } catch (error) {
        toastr.error(error);
    };
}

todoState.saveTodo = async (todo) => {
    try {
        const response = await TodoService.put(todo);
        const updatedTodoFromServer = response.data;
        todoState.setTodos(todoState.todos.map(todo => (
            todo.id !== updatedTodoFromServer.id ? todo : updatedTodoFromServer
        )));
    } catch(error) {
        toastr.error(error);
    };
}

todoState.updateTitle = (id, title) => {
    const foundTodo = todoState.todos.find(todo => todo.id === id);
    const updatedTodo = {
        ...foundTodo,
        title,
    };
    todoState.saveTodo(updatedTodo);
}

todoState.toggleCompleted = (id) => {
    const foundTodo = todoState.todos.find(todo => todo.id === id);
    const updatedTodo = {
        ...foundTodo,
        completed: !foundTodo.completed
    };
    todoState.saveTodo(updatedTodo);
}

todoState.clearCompleted = () => {
    // Filter all todos except the ones to be removed
    const keepers = todoState.todos.filter(todo => !todo.completed);
    const losers = todoState.todos.filter(todo => todo.completed);
    const promises = losers.map(todo => TodoService.delete(todo.id));
    Promise.all(promises)
        .then(responses => {
            todoState.setTodos(keepers);
        }).catch(error => {
            toastr.error(error);
        });
}

export default todoState;
