# React TODO Flavors

Here are the planned flavors:

## setState

Nothing special here, just the vanilla `this.setState({ ... })` calls from inside JavaScript classes.

Advantages:
* baked into React
* fairly easy to use

Disadvantages:
* requires using JavaScript classes for stateful components
* difficult to separate behavior logic from view logic

## Hooks

Hooks is a new proposal planned for React v17. Hooks allows you to write *all* of your React components as functions. No need for JS classes and method binding (i.e. `this.someMethod.bind(this)`).

Advantages:
* can write *all* components using functions and a more functional style of _props in, JSX out_
* can write custom, reusable hooks, which separate out behavior logic from view logic

## Context API

The Context API makes it easier to pass props down many layers of a component tree without having to pass them down explicitly through each layer.

Advantages:
* simplifies passing props down many layers.
* built into React

Disadvantages:
* does not address communication across peers in a hierarchy.
* not very powerful or flexible
* will probably be superceded by hooks

## MobX

MobX adds observers to JavaScript variables so that you can trigger code to execute when a variable is mutated.

Advantages:
* Fairly simple to learn

Disadvantages
* Seems to conflate the imperative and the functional styles of programming so that what is actually going on is not obvious to the reader
* Prefers the use of JavaScript decorators
* Must `eject` from `react-scripts` to enable JavaScript decorators
* Requires JavaScript classes


## Unstated



* Redux
* Redux with redux-actions

What about:

* Relay?
* 