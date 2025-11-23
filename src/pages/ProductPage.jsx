import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useIp } from "../context/IpContext";
import { useShop } from "../context/ShopContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./ProductPage.css";

const Products = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { callBackend } = useIp();
  const { cartCount, addToCart, error: cartError } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await callBackend("/Products");
        if (!data) throw new Error("Failed to fetch products");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Scroll to About section
  useEffect(() => {
    if (window.location.hash === '#about') {
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setShowLoginModal(false);
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
    if (success && !cartError) console.log("Added to cart successfully");
  };

  const openProductPopup = (product) => {
    setSelectedProduct(product);
  };

  const closeProductPopup = () => {
    setSelectedProduct(null);
  };

  const scrollToSection = (section) => {
    if (section === 'home') {
      navigate('/');
    } else if (section === 'products') {
      navigate('/productpage');
    } else if (section === 'about') {
      navigate('/productpage#about');
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (section === 'contact') {
      navigate('/contact');
    }
  };

  const validProducts = products.filter(
    (p) =>
      p &&
      p._id &&
      p.ProductName &&
      p.ImageURL &&
      p.Price &&
      p.Description
  );

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Navbar */}
      <nav className="fixed-navbar">
        <div className="navbar-container">
          <button
            className="logo-btn"
            onClick={() => navigate('/')}
          >
            Office.Com
          </button>

          <div className="menu-desktop">
            {["Home", "Products", "About", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="menu-link"
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
            {["Home", "Products", "About", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(item.toLowerCase());
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

      <h1 className="products-title">Our Premium A4 Paper Collection</h1>

      {/* Products Grid */}
      <div className="products-grid">
        {validProducts.map((product) => (
          <div key={product._id} className="product-card" onClick={() => openProductPopup(product)} style={{ cursor: "pointer" }}>
            <h2 className="product-title">{product.ProductName}</h2>
            <img className="imgpart" src={product.ImageURL} alt={product.ProductName} />
            <p className="product-price">{product.Price}</p>
            <p className="product-desc">{product.Description}</p>
            <button className="add-btn" onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Product Popup Modal */}
      {selectedProduct && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={closeProductPopup}
        >
          <div 
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProductPopup}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 10
              }}
            >
              <X size={24} color="#374151" />
            </button>

            <div style={{ padding: "2rem", textAlign: "center" }}>
              <img 
                src={selectedProduct.ImageURL} 
                alt={selectedProduct.ProductName}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "0.5rem"
                }}
              />
            </div>

            <div style={{ padding: "0 2rem 2rem 2rem" }}>
              <h2 style={{ 
                fontSize: "1.8rem", 
                marginBottom: "1rem", 
                color: "#1f2937",
                fontWeight: "bold"
              }}>
                {selectedProduct.ProductName}
              </h2>
              
              <p style={{ 
                fontSize: "1.5rem", 
                color: "#2563eb", 
                fontWeight: "bold",
                marginBottom: "1rem"
              }}>
                {selectedProduct.Price}
              </p>
              
              <p style={{ 
                fontSize: "1rem", 
                color: "#6b7280", 
                lineHeight: "1.6",
                marginBottom: "1.5rem"
              }}>
                {selectedProduct.Description}
              </p>

              <button 
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  closeProductPopup();
                }}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Us Section */}
      <div
        id="about"
        className="about-us-section"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          marginTop: "2rem",
          backgroundColor: "#f9fafb",
          borderRadius: "0.5rem",
          gap: "2rem",
          flexWrap: "wrap",
          marginLeft: "30px",
          width: "95%"
        }}
      >
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src="https://twosides.info/wp-content/uploads/2023/06/The-Importance-Of-Paper-Based-Materials-In-Education-e1687338164565.jpg"
            alt="Office supplies"
            style={{ width: "100%", maxWidth: "400px", borderRadius: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          />
        </div>

        <div style={{ flex: "1 1 400px", maxWidth: "600px", color: "#374151" }}>
          <h2 style={{ marginBottom: "1rem", color: "#1f2937", fontSize: "2rem" }}>About Office.Com</h2>
          <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
            Welcome to <strong>Office.Com</strong>, your trusted source for premium A4 paper and top-quality office supplies.
            We are committed to providing products that make your work and study life easier, more organized, and productive.
          </p>
          <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
            Our team carefully curates each item to ensure the highest quality and best value for our customers.
            From fast shipping to responsive support, we aim to make your shopping experience seamless and enjoyable.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            Thank you for choosing <strong>Office.Com</strong> as your go-to destination for all your office essentials. 
            We look forward to supporting your productivity every day!
          </p>
        </div>

        <div
          className="about-us-section-2"
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 2rem",
            marginTop: "2rem",
            backgroundColor: "#ffffff",
            borderRadius: "0.5rem",
            gap: "2rem",
            flexWrap: "wrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ flex: "1 1 300px", textAlign: "center" }}>
            <img
              src="https://img.freepik.com/free-photo/business-team-working-together_23-2149333016.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Quality service"
              style={{ width: "100%", maxWidth: "400px", borderRadius: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
            />
          </div>

          <div style={{ flex: "1 1 400px", maxWidth: "600px", color: "#374151" }}>
            <h2 style={{ marginBottom: "1rem", color: "#1f2937", fontSize: "2rem" }}>Our Commitment</h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              At <strong>Office.Com</strong>, we don't just sell office supplies – we provide solutions. Our goal is to make
              every workspace efficient and inspiring by offering products that combine quality, affordability, and style.
            </p>
            <p style={{ lineHeight: "1.6" }}>
              We pride ourselves on fast shipping, excellent customer support, and a curated selection that meets the
              needs of professionals, students, and businesses alike. Your satisfaction is our top priority, and we are
              constantly innovating to serve you better.
            </p>
          </div>
        </div>
      </div>

      <footer
        className="first-footer"
        style={{
          width: "100%",
          backgroundColor: "#1f2937",
          padding: "1rem",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
          color: "#f3f4f6",
        }}
      >
        <h4>Office.Com</h4>
        <p>© {new Date().getFullYear()} Office.Com. All rights reserved.</p>
      </footer>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
        onLoginSuccess={(userData) => {
          localStorage.setItem("user", JSON.stringify(userData));
          setShowLoginModal(false);
        }}
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

export default Products;