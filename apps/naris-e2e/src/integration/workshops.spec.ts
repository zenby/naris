describe('module workshops', () => {
  // логинимся перед выполнением теста
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it('should display workshop folders list', () => {
    cy.visit('#!/pages/workshops');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('soer-streams');
  });

  it('should display at least one workshop folder', () => {
    cy.visit('#!/pages/workshops');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('nz-card');
  });

  it('should display back button on every workshops folder page', () => {
    cy.visit('#!/pages/workshops');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('nz-card').each(($card, index, $cards) => {
      cy.wrap($card).click();
      cy.get('nz-card').first().as('btnBack');
      cy.get('@btnBack').should('have.descendants', 'svg[data-icon="arrow-left"]');
      cy.get('@btnBack').click();
      cy.url().should('contain', '#!/pages/workshops');
    });
  });
});
