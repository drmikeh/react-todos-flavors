const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const todosRouter = require('./routes/todos');

const app = express();
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/todos', todosRouter);

module.exports = app;
