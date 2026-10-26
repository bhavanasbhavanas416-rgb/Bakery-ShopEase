import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header, Footer, Toast } from './components.jsx';
import { About, Cart, Checkout, Contact, CustomCake, Home, NotFound, OrderConfirmation, PolicyPage, ProductDetail, Shop, Wishlist } from './pages.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return <>
    <ScrollToTop />
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/custom-cake" element={<CustomCake />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/delivery" element={<PolicyPage type="delivery" />} />
      <Route path="/privacy" element={<PolicyPage type="privacy" />} />
      <Route path="/terms" element={<PolicyPage type="terms" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
    <Toast />
  </>;
}
