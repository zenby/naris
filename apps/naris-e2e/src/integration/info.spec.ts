/* eslint-disable cypress/no-unnecessary-waiting */
describe('naris overview', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it('should display info page', () => {
    cy.visit('/#!/pages/overview/info');
    cy.get('[data-cy="Информация"]').should('have.attr', 'disabled', 'disabled');

    cy.get('div.contact_text').each(($el) => {
      cy.wrap($el).should('be.visible');
    });

    cy.get('div.social_text').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
  });
});
