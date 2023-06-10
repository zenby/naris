describe('naris overview', () => {
  it('should display info page', () => {
    cy.visit('/#!/pages/overview/info');
    cy.login('user', 'user');
    cy.get('a[title="Информация"]').should('have.attr', 'disabled', 'disabled');

    cy.get('div.contact_text').each(($el) => {
      cy.wrap($el).should('be.visible').click();
    });

    cy.get('div.social_text').each(($el) => {
      cy.wrap($el).should('be.visible').click();
    });
  });
});
