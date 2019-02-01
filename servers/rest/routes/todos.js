const express = require('express');
const router = express.Router();
const { resetTodos, getTodos, getTodo, createTodo, updateTodo, destroyTodo } = require('../models/Todos');

// PURGE
router.delete('/reset', (req, res) => {
    resetTodos();
    getTodos()
        .then(todos => {
            res.status(200).json(todos);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// INDEX
router.get('/', function(req, res) {
    getTodos()
        .then(todos => {
            res.status(200).json(todos);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// SHOW
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    getTodo(id)
        .then(todo => {
            res.status(200).json(todo);
        })
        .catch(err => {
            res.status(err.code).json({ message: err.message });
        });
});

// CREATE
router.post('/', function(req, res, next) {
    const todoData = req.body;
    createTodo(todoData)
        .then(todo => {
            res.status(201).json(todo);
        })
        .catch(err => {
            res.status(err.code).json({ message: err.message });
        });
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const updatedTodoData = req.body;
    updateTodo(id, updatedTodoData)
        .then(todo => {
            res.status(200).json(todo);
        })
        .catch(err => {
            res.status(err.code).json({ message: err.message });
        });
});

// DESTROY
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    destroyTodo(id)
        .then(todo => {
            res.status(200).json(todo);
        })
        .catch(err => {
            res.status(err.code).json({ message: err.message });
        })
});

module.exports = router;
