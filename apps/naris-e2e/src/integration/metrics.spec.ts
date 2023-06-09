describe('naris metrics', () => {
  it('should successfully navigate to metrics page', () => {
    cy.intercept('GET', '**/*.svg').as('signIn');

    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.visit('/#!/pages/overview/info');

    cy.get('a[href="#!/pages/overview/metrics"').should('not.have.attr', 'disabled');
    cy.get('a[href="#!/pages/overview/metrics"').click();
    cy.get('a[href="#!/pages/overview/metrics"').should('have.attr', 'disabled');

    cy.location().should((location) => expect(location.href).to.include('/pages/overview/metrics'));
  });
});
