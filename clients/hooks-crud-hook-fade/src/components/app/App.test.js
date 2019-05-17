import React from 'react'
import { Simulate } from 'react-dom/test-utils'
import { cleanup, render, waitForElement, wait } from 'react-testing-library'
import mockAxios from 'axios'
import App from './App'

// const scheduler = typeof setImmedate === 'function' ? setImmediate : setTimeout
// function flushResolvedPromises(millis = 0) {
//     if (millis > 0) {
//         return new Promise(res => setTimeout(res, millis) )
//     }
//     else {
//         return new Promise(res => scheduler(res))
//     }
// }

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

beforeEach(() => {
})

afterEach(cleanup)

function verifyTodo(label, expectedTitle, expectedCompleted) {
    expect(label).toBeTruthy()
    expect(label.innerHTML).toEqual(expectedTitle)
    const checkbox = label.parentNode.querySelector('input[type="checkbox"]')
    expect(checkbox).toHaveProperty('checked', expectedCompleted)
}

describe('React Todos App with Set State', () => {
    it('renders todos title', async () => {
        const { container, getByText } = render(<App />)
        expect(container).toBeTruthy()
        await waitForElement(() => getByText('todos'))
        const todosHeader = container.querySelector('header h1')
        expect(todosHeader).toBeTruthy()
        expect(todosHeader).toHaveTextContent('todos')
    })

    it('renders 3 todos', async () => {
        const { getByText } = render(<App />)
        await waitForElement(() => getByText('Learn Redux'))
        const todoList = document.querySelector('ul')
        expect(todoList.childElementCount).toEqual(3)
        mockData.forEach( item => {
            verifyTodo(getByText(item.title), item.title, item.completed)
        })
    })

    it("can update an existing todo's title", async () => {
        const { getByText, getByTestId } = render(<App />)

        // wait for data to load
        const learnReduxLabel = await waitForElement(() => getByText('Learn Redux'))
        expect(learnReduxLabel).toBeTruthy()
        Simulate.doubleClick(learnReduxLabel)
        const titleInput = getByTestId(`title-input-${2}`)
        expect(titleInput).toBeTruthy()
        
        const newTitle = 'Learn Go'
        titleInput.value = newTitle
        Simulate.change(titleInput)
        // Simulate.keyDown(titleInput, { keyCode: 13 })  // Enter key
        // fireEvent.blur(titleInput)

        // test that the editing worked
        verifyTodo(getByText(newTitle), newTitle, true)

        // test that we have our saved todo from the server
        const learnGo = await waitForElement(() => getByText(newTitle))
        verifyTodo(learnGo, newTitle, true)
    })

    it("can toggle an existing todo's completed status", async () => {
        const { getByText, getByTestId } = render(<App />)

        // wait for data to load
        const learnReduxLabel = await waitForElement(() => getByText('Learn Redux'))
        verifyTodo(learnReduxLabel, 'Learn Redux', true)
        const checkBox = getByTestId(`toggle-button-${2}`)
        expect(checkBox).toBeTruthy()
        expect(checkBox.checked).toBeTruthy()

        // Simulate.click(checkBox)  // click is not working!

        // either of the following will work
        // fireEvent.click(checkBox)
        Simulate.change(checkBox, { target: { checked: false } })
        await wait(() => expect(checkBox.checked).toBeFalsy())

        // test that we have our saved todo from the server
        const learnRedux = await waitForElement(() => getByText('Learn Redux'))
        verifyTodo(learnRedux, 'Learn Redux', false)        
    })

    it('can create a new todo', async () => {
        const { getByText, getByTestId, getByPlaceholderText } = render(<App />)

        // wait for data to load
        await waitForElement(() => getByText('Learn React'))
        const todoList = document.querySelector('ul')
        expect(todoList.childElementCount).toEqual(3)

        const newTodoForm = getByTestId('new-todo-form')
        expect(newTodoForm).toBeTruthy()
        
        // const newTodoFormInput = newTodoForm.querySelector('input')
        const newTodoFormInput = getByPlaceholderText('What needs to be done?')
        expect(newTodoFormInput).toBeTruthy()

        const newTodoTitle = 'Learn React Testing Library'

        // Simulate.change(newTodoFormInput, { target: { value: newTodoTitle } })
        newTodoFormInput.value = newTodoTitle
        Simulate.change(newTodoFormInput)
        expect(newTodoFormInput.value).toBe(newTodoTitle)

        // fireEvent.keyDown(newTodoFormInput, {
        //     key: 'Enter',
        //     keyCode: 13,
        //     which: 13
        // })
        // newTodoForm.submit()
        Simulate.submit(newTodoForm)

        await waitForElement(() => getByText(newTodoTitle))
        expect(todoList.childElementCount).toEqual(4)
        expect(newTodoFormInput.value).toBe('')
    })

    it('can delete a todo', async () => {
        const { getByText, getByTestId } = render(<App />)
        
        // wait for data to load
        const learnReduxLabel = await waitForElement(() => getByText('Learn Redux'))
        expect(learnReduxLabel).toBeTruthy()
        verifyTodo(learnReduxLabel, 'Learn Redux', true)

        const deleteButton = getByTestId(`delete-button-${2}`)
        expect(deleteButton).toBeTruthy()

        // Simulate.change(checkBox, { target: { checked: false } })
        Simulate.click(deleteButton)
        const todoList = document.querySelector('ul')
        await wait(() => expect(todoList.childElementCount).toEqual(2))
    })
})
