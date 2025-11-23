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
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Homepage = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // A4 Paper Products with real image URLs
  const a4Products = [
    {
      id: 1,
      name: "Mondi Rotatrim A4 Copy Paper",
      price: "$24.99",
      rating: 4.8,
      image: "https://mcsofficesupplies.co.za/image/cache/catalog/0-2025/Rotatrim/Rotatrim-A4-Paper-Box-Ream-320x320h.webp",
      stock: "In Stock"
    },
    {
      id: 2,
      name: "Typek A4 Copy Paper",
      price: "$22.99",
      rating: 4.7,
      image: "https://www.kalideck.co.za/web/wp-content/uploads/2018/11/Typek-sappi-white-office-paper-main.jpg",
      stock: "In Stock"
    },
    {
      id: 3,
      name: "Paper One A4 Copy Paper",
      price: "$21.99",
      rating: 4.9,
      image: "https://m.media-amazon.com/images/I/717s9vcM2-L.jpg",
      stock: "In Stock"
    },
    {
      id: 4,
      name: "Discovery A4 Copy Paper",
      price: "$23.99",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/716PRNznoGL.jpg",
      stock: "In Stock"
    },
    {
      id: 5,
      name: "HP A4 Copy Paper",
      price: "$25.99",
      rating: 4.8,
      image: "https://content.storefront7.co.za/stores/za.co.storefront7.formax/products/f1-30001-x/pictures/f1-30001-x_d0fi.jpg?width=1026&height=1026",
      stock: "In Stock"
    },
    {
      id: 6,
      name: "Xerox A4 Copy Paper",
      price: "$23.49",
      rating: 4.7,
      image: "https://unlimitedpapers.co.za/images/10-10.jpg",
      stock: "Low Stock"
    },
  ];

  const productsPerPage = 3;
  const totalPages = Math.ceil(a4Products.length / productsPerPage);

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

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentProducts = a4Products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <>
      <div className="page">
        {/* Navigation - Same as before */}
        <nav className={`navbar ${isScrolled ? "navbar-scrolled" : "navbar-top"}`}>
          <div className="nav-container">
            <div className="nav-content">
              <div className="logo">
                <button onClick={() => scrollToSection("home")}>
                  Office.Com
                </button>
              </div>

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

              <div className="cta-desktop">
                <Link to="/productpage">
                  <button className="shop-now-btn">
                    Shop Now
                  </button>
                </Link>

                {user ? (
                  <div className="user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="user-btn"
                    >
                      <Users size={18} />
                      {user.name}
                    </button>
                    
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

                <div className="menu-mobile-btn">
                  <button onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

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

        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Office.Com!</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-delay">
              Your trusted source for high-quality A4 paper, delivered quickly and reliably.
            </p>
            <button
              onClick={() => scrollToSection("products")}
              className="btn-primary animate-fade-in-delay-2"
            >
              Start Shopping
            </button>
          </div>
        </section>

        {/* A4 Paper Products Section with Pagination */}
        <section id="products" className="section light products-section">
          <div className="section-header">
            <h2 className="slide-in">Premium A4 Paper Collection</h2>
            <p>
              Discover our range of high-quality A4 copy paper from trusted brands
            </p>
          </div>

          <div className="products-carousel">
            <button onClick={prevPage} className="carousel-btn prev-btn" aria-label="Previous">
              <ChevronLeft size={24} />
            </button>

            <div className="products-grid">
              {currentProducts.map((product, index) => (
                <div key={product.id} className="product-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="product-image">
                    <div className="product-badge">{product.stock}</div>
                    <img src={product.image} alt={product.name} className="product-img" />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      <Star size={16} fill="#facc15" color="#facc15" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="product-price">R349</div>
                    <button className="add-to-cart-btn">
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={nextPage} className="carousel-btn next-btn" aria-label="Next">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="pagination-dots">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`dot ${currentPage === index ? "active" : ""}`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="section dark">
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
              <div key={i} className="feature-card zoom-in" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="section light about-section">
          <div className="about-container">
            <div className="about-content">
              <h2 className="slide-in-left">About Office.Com</h2>
              <p className="fade-in">
                Founded with a passion for quality and service, Office.Com has become the go-to destination 
                for businesses and individuals seeking premium office supplies. We understand that the right 
                paper makes all the difference in your work, which is why we partner with only the most 
                trusted brands in the industry.
              </p>
              <p className="fade-in">
                Our commitment goes beyond just selling products. We believe in building lasting relationships 
                with our customers by providing exceptional service, competitive pricing, and fast, reliable 
                delivery. Whether you're a small business, a large corporation, or an individual, we're here 
                to meet all your office supply needs.
              </p>
              <div className="about-values">
                <div className="value-item zoom-in">
                  <Award size={32} color="#2563eb" />
                  <h4>Quality First</h4>
                  <p>Only premium products from trusted brands</p>
                </div>
                <div className="value-item zoom-in">
                  <Users size={32} color="#2563eb" />
                  <h4>Customer Focused</h4>
                  <p>Your satisfaction is our top priority</p>
                </div>
                <div className="value-item zoom-in">
                  <Clock size={32} color="#2563eb" />
                  <h4>Fast & Reliable</h4>
                  <p>Quick delivery you can count on</p>
                </div>
              </div>
            </div>
          </div>

         
        </section>

    
    

        {/* Enhanced E-commerce Footer */}
        <footer id="contact" className="ecommerce-footer">
          <div className="footer-main">
            <div className="footer-grid">
              <div className="footer-about">
                <h3>Office.Com</h3>
                <p>
                  Your trusted partner for all office supply needs. Quality
                  products, fast delivery, exceptional service since 2020.
                </p>
                <div className="social-links">
                  <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                  <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                  <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                  <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                </div>
              </div>

              <div className="footer-column">
                <h4>Shop</h4>
                <a href="#products" className="footer-link">All Products</a>
                <a href="#" className="footer-link">Best Sellers</a>
                <a href="#" className="footer-link">New Arrivals</a>
                <a href="#" className="footer-link">Special Offers</a>
                <a href="#" className="footer-link">Bulk Orders</a>
              </div>

              <div className="footer-column">
                <h4>Customer Service</h4>
                <a href="#" className="footer-link">Track Order</a>
                <a href="#" className="footer-link">Shipping Info</a>
                <a href="#" className="footer-link">Returns & Refunds</a>
                <a href="#" className="footer-link">FAQ</a>
                <a href="#" className="footer-link">Help Center</a>
              </div>

              <div className="footer-column">
                <h4>Contact Us</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>support@office.com</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>1-800-OFFICE-1</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={16} />
                    <span>123 Business Ave, Suite 100</span>
                  </div>
                  <div className="contact-item">
                    <Clock size={16} />
                    <span>Mon-Fri: 9AM-6PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>© 2025 Office.Com. All rights reserved.</p>
              <div className="footer-links-bottom">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
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