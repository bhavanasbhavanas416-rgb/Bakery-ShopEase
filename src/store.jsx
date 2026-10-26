import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);
const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('cc-cart', []));
  const [wishlist, setWishlist] = useState(() => readStorage('cc-wishlist', []));
  const [coupon, setCoupon] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem('cc-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('cc-wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => setToast(''), 2600);
  };
  const addToCart = (product, quantity = 1, price = product.price, variant = '') => {
    setCart((current) => {
      const cartKey = `${product.id}-${price}`;
      const found = current.find((item) => (item.cartKey || `${item.id}-${item.price}`) === cartKey);
      if (found) return current.map((item) => (item.cartKey || `${item.id}-${item.price}`) === cartKey ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { ...product, cartKey, price, quantity, variant }];
    });
    notify(`${product.name} added to your bag`);
  };
  const setQuantity = (cartKey, quantity) => setCart((current) => quantity < 1
    ? current.filter((item) => (item.cartKey || `${item.id}-${item.price}`) !== cartKey)
    : current.map((item) => (item.cartKey || `${item.id}-${item.price}`) === cartKey ? { ...item, quantity } : item));
  const removeFromCart = (cartKey) => {
    setCart((current) => current.filter((item) => (item.cartKey || `${item.id}-${item.price}`) !== cartKey));
    notify('Item removed from your bag');
  };
  const clearCart = () => setCart([]);
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    setWishlist((current) => exists ? current.filter((item) => item.id !== product.id) : [...current, product]);
    notify(exists ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 999 || coupon === 'FREESHIP' ? 0 : 79;
  const discount = coupon === 'SWEET10' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;
  const value = useMemo(() => ({
    cart, wishlist, coupon, setCoupon, toast, notify, addToCart, setQuantity,
    removeFromCart, clearCart, toggleWishlist, subtotal, delivery, discount, total,
  }), [cart, wishlist, coupon, toast, subtotal, delivery, discount, total]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
};
