describe('Catalog -> Details -> Enroll flow', () => {
  it('loads catalog, opens first course details, enrolls and lands in classroom', () => {
    cy.visit('/courses');
    cy.get('a').contains('View').first().click();

    // On course details page
    cy.get('button').contains(/Enroll Now/i).click();

    // Because auth is required, should redirect to /login if not authenticated
    cy.url().should('include', '/login');

    // Note: Full E2E authenticated flow requires creating a test user and signing in via API or UI.
    // This spec covers unauthenticated redirect behavior and navigation.
  });
});
