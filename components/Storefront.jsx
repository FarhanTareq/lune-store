"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import ProductArt from "./ProductArt";

const FREE_SHIPPING = 75;

const announcements = [
  "Free carbon-neutral shipping over $75",
  "The spring edit just landed — 16 new pieces",
  "30-day easy returns, no questions asked",
];

const features = [
  {
    icon: Truck,
    title: "Free shipping",
    text: "Carbon-neutral delivery on every order over $75.",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    text: "Live with it for a month. Send it back if it isn't right.",
  },
  {
    icon: Leaf,
    title: "Natural materials",
    text: "Linen, oak, stoneware, and wool — nothing synthetic.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Encrypted payments and a two-year craftsmanship promise.",
  },
];

const testimonials = [
  {
    quote:
      "The mug has become the first thing I reach for every morning. It feels considered in a way few things do.",
    name: "Maya Chen",
    location: "Portland, OR",
    initials: "MC",
    tone: "#d8c7b2",
  },
  {
    quote:
      "I bought the linen throw as a gift and immediately ordered a second one for myself. Beautiful weight and colour.",
    name: "Jonas Reed",
    location: "Copenhagen, DK",
    initials: "JR",
    tone: "#aebba8",
  },
  {
    quote:
      "Everything arrived in simple, plastic-free packaging. The apron is now the only one I wear in the kitchen.",
    name: "Amara Okafor",
    location: "London, UK",
    initials: "AO",
    tone: "#c4a8a0",
  },
];

const footerColumns = [
  {
    title: "Shop",
    links: ["All pieces", "New arrivals", "Bestsellers", "The sale"],
  },
  {
    title: "Help",
    links: ["Shipping", "Returns", "Care guide", "Contact"],
  },
  {
    title: "Studio",
    links: ["Our story", "Materials", "Journal", "Stockists"],
  },
];

const heroVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function productGradient(product) {
  return `radial-gradient(120% 120% at 20% 8%, rgba(255,255,255,.7) 0%, transparent 54%), linear-gradient(145deg, ${product.tone} 0%, ${product.tone2} 100%)`;
}

function badgeClass(badge) {
  return badge ? badge.toLowerCase().replace(/\s+/g, "-") : "";
}

