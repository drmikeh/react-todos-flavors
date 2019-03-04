require('jest-extended');
const { resetTodos, getTodos, getTodo, createTodo, updateTodo, destroyTodo } = require('../models/Todos');
const TodosErrors = require('../models/TodosErrors');

const expectRejection = (cb, error, done) => {
    cb().then(data => {
        done(new Error('This should never happen!'));
    })
    .catch(err => {
        try {
            expect(err).toEqual(expect.anything());
            expect(err).toHaveProperty('code', error.code);
            expect(err).toHaveProperty('message', error.message);
            done();
        }
        catch(err) {
            done(err);
        }
    });
};

describe('Todos Model', () => {
    beforeEach(() => {
        resetTodos();
    });
    describe('getTodos', () => {
        beforeEach(() => {
            resetTodos();
        });
        test('should return 3 todos each having a title', done => {
            getTodos()
                .then(todos => {
                    expect(todos).not.toEqual(null);
                    expect(todos).toBeArray();
                    expect(todos.length).toEqual(3);
                    expect(todos[1]).toHaveProperty('title', 'Learn Redux');
                    todos.forEach(todo => {
                        expect(todo).toHaveProperty('title');
                    });
                    done();
                })
                .catch(err => {
                    done(err);
                });     
        });
    });

    describe('getTodo', () => {
        test('should reject when given an invalid id', done => {
            expectRejection(() => getTodo(123), TodosErrors.notFound, done);
        });
        xtest('should return Learn Redux when given the id', done => {
            getTodo(2)
                .then(todo => {
                    expect(todo).not.toEqual(null);
                    expect(todo).toHaveProperty('title', 'Learn Redux');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('createTodo', () => {
        test('should reject when given an empty title', done => {
            expectRejection(() => createTodo({ title: '' }), TodosErrors.invalidTitle, done);
        });
        test('should return the new todo when given a valid title and default the completed status to false', done => {
            createTodo({ title: 'Learn go' })
                .then(todo => {
                    expect(todo).not.toEqual(null);
                    expect(todo).toHaveProperty('title', 'Learn go');
                    expect(todo).toHaveProperty('completed', false);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return the new todo when given a valid title and a true completed status', done => {
            createTodo({ title: 'Learn TDD', completed: true })
                .then(todo => {
                    expect(todo).not.toEqual(null);
                    expect(todo).toHaveProperty('title', 'Learn TDD');
                    expect(todo).toHaveProperty('completed', true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('updateTodo', () => {
        test('should reject when given an invalid id', done => {
            expectRejection(() => updateTodo(123, { title: 'Learn go' }), TodosErrors.notFound, done);
        });
        test('should reject when given an empty title', done => {
            expectRejection(() => updateTodo(2, { title: '' }), TodosErrors.invalidTitle, done);
        });
        test('should return the new todo when given a valid title and a true completed status', done => {
            updateTodo(2, { title: 'Learn go', completed: true })
                .then(todo => {
                    expect(todo).not.toEqual(null);
                    expect(todo).toHaveProperty('title', 'Learn go');
                    expect(todo).toHaveProperty('completed', true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('destroyTodo', () => {
        test('should reject when given an invalid id', done => {
            expectRejection(() => destroyTodo(123), TodosErrors.notFound, done);
        });
        test('should return the deleted todo when given a valid id', done => {
            destroyTodo(2)
                .then(todo => {
                    expect(todo).not.toEqual(null);
                    expect(todo).toHaveProperty('title', 'Learn Redux');
                    expect(todo).toHaveProperty('completed', true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});
