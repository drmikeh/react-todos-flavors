// Some Sample Data
let todos = [
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Learn Redux', completed: true },
    { id: 3, text: 'Learn GraphQL', completed: false }
];

const getTodos = () => {
    return Promise.resolve(todos);
}

const createTodo = todo => {
    const newId = todos.reduce((a, b) => a.id > b.id ? a.id : b.id, { id: 0 }) + 1;
    const newTodo = { id: newId, completed: false, ...todo };
    todos = [ ...todos, newTodo ];
    return Promise.resolve(newTodo);
}

const updateTodo = (id, todo) => {
    const index = todos.findIndex(t => t.id === id);
    const found = todos[index];
    const updated = { ...found, ...todo };
    todos[index] = updated;
    return updated;
}

const destroyTodo = id => {
    const index = todos.findIndex(t => t.id === id);
    const found = todos[index];
    todos = todos.filter(t => t.id !== id);
    return found;
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    destroyTodo
};
