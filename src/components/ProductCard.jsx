import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  if (!product) return null;

  const rating = product.rating || 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  let discountPct = 0;
  if (product.originalPrice && product.originalPrice > product.price) {
    discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  const wishlisted = isWishlisted(product.id);

  const formatPrice = (val) => {
    return '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <article className="product-card h-100 position-relative d-flex flex-column">
      {/* Product Image Frame */}
      <div className="product-image position-relative overflow-hidden">
        <Link to={`/products/${product.id}`} className="d-block w-100 h-100 product-img-link">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            loading="lazy" 
            className="w-100 h-100 object-fit-cover"
          />
        </Link>

        {/* Top-Left Badges Stack (Zero Collision) */}
        <div className="product-badges-stack position-absolute top-0 start-0 m-3 d-flex flex-column gap-1" style={{ zIndex: 3 }}>
          {product.isNew && <span className="badge-new-pill">NEW</span>}
          {discountPct > 0 && <span className="badge-discount-pill">-{discountPct}%</span>}
        </div>

        {/* Top-Right Luxury Wishlist Button (Clean, Non-overlapping) */}
        <button 
          type="button" 
          className={`product-wishlist-btn position-absolute top-0 end-0 m-3 border-0 rounded-circle ${wishlisted ? 'active-wishlist' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        >
          <i className={`bi ${wishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
        </button>

        {/* Hover Quick Add Overlay */}
        <div className="product-actions-overlay">
          <button 
            type="button" 
            className="btn-quick-add"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
          >
            <i className="bi bi-bag-plus me-1"></i> ADD TO BAG
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="product-info d-flex flex-column flex-grow-1 text-center p-3">
        <span className="product-category-text">{product.category}</span>
        
        <h3 className="product-title my-1">
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            {product.name}
          </Link>
        </h3>

        {/* Subtle, Tasteful Rating */}
        <div className="product-rating d-flex align-items-center justify-content-center gap-1 my-1">
          <span className="rating-stars d-inline-flex align-items-center">
            {[...Array(fullStars)].map((_, i) => (
              <i key={`star-${i}`} className="bi bi-star-fill text-warning me-0.5" style={{ fontSize: '10px' }}></i>
            ))}
            {hasHalfStar && <i className="bi bi-star-half text-warning me-0.5" style={{ fontSize: '10px' }}></i>}
          </span>
          <span className="rating-num text-muted small ms-1" style={{ fontSize: '11px' }}>
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Price Row */}
        <div className="product-price-box mt-auto d-flex align-items-center justify-content-center gap-2 pt-1">
          <span className="product-price fw-semibold text-dark">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-original-price text-muted text-decoration-line-through small">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button 
          type="button" 
          className="btn-mobile-add-cart d-md-none mt-2"
          onClick={() => addToCart(product, 1)}
        >
          <i className="bi bi-bag-plus me-1"></i> ADD TO BAG
        </button>
      </div>
    </article>
  );
}
