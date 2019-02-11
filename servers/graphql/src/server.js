const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./graphql/schema');
const rootReducer = require('./graphql/root-reducer');

// Create an express server and a GraphQL endpoint
const app = express();

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: rootReducer,
    graphiql: true
}));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Express GraphQL Server Now Running On localhost:${port}/graphql`)
});

const close = () => {
  console.log("Shutting down server");
  server.close();
}

module.exports = {
  close
};
