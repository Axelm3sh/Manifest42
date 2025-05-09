// Basic end-to-end test for the home page

describe('Home Page', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('loads successfully', () => {
    // Check that the page loads without errors
    cy.get('body').should('be.visible');
  });
});
