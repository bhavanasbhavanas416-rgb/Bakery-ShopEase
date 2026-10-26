import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Heart, Menu, Search, ShoppingBag, UserRound, X, Star, Instagram } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { products, searchProducts } from './data.js';
import { useStore } from './store.jsx';

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

export function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.13 }} transition={{ delay }}>{children}</motion.div>;
}

function Logo() {
  return <Link className="brand" to="/" aria-label="Crème and Crumb home">
    <span className="brand-mark">c<span>&</span>c</span>
    <span className="brand-name">Crème <i>&</i> Crumb<small>HANDCRAFTED WITH HEART</small></span>
  </Link>;
}

export function Header() {
  const { cart, wishlist, notify } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const results = query.trim() ? searchProducts(query).slice(0, 5) : [];

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const searchSubmit = (event) => {
    event.preventDefault();
    setSearchOpen(false);
    navigate(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };
  const closeMenu = () => setMenuOpen(false);

  return <>
    <div className="announcement"><span>Freshly baked happiness, delivered to your door.</span><span>Free delivery on orders above ₹999 <b>✦</b></span></div>
    <header className="site-header">
      <button className="icon-button mobile-menu-trigger" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <Logo />
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <div className="nav-dropdown"><NavLink to="/shop" onClick={closeMenu}>Shop</NavLink><div className="dropdown-menu">
          <Link to="/shop?category=cakes" onClick={closeMenu}>Celebration cakes</Link><Link to="/shop?category=pastries" onClick={closeMenu}>Pastries & tarts</Link><Link to="/shop?category=cupcakes" onClick={closeMenu}>Cupcakes</Link><Link to="/shop?category=cheesecakes" onClick={closeMenu}>Cheesecakes</Link>
        </div></div>
        <NavLink to="/shop?category=cakes" onClick={closeMenu}>Cakes</NavLink>
        <NavLink to="/shop?category=pastries" onClick={closeMenu}>Pastries</NavLink>
        <NavLink to="/custom-cake" onClick={closeMenu}>Custom cakes</NavLink>
        <NavLink to="/about" onClick={closeMenu}>Our story</NavLink>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search treats" onClick={() => setSearchOpen(true)}><Search /></button>
        <Link className="icon-button header-count" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}><Heart /><span>{wishlist.length}</span></Link>
        <button className="icon-button" aria-label="Account" onClick={() => notify('Guest checkout is ready — accounts are not part of this demo.')}><UserRound /></button>
        <Link className="icon-button header-count bag-action" to="/cart" aria-label={`Shopping bag, ${count} items`}><ShoppingBag /><span>{count}</span></Link>
      </div>
    </header>
    <AnimatePresence>
      {searchOpen && <motion.div className="search-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
        <motion.div className="search-panel" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
          <div className="search-panel-heading"><span>Find your little something</span><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></button></div>
          <form className="search-form" onSubmit={searchSubmit}><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cakes, pastries, cookies..." aria-label="Search products" /><button aria-label="Submit search"><ArrowRight /></button></form>
          {query && <div className="search-results">
            {results.length ? results.map((product) => <Link key={product.id} to={`/product/${product.slug}`} onClick={() => setSearchOpen(false)}><img src={product.image} alt="" /><span>{product.name}<small>₹{product.price.toLocaleString('en-IN')}</small></span><ArrowRight size={16} /></Link>) : <p>No treats found. Try another search.</p>}
            <button className="text-link" onClick={searchSubmit}>See all results <ArrowRight size={14} /></button>
          </div>}
          {!query && <p className="search-hint">A little something for a birthday, a brunch, or just because.</p>}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
    <AnimatePresence>{menuOpen && <motion.button className="mobile-nav-scrim" aria-label="Close navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />}</AnimatePresence>
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-main"><div className="footer-brand"><Logo /><p>Small-batch bakes, made with care<br />and a little extra butter.</p><a className="social-link" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17} /> Follow our sweet journey</a></div>
      <div className="footer-column"><h4>Explore</h4><Link to="/shop">All treats</Link><Link to="/shop?category=cakes">Celebration cakes</Link><Link to="/custom-cake">Custom cake studio</Link><Link to="/about">Our story</Link></div>
      <div className="footer-column"><h4>Here to help</h4><Link to="/contact">Get in touch</Link><Link to="/delivery">Delivery & returns</Link><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms & conditions</Link></div>
      <div className="footer-note"><span className="eyebrow">A LITTLE NOTE</span><p>Made fresh in small batches, just for you. Please allow a little extra time for custom creations.</p><Link className="text-link" to="/custom-cake">Plan something sweet <ArrowRight size={14} /></Link></div>
    </div><div className="footer-bottom"><span>© 2026 Crème & Crumb. Made with love.</span><span>Demo storefront · No real orders are processed</span></div>
  </footer>;
}

export function Toast() {
  const { toast } = useStore();
  return <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><span className="toast-check">✓</span>{toast}</motion.div>}</AnimatePresence>;
}

export function SectionHeading({ eyebrow, title, text, centered = false, link, to = '/shop' }) {
  return <div className={`section-heading ${centered ? 'centered' : ''}`}>
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
    {link && <Link className="text-link section-link" to={to}>{link} <ArrowRight size={15} /></Link>}
  </div>;
}

export function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const saved = wishlist.some((item) => item.id === product.id);
  const [quickView, setQuickView] = useState(false);
  useEffect(() => {
    if (!quickView) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setQuickView(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [quickView]);
  return <motion.article className="product-card" variants={fadeUp} layout>
    <div className="product-image-wrap"><Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80'; }} /></Link>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <button className={`heart-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleWishlist(product)} aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
      <button className="quick-view" onClick={() => setQuickView(true)}>Quick view <ArrowRight size={14} /></button>
    </div>
    <div className="product-info"><div className="product-title-line"><Link to={`/product/${product.slug}`}><h3>{product.name}</h3></Link><span className="rating"><Star size={12} fill="currentColor" /> {product.rating}</span></div>
      <div className="product-meta"><span>₹{product.price.toLocaleString('en-IN')}{product.oldPrice && <del>₹{product.oldPrice.toLocaleString('en-IN')}</del>}</span><span>{product.reviews} sample reviews</span></div>
      <button className="add-button" onClick={() => addToCart(product)}><span>Add to bag</span><ShoppingBag size={16} /></button>
    </div>
    {quickView && createPortal(<motion.div className="quick-view-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickView(false); }}>
      <motion.div className="quick-view-modal" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
        <button className="icon-button quick-view-close" onClick={() => setQuickView(false)} aria-label="Close quick view"><X /></button>
        <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80'; }} />
        <div className="quick-view-content"><span className="eyebrow">{product.badge || 'A CRÈME & CRUMB FAVOURITE'}</span><h2>{product.name}</h2><span className="rating"><Star size={13} fill="currentColor" /> {product.rating} <small>· {product.reviews} sample reviews</small></span><p>{product.description}</p><b className="quick-view-price">₹{product.price.toLocaleString('en-IN')}</b><div><button className="button button-dark" onClick={() => { addToCart(product); setQuickView(false); }}>Add to bag <ShoppingBag size={15} /></button><Link className="text-link" to={`/product/${product.slug}`} onClick={() => setQuickView(false)}>Full details <ArrowRight size={14} /></Link></div></div>
      </motion.div>
    </motion.div>, document.body)}
  </motion.article>;
}

export function EmptyState({ title, text, action = 'Explore the collection', to = '/shop' }) {
  return <div className="empty-state"><span className="empty-flower">✳</span><h2>{title}</h2><p>{text}</p><Link className="button button-dark" to={to}>{action} <ArrowRight size={16} /></Link></div>;
}

export function ScrollCue() {
  return <a href="#discover" className="scroll-cue"><span>SCROLL TO DISCOVER</span><ArrowDown size={14} /></a>;
}
