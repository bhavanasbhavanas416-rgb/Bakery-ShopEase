import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Star, Truck } from 'lucide-react';
import { categories, products, searchProducts, testimonials } from './data.js';
import { useStore } from './store.jsx';
import { EmptyState, ProductCard, Reveal, ScrollCue, SectionHeading, stagger } from './components.jsx';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

function Breadcrumb({ current }) {
  return <div className="breadcrumb"><Link to="/">Home</Link><span>/</span>{current}</div>;
}

export function Home() {
  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState('');
  const testimonialTrack = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const featured = products.slice(0, 4);
  const subscribe = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setNewsletterState('Please enter a valid email address.'); return; }
    localStorage.setItem('cc-newsletter-demo', email);
    setNewsletterState('You’re on the list! This demo does not send emails.');
    setEmail('');
  };
  const scrollToTestimonial = (index) => {
    const card = testimonialTrack.current?.children[index];
    if (!card) return;
    setActiveTestimonial(index);
    card.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
  };
  const updateActiveTestimonial = () => {
    const track = testimonialTrack.current;
    if (!track) return;
    const left = track.getBoundingClientRect().left;
    const closest = Array.from(track.children).reduce((best, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - left);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    setActiveTestimonial(closest.index);
  };
  return <main>
    <section className="hero">
      <div className="hero-photo" role="img" aria-label="Handcrafted chocolate cake with fresh berries" />
      <div className="hero-shade" />
      <motion.div className="hero-content" initial="hidden" animate="visible" variants={stagger}>
        <motion.span variants={fadeForHero} className="hero-kicker"><span /> SMALL BATCH. BIG HEART.</motion.span>
        <motion.h1 variants={fadeForHero}>A little slice<br />of <i>happiness.</i></motion.h1>
        <motion.p variants={fadeForHero}>Handcrafted cakes and delicate pastries,<br className="desktop-only" /> baked fresh to make every moment sweeter.</motion.p>
        <motion.div className="hero-actions" variants={fadeForHero}><Link className="button button-cream" to="/shop">Explore our collection <ArrowRight size={16} /></Link><Link className="button button-outline-light" to="/custom-cake">Order your dream cake</Link></motion.div>
      </motion.div>
      <div className="hero-side-note">HANDMADE WITH LOVE <span>·</span> BAKED FRESH DAILY</div>
      <ScrollCue />
      <div className="hero-index"><span>01</span> / 03</div>
    </section>
    <section className="promise-strip" id="discover"><div><span>✳</span> Baked fresh, every morning</div><div><span>✳</span> Thoughtfully sourced ingredients</div><div><span>✳</span> A little joy in every bite</div></section>
    <section className="section category-section page-shell"><SectionHeading eyebrow="MADE FOR EVERY MOOD" title="Find your kind of sweet." text="A little something for the celebrations, the catch-ups, and the just-because days." centered />
      <motion.div className="category-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
        {categories.map((category, index) => <motion.div className={`category-card category-card-${index + 1}`} variants={fadeForHero} key={`${category.name}-${index}`}>
          <Link to={`/shop?category=${category.slug}`}><img src={category.image} alt={category.name} loading="lazy" /><div className="category-overlay"><span>{category.note}</span><h3>{category.name}</h3><span className="category-link">Shop now <ArrowRight size={14} /></span></div></Link>
        </motion.div>)}
      </motion.div>
    </section>
    <section className="section featured-section"><div className="page-shell"><SectionHeading eyebrow="A FEW CUSTOMER FAVOURITES" title="The ones they come back for." text="Baked in little batches, loved in big ways." link="Shop all treats" />
      <motion.div className="product-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }}>{featured.map((product) => <ProductCard key={product.id} product={product} />)}</motion.div>
    </div></section>
    <section className="story-band">
      <Reveal className="story-image"><img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1100&q=85" alt="Freshly baked pastries arranged in a bakery" loading="lazy" /><span className="image-caption">A LITTLE SLOWER. A LITTLE SWEETER.</span></Reveal>
      <Reveal className="story-copy"><span className="eyebrow">OUR LITTLE CORNER OF THE WORLD</span><h2>Baked with love.<br />Made to be <i>remembered.</i></h2><p>At Crème & Crumb, we believe life's sweetest moments deserve the finest treats. From delicate pastries to beautifully handcrafted cakes, every creation is made to bring people together.</p><Link className="button button-dark" to="/about">Discover our story <ArrowRight size={16} /></Link><span className="story-flourish">c<span>&</span>c</span></Reveal>
    </section>
    <section className="celebration-banner"><div className="celebration-image" /><div className="celebration-copy"><span className="eyebrow">LET'S MAKE A MOMENT OF IT</span><h2>Every celebration<br />deserves something <i>sweet.</i></h2><p>From birthdays to anniversaries, make every moment special with our handcrafted desserts.</p><Link className="button button-cream" to="/shop">Shop the collection <ArrowRight size={16} /></Link></div></section>
    <section className="section review-section page-shell"><SectionHeading eyebrow="KIND WORDS FROM OUR TABLE" title="A little love, shared." text="These are sample reviews, here until real customer stories arrive." centered /><div className="testimonial-grid" ref={testimonialTrack} onScroll={updateActiveTestimonial}>{testimonials.map((review) => <Reveal key={review.name} className="testimonial-card"><div className="review-stars" aria-label="5 out of 5 stars"><Star /><Star /><Star /><Star /><Star /></div><p>“{review.quote}”</p><div className="review-by"><span className="avatar">{review.name[0]}</span><span><b>{review.name}</b><small>{review.occasion} · Sample review</small></span></div></Reveal>)}</div><div className="testimonial-pagination" aria-label="Sample review pages">{testimonials.map((review, index) => <button key={review.name} className={activeTestimonial === index ? 'active' : ''} aria-label={`Show sample review ${index + 1}`} aria-current={activeTestimonial === index ? 'true' : undefined} onClick={() => scrollToTestimonial(index)} />)}</div></section>
    <section className="gallery-section page-shell"><div className="gallery-heading"><div><span className="eyebrow">A LITTLE LOOK INSIDE</span><h2>Follow our sweet journey.</h2></div><a className="text-link" href="https://instagram.com" target="_blank" rel="noreferrer">@cremeandcrumb <ArrowRight size={14} /></a></div><div className="gallery-grid">{[products[0], products[6], products[2], products[3], products[4], products[10]].map((product, index) => <a href="https://instagram.com" target="_blank" rel="noreferrer" className={`gallery-tile gallery-${index + 1}`} key={product.id}><img src={product.image} alt={product.name} loading="lazy" /><span><span>{product.name}</span><Sparkles size={19} /></span></a>)}</div></section>
    <section className="newsletter"><div className="newsletter-inner"><span className="eyebrow">A LITTLE SOMETHING IN YOUR INBOX</span><h2>Join our sweet newsletter.</h2><p>New arrivals, little offers, and sweet surprises. No spam, ever.</p><form onSubmit={subscribe} className="newsletter-form"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setNewsletterState(''); }} placeholder="Your email address" required /><button className="button button-dark">Count me in <ArrowRight size={15} /></button></form><p className={`newsletter-message ${newsletterState.includes('valid') ? 'error' : ''}`} aria-live="polite">{newsletterState || 'Demo signup only — your email is not sent or shared.'}</p></div></section>
  </main>;
}

