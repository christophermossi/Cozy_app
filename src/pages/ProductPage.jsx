import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useShop } from "../context/ShopContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./ProductPage.css";

const Products = ({ user, onLogout }) => {
  const { cartCount, addToCart, error: cartError } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_ELASTIC_IP}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });

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

  const handleAddToCart = (product) => {
    const success = addToCart(product);
    if (success && !cartError) {
      console.log('Added to cart successfully');
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Fixed Navbar */}
      <nav className="fixed-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <button className="logo-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Office.Com
          </button>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            {["Home", "Products", "Services", "About", "Contact"].map((item) =>
              item === "Home" ? (
                <Link key={item} to="/" className="nav-link">
                  {item}
                </Link>
              ) : (
                <button key={item} onClick={() => {
                  const el = document.getElementById(item.toLowerCase());
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="nav-link">
                  {item}
                </button>
              )
            )}
          </div>

          {/* Right Section */}
          <div className="nav-right">
            {/* Cart */}
            <div className="cart-icon">
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
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </div>

            {/* User/Login */}
            {user ? (
              <div className="user-section">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="user-button">
                  <Users size={18} />
                  {user.name}
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <button onClick={handleLogout} className="dropdown-logout">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="login-icon" 
                title="Login"
              >
                <Users size={20} />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="mobile-menu-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {["Home", "Products", "Services", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") {
                    window.location.href = "/";
                  } else {
                    const el = document.getElementById(item.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                className="mobile-nav-link"
              >
                {item}
              </button>
            ))}
            
            <Link to="/cart" className="mobile-cart-btn">
              Cart ({cartCount})
            </Link>

            {/* Mobile User Section */}
            {user ? (
              <div className="mobile-user">
                <p className="mobile-user-welcome">
                  Welcome, {user.name}!
                </p>
                <button onClick={handleLogout} className="mobile-user-logout">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="mobile-login"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      <h1 style={{
        fontSize: "2.2rem",
        fontWeight: "bold",
        color: "#3d4550ff",
        textAlign: "center",
        margin: "1rem 0"
      }}>
        Our Premium A4 Paper Collection
      </h1>

      {/* Products Grid */}
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product._id} style={styles.card}>
            <h2 style={styles.title}>{product.ProductName}</h2>
            <img className="imgpart" src={product.ImageURL} alt={product.ProductName}/>
            <p style={styles.price}>{product.Price}</p>
            <p style={styles.desc}>{product.Description}</p>
            <button style={styles.btn} onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <footer
        style={{
          background: "#1f2937",
          color: "#f3f4f6",
          padding: "2rem",
          marginTop: "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          <div className="footer-about">
            <h3>Office.Com</h3>
            <p>
              Your trusted partner for all office supply needs. Quality products,
              fast delivery, exceptional service.
            </p>
          </div>

          <div>
            <h4>Brands</h4>
            {[
              "Mondi Rotatrim A4 Copy Paper",
              "Typek A4 Copy Paper",
              "Paper One A4 Copy Paper",
              "Discovery A4 Copy Paper",
              "HP A4 Copy Paper",
            ].map((item) => (
              <button key={item} className="footer-link" style={linkStyle}>
                {item}
              </button>
            ))}
          </div>

          <div>
            <h4>Services</h4>
            {["Fast Delivery", "Bulk Orders", "Custom Solutions", "Support"].map(
              (item) => (
                <button key={item} className="footer-link" style={linkStyle}>
                  {item}
                </button>
              ))}
          </div>

          <div>
            <h4>Connect</h4>
            {["Email Us", "Live Chat", "Help Center", "Contact"].map((item) => (
              <button key={item} className="footer-link" style={linkStyle}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
          © 2025 Office.Com. All Rights Reserved.
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

const linkStyle = {
  background: "transparent",
  border: "none",
  color: "#f3f4f6",
  display: "block",
  margin: "0.5rem 0",
  textAlign: "left",
  cursor: "pointer",
  transition: "color 0.3s ease",
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(266px, 1fr))",
    gap: "1.5rem",
    padding: "6rem 8rem",
    background: "transparent",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e2e2",
    borderRadius: "15px",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textAlign: "center",
  },
  price: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#080a5eff",
    textAlign: "center",
  },
  desc: {
    textAlign: "center",
    fontSize: "14px",
    color: "#444",
    minHeight: "60px",
    marginBottom: "12px",
    lineHeight: "1.5",
  },
  btn: {
    width: "100%",
    padding: "10px 0",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "auto",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
};

export default Products;