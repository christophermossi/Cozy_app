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
                width: "100%",
                marginTop: "0.5rem"
              }}
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main style={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "100px",
        paddingBottom: "2rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        background: "transparent",
        minHeight: "calc(100vh - 180px)",
        marginLeft: "400px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "800px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          border: "1px solid rgba(229, 231, 235, 0.5)",
        }}>
          {/* Header Section */}
          <div style={{
            background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
            color: "white",
            padding: "2.5rem 2rem",
            textAlign: "center",
            position: "relative"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1rem"
            }}>
              <Package size={40} />
              <h1 style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                margin: 0,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>Order Confirmation</h1>
            </div>
            
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255, 255, 255, 0.2)",
              padding: "0.5rem 1rem",
              borderRadius: "50px",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}>
              <CheckCircle size={16} />
              Order Successfully Placed
            </div>
          </div>

          {/* Content Section */}
          <div style={{ padding: "2.5rem 2rem" }}>
            {/* Customer Details */}
            <div style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Users size={20} />
                Customer Information
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <p style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontWeight: "500" }}>Name:</span>
                  <span>{orderInfo.fullName || (user ? user.name : "N/A")}</span>
                </p>
                <p style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontWeight: "500" }}>Address:</span>
                  <span>{orderInfo.address}, {orderInfo.location}</span>
                </p>
                <p style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontWeight: "500" }}>Payment Method:</span>
                  <span>{orderInfo.paymentMethod || "N/A"}</span>
                </p>
                <p style={{
                  fontSize: "1rem",
                  color: "#4b5563",
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontWeight: "500" }}>Total Amount:</span>
                  <span style={{ fontWeight: "600", color: "#2563eb" }}>
                    R {orderInfo.totalAmount || totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            {cartItems.length > 0 && (
              <div style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <Package size={20} />
                  Order Items
                </h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {cartItems.map((item) => (
                    <div key={item._id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                        {item.ProductName} x {item.qty || 1}
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#2563eb" }}>
                        {item.Price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Progress */}
            <div style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Package size={20} />
                Order Progress
              </h3>
              <div style={{
                width: "100%",
                height: "12px",
                background: "#e2e8f0",
                borderRadius: "6px",
                overflow: "hidden",
                marginBottom: "1rem"
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                  borderRadius: "6px",
                  transition: "width 0.6s ease",
                  boxShadow: "0 0 10px rgba(37, 99, 235, 0.3)"
                }} />
              </div>
              <p style={{
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#2563eb",
                margin: 0
              }}>
                {progress}% Complete
              </p>
              
              {/* Progress Steps */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem",
                position: "relative"
              }}>
                {[
                  { step: 1, label: "Order Placed", icon: CheckCircle },
                  { step: 2, label: "Processing", icon: Clock },
                  { step: 3, label: "Shipped", icon: Truck },
                  { step: 4, label: "Delivered", icon: Package }
                ].map(({ step, label, icon: Icon }, index) => (
                  <div key={step} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    position: "relative",
                    zIndex: 2
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: progress >= (step * 25) ? "#2563eb" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: progress >= (step * 25) ? "white" : "#9ca3af",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                      border: `2px solid ${progress >= (step * 25) ? "#2563eb" : "#e2e8f0"}`
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      textAlign: "center",
                      fontWeight: "500"
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
                
                {/* Progress Line */}
                <div style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  height: "2px",
                  background: "#e2e8f0",
                  zIndex: 1
                }} />
              </div>
            </div>

            {/* Delivery Information */}
            <div style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              background: "#f0f9ff",
              borderRadius: "12px",
              border: "1px solid #bae6fd"
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Truck size={20} />
                Delivery Information
              </h3>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontSize: "1.1rem",
                color: "#0369a1",
                fontWeight: "600"
              }}>
                <Clock size={20} />
                Your order will arrive in <strong>{daysLeft} days</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr"
            }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "1rem 2rem",
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
                }}
              >
                Back to Home
              </button>
              
              <Link
                to="/productpage"
                style={{
                  padding: "1rem 2rem",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "#1f2937",
        color: "#f3f4f6",
        padding: "2rem 0 1rem 0",
        borderTop: "1px solid #374151",
        width: "143.9%",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            margin: "0 0 1rem 0",
            color: "#f3f4f6"
          }}>Office.Com</h3>
          <p style={{
            fontSize: "0.9rem",
            opacity: 0.8,
            margin: "0.5rem 0"
          }}>
            © {new Date().getFullYear()} Office.Com. All rights reserved.
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}>
            <Link to="/" style={{
              color: "#f3f4f6",
              textDecoration: "none",
              padding: "0.25rem 0",
              transition: "color 0.3s ease",
              fontSize: "0.9rem"
            }}>Home</Link>
            <Link to="/productpage" style={{
              color: "#f3f4f6",
              textDecoration: "none",
              padding: "0.25rem 0",
              transition: "color 0.3s ease",
              fontSize: "0.9rem"
            }}>Products</Link>
            <Link to="/cart" style={{
              color: "#f3f4f6",
              textDecoration: "none",
              padding: "0.25rem 0",
              transition: "color 0.3s ease",
              fontSize: "0.9rem"
            }}>Cart</Link>
            <Link to="/contact" style={{
              color: "#f3f4f6",
              textDecoration: "none",
              padding: "0.25rem 0",
              transition: "color 0.3s ease",
              fontSize: "0.9rem"
            }}>Contact</Link>
          </div>
        </div>
      </footer>

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