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

      cy.get('a[href="#!/pages/targets/list"').contains('Цели');
      cy.get('a[href="#!/pages/workbook"').contains('Конспекты');
      cy.get('a[href="#!/pages/qa"').contains('Вопросы');
      cy.get('a[href="#!/pages/streams"').contains('Стримы');
      cy.get('a[href="#!/pages/workshops"').contains('Воркшопы');
      cy.get('a[href="#!/pages/book"').contains('Книга');
      cy.get('a[href="#!/pages/sources"').contains('Исходники');
    });
  });
});