export default function Storefront({ products, categories }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [quickQty, setQuickQty] = useState(1);
  const [selectedColors, setSelectedColors] = useState({});
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [toast, setToast] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const searchRef = useRef(null);
  const shopRef = useRef(null);
  const toastTimer = useRef(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 80]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.id);
        return sum + (product ? product.price * item.qty : 0);
      }, 0),
    [cart, products],
  );

  const freeShippingLeft = Math.max(0, FREE_SHIPPING - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const inCategory = category === "All" || product.category === category;
      const inSearch =
        !term ||
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(term);
      const inWishlist = !savedOnly || wishlist.includes(product.id);
      return inCategory && inSearch && inWishlist;
    });

    if (sort === "price-low") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-high") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sort === "rating") {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, category, query, savedOnly, wishlist, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const locked = cartOpen || Boolean(quickView) || menuOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, quickView, menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setQuickView(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  const chooseCategory = (nextCategory) => {
    setCategory(nextCategory);
    setSavedOnly(false);
    setVisibleCount(8);
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setVisibleCount(8);
  };

  const handleSort = (event) => {
    setSort(event.target.value);
    setVisibleCount(8);
  };

  const clearFilters = () => {
    setCategory("All");
    setQuery("");
    setSort("featured");
    setSavedOnly(false);
    setVisibleCount(8);
  };

  const showSaved = () => {
    const next = !savedOnly;
    setSavedOnly(next);
    setCategory("All");
    setVisibleCount(8);
    if (next) {
      shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const focusSearch = () => {
    setMenuOpen(false);
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => searchRef.current?.focus(), 500);
  };

  const chooseColor = (productId, color) => {
    setSelectedColors((current) => ({ ...current, [productId]: color }));
  };

  const addToCart = (product, color, quantity = 1) => {
    const chosen = color || selectedColors[product.id] || product.colors[0];
    const key = `${product.id}-${chosen}`;
    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: item.qty + quantity } : item,
        );
      }
      return [...current, { key, id: product.id, color: chosen, qty: quantity }];
    });
    notify(`${product.name} added to your bag`);
  };

  const updateQuantity = (key, delta) => {
    setCart((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  };

  const removeCartItem = (key) => {
    setCart((current) => current.filter((item) => item.key !== key));
    notify("Removed from your bag");
  };

  const toggleWishlist = (id) => {
    const alreadySaved = wishlist.includes(id);
    setWishlist((current) =>
      alreadySaved
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
    notify(alreadySaved ? "Removed from saved pieces" : "Saved for later");
  };

  const openQuickView = (product) => {
    setQuickView(product);
    setQuickQty(1);
  };

  const handleNewsletter = (event) => {
    event.preventDefault();
    setNewsletterDone(true);
    notify("You're on the list — welcome to Lune");
  };

  const quickColor = quickView
    ? selectedColors[quickView.id] || quickView.colors[0]
    : null;

  return (
    <div className="site-shell">
      <div className="announcement">
        <div className="announcement-inner">
          <Sparkles size={13} />
          <AnimatePresence mode="wait">
            <motion.span
              key={announcementIndex}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.3 }}
            >
              {announcements[announcementIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <a href="/" className="brand" aria-label="Lune home">
            Lune<span>.</span>
          </a>

          <nav className="site-nav" aria-label="Main navigation">
            <a href="#shop">Shop</a>
            <a href="#story">Our standard</a>
            <a href="#reviews">Reviews</a>
            <a href="#journal">Journal</a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn search-trigger"
              onClick={focusSearch}
              aria-label="Search products"
            >
              <Search size={18} />
            </button>
            <button
              className={`icon-btn ${savedOnly ? "active" : ""}`}
              onClick={showSaved}
              aria-label="View saved pieces"
            >
              <Heart
                size={18}
                fill={wishlist.length > 0 ? "currentColor" : "none"}
              />
              {wishlist.length > 0 && (
                <motion.span
                  className="mini-badge"
                  key={wishlist.length}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  {wishlist.length}
                </motion.span>
              )}
            </button>
            <button
              className="bag-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={17} />
              <span className="bag-label">Bag</span>
              <motion.span
                className="bag-count"
                key={cartCount}
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
              >
                {cartCount}
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              aria-label="Mobile navigation"
            >
              <a href="#shop" onClick={() => setMenuOpen(false)}>
                Shop all
              </a>
              <a href="#story" onClick={() => setMenuOpen(false)}>
                Our standard
              </a>
              <a href="#reviews" onClick={() => setMenuOpen(false)}>
                Reviews
              </a>
              <a href="#journal" onClick={() => setMenuOpen(false)}>
                Journal
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <motion.div
              className="hero-copy"
              variants={heroVariants}
              initial="hidden"
              animate="show"
            >
              <motion.p className="eyebrow" variants={fadeUp}>
                <span className="eyebrow-dot" /> Spring edit · 2026
              </motion.p>
              <motion.h1 variants={fadeUp}>
                Everyday objects,
                <br />
                <em>made to be kept.</em>
              </motion.h1>
              <motion.p className="hero-sub" variants={fadeUp}>
                Thoughtful homeware and wearables in natural materials —
                designed in small batches and built for the long run.
              </motion.p>
              <motion.div className="hero-actions" variants={fadeUp}>
                <a href="#shop" className="btn btn-primary">
                  Shop the edit <ArrowRight size={16} />
                </a>
                <a href="#story" className="btn btn-ghost">
                  Our philosophy
                </a>
              </motion.div>
              <motion.div className="hero-stats" variants={fadeUp}>
                <div>
                  <strong>
                    4.9 <Star size={13} fill="currentColor" />
                  </strong>
                  <span>2,480 reviews</span>
                </div>
                <div>
                  <strong>12k+</strong>
                  <span>happy homes</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>natural materials</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-glow hero-glow-a" />
              <div className="hero-glow hero-glow-b" />

              <motion.div
                className="hero-product-card"
                style={{ y: heroY }}
              >
                <div className="hero-product-top">
                  <span className="pill pill-light">Featured piece</span>
                  <div className="seal" aria-hidden="true">
                    <svg viewBox="0 0 100 100">
                      <defs>
                        <path
                          id="seal-path"
                          d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"
                        />
                      </defs>
                      <text>
                        <textPath href="#seal-path">
                          SMALL BATCH · NATURAL · LUNE ·
                        </textPath>
                      </text>
                    </svg>
                    <Star size={18} fill="currentColor" />
                  </div>
                </div>
                <div className="hero-product-art">
                  <ProductArt type="lamp" />
                </div>
                <div className="hero-product-foot">
                  <div>
                    <span className="tiny-label">Home · Lighting</span>
                    <h3>Arc Table Lamp</h3>
                  </div>
                  <div className="hero-price">$120</div>
                </div>
              </motion.div>

              <motion.div
                className="float-card float-card-one"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="float-art">
                  <ProductArt type="mug" />
                </div>
                <div>
                  <strong>Stoneware Mug</strong>
                  <span>$24 · 4.8 ★</span>
                </div>
              </motion.div>

              <motion.div
                className="float-card float-card-two"
                animate={{ y: [0, 9, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <span className="float-stars">★★★★★</span>
                <strong>Loved by 12,000+ homes</strong>
                <span>Free returns, always</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((group) => (
              <div className="marquee-group" key={group}>
                <span>Small batch</span>
                <i />
                <span>Natural materials</span>
                <i />
                <span>Made to last</span>
                <i />
                <span>Plastic-free packaging</span>
                <i />
                <span>Designed in-house</span>
                <i />
              </div>
            ))}
          </div>
        </div>

        <section className="features">
          <div className="container features-grid">
            {features.map((feature, index) => (
              <motion.div
                className="feature"
                key={feature.title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.06 }}
              >
                <span className="feature-icon">
                  <feature.icon size={20} />
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="shop-section" id="shop" ref={shopRef}>
          <div className="container">
            <motion.div
              className="section-heading"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div>
                <p className="eyebrow">Shop the edit</p>
                <h2>
                  Small batch, <em>everyday</em> essentials
                </h2>
              </div>
              <p className="section-note">
                {filteredProducts.length} pieces · free shipping over $
                {FREE_SHIPPING}
              </p>
            </motion.div>

            <div className="shop-controls">
              <div className="category-tabs">
                {categories.map((entry) => {
                  const active = !savedOnly && category === entry;
                  return (
                    <button
                      key={entry}
                      className={`tab ${active ? "active" : ""}`}
                      onClick={() => chooseCategory(entry)}
                    >
                      {active && (
                        <motion.span
                          layoutId="tab-pill"
                          className="tab-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}
                      <span>{entry}</span>
                    </button>
                  );
                })}
                {savedOnly && (
                  <button className="tab active">
                    <motion.span
                      layoutId="tab-pill"
                      className="tab-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                    <span>Saved</span>
                  </button>
                )}
              </div>

              <div className="control-right">
                <label className="search-box">
                  <Search size={16} />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search pieces"
                    aria-label="Search pieces"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setVisibleCount(8);
                      }}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
                <label className="sort-box">
                  <select
                    value={sort}
                    onChange={handleSort}
                    aria-label="Sort products"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Top rated</option>
                  </select>
                  <ChevronDown size={14} />
                </label>
              </div>
            </div>

            {savedOnly && (
              <motion.div
                className="saved-banner"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>
                  Showing your saved pieces ({wishlist.length})
                </span>
                <button onClick={() => setSavedOnly(false)}>Show all</button>
              </motion.div>
            )}

            <motion.div layout className="product-grid">
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    wishlisted={wishlist.includes(product.id)}
                    selectedColor={selectedColors[product.id]}
                    onColor={chooseColor}
                    onWishlist={toggleWishlist}
                    onQuickView={openQuickView}
                    onAdd={addToCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="empty-icon">
                  <Search size={24} />
                </span>
                <h3>No pieces found</h3>
                <p>
                  Try a different search or clear the filters to see the full
                  edit.
                </p>
                <button className="btn btn-ghost" onClick={clearFilters}>
                  Clear filters
                </button>
              </motion.div>
            )}

            {filteredProducts.length > visibleCount && (
              <div className="load-more">
                <button
                  className="btn btn-ghost"
                  onClick={() => setVisibleCount((current) => current + 4)}
                >
                  Load more pieces <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="story" id="story">
          <div className="container story-grid">
            <motion.div
              className="story-visual"
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="story-halo" />
              <div className="story-card">
                <span className="story-stamp">Since 2019</span>
                <ProductArt type="vase" />
              </div>
              <motion.div
                className="story-mini"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="story-mini-art">
                  <ProductArt type="board" />
                </div>
                <div>
                  <strong>Responsibly sourced</strong>
                  <span>FSC-certified oak</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="story-copy"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">Our standard</p>
              <h2>
                Made slowly.
                <br />
                <em>Loved for years.</em>
              </h2>
              <p>
                We make a small number of things, and we make them properly.
                Natural materials, honest prices, and no unnecessary extras —
                just objects that earn their place in your home.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={16} /> Small-batch production with independent
                  makers
                </li>
                <li>
                  <Check size={16} /> Plastic-free, recyclable packaging
                </li>
                <li>
                  <Check size={16} /> A two-year craftsmanship guarantee
                </li>
              </ul>
              <a href="#shop" className="btn btn-primary">
                Discover the collection <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>
        </section>

        <section className="reviews" id="reviews">
          <div className="container">
            <div className="reviews-head">
              <div>
                <p className="eyebrow">Kind words</p>
                <h2>
                  Loved in <em>12,000+</em> homes
                </h2>
              </div>
              <div className="review-summary">
                <span className="summary-stars">★★★★★</span>
                <span>4.9 average · 2,480 reviews</span>
              </div>
            </div>

            <div className="reviews-grid">
              {testimonials.map((testimonial, index) => (
                <motion.figure
                  className="review-card"
                  key={testimonial.name}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="quote-mark">“</div>
                  <blockquote>{testimonial.quote}</blockquote>
                  <figcaption>
                    <span
                      className="avatar"
                      style={{ background: testimonial.tone }}
                    >
                      {testimonial.initials}
                    </span>
                    <div>
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.location}</span>
                    </div>
                    <span className="verified">
                      <Check size={12} /> Verified
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        <section className="newsletter" id="journal">
          <div className="container">
            <motion.div
              className="newsletter-card"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="newsletter-copy">
                <p className="eyebrow">The Lune letter</p>
                <h2>
                  Slow stories, early access,
                  <br />
                  and the occasional secret sale.
                </h2>
              </div>
              {newsletterDone ? (
                <motion.div
                  className="newsletter-success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span>
                    <Check size={18} />
                  </span>
                  You&apos;re on the list. Welcome to Lune.
                </motion.div>
              ) : (
                <form className="newsletter-form" onSubmit={handleNewsletter}>
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    aria-label="Email address"
                  />
                  <button className="btn btn-primary" type="submit">
                    Join the list <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <a href="/" className="brand">
              Lune<span>.</span>
            </a>
            <p>
              Thoughtful objects for a slower everyday. Designed in small
              batches, made to last.
            </p>
            <div className="footer-tags">
              <span>Carbon neutral</span>
              <span>Plastic free</span>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <a href="#shop" key={link}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Lune Studio</span>
          <div className="footer-legal">
            <a href="#shop">Privacy</a>
            <a href="#shop">Terms</a>
            <a href="#shop">Shipping</a>
          </div>
          <span>Made with care, naturally.</span>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              className="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping bag"
            >
              <div className="drawer-head">
                <div>
                  <p className="eyebrow">Your selections</p>
                  <h3>
                    Shopping bag <span>({cartCount})</span>
                  </h3>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close bag"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length > 0 && (
                <div className="shipping-progress">
                  <div className="shipping-copy">
                    {freeShippingLeft > 0 ? (
                      <span>
                        You&apos;re <strong>${freeShippingLeft}</strong> away
                        from free shipping
                      </span>
                    ) : (
                      <span className="shipping-unlocked">
                        <Check size={14} /> Free shipping unlocked
                      </span>
                    )}
                    <span>{Math.round(shippingProgress)}%</span>
                  </div>
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      initial={false}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>
              )}

              <div className="drawer-body">
                <AnimatePresence initial={false}>
                  {cart.length === 0 ? (
                    <motion.div
                      className="cart-empty"
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="empty-icon">
                        <ShoppingBag size={26} />
                      </span>
                      <h4>Your bag is feeling light</h4>
                      <p>
                        Add a few considered pieces and they&apos;ll show up
                        here.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setCartOpen(false);
                          shopRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        Browse the edit
                      </button>
                    </motion.div>
                  ) : (
                    cart.map((item) => {
                      const product = products.find(
                        (entry) => entry.id === item.id,
                      );
                      if (!product) return null;
                      return (
                        <motion.div
                          className="cart-line"
                          key={item.key}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 24, height: 0 }}
                        >
                          <div
                            className="cart-line-art"
                            style={{ background: productGradient(product) }}
                          >
                            <ProductArt type={product.art} />
                          </div>
                          <div className="cart-line-info">
                            <div className="cart-line-top">
                              <h4>{product.name}</h4>
                              <button
                                onClick={() => removeCartItem(item.key)}
                                aria-label={`Remove ${product.name}`}
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <span className="cart-line-meta">
                              <i style={{ background: item.color }} /> $
                              {product.price} each
                            </span>
                            <div className="qty-control">
                              <button
                                onClick={() =>
                                  updateQuantity(item.key, -1)
                                }
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span>{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.key, 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <strong className="cart-line-price">
                            ${product.price * item.qty}
                          </strong>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

              <div className="drawer-foot">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <strong>${subtotal}</strong>
                </div>
                <p className="drawer-note">
                  Taxes and shipping calculated at checkout.
                </p>
                <button
                  className="btn btn-primary checkout-btn"
                  disabled={cart.length === 0}
                  onClick={() =>
                    notify("Checkout is a demo — thank you for exploring Lune")
                  }
                >
                  Secure checkout <ShieldCheck size={16} />
                </button>
                <button
                  className="continue-btn"
                  onClick={() => setCartOpen(false)}
                >
                  Continue shopping
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickView && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickView(null)}
          >
            <motion.div
              className="quick-modal"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={quickView.name}
            >
              <button
                className="modal-close"
                onClick={() => setQuickView(null)}
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>

              <div
                className="quick-visual"
                style={{ background: productGradient(quickView) }}
              >
                {quickView.badge && (
                  <span
                    className={`product-badge ${badgeClass(quickView.badge)}`}
                  >
                    {quickView.badge}
                  </span>
                )}
                <motion.div
                  className="quick-art"
                  initial={{ scale: 0.9, rotate: -3 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <ProductArt type={quickView.art} />
                </motion.div>
              </div>

              <div className="quick-content">
                <p className="eyebrow">{quickView.category}</p>
                <h2>{quickView.name}</h2>
                <div className="quick-rating">
                  <span className="stars">★★★★★</span>
                  <span>
                    {quickView.rating} · {quickView.reviews} reviews
                  </span>
                </div>
                <div className="quick-price">
                  ${quickView.price}
                  {quickView.compareAt && <s>${quickView.compareAt}</s>}
                </div>
                <p className="quick-description">{quickView.description}</p>

                <div className="quick-option">
                  <span>Colour</span>
                  <div className="swatch-row static">
                    {quickView.colors.map((color) => (
                      <button
                        key={color}
                        className={`swatch ${
                          quickColor === color ? "active" : ""
                        }`}
                        style={{ background: color }}
                        onClick={() => chooseColor(quickView.id, color)}
                        aria-label={`Choose colour ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="quick-actions">
                  <div className="qty-control large">
                    <button
                      onClick={() => setQuickQty((value) => Math.max(1, value - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{quickQty}</span>
                    <button
                      onClick={() => setQuickQty((value) => value + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart(quickView, quickColor, quickQty);
                      setQuickView(null);
                      setCartOpen(true);
                    }}
                  >
                    Add to bag <ShoppingBag size={16} />
                  </button>
                </div>

                <ul className="quick-perks">
                  <li>
                    <Truck size={14} /> Free shipping over ${FREE_SHIPPING}
                  </li>
                  <li>
                    <RotateCcw size={14} /> 30-day returns
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="toast-wrap" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
            >
              <Check size={16} /> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  index,
  wishlisted,
  selectedColor,
  onColor,
  onWishlist,
  onQuickView,
  onAdd,
}) {
  const color = selectedColor || product.colors[0];

  return (
    <motion.article
      layout
      className="product-card"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.45,
        delay: index < 8 ? index * 0.035 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
    >
      <div
        className="product-media"
        style={{ background: productGradient(product) }}
      >
        {product.badge && (
          <span className={`product-badge ${badgeClass(product.badge)}`}>
            {product.badge}
          </span>
        )}

        <motion.button
          className={`heart-btn ${wishlisted ? "saved" : ""}`}
          onClick={() => onWishlist(product.id)}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from saved pieces`
              : `Save ${product.name}`
          }
          whileTap={{ scale: 0.82 }}
        >
          <Heart size={17} fill={wishlisted ? "currentColor" : "none"} />
        </motion.button>

        <motion.div
          className="product-art-wrap"
          whileHover={{ scale: 1.06, rotate: -2 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <ProductArt type={product.art} />
        </motion.div>

        <button
          className="quick-view-btn"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}`}
        >
          <ArrowUpRight size={16} />
        </button>

        <div className="swatch-row">
          {product.colors.map((entry) => (
            <button
              key={entry}
              className={`swatch ${color === entry ? "active" : ""}`}
              style={{ background: entry }}
              onClick={() => onColor(product.id, entry)}
              aria-label={`Choose colour ${entry}`}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <div className="product-meta-line">
          <span>{product.category}</span>
          <span className="rating">
            <Star size={12} fill="currentColor" /> {product.rating}
            <small>({product.reviews})</small>
          </span>
        </div>
        <h3>{product.name}</h3>
        <div className="product-footer">
          <div className="price-row">
            <span>${product.price}</span>
            {product.compareAt && <s>${product.compareAt}</s>}
          </div>
          <button
            className="add-btn"
            onClick={() => onAdd(product, color)}
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus size={15} /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