const fadeForHero = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
};

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [eggless, setEggless] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(8);
  const category = searchParams.get('category') || '';
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);
  const updateCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set('category', value) : next.delete('category');
    query ? next.set('q', query) : next.delete('q');
    setSearchParams(next, { replace: true });
  };
  const clearFilters = () => { setQuery(''); setEggless(false); setMaxPrice(2000); setSort('featured'); setSearchParams({}); setVisibleCount(8); };
  const matches = useMemo(() => {
    let list = products.filter((item) => (!category || item.category === category) && (!query || searchProducts(query).some((result) => result.id === item.id)) && (!eggless || item.eggless) && item.price <= maxPrice);
    if (sort === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'popular') list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === 'newest') list = [...list].reverse();
    return list;
  }, [category, query, eggless, maxPrice, sort]);
  const heading = categories.find((item) => item.slug === category)?.name || 'All the good things';

  return <main className="shop-page page-shell">
    <Breadcrumb current="Shop" />
    <div className="shop-intro"><div><span className="eyebrow">THE GOOD STUFF</span><h1>{heading}<i>.</i></h1><p>Small-batch favourites for your everyday little celebrations.</p></div><span className="shop-intro-note">Made fresh, just for you <b>✳</b></span></div>
    <div className="shop-toolbar"><div className="category-pills"><button className={!category ? 'active' : ''} onClick={() => updateCategory('')}>All treats</button>{categories.map((item) => <button key={item.name} className={category === item.slug ? 'active' : ''} onClick={() => updateCategory(item.slug)}>{item.name}</button>)}</div><div className="shop-controls"><label className="shop-search"><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search treats..." /><span>⌕</span></label><label className="sort-label"><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Sort: Featured</option><option value="popular">Most popular</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="newest">Newest first</option></select><ChevronDown size={14} /></label></div></div>
    <div className="shop-content"><aside className="filter-panel"><div className="filter-heading"><h3>Refine your pick</h3><button onClick={clearFilters}>Clear all</button></div><fieldset><legend>Price range</legend><div className="price-range"><span>₹0</span><span>{money(maxPrice)}</span></div><input type="range" min="100" max="2000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" /></fieldset><fieldset><legend>Made without egg?</legend><label className="check-row"><input type="checkbox" checked={eggless} onChange={(event) => setEggless(event.target.checked)} /><span>Show eggless options</span></label></fieldset><div className="filter-note"><Sparkles size={17} /><p>Dietary and allergen details are sample information. Please confirm with our bakery before ordering.</p></div></aside>
      <div className="shop-results"><div className="results-heading"><span><b>{matches.length}</b> sweet finds</span>{category && <button className="clear-chip" onClick={() => updateCategory('')}>× {heading}</button>}</div>
        {matches.length ? <motion.div className="product-grid shop-product-grid" variants={stagger} initial="hidden" animate="visible" key={`${category}-${query}-${eggless}-${maxPrice}-${sort}`}>{matches.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}</motion.div> : <div className="no-results"><span>✳</span><h2>No treats found just yet.</h2><p>Try a different search or clear a filter to find your next favourite.</p><button className="button button-dark" onClick={clearFilters}>Clear filters <ArrowRight size={15} /></button></div>}
        {matches.length > visibleCount && <button className="button button-outline more-button" onClick={() => setVisibleCount((count) => count + 4)}>Show me more <ArrowDown size={15} /></button>}
      </div>
    </div>
  </main>;
}

