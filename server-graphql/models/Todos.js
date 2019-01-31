// Some Sample Data
let todos;
const resetTodos = () => {
    todos = [
        { id: 1, title: 'Learn React', completed: true },
        { id: 2, title: 'Learn Redux', completed: true },
        { id: 3, title: 'Learn GraphQL', completed: false }
    ];
};
resetTodos();

const errors = {
    notFound: new Error('Todo not found'),
    invalidTitle: new Error('Todo needs a valid title.')
};

const isValidTitle = todo => todo.title && todo.title.length > 0;

const getTodos = () => {
    return Promise.resolve(todos);
}

const getTodo = id => {
    const found = todos.find(t => t.id === id);
    if (!found) return Promise.reject(errors.notFound);
    return Promise.resolve(found);
}

const createTodo = todo => {
    if (!isValidTitle(todo)) return Promise.reject(errors.invalidTitle);
    const newId = todos.reduce((a, b) => a.id > b.id ? a.id : b.id, { id: 0 }) + 1;
    const newTodo = { id: newId, completed: false, ...todo };
    todos = [ ...todos, newTodo ];
    return Promise.resolve(newTodo);
}

const updateTodo = (id, todo) => {
    if (!isValidTitle(todo)) return Promise.reject(errors.invalidTitle);
    const index = todos.findIndex(t => t.id === id);
    const found = todos[index];
    if (!found) return Promise.reject(errors.notFound);
    const updated = { ...found, ...todo };
    todos[index] = updated;
    return Promise.resolve(updated);
}

const destroyTodo = id => {
    const index = todos.findIndex(t => t.id === id);
    const found = todos[index];
    if (!found) return Promise.reject(errors.notFound);
    todos = todos.filter(t => t.id !== id);
    return Promise.resolve(found);
}

module.exports = {
    resetTodos,
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    destroyTodo
};
