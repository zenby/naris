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
});
