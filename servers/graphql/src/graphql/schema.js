const { buildSchema } = require('graphql');

/**
 * GraphQL schema
 * 
 * TODOs:
 *   - filter Query based on completed status
 *   - destroyCompleted
 *   
 */

const schema = buildSchema(`
    "All of the queries go here."
    type Query {
        "Just a simple greeting message."
        message: String!
        
        "A list of todos."
        todos: [Todo!]!

        "A single todo."
        todo(id: Int!): Todo!
    }
    
    "All of the mutations go here."
    type Mutation {
        "Create a new Todo."
        createTodo(todo: TodoInput!): Todo!
        
        "Update an existing Todo."
        updateTodo(id: Int!, todo: TodoInput!): Todo!
        
        "Remove a Todo from the system."
        destroyTodo(id: Int!): Todo!
    }
    
    "A Todo is a thing to do."
    type Todo {
        "The internal identifier of a Todo."
        id: Int

        "The title for the Todo"
        title: String

        "True of the Todo has been completed."
        completed: Boolean
    }

    "A Todo without an identifier (cause it hasn't been created yet)."
    input TodoInput {
        "The title for the Todo"
        title: String

        "True of the Todo has been completed."
        completed: Boolean
    }
`);

module.exports = schema;
