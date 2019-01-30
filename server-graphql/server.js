const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./schema');
const rootReducer = require('./root-reducer');

// Create an express server and a GraphQL endpoint
const app = express();

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: rootReducer,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
