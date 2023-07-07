import { allWorkbookConspectsPath } from '../../../support/pathConstants';
import { testTitle } from '../../../support/articleConstants';

const title = 'Новая тема';

describe('Тестирование конспектов', () => {
  beforeEach(() => {
    // Проходим авторизацию
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.intercept('GET', '**/api/v3/json/workbook/private').as('personalConspects');
    cy.intercept('PUT', '**/api/v3/json/workbook/**').as('conspectEdit');
    cy.intercept('DELETE', '**/api/v3/json/workbook/**').as('conspectDelete');
    cy.login('user', 'user');
    cy.visit(`/${allWorkbookConspectsPath}`);
    cy.wait('@personalConspects');
    cy.removeAllExistingConspects();
  });

  it('Вход в конспекты, создание конспекта, и проверка его в наличии', () => {
    cy.visit(allWorkbookConspectsPath);

    // Проверка, что мы зашли в конспекты
    cy.get('a.ant-btn.ant-btn-dashed.ant-btn-round.ant-btn-lg.ng-star-inserted[title="Конспекты"]').contains(
      'Конспекты'
    );

    // Клик по кнопке создания конспекта
    cy.get('[data-cy="create-item"]').click();
    cy.get('input[placeholder="Тема"]').type(title);

    cy.get('button[ng-reflect-title="Сохранить"]').click();

    // Проверка, что элемент был создан
    cy.get('div.item.ng-star-inserted').should('exist');
    cy.get('div.title').eq(0).should('contain.text', title);
  });

  it('Проверка на изменения конспекта', () => {
    cy.createConspect();

    // Проверка, что элемент был создан
    cy.get('div.item.ng-star-inserted').should('exist');
    cy.get('div.title').eq(0).should('contain.text', testTitle);

    // Клик по глазику для просмотра
    cy.get('div.item.ng-star-inserted').first().find('i[nztype="eye"]').click({ force: true });
  });

  it('Проверка на удаление конспектов', () => {
    cy.createConspect();
    cy.visit('/#!/pages/workbook/conspects');

    // Клик на кнопку с красной корзиной для удаления
    cy.get('div.item.ng-star-inserted').first().find('i[nztype="delete"]').click({ force: true });

    // Клик, чтобы подтвердить удаление
    cy.get('.cdk-overlay-pane span.ng-star-inserted').contains('OK').click();

    cy.contains('Элемент успешно удален').should('be.visible');
  });
});
