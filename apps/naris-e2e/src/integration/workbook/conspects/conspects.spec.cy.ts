const title = 'Новая тема';
const body = 'Тело конспекта, тело конспекта, тело конспекта, тело конспекта';

describe('Тестирование конспектов', () => {
  beforeEach(() => {
    // Проходим авторизацию
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it('Вход в конспекты, создание конспекта, и проверка его в наличии', () => {
    cy.visit('/#!/pages/workbook/conspects');

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
    cy.visit('/#!/pages/workbook/conspects/create/new');

    cy.get('input[placeholder="Тема"]').type(title);
    cy.get('textarea').first().type(body);

    cy.get('button[ng-reflect-title="Сохранить"]').click();

    // Проверка, что элемент был создан
    cy.get('div.item.ng-star-inserted').should('exist');
    cy.get('div.title').eq(0).should('contain.text', title);

    // Клик по глазику для просмотра
    cy.get('div.item.ng-star-inserted').first().find('i[nztype="eye"]').click({ force: true });
    cy.get('markdown.ng-star-inserted')
      .invoke('text')
      .then((text) => {
        const trimmedText = text.trim();
        expect(trimmedText).to.equal(body);
      });
  });

  it('Проверка на удаление конспектов', () => {
    cy.visit('/#!/pages/workbook/conspects');

    // Клик на кнопку с красной корзиной для удаления
    cy.get('div.item.ng-star-inserted').first().find('i[nztype="delete"]').click({ force: true });

    // Клик, чтобы подтвердить удаление
    cy.get('.cdk-overlay-pane span.ng-star-inserted').contains('OK').click();

    cy.contains('Элемент успешно удален').should('be.visible');
  });
});
