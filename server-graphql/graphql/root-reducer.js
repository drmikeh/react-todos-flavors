const { getTodos, createTodo, updateTodo, destroyTodo } = require('../models/todo');

const messageReducer = {
    message: () => 'Hello World!',
};

const todosReducer = {
    todos: getTodos,
    createTodo: input => createTodo(input.todo),
    updateTodo: input => updateTodo(input.id, input.todo),
    destroyTodo: input => destroyTodo(input.id)
}

// Root resolver
const rootReducer = {
    ...messageReducer,
    ...todosReducer
};

module.exports = rootReducer;
