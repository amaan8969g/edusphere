describe('EduSphere client', () => {
  it('loads home page and has the correct title', () => {
    cy.visit('/');
    cy.title().should('include', 'EduSphere');
  });
});
