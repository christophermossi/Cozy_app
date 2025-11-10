/// <reference types="cypress" />

describe('🏠 Office.Com Homepage & Modal Tests', () => {
  const frontendUrl = 'http://localhost:5173'; // adjust if needed

  beforeEach(() => {
    cy.visit(frontendUrl);
    cy.wait(500); // simulate page load
  });

  // 🧱 Homepage basic checks
  it('Loads the homepage with correct title and hero section', () => {
    cy.contains('Welcome to').should('be.visible');
    cy.contains('Office.Com').should('be.visible');
    cy.get('.btn-primary').contains('Start Shopping').should('exist');
    cy.wait(300); // brief pause
  });

  // 🧭 Navbar rendering
  it('Navbar renders correctly with all menu links', () => {
    const menuItems = ['Home', 'Products', 'Services', 'About', 'Contact'];
    menuItems.forEach((item) => {
      cy.get('nav').contains(item).should('be.visible');
      cy.wait(100); // simulate human scanning
    });
  });

  // 🖱️ Navbar smooth scroll
  it('Scrolls smoothly to sections when clicking navbar buttons', () => {
    cy.contains('Products').click();
    cy.wait(300); // simulate scrolling time
    cy.get('#products').should('be.visible');
    cy.contains('Why Choose Office.Com?').should('exist');
  });

  // 📱 Mobile menu
  it('Opens and closes the mobile menu correctly', () => {
    cy.viewport('iphone-x');
    cy.get('.menu-mobile-btn button').click();
    cy.wait(200);
    cy.get('.menu-mobile').should('have.class', 'open');
    cy.get('.menu-mobile-link').should('have.length.at.least', 3);
    cy.wait(200);
    cy.get('.menu-mobile-btn button').click();
    cy.get('.menu-mobile').should('have.class', 'closed');
  });

  // 🔐 LOGIN MODAL TEST
  it('Displays login modal when login button is clicked', () => {
    cy.get('.login-btn').click();
    cy.wait(200);
    cy.get('.login-modal', { timeout: 5000 })
      .should('exist')
      .and('be.visible');

    // ✅ Check form elements
    cy.get('.login-form').within(() => {
      cy.get('input[name="Email"]').should('exist').and('be.visible');
      cy.wait(100);
      cy.get('input[name="Password"]').should('exist').and('be.visible');
      cy.wait(100);
      cy.contains('Sign In').should('exist').and('be.visible');
    });
  });

  // 🔄 SWITCH TO SIGNUP MODAL
  it('Switches from login modal to signup modal', () => {
    cy.get('.login-btn').click();
    cy.wait(200);
    cy.get('.login-modal').should('be.visible');
    cy.contains('Sign Up').click({ force: true });
    cy.wait(200);

    cy.get('.login-modal-overlay').should('exist').and('be.visible');
    cy.get('.signup-form').should('be.visible');
    cy.wait(100);
  });

  // 🧑‍💻 SIGNUP MODAL TEST
  it('Displays signup modal directly (if triggered)', () => {
    // Simulate opening signup modal directly
    cy.window().then((win) => {
      win.dispatchEvent(new CustomEvent('openSignupModal'));
    });

    cy.wait(200);

    // Or open via login -> switch
    cy.get('.login-btn').click();
    cy.wait(200);
    cy.contains('Sign Up').click({ force: true });
    cy.wait(200);

    cy.get('.signup-form').within(() => {
      cy.get('input[name="UserID"]').should('exist');
      cy.wait(100);
      cy.get('input[name="Password"]').should('exist');
      cy.wait(100);
      cy.get('input[name="Email"]').should('exist');
      cy.wait(100);
      cy.contains('Sign Up').should('exist');
    });
  });

  // 👤 LOGGED-IN USER DROPDOWN
  it('Shows user dropdown when user is logged in', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({ name: 'Cozy Tester' }));
    });
    cy.reload();
    cy.wait(200);

    cy.get('.user-btn').should('contain.text', 'Cozy Tester');
    cy.get('.user-btn').click();
    cy.wait(100);
    cy.get('.logout-btn').should('be.visible');
  });

  // 🚪 LOGOUT FUNCTIONALITY
  it('Logs out user successfully', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({ name: 'Cozy Tester' }));
    });
    cy.reload();
    cy.wait(200);

    cy.get('.user-btn').click();
    cy.wait(100);
    cy.get('.logout-btn').click();
    cy.wait(200);

    cy.window().its('localStorage.user').should('not.exist');
  });

  // 🧭 SCROLL NAVBAR BEHAVIOR
  it('Scroll changes navbar appearance', () => {
    cy.scrollTo('bottom');
    cy.wait(500); // allow scroll listeners to update
    cy.get('nav').should('have.class', 'navbar-scrolled');
  });

  // 🦶 FOOTER TEST
  it('Footer renders and contains expected links', () => {
    cy.scrollTo('bottom');
    cy.wait(200);
    cy.get('.first-footer').should('exist');
    cy.get('.footer-grid').within(() => {
      cy.contains('Brands').should('exist');
      cy.wait(50);
      cy.contains('Services').should('exist');
      cy.wait(50);
      cy.contains('Connect').should('exist');
    });
    cy.wait(100);
    cy.get('.footer-bottom').contains('© 2025 Office.Com').should('exist');
  });
});
