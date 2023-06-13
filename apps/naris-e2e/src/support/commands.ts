// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    removeAllExistingArticles(): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (login, password) => {
  cy.session([login, password], () => {
    cy
      .request({
        method: 'POST',
        url: `${Cypress.env('host')}/v2/auth/signin`,
        form: true,
        followRedirect: false,
        body: {
          login,
          password,
        },
      })
      .then((response) => {
        const [cookieStr] = response['headers']['set-cookie'];
        console.log(cookieStr);
        cy.request({
          method: 'GET',
          url: `${Cypress.env('host')}/v2/auth/access_token`,
          form: true,
          followRedirect: false,
          headers: {
            Cookie: cookieStr,
          },
        }).then((response2) => {
          const [result] = response2.body.items;
          localStorage.setItem('tokenV2', result.accessToken);
          cy.visit('#!/login/auth?accesstoken=' + result.accessToken);
        });
      }),
      {
        cacheAcrossSpecs: true,
      };
  });
});

Cypress.Commands.add('removeAllExistingArticles', () => {
  cy.visit('/#!/pages/workbook/articles');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('body').then(($body) => {
    if ($body.find('.anticon-delete').length) {
      cy.get('.anticon-delete').then(($elements) => {
        if ($elements?.length > 0) {
          $elements.each(() => {
            cy.get('.anticon-delete').eq(0).click({ force: true });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(200);
            cy.contains('OK').click();
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(300);
          });
        }
      });
    }
  });
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// //
