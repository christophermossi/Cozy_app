import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Users, LogOut, CreditCard, Calendar, Lock, Package, ShoppingCart } from "lucide-react";
import { useIp } from "../context/IpContext"; // Import IpContext
import "./PaymentPage.css";

const PaymentPage = ({ user, onLogout }) => {
  const { callBackend } = useIp(); // Include IpContext for consistency
  const navigate = useNavigate();
  const [checkoutInfo, setCheckoutInfo] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const storedCheckout = JSON.parse(localStorage.getItem("checkoutInfo")) || {};
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCheckoutInfo(storedCheckout);
    setCartItems(storedCart);

    if (user && user.name) {
      setCardName(user.name);
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  const totalPrice = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.Price.replace(/[^0-9.]/g, "")) || 0;
    return acc + priceNum * (item.qty || 1);
  }, 0);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert("Please fill in all card details!");
        return;
      }
      
      // Basic validation
      if (cardNumber.replace(/\s/g, "").length < 13) {
        alert("Please enter a valid card number!");
        return;
      }
      
      if (cvv.length < 3) {
        alert("Please enter a valid CVV!");
        return;
      }
      
      if (!expiryDate.includes("/") || expiryDate.length !== 5) {
        alert("Please enter a valid expiry date (MM/YY)!");
        return;
      }
    }

    const orderInfo = {
      fullName: checkoutInfo.fullName || (user ? user.name : ""),
      address: checkoutInfo.address || "",
      location: checkoutInfo.location || "",
      paymentMethod: paymentMethod,
      totalAmount: totalPrice.toFixed(2),
    };
    localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

    setShowModal(true);
  };

  const handleOrderConfirm = () => {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartCount");
    localStorage.removeItem("checkoutInfo");
    setShowModal(false);
    navigate("/order");
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  return (
    <div className="payment-page-wrapper">
      {/* 🔹 LEFT SIDE SMALL IMAGES */}
      <div className="payment-side left-side">
        <img src="https://img.freepik.com/free-vector/credit-card-landing-page-payment-concept_23-2148298750.jpg?semt=ais_hybrid&w=740&q=80" alt="promo" />
        <img src="https://img.freepik.com/free-vector/concept-credit-card-payment-landing-page_52683-24923.jpg?semt=ais_hybrid&w=740&q=80" alt="promo" />
      </div>

      {/* 🔹 RIGHT SIDE SMALL IMAGES */}
      <div className="payment-side right-side">
        <img src="https://img.freepik.com/free-photo/3d-render-house-bills-payment-online-invoice_107791-16723.jpg?semt=ais_hybrid&w=740&q=80" alt="promo" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6K5wbNEcOsPWyO60lnwjdGfF-szwLtC8Utw&s" alt="promo" />
      </div>

      {/* Fixed Navbar */}
      <nav className="payment-navbar">
        <div className="payment-navbar-container">
          <button className="payment-logo" onClick={() => navigate("/")}>
            Office.Com
          </button>

          <div className="payment-desktop-menu">
            {["Home", "Products", "Cart","Contact"].map((item) =>
              item === "Home" ? (
                <Link key={item} to="/" className="payment-nav-link">
                  {item}
                </Link>
              ) : item === "Products" ? (
                <Link key={item} to="/productpage" className="payment-nav-link">
                  {item}
                </Link>
              ) : item === "Cart" ? (
                <Link key={item} to="/cart" className="payment-nav-link">
                  {item}
                </Link>
              ) : (
                <button
                  key={item}
                  onClick={() => {
                    const el = document.getElementById(item.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="payment-nav-link"
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="payment-nav-right">
            {user ? (
              <div className="payment-user-section">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="payment-user-btn">
                  <Users size={18} />
                  {user.name}
                </button>
                
                {showUserMenu && (
                  <div className="payment-user-dropdown">
                    <button onClick={handleLogout} className="payment-logout-btn">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="payment-login-link" title="Login">
                <Users size={20} />
              </Link>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="payment-mobile-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="payment-mobile-menu">
            {["Home", "Products", "Cart", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") navigate("/");
                  else if (item === "Products") navigate("/productpage");
                  else if (item === "Cart") navigate("/cart");
                  else {
                    const el = document.getElementById(item.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                className="payment-mobile-link"
              >
                {item}
              </button>
            ))}

            {user ? (
              <div className="payment-mobile-user">
                <p className="payment-mobile-welcome">Welcome, {user.name}!</p>
                <button onClick={handleLogout} className="payment-mobile-logout">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="payment-mobile-login">Login</Link>
            )}
          </div>
        )}
      </nav>

      {/* Payment Container */}
      <div className="payment-container">
        <h2>Complete Your Payment</h2>
        
        {/* Order Summary */}
        <div className="payment-summary">
          <h3>
            <Package size={20} />
            Order Summary
          </h3>
          <p><strong>Name:</strong> {checkoutInfo.fullName || (user ? user.name : "N/A")}</p>
          <p><strong>Email:</strong> {checkoutInfo.email || (user ? user.email : "N/A")}</p>
          <p><strong>Address:</strong> {checkoutInfo.address}, {checkoutInfo.location}</p>
          <p><strong>Items:</strong></p>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <span>{item.ProductName} x {item.qty || 1}</span>
                <span>{item.Price}</span>
              </li>
            ))}
            <li>
              <span><strong>Total Amount:</strong></span>
              <span><strong>R {totalPrice.toFixed(2)}</strong></span>
            </li>
          </ul>
        </div>

        {/* Payment Method */}
        <div className="payment-method">
          <h3>
            <CreditCard size={20} />
            Payment Method
          </h3>
          <div className="payment-options">
            <label className={paymentMethod === "card" ? "selected" : ""}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💳 Credit/Debit Card
            </label>
            <label className={paymentMethod === "paypal" ? "selected" : ""}>
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              🅿️ PayPal
            </label>
            <label className={paymentMethod === "cash" ? "selected" : ""}>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💵 Cash on Delivery
            </label>
          </div>

          {paymentMethod === "card" && (
            <div className="card-details">
              <div className="card-input">
                <CreditCard className="card-icon" size={20} />
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                />
              </div>
              <div className="card-input">
                <Users className="card-icon" size={20} />
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="card-row">
                <div className="card-input small">
                  <Calendar className="card-icon" size={16} />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    maxLength="5"
                  />
                </div>
                <div className="card-input small">
                  <Lock className="card-icon" size={16} />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div style={{
              padding: "2rem",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              borderRadius: "12px",
              textAlign: "center",
              margin: "1rem 0",
              border: "2px solid #0ea5e9"
            }}>
              <p style={{ color: "#0369a1", fontWeight: "600", margin: "0" }}>
                🅿️ You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          )}

          {paymentMethod === "cash" && (
            <div style={{
              padding: "2rem",
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              borderRadius: "12px",
              textAlign: "center",
              margin: "1rem 0",
              border: "2px solid #22c55e"
            }}>
              <p style={{ color: "#15803d", fontWeight: "600", margin: "0" }}>
                💵 Pay with cash when your order is delivered to your address.
              </p>
            </div>
          )}
        </div>

        <button className="pay-btn" onClick={handlePayment}>
          {paymentMethod === "cash" ? "Place Order" : `Pay R ${totalPrice.toFixed(2)}`}
        </button>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 Payment Successful!</h2>
            <p>
              {paymentMethod === "cash" 
                ? `Your order has been placed successfully! Total amount: R ${totalPrice.toFixed(2)} (Cash on Delivery)`
                : `Your payment of R ${totalPrice.toFixed(2)} has been processed successfully.`
              }
            </p>
            <div className="modal-buttons">
              <button onClick={handleOrderConfirm}>Track Your Order</button>
              <button onClick={() => navigate("/")}>Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
      <footer className="third-footer">
         <h4>Office.Com</h4>
         <p>© {new Date().getFullYear()} Office.Com. All rights reserved.</p>
      
      </footer>
    
    </div>
  );
};

export default PaymentPage;