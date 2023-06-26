describe('modules questions', () => {
  const veryLongQuestion = 'Can I ask a super very long question?'.repeat(45);
  const permissibleQuestion = 'Is it permissible question?';

  Cypress.session.clearAllSavedSessions();

  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.login('user', 'user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it('should open the new question creation form', () => {
    cy.visit('/#!/pages/qa/my');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[id="plus-control-btn"]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my/create/new');
    cy.get('h1').contains('Задайте свой вопрос');
  });

  it('should show error message when User trying to enter a question that is too long', () => {
    cy.visit('#!/pages/qa/my/create/new');
    cy.get('.ant-input').type(veryLongQuestion, {
      delay: 0,
    });
    cy.get('.ant-notification-notice').should('not.exist');
    cy.get('[id="save-control-btn"]').click();
    cy.get('.ant-notification-notice').should('exist');
  });

  it('should return to the prev page after show the error message and pushing the "back" button', () => {
    cy.visit('#!/pages/qa/my/create/new');
    cy.get('.ant-input').type(veryLongQuestion, {
      delay: 0,
    });
    cy.get('[id="save-control-btn"]').click();
    cy.get('[id="rollback-control-btn"]').click();

    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');
  });

  it('should save question after removing unnecessary characters', () => {
    cy.visit('#!/pages/qa/my/create/new');
    cy.get('.ant-input').type(veryLongQuestion, {
      delay: 0,
    });
    cy.get('[id="save-control-btn"]').click();
    cy.get('.ant-input').clear().type(permissibleQuestion).should('have.value', permissibleQuestion);
    cy.get('[id="save-control-btn"]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');
    cy.get('.ant-message-notice-content').should('exist');
    cy.get('.ant-list-items').last().contains(permissibleQuestion);
  });

  it('should delete selected question', () => {
    cy.visit('#!/pages/qa/my/create/new'); // add 2 new questions
    cy.get('.ant-input').type(permissibleQuestion);
    cy.get('[id="save-control-btn"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[id="plus-control-btn"]').click();
    cy.get('.ant-input').type(permissibleQuestion);
    cy.get('[id="save-control-btn"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');

    cy.get('.qa-list-item-description').then((qaList) => {
      const listLen = Cypress.$(qaList).length - 1;

      cy.get('[title="Удалить"').last().click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('.qa-list-item-description').its('length').should('equal', listLen);
    });
  });

  it('should switch between "my questions" and "all questions" page', () => {
    cy.visit('/#!/pages/qa/my');
    cy.get('[id="all-questions-tab"]').contains('Все вопросы').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/all');
    cy.get('[id="my-questions-tab"]').contains('Мои вопросы').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');
  });

  it('should show enother elements on "My questions" page if question list is empty', () => {
    cy.visit('#!/pages/qa/my/create/new');
    cy.get('.ant-input').type(permissibleQuestion);
    cy.get('[id="save-control-btn"]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');

    cy.get('[title="Удалить"]').then((delBtnList) => {
      //delete all questions
      let listLen = Cypress.$(delBtnList).length;

      while (listLen) {
        cy.get('[title="Удалить"]').last().click();
        listLen--;
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
      }
    });
    cy.get('.ant-result').contains('Задать первый вопрос');
    cy.get('[id="first-ask-btn"]').should('exist');
  });
});
