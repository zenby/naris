import { allWorkbookConspectsPath, createNewConspectPath, workbookPath } from '../../../support/pathConstants';
import { testTitle } from '../../../support/conspectConstants';
import { modifiedConspectTitle } from '../../../support/conspectConstants';

describe('Тестирование конспектов', () => {
  beforeEach(() => {
    // Проходим авторизацию
    //    cy.intercept('GET', '**/*.svg').as('signIn');
    //    cy.intercept('GET', '**/api/v3/json/workbook/private').as('personalConspects');
    //    cy.intercept('GET', '**/api/v3/json/workbook/**').as('conspectEdit');
    //    cy.intercept('DELETE', '**/api/v3/json/workbook/**').as('conspectDelete');

    cy.intercept('GET', '**/*.svg').as('signIn');

    cy.login('user', 'user');
    cy.visit(`/${allWorkbookConspectsPath}`);
    cy.get('[data-cy="Конспекты"]').should('be.visible');
    cy.removeAllExistingDocuments('Конспекты');
  });

  it('Вход в конспекты, создание конспекта, и проверка его в наличии', () => {
    cy.visit(allWorkbookConspectsPath);
    cy.location('href').should('eq', Cypress.config().baseUrl + allWorkbookConspectsPath);
    // Проверка, что мы зашли в конспекты
    cy.get('a[title="Конспекты"]').contains('Конспекты');

    // Клик по кнопке создания конспекта
    cy.get('#plus-control-btn').should('be.visible').click();
    cy.get('input[placeholder="Тема"]').type(testTitle);

    cy.get('button[ng-reflect-title="Сохранить"]').click();

    // Проверка, что элемент был создан
    cy.get('div.item.ng-star-inserted').should('exist');
    cy.get(`div[title="${testTitle}"]`).first().should('contain.text', testTitle);
  });

  it('Проверка на изменения конспекта', () => {
    cy.createDocument(workbookPath, createNewConspectPath, 'Конспекты');

    // Проверка, что элемент был создан
    cy.get('[nztype="edit"]').should('be.visible').click({ force: true });
    //   cy.wait('@conspectEdit', { timeout: 10000 });

    cy.get('input[placeholder="Тема"]')
      .should('exist')
      .should('not.be.disabled')
      .click()
      .clear()
      .type(modifiedConspectTitle)
      .should('have.value', modifiedConspectTitle);

    cy.get('#save-control-btn').click();
    cy.visit(`/${allWorkbookConspectsPath}`);

    cy.contains(modifiedConspectTitle).should('exist');
  });

  it('Проверка на удаление конспектов', () => {
    cy.createDocument(workbookPath, createNewConspectPath, 'Конспекты');
    cy.removeAllExistingDocuments('Конспекты');

    cy.contains('Начать').should('exist');
  });
});
