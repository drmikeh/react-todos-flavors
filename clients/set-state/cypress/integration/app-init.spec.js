describe('App initialization', () => {
    it('Loads todos on page load', () => {
        cy.seedAndVisit()
        cy.get('.todo-list li')
            .should('have.length', 4)
            .and('contain', 'Buy Milk')
            .and('contain', 'Buy Eggs')
            .and('contain', 'Buy Bread')
            .and('contain', 'Make French Toast')
    })

    it('Displays an error on failure', () => {
        cy.server()
        cy.route({
            url: Cypress.env('serverUrl'),
            method: 'GET',
            status: 500,
            response: {}
        })
        cy.visit('/')
        cy.get('.todo-list li')
            .should('not.exist')
        cy.get('.toast-error')
            .should('be.visible')
    })
})