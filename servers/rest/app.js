const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const todosRouter = require('./routes/todos');

const app = express();

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/todos', todosRouter);

module.exports = app;
