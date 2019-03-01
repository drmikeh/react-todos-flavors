describe('Smoke tests', () => {
    beforeEach(() => {
        // delete all of the todos from the server
        cy.request('GET', Cypress.env('serverUrl'))
            .its('body')
            .each(todo => cy.request('DELETE', `${Cypress.env('serverUrl')}/${todo.id}`))
    })

    context('With no todos', () => {
        it('Saves new todos', () => {
            const items = [
                { text: 'Buy Milk', expectedLength: 1 },
                { text: 'Buy Eggs', expectedLength: 2 },
                { text: 'Buy Bread', expectedLength: 3 }
            ]
            cy.visit('/')
            cy.server()
            cy.route('POST', Cypress.env('serverUrl'))
                .as('create')
        
            cy.wrap(items)
                .each(todo => {
                    cy.focused()
                        .type(todo.text)
                        .type('{enter}')
        
                    cy.wait('@create')
        
                    cy.get('.todo-list li')
                        .should('have.length', todo.expectedLength)
                })
        })
    })

    context('With active todos', () => {
        beforeEach(() => {
            cy.fixture('todos').each(todo => {
                const newTodo = { ...todo, completed: false }
                cy.request('POST', Cypress.env('serverUrl'), newTodo)
            })
            cy.visit('/')
        })

        it('Loads existing data from the DB', () => {
            cy.get('.todo-list li')
                .should('have.length', 4)
        })

        it('Deletes todos', () => {
            cy.server()
            cy.route('DELETE', `${Cypress.env('serverUrl')}/*`)
                .as('delete')
      
            cy.get('.todo-list li')
                .each($el => {
                    cy.wrap($el)
                        .find('.destroy')
                        .invoke('show')
                        .click()
                    cy.wait('@delete')
                })
            .should('not.exist')
        })

        it('Toggles todos', () => {
            const clickAndWait = ($el) => {
              cy.wrap($el)
                .as('item')
                .find('.toggle')
                .click()
        
              cy.wait('@update')
            }
            cy.server()
            cy.route('PUT', `${Cypress.env('serverUrl')}/*`)
              .as('update')
        
            // test clicking to mark as completed
            cy.get('.todo-list li')
                .each($el => {
                    clickAndWait($el)
                    cy.get('@item')
                        .should('have.class', 'completed')
                })

            // test clicking to mark as not completed
            cy.get('.todo-list li')
                .each($el => {
                    clickAndWait($el)
                    cy.get('@item')
                        .should('not.have.class', 'completed')
                })
        })
    })
})