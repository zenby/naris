import { articleTitle, articleTextWithMd, modifiedArticleTitle, testTitle } from '../support/articleConstants';
import { createNewArticlePath, editArticlePath, allArticlesPath, viewArticlePath } from '../support/pathConstants';

describe('naris articles', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');

    cy.login('user', 'user');
    cy.visit(`/${allArticlesPath}`);
    cy.get('[data-cy="Статьи"]').should('be.visible');
    cy.removeAllExistingArticles();
  });

  it('should check mouse interaction on create article page', () => {
    cy.visit(`/${createNewArticlePath}`);
    cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

    cy.get('[data-cy="edit-block"]').should('be.visible');
    cy.get('[data-cy="abstracte-form-input"]').type(articleTitle, { force: true });
    cy.get('[data-cy="block-editor"]').click().first().type(articleTextWithMd, { force: true });

    cy.get('[data-cy="appstore-add"]').click();

    cy.get('soer-block-editor').should('have.length', 2);
    cy.get('[data-cy="up"]').click();

    cy.get('[data-cy="block-editor"]').eq(1).should('have.value', articleTextWithMd);

    cy.get('[data-cy="block-editor"]').first().click();
    cy.get('[data-cy="down"]').click();

    cy.get('[data-cy="block-editor"]').first().should('have.value', articleTextWithMd);
    cy.get('[data-cy="edit"]').click();

    cy.get('[data-cy="block-editor"]').eq(1).should('not.to.have.focus');
  });

  it('should check keyboard interaction on create article page', () => {
    cy.visit(`/${createNewArticlePath}`);
    cy.location('href').should('eq', Cypress.config().baseUrl + createNewArticlePath);

    cy.get('[data-cy="edit-block"]').should('be.visible');

    cy.get('[data-cy="block-editor"]').click().first().type(articleTextWithMd, { force: true });

    cy.get('[data-cy="block-editor"]').type('{alt}{enter}');
    cy.get('soer-block-editor').should('have.length', 2);

    cy.get('[data-cy="block-editor"]').eq(1).type('{alt}{uparrow}');
    cy.get('[data-cy="block-editor"]').eq(1).should('have.value', articleTextWithMd);

    cy.get('[data-cy="block-editor"]').eq(1).type('{alt}{uparrow}');
    cy.get('[data-cy="block-editor"]').first().should('have.value', articleTextWithMd);

    cy.get('[data-cy="block-editor"]').first().type('{esc}');
    cy.get('[data-cy="block-editor"]').first().should('not.to.have.focus');
  });

  it('should check article creation', () => {
    cy.createArticle();
    cy.contains(testTitle).should('exist');
  });

  it('should check view mode from main page', () => {
    cy.createArticle();

    cy.get('[data-cy="eye-article"]').should('be.visible').click({ force: true });
    cy.location('href').should('contain', Cypress.config().baseUrl + viewArticlePath);
    cy.get('[data-cy="workbooks"]').should('not.exist');
  });

  it('should edit existing article', () => {
    cy.createArticle();

    cy.get('[data-cy="edit-article"]').should('be.visible').click({ force: true });

    cy.get('[data-cy="abstracte-form-input"]').should('not.be.disabled');
    cy.get('[data-cy="abstracte-form-input"]')
      .click()
      .clear()
      .type(modifiedArticleTitle)
      .should('have.value', modifiedArticleTitle);

    cy.get('[data-cy="save"]').click();
    cy.visit(`/${allArticlesPath}`);

    cy.contains(modifiedArticleTitle).should('exist');
  });

  it('should check warning after changing article without save', () => {
    cy.on('window:confirm', () => false);
    cy.createArticle();

    cy.get('[data-cy="edit-article"]').should('be.visible').click({ force: true });
    cy.location('href').should('contain', Cypress.config().baseUrl + editArticlePath);
    cy.get('[data-cy="abstracte-form-input"]').clear();
    cy.get('[data-cy="abstracte-form-input"]').type(modifiedArticleTitle);

    cy.get('[data-cy="rollback"]').click();
    cy.get('[data-cy="rollback"]').should('exist');
  });

  it('should check article delete', () => {
    cy.createArticle();
    cy.removeAllExistingArticles();

    cy.get('[data-cy="create-workbook-button"]').should('exist');
  });
});
