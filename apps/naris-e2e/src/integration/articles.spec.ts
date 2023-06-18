import { articleTitle, articleTextWithMd, modifiedArticleTitle } from '../support/articleConstants';
import { createNewArticlePath, editArticlePath, allArticlesPath, viewArticlePath } from '../support/pathConstants';

describe('naris articles', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');

    cy.login('user', 'user');
    cy.location('href', { timeout: 10000 }).should('eq', Cypress.config().baseUrl + '#!/pages/overview/info');

    cy.removeAllExistingArticles();
  });

  it('should check mouse interaction on create article page', () => {
    cy.visit(`/${createNewArticlePath}`);
    cy.location('href', { timeout: 10000 }).should('eq', Cypress.config().baseUrl + createNewArticlePath);

    cy.get('.edit', { timeout: 10000 }).should('be.visible');
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
    cy.location('href', { timeout: 10000 }).should('eq', Cypress.config().baseUrl + createNewArticlePath);

    cy.get('.edit', { timeout: 10000 }).should('be.visible');

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
    cy.contains('Test').should('exist');
  });

  it('should check view mode from main page', () => {
    cy.createArticle();

    cy.get('.anticon-eye', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.location('href', { timeout: 10000 }).should('contain', Cypress.config().baseUrl + viewArticlePath);
    cy.get('.workbooks').should('not.exist');
  });

  it('should edit existing article', () => {
    cy.createArticle();

    cy.get('.anticon-edit', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.location('href', { timeout: 10000 }).should('contain', Cypress.config().baseUrl + editArticlePath);

    cy.get('input[placeholder="Тема"]').clear();
    cy.get('input[placeholder="Тема"]').type(modifiedArticleTitle);

    cy.get('.anticon-save').click();
    cy.visit('/#!/pages/workbook/articles');
    cy.location('href', { timeout: 10000 }).should('eq', Cypress.config().baseUrl + allArticlesPath);

    cy.contains(modifiedArticleTitle).should('exist');
  });

  it('should check warning after changing article without save', () => {
    cy.on('window:confirm', () => false);
    cy.createArticle();

    cy.get('.anticon-edit', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.location('href', { timeout: 10000 }).should('contain', Cypress.config().baseUrl + editArticlePath);
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
