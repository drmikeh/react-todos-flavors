require('jest-extended');
const supertest = require('supertest');
const TodosErrors = require('../models/TodosErrors');

const port = process.env.PORT || '3000';
const api = supertest(`localhost:${port}/api/todos`);

describe('Todos Routes', () => {

    let server;
    beforeAll(next => {
        server = require('../bin/www');
        next();
    });
    afterAll(next => {
        server.close();
        next();
    });

    describe('INDEX ROUTE', () => {
        test('should return a 200 response and return 3 todos each having a title', done => {
            api.get('/')
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const todos = res.body;
                    expect(todos).not.toBeNull();
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

    describe('SHOW ROUTE', () => {
        test('should return a 404 response when given an invalid id', done => {
            api.get('/123')
                .set('Accept', 'application/json')
                .expect(TodosErrors.notFound.code)
                .then(res => {
                    const error = res.body;
                    expect(error).not.toBeNull();
                    expect(error).toHaveProperty('message', TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return a 200 response and return Learn Redux when given the proper id', done => {
            api.get('/2')
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const todo = res.body;
                    expect(todo).not.toBeNull();
                    expect(todo).toHaveProperty('title', 'Learn Redux');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('CREATE ROUTE', () => {
        test('should return a 422 response and return an error message when given an empty title', done => {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    title: ''
                })
                .expect(TodosErrors.invalidTitle.code)
                .then(res => {
                    const error = res.body;
                    expect(error).toHaveProperty('message', TodosErrors.invalidTitle.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return the new todo when given a valid title and default the completed status to false', done => {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn TDD'
                })
                .expect(201)
                .then(res => {
                    const todo = res.body;
                    expect(todo).not.toBeNull();
                    expect(todo).toHaveProperty('title', 'Learn TDD');
                    expect(todo).toHaveProperty('completed', false);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return the new todo when given a valid title and a completed status of true', done => {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn TDD',
                    completed: true
                })
                .expect(201)
                .then(res => {
                    const todo = res.body;
                    expect(todo).not.toBeNull();
                    expect(todo).toHaveProperty('title', 'Learn TDD');
                    expect(todo).toHaveProperty('completed', true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('UPDATE ROUTE', () => {
        test('should return a 404 response and when given an invalid id', done => {
            api.put('/123')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn go',
                    completed: false
                })
                .expect(TodosErrors.notFound.code)
                .then(res => {
                    const error = res.body;
                    expect(error).not.toBeNull();
                    expect(error).toHaveProperty('message', TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return a 422 response and return an error message when given an empty title', done => {
            api.put('/2')
                .set('Accept', 'application/json')
                .send({
                    title: '',
                    completed: true
                })
                .expect(TodosErrors.invalidTitle.code)
                .then(res => {
                    const error = res.body;
                    expect(error).toHaveProperty('message', TodosErrors.invalidTitle.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return a 200 response and return the updated todo when given a valid title', done => {
            api.put('/2')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn go',
                    completed: true
                })
                .expect(200)
                .then(res => {
                    const todo = res.body;
                    expect(todo).not.toBeNull();
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
        test('should return a 404 response when given an invalid id', done => {
            api.delete('/123')
                .set('Accept', 'application/json')
                .expect(TodosErrors.notFound.code)
                .then(res => {
                    const error = res.body;
                    expect(error).not.toBeNull();
                    expect(error).toHaveProperty('message', TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        test('should return the deleted todo when given a valid id', done => {
            api.delete('/3')
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const todo = res.body;
                    expect(todo).not.toBeNull();
                    expect(todo).toHaveProperty('title', 'Learn GraphQL');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});
