import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useShop } from "../context/ShopContext";
import LoginModal from "../pages/LoginModal";
import SignUpModal from "../pages/SignUpModal";
import "./ContactUs.css";
import emailjs from "emailjs-com";

const ContactUs = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { cartCount } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const scrollToSection = (section) => {
    if (section === 'home') {
      navigate('/');
    } else if (section === 'products') {
      navigate('/productpage');
    } else if (section === 'about') {
      navigate('/productpage#about');
    } else if (section === 'contact') {
      navigate('/contact');
    }
  };

  // 🚀 UPDATED EMAILJS SUBMIT HANDLER
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_zvmlonh",     // Your Service ID
        "template_wl1pxd7",    // Your Template ID
        {
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          message: formData.message,
        },
        "-BSe47CJ6xb9xRsYI"    // Your Public Key
      )
      .then(() => {
        setSubmitStatus("success");

        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          message: ""
        });

        setTimeout(() => setSubmitStatus(""), 3000);
      })
      .catch(() => {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus(""), 3000);
      });
  };

  return (
    <div className="contact-page">
      {/* Navbar */}
      <nav className="fixed-navbar">
        <div className="navbar-container">
          <button className="logo-btn" onClick={() => navigate('/')}>
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
                    <button onClick={handleLogout} className="dropdown-logout">
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

      {/* Contact Content */}
      <div className="contact-content">
        <div className="contact-form-container">
          <h1 className="form-title">How Can We Contact You?</h1>
          
          <form onSubmit={handleSubmit} className="contact-form-main">
            <div className="form-field">
              <label htmlFor="name">Name :</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contactNumber">Contact Number :</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message :</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                required
                className="form-control form-textarea-main"
              />
            </div>

            <button type="submit" className="submit-button">
              SUBMIT
            </button>

            {submitStatus === "success" && (
              <p className="success-alert">Your message has been sent!</p>
            )}

            {submitStatus === "error" && (
              <p className="error-alert">Failed to send message. Try again.</p>
            )}
          </form>
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

export default ContactUs;
