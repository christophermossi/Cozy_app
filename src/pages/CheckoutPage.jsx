import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useIp } from "../context/IpContext"; // Import IpContext
import "./CheckoutPage.css";

const CheckoutPage = ({ user, onLogout }) => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    address: false,
    location: false,
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    Email: "",
    Password: "",
  });
  const [signUpFormData, setSignUpFormData] = useState({
    UserID: "",
    Password: "",
    Email: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);

    // Pre-fill user data if available
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  const totalPrice = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.Price.replace(/[^0-9.]/g, "")) || 0;
    return acc + priceNum * (item.qty || 1);
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const newErrors = {
      fullName: !fullName,
      email: !email,
      address: !address,
      location: !location,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) {
      alert("Please fill in all required fields before proceeding!");
      return;
    }

    // Save checkout info to localStorage
    const checkoutInfo = { fullName, email, address, location };
    localStorage.setItem("checkoutInfo", JSON.stringify(checkoutInfo));

    setShowSuccess(true);
  };

  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await callBackend("/login", {
        method: "POST",
        body: loginFormData
      });

      if (!data) {
        throw new Error("Login failed");
      }

      alert("Login successful!");
      
      // Store authentication status
      localStorage.setItem("authenticated", "true");
      
      // Store user data
      const userData = {
        email: loginFormData.Email,
        name: data?.UserID || loginFormData.Email.split('@')[0] || 'User'
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Close modal and refresh page to update user state
      setShowLoginModal(false);
      window.location.reload();
    } catch (error) {
      if (error.message.includes("401")) {
        alert("Login failed: Invalid email or password");
      } else {
        alert("Login failed: " + (error.message || "Unknown error"));
      }
    }
  };

  const handleSignUpChange = (e) => {
    setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await callBackend("/signup", {
        method: "POST",
        body: signUpFormData
      });

      if (!data) {
        throw new Error("Signup failed");
      }

      alert("Account created successfully!");
      setShowSignUpModal(false);
      setShowLoginModal(true);
    } catch (error) {
      if (error.message.includes("400") || error.message.includes("409")) {
        alert("Signup failed: Invalid data or user already exists");
      } else {
        alert("Signup failed: " + (error.message || "Unknown error"));
      }
    }
  };

  const handleTrackDelivery = () => {
    setShowSuccess(false);
    navigate("/payment");
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          padding: "1rem 2rem",
          background: isScrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)",
          boxShadow: isScrolled
            ? "0 4px 8px rgba(0,0,0,0.1)"
            : "0 2px 4px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#2563eb",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Office.Com
        </button>

        <div style={{ display: "flex", gap: "1.7rem" }}>
          {["Home", "Products", "Cart", "About", "Contact"].map((item) =>
            item === "Home" ? (
              <Link
                key={item}
                to="/"
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  textAlign: "left",
                  color: "#374151",
                  textDecoration: "none",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ) : item === "Products" ? (
              <Link
                key={item}
                to="/productpage"
                style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  textDecoration: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                {item}
              </Link>
            ) : item === "Cart" ? (
              <Link
                key={item}
                to="/cart"
                style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  textDecoration: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                {item}
              </Link>
            ) : (
              <button
                key={item}
                onClick={() => {
                  const el = document.getElementById(item.toLowerCase());
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Dynamic User/Login Section */}
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                <Users size={18} />
                {user.name}
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 100,
                    minWidth: "150px",
                    marginTop: "0.5rem",
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#374151",
                      fontSize: "0.9rem",
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ color: "#2563eb" }} title="Login">
              <Users size={20} />
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            padding: "1rem",
            position: "absolute",
            top: "100%",
            right: 0,
            width: "200px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {["Home", "Products", "Cart", "About", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "Home") {
                  navigate("/");
                } else if (item === "Products") {
                  navigate("/productpage");
                } else if (item === "Cart") {
                  navigate("/cart");
                } else {
                  const el = document.getElementById(item.toLowerCase());
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
                setIsMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                textAlign: "left",
                border: "none",
                background: "none",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}

          {/* Mobile User Section */}
          {user ? (
            <div style={{ padding: "1rem 0", borderTop: "1px solid #e5e7eb" }}>
              <p style={{ margin: "0 0 0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>
                Welcome, {user.name}!
              </p>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "0.9rem",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ marginTop: "0.5rem" }}>
              <button
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "0.75rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Checkout Form */}
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Checkout Information</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ border: errors.fullName ? "1px solid red" : "" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ border: errors.email ? "1px solid red" : "" }}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ border: errors.address ? "1px solid red" : "" }}
          />
          <input
            type="text"
            placeholder="Location / City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ border: errors.location ? "1px solid red" : "" }}
          />
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item._id}>
                  {item.ProductName} x {item.qty || 1} - {item.Price}
                </li>
              ))}
            </ul>
          )}
          <h3>Total: R {totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Login to Account</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  name="Email"
                  placeholder="Email Address"
                  value={loginFormData.Email}
                  onChange={handleLoginChange}
                  required
                />
                <input
                  type="password"
                  name="Password"
                  placeholder="Password"
                  value={loginFormData.Password}
                  onChange={handleLoginChange}
                  required
                />
                <button type="submit">Sign In</button>
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowSignUpModal(true);
                    }}
                    style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}
                  >
                    Sign Up
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  style={{ background: "#f3f4f6", color: "#374151", marginTop: "1rem" }}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SignUp Modal */}
        {showSignUpModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Create Account</h2>
              <form onSubmit={handleSignUpSubmit}>
                <input
                  type="text"
                  name="UserID"
                  placeholder="User Name"
                  value={signUpFormData.UserID}
                  onChange={handleSignUpChange}
                  required
                />
                <input
                  type="password"
                  name="Password"
                  placeholder="Password"
                  value={signUpFormData.Password}
                  onChange={handleSignUpChange}
                  required
                />
                <input
                  type="email"
                  name="Email"
                  placeholder="Email Address"
                  value={signUpFormData.Email}
                  onChange={handleSignUpChange}
                  required
                />
                <button type="submit">Sign Up</button>
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignUpModal(false);
                      setShowLoginModal(true);
                    }}
                    style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}
                  >
                    Login
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setShowSignUpModal(false)}
                  style={{ background: "#f3f4f6", color: "#374151", marginTop: "1rem" }}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="modal-overlay">
            <div className="modal">
              <h1>✅ Purchase Successful!</h1>
              <p>Thank you, {fullName || (user ? user.name : email)}! Your order details:</p>

              <div style={{ textAlign: "left", margin: "1rem 0" }}>
                <h3>Shipping Address:</h3>
                <p>
                  {address}, {location}
                </p>

                <h3>Items:</h3>
                <ul>
                  {cartItems.map((item) => (
                    <li key={item._id}>
                      {item.ProductName} x {item.qty || 1} - {item.Price}
                    </li>
                  ))}
                </ul>

                <h3>Total Price: R {totalPrice.toFixed(2)}</h3>
              </div>

              <button onClick={handleTrackDelivery}>Proceed to Payment</button>
            </div>
          </div>
        )}
      </div>
      
      <footer className="third-footer">
        <h4>Office.Com</h4>
        <p>© {new Date().getFullYear()} Office.Com. All rights reserved.</p>
        <p>
          <Link to="/">Home</Link> | <Link to="/productpage">Products</Link> |{" "}
          <Link to="/contact">Contact</Link>
        </p>
      </footer>
    </div>
  );
};

export default CheckoutPage;