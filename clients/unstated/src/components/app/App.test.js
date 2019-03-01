import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import App from './App';
import TodoApp from '../todos/TodoApp';
import Todo from '../todos/Todo';
import TodoService from '../../services/TodoService';

async function mountApp() {
    if (wrapper) {
        wrapper.unmount();
    }
    wrapper = mount(<App />);
    const promise = await asyncFlush();
    wrapper.update(); // waits for TodoApp's componentDidMount to call setState
    return promise;
}

const DELAY_MILLIS = 100;
const asyncFlush = (delay = DELAY_MILLIS) => new Promise(resolve => setTimeout(resolve, delay));

let wrapper = null;

beforeEach(async () => {
    await TodoService.reset(); // reset the server's list of todos
    await mountApp();
});

function verifyTodo(wrapper, expectedTitle, expectedCompleted) {
    expect(wrapper.text()).to.equal(expectedTitle);
    expect(wrapper.prop('todo').title).to.equal(expectedTitle);
    expect(wrapper.prop('todo').completed).to.equal(expectedCompleted);
    expect(wrapper.childAt(0).hasClass('completed')).to.equal(expectedCompleted);
}

describe('React Todos App with Set State', () => {
    it('renders without crashing', () => {
        // nothing to do here as the `beforeEach` is mounting the component for us.    
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

    it("can update an existing todo's title", () => {
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).to.equal(3);
            wrapper.render();
            const todoApp = wrapper.find(TodoApp);
            // console.log('wrapper:', wrapper.debug());
            expect(todoApp).to.not.be.null();
            todoApp.instance().onUpdateTitle(2, 'Learn Go')
            .then(async () => {
                mountApp();   // we must remount the component because Enzyme wrappers are immutable.
                await asyncFlush();
                wrapper.update();
                verifyTodo(wrapper.find(Todo).at(1), 'Learn Go', true);
                resolve('all done');
            });
        });
    });

    it("can toggle an existing todo's completed status", () => {
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).to.equal(3);
            const todoApp = wrapper.find(TodoApp);
            expect(todoApp).to.not.be.null();
            todoApp.instance().onToggleCompleted(2)
                .then(async () => {
                    mountApp(); // we must remount the component because Enzyme wrappers are immutable.
                    await asyncFlush();
                    wrapper.update();
                    verifyTodo(wrapper.find(Todo).at(1), 'Learn Redux', false);
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
            expect(todoApp).to.not.be.null();
            todoApp.instance().onAdd('Groceries')
            .then(() => {
                // mountApp();   // here remounting causes this test to fail, I don't know why!
                wrapper.update();
                expect(wrapper.find(Todo).length).to.equal(4);
                verifyTodo(wrapper.find(Todo).at(3), 'Groceries', false);
                resolve('all done');
            });
        });
    });
});
