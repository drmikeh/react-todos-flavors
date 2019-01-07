# React TODO Flavors

I have been coding a set of examples all based on the TodoMVC demo app - see: http://todomvc.com/examples/react/#/

I am developing the TodoMVC app using each of the following state management options and then comparing the results:

1. setState - just plain old built-in setState
2. React Hooks - hooks are the (new feature coming soon to React that allows you to write all React components as functions (even if they have state and/or lifecycle events)
3. MobX - allows you to mutate your state and notifies React to render as needed - I’m *not* a fan of MobX however.
4. Context API
5. Unstated - similar to the React Context API but more powerful / flexible
6. Redux
7. Redux with redux-actions
8. Apollo - works with GraphQL
9. Relay - works with GraphQL

So far I have completed the TodoMVC app using approaches 1, 2, and 3 above. I should be able to complete options 4 and 5 pretty quickly. Options 6 through 9 will take more work.

## Future Ideas

* Add testing with Jest and Enzyme
* Develop criteria for comparing flavors:
  * Separation of concerns
  * Readability
  * Testability
  * Maintainability
* Develop a TODOs server and database for all flavors
  * RESTful API
  * GraphQL API

## Observations

### setState

Nothing special here, just the vanilla `this.setState({ ... })` calls from inside JavaScript classes.

Advantages:
* baked into React
* fairly easy to use

Disadvantages:
* requires using JavaScript classes for stateful components
* difficult to separate behavior logic from view logic


### Hooks

Hooks is a new proposal planned for React v17. Hooks allows you to write *all* of your React components as functions. No need for JS classes and method binding (i.e. `this.someMethod.bind(this)`).

Advantages:
* can write *all* components using functions and a more functional style of _props in, JSX out_
* can write custom, reusable hooks, which separate out behavior logic from view logic


### Context API

The Context API makes it easier to pass props down many layers of a component tree without having to pass them down explicitly through each layer.

Advantages:
* simplifies passing props down many layers.
* built into React

Disadvantages:
* does not address communication across peers in a hierarchy.
* not very powerful or flexible
* will probably be superceded by hooks


## Unstated

TODO:


### MobX

MobX adds observers to JavaScript variables so that you can trigger code to execute when a variable is mutated.

Advantages:
* Fairly simple to learn

Disadvantages
* Seems to conflate the imperative and the functional styles of programming so that what is actually going on is not obvious to the reader
* Prefers the use of JavaScript decorators
* Must `eject` from `react-scripts` to enable JavaScript decorators
* Requires JavaScript classes

## Redux


## Redux with redux-actions


## Relay with GraphQL


## Apollo with GraphQL

