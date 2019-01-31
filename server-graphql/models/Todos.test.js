const expect = require('chai').expect;
const { resetTodos, getTodos, getTodo, createTodo, updateTodo, destroyTodo } = require('../models/Todos');

const expectRejection = (cb, done) => {
    cb().then(data => {
        done(new Error('This should never happen!'));
    })
    .catch(err => {
        expect(err).instanceOf(Error);
        done();
    });
};

describe('Todos Model', () => {
    beforeEach('Reseting todos data', () => {
        resetTodos();
    });
    describe('getTodos', () => {
        beforeEach('Reseting todos data', () => {
            resetTodos();
        });
        it('should return 3 todos each having a title', done => {
            getTodos()
                .then(todos => {
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

    describe('getTodo', () => {
        it('should reject when given an invalid id', done => {
            expectRejection(() => getTodo(123), done);
        });
        it('should return Learn Redux when given the id', done => {
            getTodo(2)
                .then(todo => {
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn Redux');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('createTodo', () => {
        it('should reject when given an empty title', done => {
            expectRejection(() => createTodo({ title: '' }), done);
        });
        it('should return the new todo when given a valid title and default the completed status to false', done => {
            createTodo({ title: 'Learn go' })
                .then(todo => {
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn go');
                    expect(todo).to.have.property('completed').that.equals(false);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return the new todo when given a valid title and a true completed status', done => {
            createTodo({ title: 'Learn TDD', completed: true })
                .then(todo => {
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

    describe('updateTodo', () => {
        it('should reject when given an invalid id', done => {
            expectRejection(() => updateTodo(123, { title: '' }), done);
        });
        it('should reject when given an empty title', done => {
            expectRejection(() => updateTodo(2, { title: '' }), done);
        });
        it('should return the new todo when given a valid title and a true completed status', done => {
            updateTodo(2, { title: 'Learn go', completed: true })
                .then(todo => {
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

    describe('destroyTodo', () => {
        it('should reject when given an invalid id', done => {
            expectRejection(() => destroyTodo(123), done);
        });
        it('should return the deleted todo when given a valid id', done => {
            destroyTodo(2)
                .then(todo => {
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn Redux');
                    expect(todo).to.have.property('completed').that.equals(true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});
