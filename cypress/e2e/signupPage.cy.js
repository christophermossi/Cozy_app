/// <reference types="cypress" />

describe('🧾 Sign Up Page Tests', () => {
  const frontendUrl = 'http://localhost:5173';
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    // Intercept the signup POST request
    cy.intercept('POST', `${apiUrl}/signup`, (req) => {
      const { UserID, Password, Email } = req.body;

      if (!UserID || !Password || !Email) {
        req.reply({
          statusCode: 400,
          body: { message: 'Invalid data' }
        });
      } else if (UserID === 'existingUser') {
        req.reply({
          statusCode: 409,
          body: { message: 'User already exists' }
        });
      } else {
        req.reply({
          statusCode: 201,
          body: { message: 'Account created successfully!', success: true }
        });
      }
    }).as('signupRequest');

    // Visit signup page
    cy.visit(`${frontendUrl}/signup`);
  });

  it('Loads the signup page correctly', () => {
    cy.get('h2').should('contain.text', 'Create Account');
    cy.get('input[name="UserID"]').should('exist');
    cy.get('input[name="Password"]').should('exist');
    cy.get('input[name="Email"]').should('exist');
    cy.contains('Sign Up').should('exist');
  });

  it('Shows an error if a field is missing', () => {
    cy.get('input[name="UserID"]').type('newUser');
    cy.get('input[name="Password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (text) => {
      expect(text).to.include('Signup failed');
    });
  });

  it('Handles user already exists (409 error)', () => {
    cy.get('input[name="UserID"]').type('existingUser');
    cy.get('input[name="Password"]').type('password123');
    cy.get('input[name="Email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@signupRequest');
    cy.on('window:alert', (text) => {
      expect(text).to.include('user already exists');
    });
  });

  it('Successfully creates account and redirects', () => {
    cy.get('input[name="UserID"]').type('newUser');
    cy.get('input[name="Password"]').type('password123');
    cy.get('input[name="Email"]').type('newuser@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@signupRequest');
    cy.on('window:alert', (text) => {
      expect(text).to.include('Account created successfully');
    });
  });

  it('Has a working link to the login page', () => {
    cy.contains('Login').should('have.attr', 'href', '/login');
  });
});
