import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import ProductPage from "./ProductPage";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";


import {
  Menu,
  X,
  Package,
  Truck,
  MessageCircle,
  Star,
  Users,
  Clock,
  Award,
  LogOut,
} from "lucide-react";

const Homepage = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

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

  return (
    <>
      <div className="page">
        {/* Navigation */}
        <nav className={`navbar ${isScrolled ? "navbar-scrolled" : "navbar-top"}`}>
          <div className="nav-container">
            <div className="nav-content">
              {/* Logo */}
              <div className="logo">
                <button onClick={() => scrollToSection("home")}>
                  Office.Com
                </button>
              </div>

              {/* Desktop Menu */}
              <div className="menu-desktop">
                {["Home", "Products", "Services", "About", "Contact"].map(
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

              {/* Right Section with CTA and User */}
              <div className="cta-desktop">
                <Link to="/productpage">
                  <button className="shop-now-btn">
                    Shop Now
                  </button>
                </Link>

                {/* Dynamic User/Login Section */}
                {user ? (
                  <div className="user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="user-btn"
                    >
                      <Users size={18} />
                      {user.name}
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="user-dropdown">
                        <button onClick={handleLogout} className="logout-btn">
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowLoginModal(true)} 
                    className="login-btn" 
                    title="Login"
                  >
                    <Users size={20} />
                  </button>
                )}

                {/* Mobile Menu Button */}
                <div className="menu-mobile-btn">
                  <button onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`menu-mobile ${isMenuOpen ? "open" : "closed"}`}>
            {["Home", "Products", "Services", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="menu-mobile-link"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("products")}
              className="btn-primary"
            >
              Shop Now
            </button>

            {/* Mobile User Section */}
            {user ? (
              <div className="mobile-user-section">
                <p className="mobile-welcome">
                  Welcome, {user.name}!
                </p>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="btn-primary"
              >
                Login
              </button>
            )}
          </div>
        </nav>

        {/* Rest of your existing content remains the same */}
        <section id="home" className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Office.Com!</span>
            </h1>
            <p className="hero-subtitle">
              Your trusted source for high-quality A4 paper, delivered quickly and reliably.
            </p>
            <button
              onClick={() => scrollToSection("products")}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        </section>

        <section id="products" className="section light">
          <div className="section-header">
            <h2>Why Choose Office.Com?</h2>
            <p>
              We're committed to providing the best office supply experience with
              quality products and exceptional service.
            </p>
          </div>

          <div className="features">
            {[
              {
                icon: <Package />,
                title: "Wide Product Range",
                description:
                  "From A4 paper to the latest office gadgets, all at great prices.",
              },
              {
                icon: <Truck />,
                title: "Fast Delivery",
                description:
                  "Get your orders delivered reliably within 24-48 hours.",
              },
              {
                icon: <MessageCircle />,
                title: "24/7 Support",
                description:
                  "Friendly customer support team ready to help anytime.",
              },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section dark">
          <div className="section-header">
            <h2>Trusted by Thousands</h2>
            <p>Join our growing community of satisfied customers</p>
          </div>

          <div className="stats">
            {[
              { icon: <Users />, number: "50K+", label: "Happy Customers" },
              { icon: <Package />, number: "10K+", label: "Products Available" },
              { icon: <Star />, number: "99%", label: "Customer Satisfaction" },
              { icon: <Clock />, number: "24h", label: "Average Delivery" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="section light">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Everything you need for your office, delivered with excellence</p>
          </div>

          <div className="services">
            {[
              "Office Supplies",
              "Technology Solutions",
              "Furniture & Equipment",
              "Custom Bulk Orders",
            ].map((service, i) => (
              <div key={i} className="service-card">
                <div className="service-icon">
                  <Award />
                </div>
                <h3>{service}</h3>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="first-footer">
          <div className="footer-grid">
            <div className="footer-about">
              <h3>Office.Com</h3>
              <p>
                Your trusted partner for all office supply needs. Quality
                products, fast delivery, exceptional service.
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
                <button key={item} className="footer-link">
                  {item}
                </button>
              ))}
            </div>

            <div>
              <h4>Services</h4>
              {["Fast Delivery", "Bulk Orders", "Custom Solutions", "Support"].map(
                (item) => (
                  <button key={item} className="footer-link">
                    {item}
                  </button>
                )
              )}
            </div>

            <div>
              <h4>Connect</h4>
              {["Email Us", "Live Chat", "Help Center", "Contact"].map((item) => (
                <button key={item} className="footer-link">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Office.Com. All rights reserved.</p>
          </div>
        </section>
      </div>

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
    </>
  );
};

export default Homepage;