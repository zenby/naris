/* eslint-disable cypress/no-unnecessary-waiting */
describe('naris overview', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
  });

  it('should display info page', () => {
    cy.visit('/#!/pages/overview/info');
    cy.get('[data-cy="Информация"]').should('have.attr', 'disabled', 'disabled');

    cy.get('[data-cy="contactText"]').each(($el) => {
      cy.wrap($el).should('be.visible');
    });

    cy.get('[data-cy="socialText"]').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
  });
});
