/// <reference types="cypress" />

// Custom command declarations if needed
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getCell(index: number): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getCell', (index: number) => {
  return cy.get(`[data-testid="cell-${index}"]`);
});

export {};
