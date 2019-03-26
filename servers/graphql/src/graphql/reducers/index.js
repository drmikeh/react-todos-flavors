const messageReducer = require('./message-reducer');
const todosReducer = require('./todos-reducer');

// Root resolver
const rootReducer = {
    ...messageReducer,
    ...todosReducer
};

module.exports = rootReducer;
