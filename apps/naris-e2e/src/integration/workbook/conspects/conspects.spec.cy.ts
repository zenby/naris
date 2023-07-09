import { allArticlesPath, allWorkbookConspectsPath, createNewArticlePath } from '../../../support/pathConstants';
import { testTitle } from '../../../support/conspectsConstants';
import { modifiedConspectTitle } from '../../../support/conspectsConstants';

describe('Тестирование конспектов', () => {
  beforeEach(() => {
    // Проходим авторизацию
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.intercept('GET', '**/api/v3/json/workbook/private').as('personalConspects');
    cy.intercept('GET', '**/api/v3/json/workbook/**').as('conspectEdit');
    cy.intercept('DELETE', '/api/v3/json/workbook/**').as('conspectDelete');
    cy.login('user', 'user');
    cy.visit(`/${allWorkbookConspectsPath}`);
    cy.wait('@personalConspects', { timeout: 10000 });
    cy.removeAllExistingConspects();
  });

  it('Вход в конспекты, создание конспекта, и проверка его в наличии', () => {
    cy.visit(allWorkbookConspectsPath);
    cy.location('href').should('eq', Cypress.config().baseUrl + '/' + allWorkbookConspectsPath);
    // Проверка, что мы зашли в конспекты
    cy.get('a[title="Конспекты"]').contains('Конспекты');

    // Клик по кнопке создания конспекта
    cy.get('[data-cy="create-item"]').click();
    cy.get('input[placeholder="Тема"]').type(testTitle);

    cy.get('button[ng-reflect-title="Сохранить"]').click();

    // Проверка, что элемент был создан
    cy.get('div.item.ng-star-inserted').should('exist');
    cy.get(`div[title="${testTitle}"]`).first().should('contain.text', testTitle);
  });

  it('Проверка на изменения конспекта', () => {
    cy.createConspect();

    // Проверка, что элемент был создан
    cy.get('.anticon-edit').should('be.visible').click({ force: true });
    cy.wait('@conspectEdit', { timeout: 10000 });

    cy.get('input[placeholder="Тема"]').should('not.be.disabled');
    cy.get('input[placeholder="Тема"]')
      .click()
      .clear()
      .type(modifiedConspectTitle)
      .should('have.value', modifiedConspectTitle);

    cy.get('.anticon-save').click();
    cy.visit(`/${allWorkbookConspectsPath}`);
    cy.wait('@personalConspects');

    cy.contains(modifiedConspectTitle).should('exist');
  });

  it('Проверка на удаление конспектов', () => {
    cy.createConspect();
    cy.removeAllExistingConspects();

    cy.contains('Начать').should('exist');
  });
});
