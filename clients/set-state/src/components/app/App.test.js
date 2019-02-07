import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import App from './App';
import Todo from '../todos/Todo';

it('renders without crashing', () => {
  mount(<App />);
});

it('renders todos title', () => {
  const wrapper = mount( <App /> );
  expect(wrapper.find('h1').text()).to.equal('todos');
});

it('renders 3 todos', () => {
  const wrapper = mount( <App /> );
  
  // We need jest to wait until the axios data arrives, so we return a Promise that
  // isn't resolved until after 500ms. It's a hack but I could not find a better way
  // to do an integration test.
  return new Promise((resolve, reject) => {    
    setTimeout(() => {
      function verifyTodo(wrapper, expectedTitle, expectedCompleted) {
        expect(wrapper.text()).to.equal(expectedTitle);
        expect(wrapper.prop('todo').title).to.equal(expectedTitle);
        expect(wrapper.prop('todo').completed).to.equal(expectedCompleted);
        expect(wrapper.childAt(0).hasClass('completed')).to.equal(expectedCompleted);
      }
      wrapper.update();
      expect(wrapper.find(Todo).length).to.equal(3);

      // console.log(learnReact.debug());
      verifyTodo(wrapper.find(Todo).at(0), 'Learn React', true);
      verifyTodo(wrapper.find(Todo).at(1), 'Learn Redux', true);
      verifyTodo(wrapper.find(Todo).at(2), 'Learn GraphQL', false);

      resolve('all done');
    }, 1000);
  });
});
