describe('naris metrics', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it('should successfully navigate to metrics page', () => {
    cy.visit('/#!/pages/overview/info');

    // Tab button
    cy.get('a[href="#!/pages/overview/metrics"').should('not.have.attr', 'disabled');
    cy.get('a[href="#!/pages/overview/metrics"').click();
    cy.get('a[href="#!/pages/overview/metrics"').should('have.attr', 'disabled');

    cy.location().should((location) => expect(location.href).to.include('/pages/overview/metrics'));
  });

  describe('Achievements section', () => {
    it('should display achievement tile and navigetes to General templates by clicking on it', () => {
      cy.visit('/#!/pages/overview/metrics');

      cy.get('a[href="#!/pages/targets/templates/public"').click();
      cy.location().should((location) => expect(location.href).to.include('/pages/targets/templates/public'));
    });
  });

  describe('Metrics section', () => {
    it('should display tiles', () => {
      cy.visit('/#!/pages/overview/metrics');

      cy.get('[data-cy="Цели"]').contains('Цели');
      cy.get('[data-cy="Конспекты"]').contains('Конспекты');
      cy.get('[data-cy="Вопросы"]').contains('Вопросы');
      cy.get('[data-cy="Стримы"]').contains('Стримы');
      cy.get('[data-cy="Воркшопы"]').contains('Воркшопы');
      cy.get('[data-cy="Книга"]').contains('Книга');
      cy.get('[data-cy="Исходники"]').contains('Исходники');
    });
  });
});
