import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Users, LogOut, Package, CheckCircle, Truck, Clock } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useIp } from "../context/IpContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./OrderPage.css";

const OrderPage = ({ user, onLogout }) => {
  const { callBackend } = useIp();
  const { cartItems, getCartTotal } = useShop();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState({ fullName: "", address: "", location: "" });
  const [daysLeft, setDaysLeft] = useState(3);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await callBackend("/Products");
        if (!data) console.error("Failed to fetch products: No data received");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

    const storedInfo = JSON.parse(localStorage.getItem("orderInfo")) || {};
    setOrderInfo(storedInfo);

    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 800);

    const countdown = setInterval(() => {
      setDaysLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 86400000);

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callBackend]);

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
    navigate("/");
  };

  const handleLoginSuccess = () => window.location.reload();
  const handleSwitchToSignUp = () => { setShowLoginModal(false); setShowSignUpModal(true); };
  const handleSwitchToLogin = () => { setShowSignUpModal(false); setShowLoginModal(true); };
  const totalPrice = getCartTotal();

  return (
    <div className="order-page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <button className="logo" onClick={() => navigate("/")}>Office.Com</button>
          <div className="nav-links">
            {["Home", "Products", "Cart", "Payment", "About", "Contact"].map((item) =>
              item === "Home" ? (
                <Link key={item} to="/" className="nav-link">{item}</Link>
              ) : item === "Products" ? (
                <Link key={item} to="/productpage" className="nav-link">{item}</Link>
              ) : item === "Cart" ? (
                <Link key={item} to="/cart" className="nav-link">{item}</Link>
              ) : item === "Payment" ? (
                <Link key={item} to="/payment" className="nav-link">{item}</Link>
              ) : (
                <button key={item} onClick={() => {
                  const el = document.getElementById(item.toLowerCase());
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="nav-link-btn">{item}</button>
              )
            )}
          </div>

          <div className="user-menu-container">
            {user ? (
              <div className="user-menu-wrapper">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="user-btn">
                  <Users size={18} /> {user.name}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button onClick={handleLogout} className="logout-btn">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="login-icon" title="Login">
                <Users size={20} />
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {["Home", "Products", "Cart", "Payment", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") navigate("/");
                  else if (item === "Products") navigate("/productpage");
                  else if (item === "Cart") navigate("/cart");
                  else if (item === "Payment") navigate("/payment");
                  else {
                    const el = document.getElementById(item.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                className="mobile-menu-link"
              >
                {item}
              </button>
            ))}

            {user ? (
              <div className="mobile-user-section">
                <p>Welcome, {user.name}!</p>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="login-btn">Login</button>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="order-main">
        <h1 className="order-title">Your Order</h1>

        {user ? (
          <div className="order-card">
            <h2>Order Confirmation</h2>
            <p>Thank you, {orderInfo.fullName || user.name}, for your order! Your items are being processed.</p>

            <div className="order-section">
              <h3>Shipping Information</h3>
              <p>{orderInfo.address}, {orderInfo.location}</p>
            </div>

            <div className="order-section">
              <h3>Order Items</h3>
              {cartItems.length === 0 ? <p>No items in your order.</p> : (
                <ul className="order-items">
                  {cartItems.map((item) => (
                    <li key={item._id}>
                      <span>{item.ProductName} x {item.qty || 1}</span>
                      <span>{item.Price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="order-section">
              <h3>Total: R {totalPrice.toFixed(2)}</h3>
            </div>

            <div className="order-section">
              <h3>Order Status</h3>
              <div className="progress-wrapper">
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <span>{progress}% Complete</span>
              </div>

              <div className="order-stages">
                {[{ icon: Package, label: "Order Placed", active: progress >= 25 },
                  { icon: CheckCircle, label: "Processing", active: progress >= 50 },
                  { icon: Truck, label: "Shipped", active: progress >= 75 },
                  { icon: Clock, label: "Delivered", active: progress >= 100 }].map((stage, index) => (
                  <div key={index} className={`stage ${stage.active ? "active" : ""}`}>
                    <stage.icon size={24} />
                    <p>{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-section">
              <h3>Estimated Delivery</h3>
              <p>{daysLeft === 0 ? "Arriving today!" : `Arrives in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`}</p>
            </div>
          </div>
        ) : (
          <div className="order-login-card">
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your order details.</p>
            <button onClick={() => setShowLoginModal(true)} className="login-btn">Login</button>
          </div>
        )}
      </main>


      {/* Footer */}
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
                   <p>
                     <Link to="/" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Home</Link> | 
                     <Link to="/productpage" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Products</Link> |
                     <Link to="/contact" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Contact</Link>
                   </p>
                 </footer>

      {/* Modals */}
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
        onSignUpSuccess={() => { setShowSignUpModal(false); setShowLoginModal(true); }}
      />
    </div>
  );
};

export default OrderPage;
