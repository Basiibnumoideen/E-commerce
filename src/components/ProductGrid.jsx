import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function ProductGrid({ 
  products = [], 
  loading = false, 
  error = null, 
  onRetry = null,
  onResetFilters = null 
}) {
  if (loading) {
    return <LoadingSpinner message="Curating pieces..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="no-products-found text-center py-5 my-4 bg-white border border-dashed p-4">
        <div className="no-products-icon mb-2 text-muted fs-1">
          <i className="bi bi-search"></i>
        </div>
        <h4 className="font-serif mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px' }}>
          No pieces found
        </h4>
        <p className="text-muted mb-3 small">
          No products match your active search and category selection.
        </p>
        {onResetFilters && (
          <button 
            type="button" 
            className="btn btn-dark text-uppercase fw-semibold px-4 py-2"
            onClick={onResetFilters}
            style={{ fontSize: '11px', letterSpacing: '1.5px', borderRadius: 0 }}
          >
            RESET ALL FILTERS
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="row g-4">
      {products.map(product => (
        <div key={product.id} className="col-lg-3 col-md-6 col-6">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
