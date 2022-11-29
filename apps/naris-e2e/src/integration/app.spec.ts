describe('naris', () => {
  it('should display login page', () => {
    cy.visit('/');

    cy.get('h2').contains('LOGIN via');

    cy.get('.ant-btn.login-form-button').its('length').should('equal', 3);

    cy.contains('Yandex');
    cy.contains('Google');
    cy.contains('Patreon');
  });
});
