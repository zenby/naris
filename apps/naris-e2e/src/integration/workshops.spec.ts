import ViewportPreset = Cypress.ViewportPreset;

const screenSizes: ViewportPreset[] = ['iphone-6', 'macbook-11']; //macbook-11 is 1366x768

describe('module workshops', () => {
  screenSizes.forEach((screenSize) => {
    // initial login and screen size configuration
    beforeEach(() => {
      cy.viewport(screenSize);
      cy.intercept('GET', '**/api/kinescope/workshops').as('workshops');
      cy.login('user', 'user');
      cy.visit('#!/pages/workshops');
      cy.wait('@workshops');
    });

    it('displays workshop folders list', () => {
      cy.get('[data-cy="streamsFolderList"]');
    });

    it('displays at least one workshop folder', () => {
      cy.get('[data-cy="openFolder"]');
    });

    it('displays back button on every workshops folder page', () => {
      cy.get('nz-card').each(($card, _, __) => {
        cy.wrap($card).click();
        cy.get('nz-card').first().as('btnBack'); // first card is back to workshops button
        cy.get('@btnBack').should('have.descendants', 'svg[data-icon="arrow-left"]'); // check if icon goback is present
        cy.get('@btnBack').click();
        cy.url().should('contain', '#!/pages/workshops'); // now we are at the page where we started
      });
    });

    it('has workshops inside every workshops folder', () => {
      cy.get('nz-card').each(($card, _, __) => {
        cy.wrap($card).click();
        cy.get('nz-card').should('have.length.least', 2); // first card is back button, others are supposed to be workshops
      });
    });

    it('shows access restricted message for guest account when accessing workshop ', () => {
      cy.get('[data-cy="openFolder"]').each(($card, _, __) => {
        cy.wrap($card).click();
        cy.get('[data-cy="openVideo"]').each(($card1, index, _) => {
          cy.wrap($card1).click();
          cy.get('[data-cy="noContent"]')
            .should('be.visible')
            .contains('Данный контент доступен только на платных подписках');
          cy.get('[data-cy="closeBtn"]').click(); // popup has close button that works
          cy.get('[data-cy="noContent"]').should('not.exist'); // popup is closed
        });
      });
    });
  });
});
