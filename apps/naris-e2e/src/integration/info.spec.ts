describe('naris overview', () => {
  it('should display info page', () => {
    cy.visit('/#!/pages/overview/info');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    //    cy.contains('sample');
  });
});
