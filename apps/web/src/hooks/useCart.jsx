import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
    return new Promise((resolve, reject) => {
      const safeVariant = variant || product?.variants?.[0] || { id: 'default', title: 'Default', price_formatted: '₹0' };
      const safeAvailableQuantity = availableQuantity ?? 999;

      if (safeVariant.manage_inventory) {
        const existingItem = cartItems.find(item => item.variant?.id === safeVariant.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if ((currentCartQuantity + quantity) > safeAvailableQuantity) {
          const error = new Error(`Not enough stock for ${product?.title || 'this item'} (${safeVariant.title}). Only ${safeAvailableQuantity} left.`);
          reject(error);
          return;
        }
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.variant?.id === safeVariant.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.variant?.id === safeVariant.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { product, variant: safeVariant, quantity, availableQuantity: safeAvailableQuantity }];
      });
      resolve();
    });
  }, [cartItems]);

  const removeFromCart = useCallback((productId, variantTitle) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.product?.id === productId && item.variant?.title === variantTitle)
    ));
  }, []);

  const updateQuantity = useCallback((productId, variantTitle, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.product?.id === productId && item.variant?.title === variantTitle) 
          ? { ...item, quantity } 
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const variant = item.variant || item.product?.variants?.[0] || {};
      let price = 0;
      
      if (variant.sale_price_in_cents !== undefined || variant.price_in_cents !== undefined) {
        price = (variant.sale_price_in_cents ?? variant.price_in_cents ?? 0) / 100;
      } else if (variant.price_formatted) {
        price = parseFloat(String(variant.price_formatted).replace(/[^\d.]/g, '')) || 0;
      } else if (item.product?.price) {
        price = parseFloat(String(item.product.price).replace(/[^\d.]/g, '')) || 0;
      }
      
      // Use the variant's effective price (sale if available) instead of product MRP
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
};