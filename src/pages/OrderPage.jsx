import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Users, LogOut, Package, CheckCircle, Truck, Clock } from "lucide-react";
import { useShop } from "../context/ShopContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const OrderPage = ({ user, onLogout }) => {
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

const { apiBaseUrl } = useShop();

useEffect(() => {
  fetch(`${apiBaseUrl}/Products`)
    .then(res => res.json())
    .then(data => console.log(data));
}, [apiBaseUrl]);


  useEffect(() => {
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
  }, []);

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
            {["Home", "Products", "Cart", "Payment", "About", "Contact"].map((item) =>
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
      </nav>

      {/* The rest of your JSX stays the same */}
      {/* ... */}

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
