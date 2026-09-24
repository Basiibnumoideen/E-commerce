import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state if URL searchParams change externally (e.g. from navbar search or footer)
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const s = searchParams.get('search') || '';
    setActiveCategory(cat);
    setSearchQuery(s);
  }, [searchParams]);

  // Fetch products with Axios whenever activeCategory or searchQuery changes
  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({ category: activeCategory, search: searchQuery });
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Unable to load products. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [activeCategory, searchQuery]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <main className="new-arrivals py-5">
      <div className="container-fluid px-lg-5 px-3">
        {/* Section Header */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-2">
          <div>
            <h1 className="section-title mb-0">The Collection</h1>
            <p className="text-muted small m-0 pt-1">
              Curated luxury pieces for discerning lifestyles &bull; {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {(activeCategory !== 'All' || searchQuery) && (
            <button 
              type="button" 
              className="btn btn-outline-dark btn-sm text-uppercase"
              onClick={handleResetFilters}
              style={{ fontSize: '11px', letterSpacing: '1px' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Catalog Controls: Categories + Search Bar */}
        <div className="catalog-controls mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-lg-7 col-md-12">
              <CategoryFilter 
                activeCategory={activeCategory} 
                onSelectCategory={handleCategorySelect} 
              />
            </div>

            {/* Live Search Input */}
            <div className="col-lg-5 col-md-12">
              <div className="search-input-wrapper position-relative w-100">
                <i className="bi bi-search search-icon position-absolute top-50 translate-middle-y"></i>
                <input 
                  type="text" 
                  className="form-control live-search-field"
                  placeholder="Search products by name or style..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="clear-search-btn position-absolute top-50 translate-middle-y border-0 bg-transparent"
                    onClick={handleClearSearch}
                    aria-label="Clear Search"
                    style={{ display: 'block' }}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid with Loading & Error States */}
        <ProductGrid 
          products={products} 
          loading={loading} 
          error={error} 
          onRetry={fetchCatalog}
          onResetFilters={handleResetFilters}
        />
      </div>
    </main>
  );
}
