import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductGrid from '../components/ProductGrid';

const HOME_CATEGORIES = ['All', 'Clothing', 'Electronics', 'Footwear', 'Books'];

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setAllProducts(data);
      // Initially show 4 items
      setDisplayedProducts(data.slice(0, 4));
    } catch (err) {
      setError(err.message || 'Failed to load featured collection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setDisplayedProducts(allProducts.slice(0, 4));
    } else {
      const filtered = allProducts.filter(p => p.category.toLowerCase() === cat.toLowerCase());
      setDisplayedProducts(filtered.slice(0, 4));
    }
  };

  return (
    <main>
      {/* Hero Banner */}
      <section className="hero position-relative overflow-hidden" id="home">
        <img
          src="/asset/Hero.png"
          alt="ATELIER Autumn/Winter Collection"
          className="hero-image w-100 h-100 object-fit-cover"
        />
        <div className="hero-overlay text-center position-absolute top-50 start-50 translate-middle">
          <span className="hero-tag d-block">NEW COLLECTION</span>
          <h1>Timeless Style</h1>
          <Link to="/products" className="hero-btn text-decoration-none">
            EXPLORE COLLECTION
          </Link>
        </div>
      </section>

      {/* Complimentary Shipping Bar */}
      <section className="shipping-bar d-flex justify-content-center align-items-center text-center px-3">
        <span>Complimentary global shipping and returns on all orders over $300.</span>
      </section>

      {/* Featured Categories Grid */}
      <section className="featured-categories py-5" id="categories">
        <div className="container">
          <div className="category-grid">
            {/* Left Large Featured Category Card */}
            <article
              className="category-card category-large cursor-pointer"
              onClick={() => navigate('/products?category=Clothing')}
            >
              <img src="/asset/essential.png" alt="Essentials Collection" className="w-100 h-100 object-fit-cover" />
              <div className="category-content">
                <h3>Essentials</h3>
                <Link to="/products?category=Clothing" onClick={e => e.stopPropagation()}>
                  SHOP NOW
                </Link>
              </div>
            </article>

            {/* Right Column Category Cards */}
            <div className="category-right d-flex flex-column gap-4">
              <article
                className="category-card cursor-pointer"
                onClick={() => navigate('/products?category=Clothing')}
              >
                <img src="/asset/shirt.png" alt="Signature Shirts" className="w-100 h-100 object-fit-cover" />
                <div className="category-content">
                  <h3>Shirts</h3>
                  <Link to="/products?category=Clothing" onClick={e => e.stopPropagation()}>
                    SHOP NOW
                  </Link>
                </div>
              </article>

              <article
                className="category-card cursor-pointer"
                onClick={() => navigate('/products?category=Clothing')}
              >
                <img src="/asset/jeans.png" alt="Tailored Jeans" className="w-100 h-100 object-fit-cover" />
                <div className="category-content">
                  <h3>Jeans</h3>
                  <Link to="/products?category=Clothing" onClick={e => e.stopPropagation()}>
                    SHOP NOW
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          NEW ARRIVALS SECTION (Well-Organized Clean Luxury View)
          ========================================================================== */}
      <section className="new-arrivals-home py-5" id="new-arrivals">
        <div className="container-fluid px-lg-5 px-3">

          {/* Section Header with Eyebrow, Title & Clean Action Link */}
          <div className="section-header-wrap mb-4 pb-2 border-bottom">
            <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
              <div>
                <span className="section-eyebrow d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '11px', letterSpacing: '2px', color: '#78716C' }}>
                  CURATED SELECTION
                </span>
                <h2 className="section-title mb-0" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '46px', fontWeight: 500, color: '#1C1917', lineHeight: 1.1 }}>
                  New Arrivals
                </h2>
                <p className="text-muted small mt-1 mb-0" style={{ letterSpacing: '0.3px' }}>
                  Timeless silhouettes crafted for understated modern distinction.
                </p>
              </div>

              {/* View All Collection Link with Animated Arrow */}
              <Link to="/products" className="view-all-link text-decoration-none d-inline-flex align-items-center gap-2 fw-semibold" style={{ fontSize: '11.5px', letterSpacing: '2px', color: '#1C1917' }}>
                <span>VIEW ALL PIECES</span>
                <i className="bi bi-arrow-right view-arrow-icon"></i>
              </Link>
            </div>

            {/* In-Section Quick Category Filter Tabs */}
            <div className="home-filter-tabs d-flex flex-wrap gap-2 mt-4 pt-2">
              {HOME_CATEGORIES.map(cat => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`home-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Product Grid */}
          <ProductGrid
            products={displayedProducts}
            loading={loading}
            error={error}
            onRetry={loadProducts}
          />

          {/* Bottom Callout Bar */}
          <div className="text-center mt-5 pt-3">
            <Link
              to="/products"
              className="btn btn-outline-dark text-uppercase px-5 py-3 fw-semibold home-explore-btn"
              style={{ fontSize: '11px', letterSpacing: '2.5px', borderRadius: 0 }}
            >
              EXPLORE COMPLETE CATALOG ({allProducts.length} ITEMS)
            </Link>
          </div>

        </div>
      </section>

      {/* Editorial / Trending Section */}
      <section className="trending-section py-5" id="trending">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="trending-image overflow-hidden">
                <img
                  src="/asset/trend pick.png"
                  alt="Curated Seasonal Collection"
                  className="img-fluid w-100 object-fit-cover"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="trending-content ms-lg-auto">
                <span className="section-tag d-block">CURATED SELECTION</span>
                <h2>Trending Picks<br />For The Season</h2>
                <p>
                  Discover pieces defined by their meticulous craftsmanship
                  and understated elegance. Designed to transcend seasons,
                  our latest curation offers the perfect balance of form,
                  function, and unparalleled quality.
                </p>
                <Link to="/products" className="lookbook-btn text-decoration-none">
                  VIEW THE LOOKBOOK
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
