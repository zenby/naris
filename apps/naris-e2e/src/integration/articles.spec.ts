import { articleTitle, articleTextWithMd, modifiedArticleTitle, testTitle } from '../support/articleConstants';
import {
  createNewArticlePath,
  editArticlePath,
  allArticlesPath,
  viewArticlePath,
  infoPath,
} from '../support/pathConstants';

describe('naris articles', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.intercept('GET', '**/api/v2/json/article/personal').as('personalArticles');
    cy.intercept('GET', '**/api/v2/json/article/**').as('editArticle');
    cy.intercept('DELETE', '/api/v2/json/article/**').as('deleteRequest');

    cy.login('user', 'user');
    cy.visit(`/${allArticlesPath}`);
    cy.wait('@personalArticles');
    cy.get('a[title="Статьи"]').should('be.visible');
    cy.removeAllExistingArticles();
  });

  it('should check mouse interaction on create article page', () => {
    cy.visit(`/${createNewArticlePath}`);
    cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

    cy.get('.edit').should('be.visible');
    cy.get('input[placeholder="Тема"]').type(articleTitle, { force: true });
    cy.get('textarea').first().type(articleTextWithMd, { force: true });

    cy.get('.anticon-appstore-add').click();

    cy.get('soer-block-editor').should('have.length', 2);
    cy.get('.anticon-up').click();

    cy.get('textarea').eq(1).should('have.value', articleTextWithMd);

    cy.get('textarea').first().click();
    cy.get('.anticon-down').click();

    cy.get('textarea').first().should('have.value', articleTextWithMd);
    cy.get('.anticon-edit').click();

    cy.get('textarea').eq(1).should('not.to.have.focus');
  });

  it('should check keyboard interaction on create article page', () => {
    cy.visit(`/${createNewArticlePath}`);
    cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

    cy.get('.edit').should('be.visible');

    cy.get('textarea').first().type(articleTextWithMd, { force: true });

    cy.get('textarea').type('{alt}{enter}');
    cy.get('soer-block-editor').should('have.length', 2);

    cy.get('textarea').eq(1).type('{alt}{uparrow}');
    cy.get('textarea').eq(1).should('have.value', `${articleTextWithMd}\n`);

    cy.get('textarea').eq(1).type('{alt}{uparrow}');
    cy.get('textarea').first().should('have.value', `${articleTextWithMd}\n`);

    cy.get('textarea').first().type('{esc}');
    cy.get('textarea').first().should('not.to.have.focus');

    cy.get('soer-mobile-menu .ng-star-inserted').first().click();
    cy.get('soer-mobile-menu textarea').should('not.exist');
  });

  it('should check article creation', () => {
    cy.createArticle();
    cy.contains(testTitle).should('exist');
  });

  it('should check view mode from main page', () => {
    cy.createArticle();

    cy.get('.anticon-eye').should('be.visible').click({ force: true });
    cy.location('href').should('contain', Cypress.config().baseUrl + viewArticlePath);
    cy.get('.workbooks').should('not.exist');
  });

  it('should edit existing article', () => {
    cy.createArticle();

    cy.get('.anticon-edit').should('be.visible').click({ force: true });
    cy.wait('@editArticle', { timeout: 10000 });

    cy.get('input[placeholder="Тема"]').should('not.be.disabled');
    cy.get('input[placeholder="Тема"]')
      .click()
      .clear()
      .type(modifiedArticleTitle)
      .should('have.value', modifiedArticleTitle);

    cy.get('.anticon-save').click();
    cy.visit(`/${allArticlesPath}`);
    cy.wait('@personalArticles');

    cy.contains(modifiedArticleTitle).should('exist');
  });

  it('should check warning after changing article without save', () => {
    cy.on('window:confirm', () => false);
    cy.createArticle();

    cy.get('.anticon-edit').should('be.visible').click({ force: true });
    cy.location('href').should('contain', Cypress.config().baseUrl + editArticlePath);
    cy.get('input[placeholder="Тема"]').clear();
    cy.get('input[placeholder="Тема"]').type(modifiedArticleTitle);

    cy.get('.anticon-rollback').click();
    cy.get('.anticon-rollback').should('exist');
  });

  it('should check article delete', () => {
    cy.createArticle();
    cy.removeAllExistingArticles();

    cy.contains('Начать').should('exist');
  });
});
