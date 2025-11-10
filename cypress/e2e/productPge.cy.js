/// <reference types="cypress" />

describe('🛒 Product Page Tests (Live Backend)', () => {
  const frontendUrl = 'http://localhost:5173';
  const backendUrl = 'http://localhost:3000/Products'; // ✅ matches your backend

  beforeEach(() => {
    cy.visit(`${frontendUrl}/productpage`);
  });

  it('renders the product page correctly', () => {
    cy.contains('Our Premium A4 Paper Collection').should('be.visible');
    cy.url().should('include', '/productpage');
  });

  it('fetches and displays products from backend', () => {
    cy.request(backendUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').that.is.not.empty;

      const firstProduct = response.body[0];
      cy.contains(firstProduct.ProductName).should('be.visible');
    });
  });

  it('adds a product to the cart', () => {
    cy.get('button')
      .contains(/Add to Cart/i)
      .first()
      .click({ force: true });

    cy.get('.cart-badge').should('contain.text', '1');

    cy.window().then((win) => {
      const cart = JSON.parse(win.localStorage.getItem('cartItems') || '[]');
      expect(cart).to.have.length(1);
    });
  });

  it('navigates to the cart page', () => {
    cy.get('nav .cart-icon a').click({ force: true });
    cy.url().should('include', '/cart');
  });

  it('navigates home', () => {
    cy.get('nav').contains('Home').click({ force: true });
    cy.url().should('eq', `${frontendUrl}/`);
  });
});
