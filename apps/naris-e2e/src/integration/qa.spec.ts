describe('modules questions', () => {
  const veryLongQuestion = 'Can I ask a super very long question?'.repeat(45);
  const permissibleQuestion = 'Is it permissible question?';

  Cypress.session.clearAllSavedSessions();

  beforeEach(() => {
    cy.intercept('GET', '**/*.svg').as('signIn');
    cy.intercept('GET', 'https://stage.s0er.ru/api/questions').as('getUpdatedQuestions');
    cy.login('user', 'user');
  });

  it('should open the new question creation form, show error if saving very long question, handle it and save normal question', () => {
    cy.visit('/#!/pages/qa/my');
    cy.get('[data-cy="plusBtn"]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my/create/new');
    cy.get('[data-cy="questionFormTitle"]').contains('Задайте свой вопрос');
    cy.get('[data-cy="questionInput"]').type(veryLongQuestion, {
      delay: 0,
    });
    cy.get('.ant-notification-notice').should('not.exist');
    cy.get('[data-cy="saveBtn"]').click();
    cy.get('.ant-notification-notice').should('exist');
    cy.get('[data-cy="rollbackBtn"]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');
    cy.get('[data-cy="plusBtn"]').click();
    cy.get('[data-cy="questionInput"]').type(veryLongQuestion, {
      delay: 0,
    });
    cy.get('[data-cy="saveBtn"]').click();
    cy.get('[data-cy="questionInput"]').clear().type(permissibleQuestion).should('have.value', permissibleQuestion);
    cy.get('[data-cy="saveBtn"]').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');
    cy.wait('@getUpdatedQuestions');
    cy.get('.ant-message-notice-content').should('exist');
    cy.get('[data-cy="qaListItemDescription"]').last().contains(permissibleQuestion);
  });

  it('should delete selected question, then all questions and then show proposal to ask first question', () => {
    cy.visit('#!/pages/qa/my/create/new'); // add 2 new questions.
    cy.get('[data-cy="questionInput"]').type(permissibleQuestion);
    cy.get('[data-cy="saveBtn"]').click();
    cy.wait('@getUpdatedQuestions');
    cy.get('[data-cy="plusBtn"]').click();
    cy.get('[data-cy="questionInput"]').type(permissibleQuestion);
    cy.get('[data-cy="saveBtn"]').click();
    cy.wait('@getUpdatedQuestions');
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');

    cy.get('[data-cy="qaListItemDescription"]').then((qaList) => {
      const listLen = Cypress.$(qaList).length - 1;

      cy.get('[data-cy="questionDeleteBtn"]').last().click();
      cy.wait('@getUpdatedQuestions');
      cy.get('[data-cy="qaListItemDescription"]').its('length').should('equal', listLen);
    });
    cy.visit('#!/pages/qa/my/create/new');
    cy.get('[data-cy="questionInput"]').type(permissibleQuestion);
    cy.get('[data-cy="saveBtn"]').click();
    cy.wait('@getUpdatedQuestions');
    cy.get('[data-cy="questionDeleteBtn"]').then((delBtnList) => {
      //delete all questions
      let listLen = Cypress.$(delBtnList).length;

      while (listLen) {
        cy.get('[data-cy="questionDeleteBtn"]').last().click();
        cy.wait('@getUpdatedQuestions');
        listLen--;
      }
    });
    cy.get('[data-cy="firstAskProposal"]').contains('Задать первый вопрос');
    cy.get('[data-cy="firstAskBtn"]').should('exist');
  });

  it('should switch between "my questions" and "all questions" page', () => {
    cy.visit('/#!/pages/qa/my');
    cy.get('[data-cy="allQuestionsTab"]').contains('Все вопросы').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/all');
    cy.get('[data-cy="myQuestionsTab"]').contains('Мои вопросы').click();
    cy.url().should('equal', Cypress.config().baseUrl + '#!/pages/qa/my');
  });
});
