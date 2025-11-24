import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Users, LogOut, Package, CheckCircle, Truck, Clock } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useIp } from "../context/IpContext"; // Import IpContext
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const OrderPage = ({ user, onLogout }) => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
  const { cartItems, getCartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState({ fullName: "", address: "", location: "" });
  const [daysLeft, setDaysLeft] = useState(3);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    // Fetch products using IpContext
    const fetchProducts = async () => {
      try {
        const data = await callBackend("/Products");
        if (data) {
          console.log(data);
        } else {
          console.error("Failed to fetch products: No data received");
        }
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

  // Get total price from ShopContext
  const totalPrice = getCartTotal();

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
    }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(229, 231, 235, 0.6)",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.75rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <button
            onClick={() => navigate("/")}
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

          <div style={{ 
            display: window.innerWidth > 768 ? "flex" : "none",
            gap: "1.5rem",
            alignItems: "center"
          }}>
            {["Home", "Products","Payment"].map((item) =>
              item === "Home" ? (
                <Link
                  key={item}
                  to="/"
                  style={{ 
                    color: "#4b5563", 
                    textDecoration: "none", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "6px",
                    transition: "color 0.2s ease"
                  }}
                >
                  {item}
                </Link>
              ) : item === "Products" ? (
                <Link 
                  key={item} 
                  to="/productpage" 
                  style={{ 
                    color: "#4b5563", 
                    textDecoration: "none", 
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "color 0.2s ease"
                  }}
                >
                  {item}
                </Link>
              ) : item === "Cart" ? (
                <Link 
                  key={item} 
                  to="/cart" 
                  style={{ 
                    color: "#4b5563", 
                    textDecoration: "none", 
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "color 0.2s ease"
                  }}
                >
                  {item}
                </Link>
              ) : item === "Payment" ? (
                <Link 
                  key={item} 
                  to="/payment" 
                  style={{ 
                    color: "#4b5563", 
                    textDecoration: "none", 
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "color 0.2s ease"
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
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "color 0.2s ease"
                  }}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
              <button 
                onClick={() => setShowLoginModal(true)} 
                style={{ color: "#2563eb" }} 
                title="Login"
              >
                <Users size={20} />
              </button>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ 
                display: window.innerWidth <= 768 ? "block" : "none",
                border: "none", 
                background: "none", 
                cursor: "pointer",
                padding: "0.5rem"
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            padding: "1rem",
            position: "absolute",
            top: "100%",
            right: 0,
            width: "200px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}>
            {["Home", "Products", "Cart", "Payment", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") {
                    navigate("/");
                  } else if (item === "Products") {
                    navigate("/productpage");
                  } else if (item === "Cart") {
                    navigate("/cart");
                  } else if (item === "Payment") {
                    navigate("/payment");
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
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMenuOpen(false);
                }}
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  marginTop: "0.5rem",
                }}
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>


      {/* Order Content */}
      <main style={{
        maxWidth: "1200px",
        margin: "80px auto 2rem",
        padding: "1rem",
        flex: 1,
        marginLeft: "400px",
      }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#1f2937" }}>
          Your Order
        </h1>

        {user ? (
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
              Order Confirmation
            </h2>
            <p style={{ marginBottom: "1rem", color: "#4b5563" }}>
              Thank you, {orderInfo.fullName || user.name}, for your order! Your items are being processed.
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "0.5rem", color: "#1f2937" }}>
                Shipping Information
              </h3>
              <p style={{ color: "#4b5563" }}>
                {orderInfo.address}, {orderInfo.location}
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "0.5rem", color: "#1f2937" }}>
                Order Items
              </h3>
              {cartItems.length === 0 ? (
                <p style={{ color: "#4b5563" }}>No items in your order.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {cartItems.map((item) => (
                    <li key={item._id} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e5e7eb",
                      color: "#4b5563"
                    }}>
                      <span>{item.ProductName} x {item.qty || 1}</span>
                      <span>{item.Price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "0.5rem", color: "#1f2937" }}>
                Total: R {totalPrice.toFixed(2)}
              </h3>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "0.5rem", color: "#1f2937" }}>
                Order Status
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ 
                  width: "100%", 
                  height: "8px", 
                  background: "#e5e7eb", 
                  borderRadius: "4px",
                  position: "relative"
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                    borderRadius: "4px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <span style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                  {progress}% Complete
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { icon: Package, label: "Order Placed", active: progress >= 25 },
                  { icon: CheckCircle, label: "Processing", active: progress >= 50 },
                  { icon: Truck, label: "Shipped", active: progress >= 75 },
                  { icon: Clock, label: "Delivered", active: progress >= 100 },
                ].map((stage, index) => (
                  <div key={index} style={{ 
                    textAlign: "center", 
                    color: stage.active ? "#2563eb" : "#9ca3af",
                    flex: "1 1 0",
                    minWidth: "80px"
                  }}>
                    <stage.icon size={24} style={{ marginBottom: "0.5rem" }} />
                    <p style={{ fontSize: "0.9rem", fontWeight: stage.active ? "500" : "400" }}>
                      {stage.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "0.5rem", color: "#1f2937" }}>
                Estimated Delivery
              </h3>
              <p style={{ color: "#4b5563" }}>
                {daysLeft === 0 ? "Arriving today!" : `Arrives in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
              Please Log In
            </h2>
            <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
              You need to be logged in to view your order details.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                background: "#2563eb",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
          
        )}
        
      </main>

      {/* Footer */}
  
       

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

export default OrderPage;