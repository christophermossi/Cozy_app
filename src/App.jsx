import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IpProvider } from './context/IpContext';
import { ShopProvider } from './context/ShopContext';
import Homepage from './pages/HomePage';
import Products from './pages/ProductPage';
import ContactUs from './components/ContactUs';
import Cart from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderPage from './pages/OrderPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <IpProvider>
      <ShopProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage user={user} onLogout={handleLogout} />} />
              <Route path="/productpage" element={<Products user={user} onLogout={handleLogout} />} />
              <Route path="/contact" element={<ContactUs user={user} onLogout={handleLogout} />} />
              <Route path="/cart" element={<Cart user={user} onLogout={handleLogout} />} />
              <Route path="/checkout" element={<CheckoutPage user={user} onLogout={handleLogout} />} />
              <Route path="/payment" element={<PaymentPage user={user} onLogout={handleLogout} />} />
              <Route path="/order" element={<OrderPage user={user} onLogout={handleLogout} />} />
            </Routes>
          </div>
        </Router>
      </ShopProvider>
    </IpProvider>
  );
}

export default App;