export function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('1 kg');
  if (!product) return <EmptyState title="We couldn't find that treat." text="It may have sold out, but there are plenty of other lovely things to discover." />;
  const multipliers = { '0.5 kg': 0.65, '1 kg': 1, '2 kg': 1.85, '3 kg': 2.65 };
  const price = product.category === 'cakes' ? Math.round(product.price * multipliers[size]) : product.price;
  const saved = wishlist.some((item) => item.id === product.id);
  return <main className="detail-page page-shell"><Breadcrumb current={product.name} /><div className="detail-layout">
    <div className="detail-photo"><img src={product.image} alt={product.name} /><span className="detail-image-note">MADE FRESH IN OUR LITTLE KITCHEN</span></div>
    <div className="detail-copy"><span className="eyebrow">{product.badge || 'A CRÈME & CRUMB FAVOURITE'}</span><h1>{product.name}</h1><div className="detail-rating"><span className="rating"><Star size={14} fill="currentColor" /> {product.rating}</span><span>{product.reviews} sample reviews</span></div><p className="detail-description">{product.description}</p>
      <div className="detail-price">{money(price)} {product.oldPrice && size === '1 kg' && <del>{money(product.oldPrice)}</del>}</div>
      {product.category === 'cakes' && <label className="field-label">Choose your cake size<select className="form-control" value={size} onChange={(event) => setSize(event.target.value)}>{Object.keys(multipliers).map((option) => <option key={option}>{option}</option>)}</select></label>}
      <div className="detail-quantity-row"><div className="quantity-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div><button className="button button-dark detail-add" onClick={() => addToCart(product, quantity, price, product.category === 'cakes' ? size : '')}>Add to bag <ShoppingBag size={16} /></button><button className={`detail-heart ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(product)}><Heart size={19} fill={saved ? 'currentColor' : 'none'} /></button></div>
      <div className="delivery-note"><Truck size={18} /><span><b>A little note on delivery</b><small>Free local delivery on orders over ₹999. Delivery availability is confirmed at checkout.</small></span></div>
      <div className="detail-accordions"><details><summary>What's inside <ChevronDown size={16} /></summary><p>{product.ingredients} Sample product details only; please confirm current ingredients before ordering.</p></details><details><summary>Allergens & dietary notes <ChevronDown size={16} /></summary><p>{product.allergens} Not certified dietary advice. Contact the bakery to confirm.</p></details><details><summary>Perfect for <ChevronDown size={16} /></summary><p>{product.serves}. Best enjoyed fresh on the day of delivery.</p></details></div>
    </div></div>
    <section className="related-section"><SectionHeading eyebrow="ONE MORE FOR THE TABLE" title="You might also love." link="Shop all treats" /><div className="product-grid">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
  </main>;
}

