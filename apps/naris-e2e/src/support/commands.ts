import { createNewArticlePath, allArticlesPath } from './pathConstants';
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
  cy.get('a[title="Статьи"]').should('have.attr', 'disabled');
  cy.get('.ant-spin-dot').should('not.exist');
  cy.get('.anticon-delete')
    .should('have.length.gte', 0)
    .then(($delBtnList) => {
      const delBtnLen = $delBtnList.length;

      for (let i = 0; i < delBtnLen; i++) {
        cy.get('.anticon-delete').eq(0).click({ force: true });
        cy.contains('OK').should('be.visible').click({ force: true });
        cy.wait(['@deleteRequest', '@personalArticles', '@personalArticles']);
      }
    });
});

Cypress.Commands.add('removeAllExistingConspects', () => {
  cy.get('a[title="Конспекты"]').should('have.attr', 'disabled');
  cy.get('.ant-spin-dot').should('not.exist');
  cy.get('.anticon-delete')
    .should('have.length.gte', 0)
    .then(($delBtnList) => {
      const delBtnLen = $delBtnList.length;

      for (let i = 0; i < delBtnLen; i++) {
        cy.get('.anticon-delete').eq(0).click({ force: true });
        cy.contains('OK').should('be.visible').click({ force: true });
        cy.wait(['@conspectDelete', '@conspectEdit', '@personalConspects']);
      }
    });
});
Cypress.Commands.add('createArticle', () => {
  cy.visit(`/${allArticlesPath}`);
  cy.location('href').should('eq', Cypress.config().baseUrl + allArticlesPath);

  cy.get('.anticon-plus').should('be.visible').click();
  cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

  cy.get('input[placeholder="Тема"]').type(testTitle, { force: true });
  cy.get('.anticon-save').click();
  cy.wait(['@personalArticles', '@personalArticles']);
  cy.get('a[title="Статьи"]').should('be.visible').click();
  cy.wait('@personalArticles');
  cy.get('a[title="Статьи"]').should('have.attr', 'disabled');
  cy.get('.ant-spin-dot').should('not.exist');
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
