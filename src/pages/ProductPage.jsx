import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useShop } from "../context/ShopContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./ProductPage.css";

const Products = ({ user, onLogout }) => {
  const { cartCount, addToCart, error: cartError, backendUrl } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Fetch products safely
  useEffect(() => {
    const fetchProducts = async () => {
      if (!backendUrl) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const handleLoginSuccess = () => window.location.reload();
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
    if (success && !cartError) console.log("Added to cart successfully");
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Navbar */}
      <nav className="fixed-navbar">
        <div className="navbar-container">
          <button
            className="logo-btn"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Office.Com
          </button>

          <div className="desktop-menu">
            {["Home", "Products", "Services", "About", "Contact"].map(
              (item) =>
                item === "Home" ? (
                  <Link key={item} to="/" className="nav-link">
                    {item}
                  </Link>
                ) : (
                  <button
                    key={item}
                    onClick={() => {
                      const el = document.getElementById(item.toLowerCase());
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="nav-link"
                  >
                    {item}
                  </button>
                )
            )}
          </div>

          <div className="nav-right">
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
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>

            {user ? (
              <div className="user-section">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-button"
                >
                  <Users size={18} /> {user.name}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <button
                      onClick={handleLogout}
                      className="dropdown-logout"
                    >
                      <LogOut size={16} /> Logout
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

            <button onClick={toggleMenu} className="mobile-menu-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            {["Home", "Products", "Services", "About", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "Home") window.location.href = "/";
                    else {
                      const el = document.getElementById(item.toLowerCase());
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="mobile-nav-link"
                >
                  {item}
                </button>
              )
            )}
            <Link to="/cart" className="mobile-cart-btn">
              Cart ({cartCount})
            </Link>
            {user ? (
              <div className="mobile-user">
                <p>Welcome, {user.name}!</p>
                <button onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)}>Login</button>
            )}
          </div>
        )}
      </nav>

      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          color: "#3d4550ff",
          textAlign: "center",
          margin: "1rem 0",
        }}
      >
        Our Premium A4 Paper Collection
      </h1>

      {/* Loading/Error */}
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Products Grid */}
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product._id} style={styles.card}>
            <h2 style={styles.title}>{product.ProductName}</h2>
            <img className="imgpart" src={product.ImageURL} alt={product.ProductName} />
            <p style={styles.price}>{product.Price}</p>
            <p style={styles.desc}>{product.Description}</p>
            <button style={styles.btn} onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <footer style={footerStyles}>{/* Keep footer JSX here */}</footer>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
        onLoginSuccess={handleLoginSuccess}
      />
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

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(266px, 1fr))", gap: "1.5rem", padding: "6rem 8rem" },
  card: { background: "#fff", border: "1px solid #e2e2e2", borderRadius: "15px", padding: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" },
  title: { fontSize: "1.3rem", fontWeight: "600", marginBottom: "0.5rem", background: "linear-gradient(45deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" },
  price: { fontSize: "15px", fontWeight: "bold", marginBottom: "0.5rem", color: "#080a5eff", textAlign: "center" },
  desc: { textAlign: "center", fontSize: "14px", color: "#444", minHeight: "60px", marginBottom: "12px", lineHeight: "1.5" },
  btn: { width: "100%", padding: "10px 0", background: "linear-gradient(90deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: "9px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "auto" },
};

const footerStyles = { background: "#1f2937", color: "#f3f4f6", padding: "2rem", marginTop: "2rem" };

export default Products;
