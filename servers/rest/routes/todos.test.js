const expect = require('chai').expect;
const supertest = require('supertest');
const TodosErrors = require('../models/TodosErrors');

const api = supertest('localhost:3004/todos');

describe('Todos Routes', () => {
    describe('INDEX ROUTE', () => {
        it('should return a 200 response and return 3 todos each having a title', done => {
            api.get('/')
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const todos = res.body;
                    expect(todos).to.not.equal(null);
                    expect(todos).to.be.instanceof(Array);
                    expect(todos.length).to.equal(3);
                    expect(todos[1]).to.have.property('title').that.equals('Learn Redux');
                    todos.forEach(todo => {
                        expect(todo).to.have.property('title');
                    });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('SHOW ROUTE', () => {
        it('should return a 404 response and when given an invalid id', done => {
            api.get('/123')
                .set('Accept', 'application/json')
                .expect(TodosErrors.notFound.code)
                .then(res => {
                    const error = res.body;
                    expect(error).to.not.equal(null);
                    expect(error).to.have.property('message').that.equals(TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return a 200 response and return Learn Redux when given the proper id', done => {
            api.get('/2')
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const todo = res.body;
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn Redux');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('CREATE ROUTE', () => {
        it('should return a 422 response and return an error message when given an empty title', done => {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    title: ''
                })
                .expect(TodosErrors.invalidTitle.code)
                .then(res => {
                    const error = res.body;
                    expect(error).to.have.property('message').that.equals(TodosErrors.invalidTitle.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return a 201 response and return the new todo when given a valid title', done => {
            api.post('/')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn TDD',
                    completed: true
                })
                .expect(201)
                .then(res => {
                    const todo = res.body;
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn TDD');
                    expect(todo).to.have.property('completed').that.equals(true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('UPDATE ROUTE', () => {
        it('should return a 404 response and when given an invalid id', done => {
            api.put('/123')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn go',
                    completed: false
                })
                .expect(TodosErrors.notFound.code)
                .then(res => {
                    const error = res.body;
                    expect(error).to.not.equal(null);
                    expect(error).to.have.property('message').that.equals(TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return a 422 response and return an error message when given an empty title', done => {
            api.put('/2')
                .set('Accept', 'application/json')
                .send({
                    title: '',
                    completed: true
                })
                .expect(TodosErrors.invalidTitle.code)
                .then(res => {
                    const error = res.body;
                    expect(error).to.have.property('message').that.equals(TodosErrors.invalidTitle.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return a 200 response and return the updated todo when given a valid title', done => {
            api.put('/2')
                .set('Accept', 'application/json')
                .send({
                    title: 'Learn go',
                    completed: true
                })
                .expect(200)
                .then(res => {
                    const todo = res.body;
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn go');
                    expect(todo).to.have.property('completed').that.equals(true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});
