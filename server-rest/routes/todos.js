const express = require('express');
const router = express.Router();

const errorMessage = { message: 'Todo not found.' };

const reset = () => [
    { id: 1, title: 'Learn React', completed: true },
    { id: 2, title: 'Learn Redux', completed: true },
    { id: 3, title: 'Learn GraphQL', completed: false }
];

let todos = reset();

// PURGE
router.delete('/reset', (req, res) => {
    todos = reset();
    res.status(200).json(todos);
});

// INDEX
router.get('/', function(req, res) {
    res.status(200).json(todos);
});

// SHOW
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const found = todos.find(t => t.id === id);
    if (found) {
        res.status(200).json(found);
    }
    else {
        res.status(404).json(errorMessage);
    }
});

// CREATE
router.post('/', function(req, res, next) {
    const todoData = req.body;
    if (!todoData.title || todoData.title.length < 1) {
        res.status(422).json({ message: 'Todo needs a valid title.' });
    }
    else {
        const newId = todos.reduce((a, b) => a.id > b.id ? a.id : b.id, { id: 0 }) + 1;
        const newTodo = {
          id: newId,
          completed: false,
          ...req.body
        };
        todos = [...todos, newTodo];
        res.status(201).json(newTodo);
    }
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const updatedTodoData = req.body;
    const index = todos.findIndex(t => t.id === id);
    const found = todos[index];
    if (found) {
        const updatedTodo = { ...found, ...updatedTodoData };
        todos[index] = updatedTodo;
        res.status(200).json(updatedTodo);
    }
    else {
        res.status(404).json(errorMessage);
    }
});

// DESTROY
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    const found = todos[index];
    if (found) {
        todos = todos.filter(t => t.id !== id);
        res.status(200).json(found);
    }
    else {
        res.status(404).json(errorMessage);
    }
});

module.exports = router;
