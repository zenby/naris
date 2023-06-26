const screenSizes = ['iphone-6', 'macbook-11']; //macbook-11 is 1366x768

describe('module workshops', () => {
  screenSizes.forEach((screenSize) => {
    // initial login and screen size configuration
    beforeEach(() => {
      cy.viewport(screenSize);
      cy.intercept('GET', '**/*.svg').as('signIn');
      cy.login('user', 'user');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
    });

    it('displays workshop folders list', () => {
      cy.visit('#!/pages/workshops');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('soer-streams');
    });

    it('displays at least one workshop folder', () => {
      cy.visit('#!/pages/workshops');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('nz-card');
    });

    it('displays back button on every workshops folder page', () => {
      cy.visit('#!/pages/workshops');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('nz-card').each(($card, index, $cards) => {
        cy.wrap($card).click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get('nz-card').first().as('btnBack'); // first card is back to workshops button
        cy.get('@btnBack').should('have.descendants', 'svg[data-icon="arrow-left"]'); // check if icon goback is present
        cy.get('@btnBack').click();
        cy.url().should('contain', '#!/pages/workshops'); // now we are at the page where we started
      });
    });

    it('has workshops inside every workshops folder', () => {
      cy.visit('#!/pages/workshops');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('nz-card').each(($card, index, $cards) => {
        cy.wrap($card).click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get('nz-card').should('have.length.least', 2); // first card is back button, others are supposed to be workshops
      });
    });

    it('shows access restricted message for guest account when accessing workshop ', () => {
      cy.visit('#!/pages/workshops');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('nz-card').each(($card, index, $cards) => {
        cy.wrap($card).click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get('nz-card').each(($card1, index, $cards1) => {
          if (index > 0) {
            // FIXME filter elements using more functional approach
            cy.wrap($card1).click();
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000);
            cy.get('nz-result').should('be.visible').contains('Данный контент доступен только на платных подписках');
            cy.get('i[nztype="close-circle"]').click(); // popup has close button that works
            cy.get('nz-result').should('not.exist'); // popup is closed
          }
        });
      });
    });
  });
});
