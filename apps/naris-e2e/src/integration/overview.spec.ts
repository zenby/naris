describe('naris overview', () => {
  it('should contain latest videos', () => {
    cy.intercept('GET', '**/*.svg').as('signIn');

    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.visit('/#!/pages/overview/latest');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('.ant-card').its('length').should('equal', 4);
    cy.contains('sample');
  });
});
