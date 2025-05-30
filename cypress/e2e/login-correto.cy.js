describe('Página de Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/PhpDailyManager-front/')
  });
  it('Realiza login com sucesso', () => {
    cy.login('ruigx@hotmail.com','200394');
    cy.contains('Daily Manager R');
    cy.contains('Primeira Página');
  })
})