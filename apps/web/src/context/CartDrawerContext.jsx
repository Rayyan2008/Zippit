import React, { createContext, useContext, useState } from 'react';

const CartDrawerContext = createContext({ open: false, openCart: () => {}, closeCart: () => {}, setOpen: () => {} });

export const CartDrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <CartDrawerContext.Provider value={{ open, openCart: () => setOpen(true), closeCart: () => setOpen(false), setOpen }}>
      {children}
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => useContext(CartDrawerContext);