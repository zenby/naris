import { createNewArticlePath, workbookPath, allArticlesPath } from './pathConstants';
import { testTitle } from '../support/articleConstants';
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
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(email: string, password: string): void;
      removeAllExistingArticles(): void;
      createArticle(): void;
    }
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
  cy.visit(`/${allArticlesPath}`);
  cy.wait('@personalArticles');

  cy.get('.anticon-delete')
    .should('have.length.gte', 0)
    .then(($delBtnList) => {
      let delBtnLen = $delBtnList.length;

      function deleteArticle() {
        if (delBtnLen == 0) {
          return;
        }
        cy.get('.anticon-delete').should('be.visible').eq(0).click({ force: true });
        cy.contains('OK').should('be.visible').click({ force: true });
        delBtnLen--;
        cy.wait(['@deleteRequest', '@personalArticles', '@personalArticles']);

        deleteArticle();
      }

      deleteArticle();
    });
});

Cypress.Commands.add('createArticle', () => {
  cy.visit(`/${allArticlesPath}`);
  cy.location('href').should('eq', Cypress.config().baseUrl + allArticlesPath);

  cy.get('.anticon-plus').should('be.visible').click();
  cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

  cy.get('input[placeholder="Тема"]').type(testTitle, { force: true });
  cy.get('.anticon-save').click();
  cy.wait('@personalArticles');
  cy.get('a[title="Статьи"]').should('be.visible').click();
  cy.wait('@personalArticles');
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
