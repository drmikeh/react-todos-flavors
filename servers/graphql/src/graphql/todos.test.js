const expect = require('chai').expect;
const supertest = require('supertest');
const TodosErrors = require('../models/TodosErrors');

const port = process.env.PORT || '4000';
const api = supertest(`localhost:${port}/graphql`);

const todosQuery =
`query todos {
    todos {
        id,
        title,
        completed
    }
}`;

const todoQuery =
`query todo($id: Int!) {
  todo(id: $id) {
    id
    title
    completed
  }
}`;

const createMutation =
`mutation createTodo($todo: TodoInput!) {
    createTodo(todo: $todo) {
        id,
        title,
        completed
    }
}`;

const updateMutation =
`mutation updateTodo($id: Int!, $todo: TodoInput!) {
  updateTodo(id: $id, todo: $todo) {
    id,
    title
    completed
  }
}`;

const destroyMutation =
`
mutation destroyTodo($id: Int!) {
    destroyTodo(id: $id) {
        id,
        title
        completed
    }
}
`;

let server;
before(next => {
    server = require('../server');
    next();
});
after(next => {
    server.close();
    next();
});

describe('Todo Queries', () => {
    describe('Todos Query', () => {
        it('should return 3 todos each having a title', done => {
            const query = { query: todosQuery };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(200)
                .then(res => {
                    const todos = res.body.data.todos;
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

    describe('Todo Query', () => {
        it('should return an error message when given an invalid id', done => {
            const variables = {
                id: 123
            };
            const query = {
                query: todoQuery,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(500)
                .then(res => {
                    const error = res.body.errors[0].message;
                    expect(error).to.equal(TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return a todo when given a valid id', done => {
            const variables = {
                id: 2
            };
            const query = {
                query: todoQuery,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(200)
                .then(res => {
                    const todo = res.body.data.todo;
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

describe('Todo Mutations', () => {
    describe('Create Todo', () => {
        it('should return an error message when given an empty title', done => {
            const variables = { todo: { title: '', completed: true } };
            const query = { query: createMutation, variables };

            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                // .expect(TodosErrors.invalidTitle.code)
                .expect(500)
                .then(res => {
                    const error = res.body.errors[0].message;
                    expect(error).to.equal(TodosErrors.invalidTitle.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return the new todo when given a valid title and default the completed status to false', done => {
            const variables = {
                todo: {
                    title: 'Learn TDD'
                }
            };
            const query = {
                query: createMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(200)
                .then(res => {
                    const todo = res.body.data.createTodo;
                    expect(todo).to.not.equal(null);
                    expect(todo).to.have.property('title').that.equals('Learn TDD');
                    expect(todo).to.have.property('completed').that.equals(false);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return the new todo when given a valid title and a true completed status', done => {
            const variables = {
                todo: {
                    title: 'Learn TDD',
                    completed: true
                }
            };
            const query = {
                query: createMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(200)
                .then(res => {
                    const todo = res.body.data.createTodo;
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

    describe('Update Todo', () => {
        it('should return an error message when given an invalid id', done => {
            const variables = {
                id: 123,
                todo: {
                    title: 'Learn go',
                    completed: true
                }
            };
            const query = {
                query: updateMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(500)
                .then(res => {
                    const error = res.body.errors[0].message;
                    expect(error).to.equal(TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return an error message when given an invalid title', done => {
            const variables = {
                id: 1,
                todo: {
                    title: ''
                }
            };
            const query = {
                query: updateMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(500)
                .then(res => {
                    const error = res.body.errors[0].message;
                    expect(error).to.equal(TodosErrors.invalidTitle.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return the new todo when given a valid title and a true completed status', done => {
            const variables = {
                id: 2,
                todo: {
                    title: 'Learn go',
                    completed: true
                }
            };
            const query = {
                query: updateMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(200)
                .then(res => {
                    const todo = res.body.data.updateTodo;
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

    describe('Destroy Todo', () => {
        it('should return an error message when given an invalid id', done => {
            const variables = {
                id: 123
            };
            const query = {
                query: destroyMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(500)
                .then(res => {
                    const error = res.body.errors[0].message;
                    expect(error).to.equal(TodosErrors.notFound.message);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
        it('should return the deleted todo when given a valid id', done => {
            const variables = {
                id: 2
            };
            const query = {
                query: destroyMutation,
                variables
            };
            api.post('/')
                .set('Accept', 'application/json')
                .send(query)
                .expect(200)
                .then(res => {
                    const todo = res.body.data.destroyTodo;
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
