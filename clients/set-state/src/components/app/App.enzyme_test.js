import React from 'react';
import { mount } from 'enzyme';
// import { expect } from 'chai';
import mockAxios from 'axios';
import App from './App';
import TodoApp from '../todos/TodoApp';
import Todo from '../todos/Todo';

const mockData = [
    {
        id: 1,
        title: "Learn React",
        completed: true
      },
      {
        id: 2,
        title: "Learn Redux",
        completed: true
      },
      {
        id: 3,
        title: "Learn GraphQL",
        completed: false
      }
]

beforeAll(() => {
    mockAxios.get.mockImplementation(() => {
        // console.log('GET')
        return Promise.resolve({ data: mockData })
    })
    mockAxios.put.mockImplementation((url, data) => {
        // console.log('PUT:', url, data)
        return Promise.resolve({ data })
    })
    mockAxios.post.mockImplementation((url, data) => {
        // console.log('POST:', url, data)
        return Promise.resolve({ data: { id: 100, ...data } })
    })
    mockAxios.delete.mockImplementation((url, data) => {
        const id = url.slice(1)
        const deletedTodo = mockData.find( t => t.id === Number(id))
        // console.log('DELETE:', deletedTodo)
        return Promise.resolve({ data: deletedTodo })
    })
})

let wrapper = null;

async function mountApp() {
    if (wrapper) {
        // console.log('unmounting wrapper');
        wrapper.unmount();
    }
    wrapper = mount(<App />);
    // console.log('wrapper is mounted');
    const promise = await flushPromises();
    wrapper.update(); // waits for TodoApp's componentDidMount to call setState
    return promise;
}

// const asyncFlush = (delay = 100) => new Promise(resolve => setTimeout(resolve, delay));

const scheduler = typeof setImmedate === 'function' ? setImmediate : setTimeout
function flushPromises(millis = 0) {
    if (millis > 0) {
        return new Promise(res => setTimeout(res, millis) )
    }
    else {
        return new Promise(res => scheduler(res))
    }
}

beforeEach(async () => {
    await mountApp();
});

function verifyTodo(wrapper, expectedTitle, expectedCompleted) {
    expect(wrapper.text()).toBe(expectedTitle);
    expect(wrapper.prop('todo').title).toBe(expectedTitle);
    expect(wrapper.prop('todo').completed).toBe(expectedCompleted);
    expect(wrapper.childAt(0).hasClass('completed')).toBe(expectedCompleted);
}

describe('React Todos App with Set State', () => {
    it('renders without crashing', () => {
        // nothing to do here as the `beforeEach` is mounting the component for us.
    });

    it('renders todos title', () => {
      expect(wrapper.find('h1').text()).toBe('todos');
    });

    it('renders 3 todos', () => {    
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(resolve => {
            expect(wrapper.find(Todo).length).toBe(3);

            // console.log(learnReact.debug());
            verifyTodo(wrapper.find(Todo).at(0), 'Learn React', true);
            verifyTodo(wrapper.find(Todo).at(1), 'Learn Redux', true);
            verifyTodo(wrapper.find(Todo).at(2), 'Learn GraphQL', false);

            resolve('all done');
        });
    });

    it("can update an existing todo's title", async done => {
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        /*
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).toBe(3);
            const todoApp = wrapper.find(TodoApp);
            todoApp.instance().onUpdateTitle(2, 'Learn Go')
                .then(async () => {
                    // we must remount the component because Enzyme wrappers are immutable, but this wipes our state :-(
                    // mountApp();
                    await flushPromises(100);
                    wrapper.update();
                    console.log(wrapper.debug())
                    verifyTodo(wrapper.find(Todo).at(1), 'Learn Go', true);
                    resolve('all done');
            });
        });
        */
        
       const todoApp = wrapper.find(TodoApp);
       todoApp.instance().onUpdateTitle(2, 'Learn Go')
       await flushPromises(300);
       wrapper.update();
       const targetTodo = wrapper.find(Todo).at(1);
       verifyTodo(targetTodo, 'Learn Go', true);
       done();
    });

    it("can toggle an existing todo's completed status", async done => {
        await mountApp();
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        /*
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).toBe(3);
            const todoApp = wrapper.find(TodoApp);
            todoApp.instance().onToggleCompleted(2)
                .then(async () => {
                    // we must remount the component because Enzyme wrappers are immutable, but this wipes our state :-(
                    // mountApp();
                    await flushPromises(100);
                    wrapper.update();
                    verifyTodo(wrapper.find(Todo).at(1), 'Learn Redux', false);
                    resolve('all done');
                });
        });
        */
        
        // I cannot get click event to work
        // const toggleButton = wrapper.find('[data-testid="toggle-button-1"]');
        // toggleButton.simulate('click');
        
        const todoApp = wrapper.find(TodoApp);
        todoApp.instance().onToggleCompleted(2)
        await flushPromises(300);
        wrapper.update();
        const targetTodo = wrapper.find(Todo).at(1);
        verifyTodo(targetTodo, 'Learn Redux', false);
        done();
    });
            
    it('can create a new todo', () => {
        // We need jest to wait until the axios data arrives, so we return a Promise that
        // is resolved after the data arrives.
        return new Promise(async (resolve, reject) => {
            expect(wrapper.find(Todo).length).toBe(3);
            const todoApp = wrapper.find(TodoApp);
            todoApp.instance().onAdd('Groceries')
            .then(() => {
                // mountApp();   // here remounting causes this test to fail, I don't know why!
                wrapper.update();
                expect(wrapper.find(Todo).length).toBe(4);
                verifyTodo(wrapper.find(Todo).at(3), 'Groceries', false);
                resolve('all done');
            });
        });
    });
});
