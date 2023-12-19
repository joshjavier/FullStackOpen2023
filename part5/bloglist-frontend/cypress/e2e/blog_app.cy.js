describe('Blog app', () => {
  beforeEach(() => {
    // empty the test database
    cy.request('POST', '/api/testing/reset')

    // add a test user to the database
    const user = {
      name: 'Steve Rogers',
      username: 'captainamerica',
      password: 'hailhydra',
    }
    cy.request('POST', '/api/users', user)

    cy.visit('/')
  })

  it('Login form is shown', () => {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type('captainamerica')
      cy.get('#password').type('hailhydra{enter}')

      cy.contains('You are now logged in!').then(() => {
        const userString = window.localStorage.getItem('loggedUser')

        expect(userString).to.be.a('string')
        const user = JSON.parse(userString)

        expect(user)
          .to.be.an('object')
          .that.includes.all.keys(['token', 'username'])

        expect(user.token).to.be.a('string')
      })
    })

    it('fails with wrong credentials', () => {
      cy.get('#username').type('captainamerica')
      cy.get('#password').type('iamironman{enter}')

      cy.get('#notification')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(178, 34, 34)')
    })
  })
})
