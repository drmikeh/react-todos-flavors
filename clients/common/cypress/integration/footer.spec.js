describe('Footer', () => {
    context('with a single todo', () => {
        it('displays a singular todo in count', () => {
            cy.seedAndVisit([ { id: 1, title: 'Buy Milk', completed: false } ])
            cy.get('.todo-count')
                .should('contain', '1 item left')
        })
    })

    context('with multiple todos', () => {
        beforeEach(() => {
            cy.seedAndVisit()
        })

        it('displays plural todos in count', () => {
            cy.get('.todo-count')
                .should('contain', '3 items left')
        })

        it('Handles filter links', () => {
            const filters = [
                { link: 'Active', expectedLength: 3 },
                { link: 'Completed', expectedLength: 1 },
                { link: 'All', expectedLength: 4 }
            ]
            cy.wrap(filters)
                .each(filter => {
                    cy.contains(filter.link)
                        .click()
                    cy.get('.todo-list li')
                        .should('have.length', filter.expectedLength)
                })
        })
    })
})