/// <reference types="cypress" />

describe("🛒 Cart Page Tests (Frontend + Backend)", () => {
  const frontendUrl = "http://localhost:5173";
  const backendUrl = "http://localhost:3000/Cart"; // ✅ your backend route (capital C)

  // Verify backend first
  it("verifies backend /Cart endpoint responds correctly", () => {
    cy.request(backendUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  // Visit the frontend cart page
  context("Cart Page UI", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/cart`);
    });

    it("renders the cart page and title correctly", () => {
      cy.contains("🛒 Your Shopping Cart").should("be.visible");
      cy.url().should("include", "/cart");
    });

    it("shows empty cart message if no items", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Your cart is empty.")) {
          cy.contains("Your cart is empty.").should("be.visible");
          cy.contains("Continue Shopping").should("be.visible");
        }
      });
    });

    it("displays cart items when available", () => {
      // Only check if items exist
      cy.get("body").then(($body) => {
        if ($body.find(".cart-item").length > 0) {
          cy.get(".cart-item").first().should("be.visible");
          cy.get(".product-name").first().should("exist");
          cy.get(".price").first().should("exist");
        } else {
          cy.log("Cart is empty, skipping product checks.");
        }
      });
    });

    it("updates quantity buttons if items exist", () => {
      cy.get("body").then(($body) => {
        if ($body.find(".cart-item").length > 0) {
          cy.get(".cart-item").first().within(() => {
            cy.get("button").contains("+").click({ force: true });
            cy.get("button").contains("-").click({ force: true });
          });
        } else {
          cy.log("Cart is empty, skipping quantity test.");
        }
      });
    });

    it("removes an item if items exist", () => {
      cy.get("body").then(($body) => {
        if ($body.find(".remove-btn").length > 0) {
          cy.get(".remove-btn").first().click({ force: true });
        } else {
          cy.log("No items to remove, skipping test.");
        }
      });
    });

    it("checks navigation links", () => {
      // Click Home
      cy.get("nav").contains("Home").click({ force: true });
      cy.url().should("eq", `${frontendUrl}/`);

      // Back to Cart
      cy.visit(`${frontendUrl}/cart`);

      // Click Products
      cy.get("nav").contains("Products").click({ force: true });
      cy.url().should("include", "/productpage");
    });

    it("proceeds to checkout when items exist", () => {
      cy.visit(`${frontendUrl}/cart`);
      cy.get("body").then(($body) => {
        if ($body.find(".checkout-btn").length > 0) {
          cy.get(".checkout-btn").click({ force: true });
          cy.url().should("include", "/checkout");
        } else {
          cy.log("No checkout button (empty cart)");
        }
      });
    });
  });
});
