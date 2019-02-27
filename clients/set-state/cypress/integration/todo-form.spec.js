describe('Todo Form', () => {
    beforeEach(() => {
        console.log('HERE')
        cy.seedAndVisit()
    })

    it('focuses input on load', () => {
        cy.focused()
            .should('have.class', 'new-todo')
    })

    it('accepts input', () => {
        const newTodoTitle = 'Buy Milk'
        cy.get('.new-todo')
            .type(newTodoTitle)
            .should('have.value', newTodoTitle)
    })

    context('Form submission', () => {
        it('Adds a new todo on submit', () => {
            cy.get('.todo-list li')
                .should('have.length', 4)
            const itemText = 'Buy Vanilla Extract'
            cy.route('POST', Cypress.env('serverUrl'), {
                id: 1,
                title: itemText,
                completed: false
            })
  
            cy.get('.new-todo')
              .type(itemText)
              .type('{enter}')
              .should('have.value', '')

            cy.get('.todo-list li')
                .should('have.length', 5)
                .and('contain', itemText)
        })
    })
})