const cakeBase = { '0.5 kg': 799, '1 kg': 1299, '2 kg': 2299, '3 kg': 3299 };
const designFee = { Floral: 250, Minimalist: 0, 'Photo Cake': 350, 'Designer Cake': 500 };
export function CustomCake() {
  const [occasion, setOccasion] = useState('Birthday');
  const [size, setSize] = useState('1 kg');
  const [flavour, setFlavour] = useState('Chocolate');
  const [design, setDesign] = useState('Floral');
  const [eggless, setEggless] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const price = cakeBase[size] + designFee[design] + (eggless ? 100 : 0);
  const minDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = form.get('message') ? ` · message: “${form.get('message')}”` : '';
    setConfirmation(`${form.get('name')} · ${occasion} · ${size} ${flavour.toLowerCase()} ${eggless ? 'eggless' : ''} cake · ${design} design · requested for ${form.get('date')} (${form.get('time')})${message} · estimated ${money(price)}. The bakery will confirm availability and a final quotation.`);
    event.currentTarget.reset();
  };
  return <main className="custom-page page-shell"><Breadcrumb current="Custom cake studio" /><div className="custom-intro"><span className="eyebrow">MADE JUST FOR YOUR MOMENT</span><h1>Your cake, your <i>story.</i></h1><p>Dream it up. We’ll help you make it delicious.</p></div>
    <div className="custom-layout"><div className="custom-photo"><img src="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1000&q=85" alt="Elegant custom celebration cake with delicate floral decoration" /><div className="custom-photo-caption"><span>THE CUSTOM CAKE STUDIO</span><p>A little something made only for you.</p></div></div>
      <form className="custom-form" onSubmit={submit}><div className="custom-form-heading"><span className="eyebrow">LET'S MAKE IT YOURS</span><h2>Tell us what you're dreaming of.</h2></div>
        <label className="field-label">Your name<input className="form-control" name="name" required placeholder="The name we should know you by" /></label>
        <div className="form-two"><label className="field-label">What are we celebrating?<select className="form-control" value={occasion} onChange={(event) => setOccasion(event.target.value)}>{['Birthday', 'Wedding', 'Anniversary', 'Baby Shower', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">Cake size<select className="form-control" value={size} onChange={(event) => setSize(event.target.value)}>{Object.keys(cakeBase).map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <div className="form-two"><label className="field-label">Flavour<select className="form-control" value={flavour} onChange={(event) => setFlavour(event.target.value)}>{['Chocolate', 'Vanilla', 'Red Velvet', 'Black Forest', 'Butterscotch'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">Design<select className="form-control" value={design} onChange={(event) => setDesign(event.target.value)}>{Object.keys(designFee).map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <fieldset className="dietary-field"><legend>Choose your sponge</legend><label><input type="radio" checked={!eggless} onChange={() => setEggless(false)} /> Contains egg</label><label><input type="radio" checked={eggless} onChange={() => setEggless(true)} /> Eggless <small>(sample option)</small></label></fieldset>
        <div className="form-two"><label className="field-label">Cake message<input className="form-control" name="message" maxLength="50" placeholder="e.g. Happy birthday, Maya!" /></label><label className="field-label">Preferred delivery date<input className="form-control" type="date" name="date" min={minDate} required /></label></div>
        <div className="form-two"><label className="field-label">Preferred time<select className="form-control" name="time" required><option value="">Choose a time</option><option>10 am – 1 pm</option><option>1 pm – 4 pm</option><option>4 pm – 7 pm</option></select></label><label className="field-label">Email address<input className="form-control" type="email" name="email" required placeholder="you@example.com" /></label></div>
        <label className="field-label">Anything else we should know?<textarea className="form-control" name="notes" rows="3" placeholder="Colours, inspiration, delivery details..." /></label>
        <div className="custom-estimate"><span><small>Your custom cake · sample estimate</small><b>{money(price)}</b><small className="estimate-details">{occasion} · {size} · {flavour} · {design} · {eggless ? 'Eggless sample option' : 'Contains egg'}</small></span><span>Final quote confirmed by the bakery</span></div>
        {confirmation && <div className="success-panel" role="status"><Check size={18} /><p>{confirmation}</p></div>}
        <button className="button button-dark custom-submit">Request your custom cake <ArrowRight size={16} /></button><p className="demo-disclaimer">Demo request only — no order is sent to a real bakery.</p>
      </form>
    </div>
  </main>;
}

export function Wishlist() {
  const { wishlist } = useStore();
  return <main className="page-shell simple-page"><Breadcrumb current="Your wishlist" /><div className="page-title-block"><span className="eyebrow">SAVED FOR A SWEETER DAY</span><h1>Your little wish list.</h1><p>All the treats you’ve had your eye on, in one lovely place.</p></div>{wishlist.length ? <div className="product-grid">{wishlist.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <EmptyState title="Your wishlist is waiting." text="Save the treats you love and they’ll be right here when you’re ready." />}</main>;
}

function OrderSummary({ compact = false }) {
  const { cart, subtotal, delivery, discount, total, coupon, setCoupon, notify } = useStore();
  const [couponInput, setCouponInput] = useState(coupon);
  const [couponError, setCouponError] = useState('');
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'SWEET10' || code === 'FREESHIP') { setCoupon(code); setCouponError(''); notify(`${code} applied`); }
    else { setCouponError('That demo code didn’t work. Try SWEET10 or FREESHIP.'); }
  };
  return <div className={`order-summary ${compact ? 'compact' : ''}`}><h2>Your little order</h2><div className="summary-products">{cart.map((item) =>   <div className="summary-product" key={`${item.id}-${item.price}`}><img src={item.image} alt="" /><span>{item.name}<small>{item.variant ? `Size: ${item.variant} · ` : ''}Qty {item.quantity}</small></span><b>{money(item.price * item.quantity)}</b></div>)}</div>
    {!compact && <div className="coupon-entry"><label htmlFor="coupon-code">A little code?</label><div><input id="coupon-code" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Try SWEET10" /><button onClick={applyCoupon}>Apply</button></div>{couponError && <small className="form-error" role="alert">{couponError}</small>}{coupon && <small className="coupon-applied">Applied: {coupon}</small>}</div>}
    <div className="summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="summary-line"><span>Delivery</span><span>{delivery ? money(delivery) : <b className="free-label">On us</b>}</span></div>{discount > 0 && <div className="summary-line discount-line"><span>Sweet 10% off</span><span>−{money(discount)}</span></div>}<div className="summary-total"><b>Total</b><b>{money(total)}</b></div>
    {subtotal > 0 && subtotal < 999 && coupon !== 'FREESHIP' && <div className="delivery-progress"><span>You're {money(999 - subtotal)} away from free delivery.</span><div><i style={{ width: `${Math.min(100, subtotal / 999 * 100)}%` }} /></div></div>}
  </div>;
}

export function Cart() {
  const { cart, setQuantity, removeFromCart, subtotal } = useStore();
  return <main className="page-shell cart-page"><Breadcrumb current="Your bag" /><div className="page-title-block"><span className="eyebrow">GOOD THINGS ARE GATHERING</span><h1>Your shopping bag.</h1><p>A little joy, soon to be on its way.</p></div>
    {cart.length ? <div className="cart-layout"><div className="cart-items">        <div className="cart-table-head"><span>Your treats <b>({cart.reduce((sum, item) => sum + item.quantity, 0)})</b></span><span>Quantity</span><span>Total</span></div>{cart.map((item) => <article className="cart-item" key={item.cartKey || `${item.id}-${item.price}`}><Link to={`/product/${item.slug}`}><img src={item.image} alt={item.name} /></Link><div className="cart-item-name"><Link to={`/product/${item.slug}`}><h3>{item.name}</h3></Link>{item.variant && <span>Size: {item.variant}</span>}<span>{money(item.price)} each</span><button className="remove-item" onClick={() => removeFromCart(item.cartKey || `${item.id}-${item.price}`)}>Remove</button></div><div className="quantity-control"><button onClick={() => setQuantity(item.cartKey || `${item.id}-${item.price}`, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => setQuantity(item.cartKey || `${item.id}-${item.price}`, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={14} /></button></div><b className="cart-item-total">{money(item.price * item.quantity)}</b></article>)}
      <Link to="/shop" className="continue-link"><ArrowLeft size={15} /> Keep browsing</Link></div><div className="cart-checkout"><OrderSummary /><Link className="button button-dark checkout-button" to="/checkout">Continue to checkout <ArrowRight size={16} /></Link><p><ShieldCheck size={14} /> A secure, demo-only checkout</p><small>{subtotal >= 999 ? 'You’ve unlocked free delivery!' : 'Free delivery on orders above ₹999.'}</small></div></div>
      : <EmptyState title="Your bag is still dreaming." text="Fill it with something freshly baked and lovely." />}
  </main>;
}

export function Checkout() {
  const { cart, subtotal, delivery, discount, total, clearCart, setCoupon } = useStore();
  const navigate = useNavigate();
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const placeOrder = (event) => {
    event.preventDefault();
    const reference = `CC-${Date.now().toString().slice(-7)}`;
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    sessionStorage.setItem('cc-last-order', JSON.stringify({ reference, items: cart, subtotal, delivery, discount, total, details: formData }));
    clearCart();
    setCoupon('');
    navigate('/order-confirmation');
  };
  if (!cart.length) return <main className="page-shell checkout-page"><Breadcrumb current="Checkout" /><EmptyState title="A lovely checkout starts with a lovely treat." text="Your bag is empty, so there’s nothing to check out just yet." /></main>;
  return <main className="page-shell checkout-page"><Breadcrumb current="Checkout" /><div className="page-title-block"><span className="eyebrow">JUST ONE MORE LITTLE THING</span><h1>Let's make it yours.</h1><p>Tell us where to bring the good stuff.</p></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={placeOrder}><div className="form-section"><h2><span>01</span> The lovely details</h2>    <div className="form-two"><label className="field-label">Full name<input className="form-control" name="name" autoComplete="name" required /></label><label className="field-label">Phone number<input className="form-control" name="phone" type="tel" autoComplete="tel" pattern="[0-9]{8,18}" title="Enter a phone number with 8 to 18 digits." required /></label></div><label className="field-label">Email address<input className="form-control" name="email" type="email" autoComplete="email" required /></label><label className="field-label">Delivery address<input className="form-control" name="address" autoComplete="street-address" required /></label><div className="form-two"><label className="field-label">City<input className="form-control" name="city" autoComplete="address-level2" required /></label><label className="field-label">Postal code<input className="form-control" name="postal" autoComplete="postal-code" pattern="[0-9]{5,6}" title="Enter a 5 or 6 digit postal code." required /></label></div></div>
      <div className="form-section"><h2><span>02</span> Delivery, your way</h2><div className="form-two"><label className="field-label">Delivery date<input className="form-control" type="date" name="date" min={minDate} required /></label><label className="field-label">A time that suits<select className="form-control" name="time" required><option value="">Choose a time slot</option><option>10 am – 1 pm</option><option>1 pm – 4 pm</option><option>4 pm – 7 pm</option></select></label></div><label className="field-label">A note for our delivery team<textarea className="form-control" name="notes" rows="3" placeholder="Landmark, gate details, or a little note..." /></label></div>
      <div className="demo-payment"><ShieldCheck size={19} /><div><b>No real payment will be collected.</b><p>This is a demo checkout. No card details are requested or stored. Orders are not sent to a real bakery.</p></div></div><button className="button button-dark checkout-place">Place demo order <ArrowRight size={16} /></button></form>
      <div className="checkout-sidebar"><OrderSummary /><div className="trust-note"><Truck size={17} /><span>Carefully packed with a little extra love.</span></div><div className="trust-note"><ShieldCheck size={17} /><span>Your information stays in this demo.</span></div></div>
    </div>
  </main>;
}

export function OrderConfirmation() {
  const rawOrder = sessionStorage.getItem('cc-last-order');
  const order = rawOrder ? JSON.parse(rawOrder) : null;
  if (!order) return <main className="page-shell simple-page"><EmptyState title="No order to celebrate just yet." text="Add a treat to your bag and checkout to see your demo confirmation." /></main>;
  return <main className="page-shell confirmation-page"><div className="confirmation-card"><span className="confirmation-icon"><Check size={28} /></span><span className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</span><h1>Thank you, {order.details.name.split(' ')[0]}.</h1><p>Your demo order is all wrapped up. In a real shop, the bakery would be in touch to confirm the details.</p>    <div className="order-reference">DEMO ORDER REFERENCE <b>{order.reference}</b></div><div className="confirmation-items">{order.items.map((item) => <div key={item.cartKey || `${item.id}-${item.price}`}><img src={item.image} alt="" /><span>{item.name}<small>{item.variant ? `Size: ${item.variant} · ` : ''}Qty {item.quantity}</small></span><b>{money(item.price * item.quantity)}</b></div>)}</div><div className="summary-total"><b>Order total</b><b>{money(order.total)}</b></div><div className="demo-disclaimer"><ShieldCheck size={15} /> Demo only — no payment was collected and no real order was placed.</div><Link className="button button-dark" to="/shop" onClick={() => sessionStorage.removeItem('cc-last-order')}>Back to the good stuff <ArrowRight size={15} /></Link></div></main>;
}

export function About() {
  return <main className="about-page"><div className="about-hero page-shell"><Breadcrumb current="Our story" /><div><span className="eyebrow">A LITTLE ABOUT US</span><h1>Good things take<br />a little <i>time.</i></h1><p>And the best things are made with a little extra love.</p></div></div><div className="about-story"><div className="about-story-image"><img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85" alt="A baker's tray of fresh golden pastries" loading="lazy" /></div><div className="about-story-copy"><span className="eyebrow">OUR LITTLE CORNER OF THE WORLD</span><h2>Baked with love.<br />Made to be <i>remembered.</i></h2><p>At Crème & Crumb, we believe life's sweetest moments deserve the finest treats. From delicate pastries to beautifully handcrafted cakes, every creation is made to bring people together.</p><p>We’re a small-batch bakery in spirit: thoughtful ingredients, a careful hand, and the belief that a really good cake can turn an ordinary Tuesday into a little celebration.</p><Link className="button button-dark" to="/shop">Explore our bakes <ArrowRight size={15} /></Link></div></div><div className="about-values page-shell"><div><span>01</span><h3>Made with intention</h3><p>Every bake gets the time and care it deserves.</p></div><div><span>02</span><h3>For sharing moments</h3><p>From big milestones to small, sweet pauses.</p></div><div><span>03</span><h3>Always a little joyful</h3><p>Because life feels better with something lovely.</p></div></div></main>;
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (event) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); };
  return <main className="page-shell contact-page"><Breadcrumb current="Contact" /><div className="page-title-block"><span className="eyebrow">WE’RE ALL EARS (AND A LITTLE BUTTER)</span><h1>Say hello.</h1><p>Have a question, an idea, or just want to talk cake? Drop us a note.</p></div><div className="contact-layout"><form className="contact-form" onSubmit={submit}><h2>Leave us a little note.</h2><label className="field-label">Your name<input className="form-control" required /></label><label className="field-label">Email address<input className="form-control" type="email" required /></label><label className="field-label">What’s on your mind?<textarea className="form-control" rows="5" required /></label>{sent && <p className="success-inline" role="status"><Check size={16} /> Thanks for your note! This demo form does not send messages.</p>}<button className="button button-dark">Send a demo message <ArrowRight size={15} /></button></form><aside className="contact-aside"><span className="eyebrow">A NOTE ABOUT THIS DEMO</span><h3>We’re a little pretend, for now.</h3><p>Crème & Crumb is a sample storefront. No physical bakery contact details are available, and messages are not delivered to a real team.</p><Link to="/custom-cake" className="text-link">Dreaming up a cake? <ArrowRight size={15} /></Link><span className="contact-flourish">✳</span></aside></div></main>;
}

const policyContent = {
  delivery: { eyebrow: 'THE PRACTICAL LITTLE DETAILS', title: 'Delivery & returns.', intro: 'A few things to know before the good stuff arrives.', sections: [['Delivery', 'Delivery fees are shown in your shopping bag. Orders above ₹999 qualify for free delivery in this demo. Actual delivery zones, availability, and timing would need to be confirmed by a real bakery.'], ['Freshness & timing', 'Our sample storefront represents freshly made goods. In a real order, delivery date and availability would be confirmed directly with the bakery.'], ['Changes & returns', 'Perishable goods may have specific change and cancellation policies. This demo has no real orders, so no purchase or return can be made. Please confirm all terms with the bakery before ordering in a real store.']] },
  privacy: { eyebrow: 'YOUR INFORMATION MATTERS', title: 'Privacy policy.', intro: 'A plain-language note about how this demo behaves.', sections: [['Local demo data', 'Cart and wishlist information are stored in your browser’s local storage to demonstrate persistence. A demo order summary is stored temporarily in session storage.'], ['No real submissions', 'Newsletter signups, contact messages, custom cake requests, and checkout details are not sent to a real business or payment processor. Do not enter sensitive personal or payment details.'], ['Your choice', 'You can clear this demo data by clearing this site’s browser storage. A production storefront would need a complete privacy policy describing its actual services and retention practices.']] },
  terms: { eyebrow: 'THE SMALL PRINT, MADE SIMPLE', title: 'Terms & conditions.', intro: 'This storefront is an interactive demo, not a real bakery.', sections: [['Demo use only', 'Products, prices, reviews, ingredient notes, coupons, and order confirmations are illustrative. No real product is offered for sale and no order is submitted.'], ['Pricing & availability', 'Sample prices are shown in Indian rupees. Any real bakery would need to confirm product availability, final pricing, delivery, ingredients, and dietary requirements.'], ['No payment processing', 'This demo does not collect payment card details and does not process payments. A confirmation screen does not represent a real order.']] },
};

export function PolicyPage({ type }) {
  const content = policyContent[type] || policyContent.delivery;
  return <main className="page-shell policy-page"><Breadcrumb current={content.title.replace('.', '')} /><div className="page-title-block"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p></div><div className="policy-content">{content.sections.map(([title, text], index) => <section key={title}><span>0{index + 1}</span><div><h2>{title}</h2><p>{text}</p></div></section>)}</div><div className="policy-note"><ShieldCheck size={19} /><span>Crème & Crumb is a demo storefront. No real orders, payments, or messages are processed.</span></div></main>;
}

export function NotFound() {
  return <main className="page-shell not-found"><span className="eyebrow">OH, CRUMBS</span><h1>This page wandered<br />off for a <i>little treat.</i></h1><p>Let’s get you back to the good stuff.</p><Link className="button button-dark" to="/">Back to home <ArrowRight size={15} /></Link></main>;
}

export { OrderSummary };
