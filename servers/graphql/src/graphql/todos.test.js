const expect = require('chai').expect;
const supertest = require('supertest');
const TodosErrors = require('../models/TodosErrors');

const api = supertest('localhost:4000/graphql');

const createMutation =
`mutation createTodo($todo: TodoInput!) {
    createTodo(todo: $todo) {
        id,
        title,
        completed
    }
}`;

describe('Todos Routes', () => {
    describe('INDEX ROUTE', () => {
        const query = 
`query todos {
    todos {
        id,
        title,
        completed
    }
}`;
        it('should return a 200 response and return 3 todos each having a title', done => {
            api.post('/')
                .set('Accept', 'application/json')
                .send({ query })
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

    describe('CREATE ROUTE', () => {
        it('should return a 500 response and return an error message when given an empty title', done => {
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
        it('should return a 200 response and return the new todo when given a valid title', done => {
            const variables = { todo: { title: 'Learn TDD', completed: true } };
            const query = { query: createMutation, variables };
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
    
});
