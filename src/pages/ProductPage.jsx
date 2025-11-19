import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Users, LogOut } from "lucide-react";
import { useIp } from "../context/IpContext"; // Import IpContext
import { useShop } from "../context/ShopContext"; // Import ShopContext
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./ProductPage.css";

const Products = ({ user, onLogout }) => {
  const { callBackend } = useIp(); // Use IpContext to get callBackend
  const { cartCount, addToCart, error: cartError } = useShop(); // Use ShopContext for cart functionality
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Fetch products using IpContext's callBackend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await callBackend("/Products"); // Use callBackend from IpContext
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
}, []); // load once

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

  // Remove empty, null, undefined, or incomplete products
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
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Office.Com
          </button>

          <div className="desktop-menu">
            {["Home", "Products", "Services", "About", "Contact"].map(
              (item) =>
                item === "Home" ? (
                  <Link key={item} to="/" className="nav-link">
                    {item}
                  </Link>
                ) : (
                  <button
                    key={item}
                    onClick={() => {
                      const el = document.getElementById(item.toLowerCase());
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="nav-link"
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
            {["Home", "Products", "Services", "About", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "Home") window.location.href = "/";
                    else {
                      const el = document.getElementById(item.toLowerCase());
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
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


      {/* Loading/Error */}
    
      

      {/* Products Grid */}
     <div className="products-grid">
  {validProducts.map((product) => (
    <div key={product._id} className="product-card">
      <h2 className="product-title">{product.ProductName}</h2>
      <img className="imgpart" src={product.ImageURL} alt={product.ProductName} />
      <p className="product-price">{product.Price}</p>
      <p className="product-desc">{product.Description}</p>
      <button className="add-btn" onClick={() => handleAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  ))}
</div>
{/* About Us Section */}
<div
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
  {/* Image */}
  <div style={{ flex: "1 1 300px", textAlign: "center" }}>
    <img
      src="https://twosides.info/wp-content/uploads/2023/06/The-Importance-Of-Paper-Based-Materials-In-Education-e1687338164565.jpg"
      alt="Office supplies"
      style={{ width: "100%", maxWidth: "400px", borderRadius: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
    />
  </div>

  {/* Text */}
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

  {/* About Us Section 2 */}
<div
  className="about-us-section-2"
  style={{
    display: "flex",
    flexDirection: "row-reverse", // image on the other side
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
  {/* Image */}
  <div style={{ flex: "1 1 300px", textAlign: "center" }}>
    <img
      src="https://img.freepik.com/free-photo/business-team-working-together_23-2149333016.jpg?semt=ais_hybrid&w=740&q=80"
      alt="Quality service"
      style={{ width: "100%", maxWidth: "400px", borderRadius: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
    />
  </div>

  {/* Text */}
  <div style={{ flex: "1 1 400px", maxWidth: "600px", color: "#374151" }}>
    <h2 style={{ marginBottom: "1rem", color: "#1f2937", fontSize: "2rem" }}>Our Commitment</h2>
    <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
      At <strong>Office.Com</strong>, we don’t just sell office supplies – we provide solutions. Our goal is to make
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
             <p>
               <Link to="/" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Home</Link> | 
               <Link to="/productpage" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Products</Link> |
               <Link to="/contact" style={{ color: "#f3f4f6", margin: "0 0.5rem" }}>Contact</Link>
             </p>
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