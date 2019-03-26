const { getTodos, getTodo, createTodo, updateTodo, destroyTodo } = require('../../models/Todos');

const todosReducer = {
    todos: getTodos,
    todo: input => {
        return getTodo(input.id)
            .then(todo => todo)
            .catch(err => {
                throw err.message;
            });
        },
    createTodo: input => {
        return createTodo(input.todo)
            .then(todo => todo)
            .catch(err => {
                throw err.message;
            });
    },
    updateTodo: input => {
        return updateTodo(input.id, input.todo)
            .then(todo => todo)
            .catch(err => {
                throw err.message;
            });
    },
    destroyTodo: input => {
        return destroyTodo(input.id)
            .then(todo => todo)
            .catch(err => {
                throw err.message
            });
    }
};

module.exports = todosReducer;
