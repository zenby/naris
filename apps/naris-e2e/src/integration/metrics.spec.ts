describe('naris metrics', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
  });

  it('should successfully navigate to metrics page and click on every metric tile', () => {
    cy.visit('/#!/pages/overview/info');

    // Tab button
    cy.get('[data-cy="Метрики"]').should('not.have.attr', 'disabled');
    cy.get('[data-cy="Метрики"]').click();
    cy.get('[data-cy="Метрики"]').should('have.attr', 'disabled');

    cy.location().should((location) => expect(location.href).to.include('/pages/overview/metrics'));
    cy.get('[data-cy="targets/list"]').contains('Цели');
    cy.get('[data-cy="workbook"]').contains('Конспекты');
    cy.get('[data-cy="qa"]').contains('Вопросы');
    cy.get('[data-cy="streams"]').contains('Стримы');
    cy.get('[data-cy="workshops"]').contains('Воркшопы');
    cy.get('[data-cy="book"]').contains('Книга');
    cy.get('[data-cy="sources"]').contains('Исходники');
  });

  it('should display achievement tile and navigetes to General templates by clicking on it', () => {
    cy.visit('/#!/pages/overview/metrics');

    cy.get('[data-cy="emptyTarget"]').click();
    cy.location().should((location) => expect(location.href).to.include('/pages/targets/templates/public'));
  });
});
