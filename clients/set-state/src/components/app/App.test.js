import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import App from './App';
import TodoApp from '../todos/TodoApp';
import Todo from '../todos/Todo';
import TodosFetcher from '../../TodosFetcher';

function mountApp() {
    return ( mount(<App />) );
}

const DELAY_MILLIS = 50;
const asyncFlush = (delay = DELAY_MILLIS) => new Promise(resolve => setTimeout(resolve, delay));

let wrapper = null;

beforeEach(async () => {
    TodosFetcher.reset();
    await asyncFlush();
    wrapper = mountApp();
    await asyncFlush();
    wrapper.update();
});

function verifyTodo(wrapper, expectedTitle, expectedCompleted) {
    expect(wrapper.text()).to.equal(expectedTitle);
    expect(wrapper.prop('todo').title).to.equal(expectedTitle);
    expect(wrapper.prop('todo').completed).to.equal(expectedCompleted);
    expect(wrapper.childAt(0).hasClass('completed')).to.equal(expectedCompleted);
}

describe('React Todos App with Set State', () => {
    it('renders without crashing', () => {
      mountApp();
    });

    it('renders todos title', () => {
      expect(wrapper.find('h1').text()).to.equal('todos');
    });

    it('renders 3 todos', () => {    
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(resolve => {
            expect(wrapper.find(Todo).length).to.equal(3);

            // console.log(learnReact.debug());
            verifyTodo(wrapper.find(Todo).at(0), 'Learn React', true);
            verifyTodo(wrapper.find(Todo).at(1), 'Learn Redux', true);
            verifyTodo(wrapper.find(Todo).at(2), 'Learn GraphQL', false);

            resolve('all done');
        });
    });

    it('can update an existing todo', () => {
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).to.equal(3);
            const todoApp = wrapper.find(TodoApp);
            todoApp.instance().onUpdateTitle(2, 'Learn Go')
            .then(async () => {
                wrapper = mountApp();
                await asyncFlush();
                wrapper.update();
                verifyTodo(wrapper.find(Todo).at(1), 'Learn Go', true);
                resolve('all done');
            });
        });
    });
            
    it('can create a new todo', () => {
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).to.equal(3);
            const todoApp = wrapper.find(TodoApp);
            todoApp.instance().onAdd('Groceries')
            .then(() => {
                wrapper.update();
                expect(wrapper.find(Todo).length).to.equal(4);
                verifyTodo(wrapper.find(Todo).at(3), 'Groceries', false);
                resolve('all done');
            });
        });
    });
});
