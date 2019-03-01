describe('List items', () => {
    beforeEach(() => {
        cy.seedAndVisit()
    })
    
    it('Properly displays completed items', () => {
        cy.get('.todo-list li')
            .filter('.completed')
            .should('have.length', 1)
            .and('contain', 'Buy Eggs')
            .find('.toggle')
            .should('be.checked')
    })
    
    it('Shows remaining todos in the footer', () => {
        cy.get('.todo-count')
            .should('contain', 3)
    })

    it('Removes a todo', () => {
        cy.route({
            url: `${Cypress.env('serverUrl')}/1`,
            method: 'DELETE',
            status: 200,
            response: {}
        })
        cy.get('.todo-list li')
            .first()
            .find('.destroy')
            .invoke('show')
            .click()
        cy.get('.todo-list li')
            .should('have.length', 3)
            .and('not.contain', 'Milk')
    })

    it('Marks an incomplete item as complete', () => {
        // let's modify our fixture data
        cy.fixture('todos')
            .then(todos => {
                const target = todos[0]
                cy.route(
                    'PUT',
                    `${Cypress.env('serverUrl')}/${target.id}`,
                    {...target, completed: true }
                )
            })
        cy.get('.todo-list li')
            .first()
            .as('first-todo')
        cy.get('@first-todo')
            .find('.toggle')
            .click()
            .should('be.checked')
        cy.get('@first-todo')
            .should('have.class', 'completed')
        cy.get('.todo-count')
            .should('contain', 2)
    })
})