import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIp } from './IpContext'; // Import IpContext

// Create the context
const ShopContext = createContext();

// Custom hook to use the shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

// Provider component
export const ShopProvider = ({ children }) => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    if (cartItems.length >= 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      const totalCount = cartItems.reduce((sum, item) => sum + (parseInt(item.qty) || 1), 0);
      setCartCount(totalCount);
      localStorage.setItem('cartCount', totalCount.toString());
    }
  }, [cartItems]);

  const initializeCart = () => {
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      const savedCartCount = localStorage.getItem('cartCount');
      
      if (savedCartItems) {
        const parsedItems = JSON.parse(savedCartItems);
        setCartItems(Array.isArray(parsedItems) ? parsedItems : []);
      }
      
      if (savedCartCount) {
        setCartCount(parseInt(savedCartCount, 10) || 0);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartCount');
      setCartItems([]);
      setCartCount(0);
    }
  };

  const addToCart = (product) => {
    try {
      setError(null);
      
      if (!product || !product._id) {
        throw new Error('Invalid product data');
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item._id === product._id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item._id === product._id
              ? { ...item, qty: (parseInt(item.qty) || 1) + 1 }
              : item
          );
        } else {
          const newItem = {
            _id: product._id,
            ProductName: product.ProductName,
            ImageURL: product.ImageURL,
            Price: product.Price,
            Description: product.Description,
            qty: 1
          };
          return [...prevItems, newItem];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
      return false;
    }
  };

  const removeFromCart = (productId) => {
    try {
      setError(null);
      setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart');
      return false;
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    try {
      setError(null);
      const validQuantity = Math.max(1, parseInt(newQuantity) || 1);
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId
            ? { ...item, qty: validQuantity }
            : item
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update item quantity');
      return false;
    }
  };

  const clearCart = () => {
    try {
      setError(null);
      setCartItems([]);
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartCount');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
      return false;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      try {
        const priceStr = item.Price || "0";
        const priceNum = parseFloat(priceStr.toString().replace(/[^0-9.]/g, "")) || 0;
        return total + priceNum * (parseInt(item.qty) || 1);
      } catch (error) {
        console.error('Error calculating price for item:', item, error);
        return total;
      }
    }, 0);
  };

  const getItemCount = () => {
    return cartCount;
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item._id === productId);
  };

  const loadCartItemsWithAPI = async (cartData = null) => {
    try {
      setLoading(true);
      setError(null);

      if (cartItems.length === 0) {
        setLoading(false);
        return [];
      }

      // Use provided cartData if available, otherwise fetch from backend
      let allProducts;
      if (cartData) {
        allProducts = cartData;
      } else {
        const data = await callBackend("/Products");
        if (!data) throw new Error("Failed to fetch products");
        allProducts = data;
      }

      if (!Array.isArray(allProducts)) throw new Error("Products data is not in expected format");

      const enrichedCartItems = cartItems
        .map(cartItem => {
          const productDetails = allProducts.find(product => product._id === cartItem._id);
          if (!productDetails) {
            console.warn(`Product with ID ${cartItem._id} not found in products list`);
            return null;
          }
          return { ...productDetails, qty: parseInt(cartItem.qty) || 1 };
        })
        .filter(item => item !== null);

      if (enrichedCartItems.length !== cartItems.length) {
        setCartItems(enrichedCartItems.map(item => ({
          _id: item._id,
          ProductName: item.ProductName,
          ImageURL: item.ImageURL,
          Price: item.Price,
          Description: item.Description,
          qty: item.qty
        })));
      }

      setLoading(false);
      return enrichedCartItems;
      
    } catch (error) {
      console.error('Error loading cart items with API:', error);
      setError(`Failed to load cart items: ${error.message}`);
      setLoading(false);
      return [];
    }
  };

  const value = {
    // State
    cartItems,
    cartCount,
    loading,
    error,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Getters
    getCartTotal,
    getItemCount,
    isInCart,
    getCartItem,

    // API
    loadCartItemsWithAPI,
    initializeCart,

    // Helpers
    clearError: () => setError(null)
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;