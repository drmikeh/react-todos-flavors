const { getTodos, createTodo, updateTodo, destroyTodo } = require('../models/Todos');

const messageReducer = {
    message: () => 'Hello World!',
};

const todosReducer = {
    todos: getTodos,
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
}

// Root resolver
const rootReducer = {
    ...messageReducer,
    ...todosReducer
};

module.exports = rootReducer;
