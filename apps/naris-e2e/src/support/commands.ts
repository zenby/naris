import {
  createNewArticlePath,
  allArticlesPath,
  allWorkbookConspectsPath,
  createNewConspectPath,
  workbookPath,
} from './pathConstants';
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
      removeAllExistingConspects(): void;
      createConspect(): void;
    }
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (login, password) => {
  cy.session([login, password], () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('host')}/v2/auth/signin`,
      form: true,
      followRedirect: false,
      body: {
        login,
        password,
      },
    }).then((response) => {
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
      });
    });
  });
});

Cypress.Commands.add('removeAllExistingArticles', () => {
  cy.get('[data-cy="Статьи"]').should('have.attr', 'disabled');
  cy.get('.ant-spin-dot').should('not.exist');
  cy.get('[data-cy="delete-article"]')
    .should('have.length.gte', 0)
    .then(($delBtnList) => {
      const delBtnLen = $delBtnList.length;

      for (let i = 0; i < delBtnLen; i++) {
        cy.get('[data-cy="delete-article"]').then((delBtns) => {
          const delBtnLen = delBtns.length;
          cy.get('[data-cy="delete-article"]').eq(0).click({ force: true });
          cy.contains('OK').should('be.visible').click({ force: true });
          cy.get('[data-cy="delete-article"]').should('have.length', delBtnLen - 1);
          cy.get('.ant-message-notice-content', { timeout: 10000 }).should('have.length', 1);
          cy.get('.ant-message-notice-content', { timeout: 10000 }).should('have.length', 0);
        });
      }
    });
});
Cypress.Commands.add('createArticle', () => {
  cy.visit(`/${allArticlesPath}`);
  cy.location('href').should('eq', Cypress.config().baseUrl + allArticlesPath);

  cy.get('[data-cy="plus"]').should('be.visible').click();
  cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

  cy.get('input[placeholder="Тема"]').type(testTitle, { force: true });
  cy.get('[data-cy="save"]').click();
  cy.location('href').should('contain', Cypress.config().baseUrl + workbookPath);
  cy.get('[data-cy="Статьи"]').should('be.visible').click();
  cy.get('[data-cy="Статьи"]').should('have.attr', 'disabled');
  cy.get('.ant-spin-dot').should('not.exist');
  cy.get('.ant-message-notice-content', { timeout: 10000 }).should('have.length', 1);
  cy.get('.ant-message-notice-content', { timeout: 10000 }).should('have.length', 0);
  cy.get('[data-cy="Статьи"]').click();
  cy.get('[data-cy="delete-article"]').should('exist');
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
