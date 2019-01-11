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
* Add a "Loading..." indicator for all flavors
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

### Advantages

* baked into React
* fairly easy to use

### Disadvantages

* requires using JavaScript classes for stateful components
* difficult to separate behavior logic from view logic


### Hooks

Hooks is a new proposal planned for React v17. Hooks allows you to write *all* of your React components as functions. No need for JS classes and method binding (i.e. `this.someMethod.bind(this)`).

### Advantages

* can write *all* components using functions and a more functional style of _props in, JSX out_
* can write custom, reusable hooks, which separate out behavior logic from view logic

### Disadvantages

* React hooks are still a proposal


## Context API

### How It Works

The Context API makes it easier to pass props down many layers of a component tree without having to pass them down explicitly through each layer.

### Advantages

* simplifies passing props down many layers.
* built into React

### Disadvantages

* does not address communication across peers in a hierarchy.
* not very powerful or flexible
* will probably be superceded by hooks


## Unstated

### How it works

* You code `Containers` that have state but no rendering. 
* Containers are injected into your rendering components via a `Subscribe`.
  - you inject what containers you need where you need them.
  - you can inject as many `Containers` as you want into your rendering components.

### Links

* [GitHub](https://github.com/jamiebuilds/unstated)
* [Easy State Management in React Using Unstated](https://alligator.io/react/unstated/)
* [unstated — The setState of React State Management](https://medium.com/react-native-training/unstated-the-setstate-of-react-state-management-8ce47b240e6d)

### Advantages

* Lightweight but powerful
* Similar to React's Context API but more flexible
* Easy separation of state and rendering
  - behavior: JS Classes
  - rendering: JS function components

### Disadvantages

* ???


### MobX

### How It Works

MobX adds observers to JavaScript variables so that you can trigger code to execute when a variable is mutated.

### Advantages

* Fairly simple to learn

### Disadvantages

* Seems to conflate the imperative and the functional styles of programming so that what is actually going on is not obvious to the reader
* Prefers the use of JavaScript decorators
* Must `eject` from `react-scripts` to enable JavaScript decorators
* Requires JavaScript classes


## Redux

### How It Works

### Advantages

* Very popular
* Scales well for larger applications

### Disadvantages

* Steep learning curve
* Lots of boilerplate / moving parts
* Does not directly support async state updates


### Links

* [Twitter: React Thought Leaders are now hating on Redux](https://twitter.com/jevakallio/status/962996195420405760?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E962996195420405760&ref_url=https%3A%2F%2Fmedium.com%2Fmedia%2F1e0a879970d83cc49906873d200f229e%3FpostId%3D8ce47b240e6d)


## Redux with redux-actions


## Apollo with GraphQL


## Relay with GraphQL

