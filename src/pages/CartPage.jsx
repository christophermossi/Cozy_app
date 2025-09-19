import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useShop } from "../context/ShopContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import.meta.env.VITE_ELASTIC_IP 
import "./CartPage.css";

const Cart = ({ user, onLogout }) => {
  const { 
    cartItems, 
    cartCount, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    loadCartItemsWithAPI,
    loading: cartLoading,
    error: cartError
  } = useShop();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItemsWithAPI();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const handleLoginSuccess = (userData) => {
    window.location.reload();
  };

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id, currentQty, change) => {
    const newQty = Math.max(1, (parseInt(currentQty) || 1) + change);
    updateQuantity(id, newQty);
  };

  const totalPrice = getCartTotal();

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Fixed Navbar */}
      <nav className="cart-navbar">
        <div className="cart-navbar-container">
          {/* Logo */}
          <button className="cart-logo" onClick={() => navigate("/")}>
            Office.Com
          </button>

          {/* Desktop Menu */}
          <div className="cart-desktop-menu">
            {["Home", "Products", "Services", "About", "Contact"].map((item) =>
              item === "Home" ? (
                <Link key={item} to="/" className="cart-nav-link">
                  {item}
                </Link>
              ) : item === "Products" ? (
                <Link key={item} to="/productpage" className="cart-nav-link">
                  {item}
                </Link>
              ) : (
                <button
                  key={item}
                  onClick={() => {
                    const el = document.getElementById(item.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="cart-nav-link"
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Right Section */}
          <div className="cart-nav-right">
            {/* Cart Icon */}
            <div className="cart-icon-section">
              <Link to="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  style={{ width: "24px", height: "24px", color: "#2563eb" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M5 21h14"
                  />
                </svg>
              </Link>
              {cartCount > 0 && (
                <span className="cart-count-badge">
                  {cartCount}
                </span>
              )}
            </div>

            {/* User Section */}
            {user ? (
              <div className="cart-user-section">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="cart-user-btn">
                  <Users size={18} />
                  {user.name}
                </button>
                
                {showUserMenu && (
                  <div className="cart-user-dropdown">
                    <button onClick={handleLogout} className="cart-logout-btn">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="cart-login-link" 
                title="Login"
              >
                <Users size={20} />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="cart-mobile-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="cart-mobile-menu">
            {["Home", "Products", "Services", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") {
                    navigate("/");
                  } else if (item === "Products") {
                    navigate("/productpage");
                  } else {
                    const el = document.getElementById(item.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                className="cart-mobile-link"
              >
                {item}
              </button>
            ))}

            {/* Mobile User Section */}
            {user ? (
              <div className="cart-mobile-user">
                <p className="cart-mobile-welcome">
                  Welcome, {user.name}!
                </p>
                <button onClick={handleLogout} className="cart-mobile-logout">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="cart-mobile-login"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Cart Page Content */}
      <div className="page-wrapper">
        <h1 className="title">🛒 Your Shopping Cart</h1>

        {cartLoading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading cart items...</p>
          </div>
        ) : cartError ? (
          <div className="error-container" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>{cartError}</p>
            <button 
              onClick={() => loadCartItemsWithAPI()} 
              style={{ 
                marginTop: '1rem', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Retry
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart-container" style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="empty-cart">Your cart is empty.</p>
            <Link 
              to="/productpage" 
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="items-section">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={item.ImageURL || "/placeholder-image.jpg"}
                    alt={item.ProductName || "Product"}
                    className="cart-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="cart-details">
                    <h3 className="product-name">{item.ProductName || "Unknown Product"}</h3>
                    <p className="price">{item.Price || "Price not available"}</p>
                    <div className="qty">
                      <span>Quantity: </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.qty || 1, -1)}
                        style={{ marginLeft: "6px" }}
                        disabled={cartLoading || (item.qty || 1) <= 1}
                      >
                        -
                      </button>
                      <span style={{ margin: "0 8px" }}>{item.qty || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.qty || 1, 1)}
                        disabled={cartLoading}
                      >
                        +
                      </button>
                    </div>

                    <p className="desc">
                      {item.Description || "No description available"}
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item._id)}
                      disabled={cartLoading}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-section">
              <h3 className="summary-title">Order Summary</h3>
              <p className="summary-text">Items in Cart: {cartItems.length}</p>
              <p className="summary-text">Subtotal: R {totalPrice.toFixed(2)}</p>
              <p className="summary-text">
                Delivery Fee: <strong>Free</strong>
              </p>
              <hr />
              <h4 className="total">Total: R {totalPrice.toFixed(2)}</h4>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
                disabled={cartLoading}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <footer
        className="footer"
        style={{
          width: "105.3%",
          backgroundColor: "#1f2937",
          padding: "1rem",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
          color: "#f3f4f6",
        }}
      >
        <h4>Office.Com</h4>
        <p>© {new Date().getFullYear()} Office.Com. All rights reserved.</p>
        <p>
          <Link to="/" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Home</Link> | 
          <Link to="/productpage" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Products</Link> |
          <Link to="/contact" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Contact</Link>
        </p>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* SignUp Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onSignUpSuccess={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default Cart;