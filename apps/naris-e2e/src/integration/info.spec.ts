describe('naris overview', () => {
  it('should display info page', () => {
    cy.visit('/#!/pages/overview/info');
    cy.login('user', 'user');
    cy.get('a[title="Информация"]').should('have.attr', 'disabled', 'disabled');
  });
});
