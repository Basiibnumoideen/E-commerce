import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User interactive choices
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('38');

  // Accordion state (Description open by default as shown in image)
  const [openAccordion, setOpenAccordion] = useState({
    description: true,
    details: false,
    shipping: false
  });

  // Size guide modal state
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Complete the look scroll container ref
  const carouselRef = useRef(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProductById(id);
      setProduct(data);

      // Default active image, color, size
      setSelectedImage(data.images && data.images[0] ? data.images[0] : data.imageUrl);
      setSelectedColor(data.colors && data.colors[0] ? data.colors[0] : { name: 'Alabaster', hex: '#F3EFE6' });
      
      const defaultSize = (data.sizes && data.sizes.find(s => s.size === '38' && s.inStock)?.size) || 
                          (data.sizes && data.sizes[0]?.size) || '38';
      setSelectedSize(defaultSize);

      // Fetch related items for "Complete the Look"
      const allProducts = await getProducts();
      let related = [];
      if (data.relatedProductIds && data.relatedProductIds.length > 0) {
        related = allProducts.filter(p => data.relatedProductIds.includes(p.id));
      } else {
        related = allProducts.filter(p => p.id !== data.id && p.category === data.category).slice(0, 3);
      }
      setRelatedProducts(related);

    } catch (err) {
      setError(err.message || 'Unable to retrieve product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchDetail();
  }, [id]);

  const toggleSection = (section) => {
    setOpenAccordion(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving piece details..." />;
  }

  if (error || !product) {
    return <ErrorMessage message={error || 'Product not found'} onRetry={fetchDetail} />;
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <main className="product-detail-page py-4">
      <div className="container" style={{ maxWidth: '1280px' }}>

        {/* 1. Breadcrumb Navigation (Exact Image Match) */}
        <nav aria-label="breadcrumb" className="breadcrumb-nav mb-4">
          <ol className="breadcrumb m-0 text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '11px', fontWeight: 600 }}>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">HOME</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none text-muted">SHOP</Link>
            </li>
            <li className="breadcrumb-item active text-dark" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* 2. Main Product Section (2-Column Architecture) */}
        <div className="row g-5 align-items-start mb-5 pb-4">
          
          {/* LEFT: Vertical Thumbnails Strip + Large Main Image */}
          <div className="col-lg-7 col-md-12">
            <div className="product-gallery d-flex gap-3">
              
              {/* Vertical Thumbnail Column */}
              <div className="gallery-thumbnails d-flex flex-column gap-3" style={{ width: '84px' }}>
                {(product.images && product.images.length > 0 ? product.images : [product.imageUrl]).map((imgSrc, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    className={`gallery-thumb-btn border-0 p-0 bg-transparent overflow-hidden ${selectedImage === imgSrc ? 'active-thumb' : ''}`}
                    onClick={() => setSelectedImage(imgSrc)}
                    style={{
                      height: '104px',
                      cursor: 'pointer',
                      outline: selectedImage === imgSrc ? '1.5px solid #1C1917' : '1px solid #E7E5E4',
                      transition: '0.2s ease'
                    }}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`${product.name} thumbnail ${idx + 1}`} 
                      className="w-100 h-100 object-fit-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Featured Image Display */}
              <div 
                className="gallery-main-image flex-grow-1 overflow-hidden position-relative"
                style={{ background: '#F7F6F4', minHeight: '620px' }}
              >
                <img 
                  src={selectedImage} 
                  alt={product.name}
                  className="w-100 h-100 object-fit-cover animate-fade"
                  style={{ maxHeight: '760px', transition: 'transform 0.4s ease' }}
                />
              </div>

            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Form */}
          <div className="col-lg-5 col-md-12">
            <div className="product-detail-content ps-lg-3">
              
              {/* Product Title (Cormorant Garamond Serif) */}
              <h1 
                className="product-detail-title mb-2"
                style={{ 
                  fontFamily: 'Cormorant Garamond, Georgia, serif', 
                  fontSize: '40px', 
                  fontWeight: 500, 
                  lineHeight: 1.15,
                  color: '#1C1917'
                }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="product-detail-price mb-4 pb-2">
                <span className="fs-4 fw-normal text-dark" style={{ letterSpacing: '0.5px' }}>
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-muted text-decoration-line-through ms-3 fs-6">
                    ${product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {/* Color Selector */}
              <div className="color-selector-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-uppercase fw-semibold" style={{ letterSpacing: '1px', fontSize: '11px', color: '#1C1917' }}>
                    COLOR: {selectedColor?.name || 'ALABASTER'}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  {(product.colors || [
                    { name: 'Alabaster', hex: '#F3EFE6' },
                    { name: 'Noir', hex: '#1C1917' },
                    { name: 'Camel', hex: '#9E7B56' }
                  ]).map((color) => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        className="color-swatch-btn rounded-circle p-0"
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        aria-label={`Select color ${color.name}`}
                        style={{
                          width: '26px',
                          height: '26px',
                          backgroundColor: color.hex,
                          border: color.hex.toLowerCase() === '#ffffff' ? '1px solid #D1D5DB' : 'none',
                          boxShadow: isSelected ? '0 0 0 2px #FFFFFF, 0 0 0 3.5px #1C1917' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="size-selector-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-uppercase fw-semibold" style={{ letterSpacing: '1px', fontSize: '11px', color: '#1C1917' }}>
                    SIZE: EU {selectedSize}
                  </span>
                  <button 
                    type="button" 
                    className="btn-size-guide p-0 border-0 bg-transparent text-uppercase fw-semibold text-decoration-underline text-dark"
                    style={{ fontSize: '10.5px', letterSpacing: '1px' }}
                    onClick={() => setShowSizeGuide(true)}
                  >
                    SIZE GUIDE
                  </button>
                </div>

                {/* Size Grid Buttons */}
                <div className="size-buttons-grid d-flex flex-wrap gap-2">
                  {(product.sizes || [
                    { size: '34', inStock: true },
                    { size: '36', inStock: true },
                    { size: '38', inStock: true },
                    { size: '40', inStock: true },
                    { size: '42', inStock: true },
                    { size: '44', inStock: false }
                  ]).map((sizeObj) => {
                    const isSelected = selectedSize === sizeObj.size;
                    const inStock = sizeObj.inStock !== false;

                    return (
                      <button
                        key={sizeObj.size}
                        type="button"
                        disabled={!inStock}
                        onClick={() => setSelectedSize(sizeObj.size)}
                        className={`size-btn ${isSelected ? 'active-size' : ''} ${!inStock ? 'disabled-size' : ''}`}
                        style={{
                          flex: '1 0 28%',
                          maxWidth: '92px',
                          height: '42px',
                          border: isSelected ? '1px solid #1C1917' : '1px solid #E5E7EB',
                          backgroundColor: isSelected ? '#1C1917' : (inStock ? '#FFFFFF' : '#F9FAFB'),
                          color: isSelected ? '#FFFFFF' : (inStock ? '#1C1917' : '#9CA3AF'),
                          fontSize: '12px',
                          fontWeight: isSelected ? 600 : 500,
                          cursor: inStock ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        {sizeObj.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Call-to-Action Buttons (Exact Match to Image) */}
              <div className="product-action-buttons d-flex flex-column gap-2 mb-5">
                {/* Primary Button: ADD TO CART */}
                <button
                  type="button"
                  className="btn-add-to-cart-primary w-100 text-uppercase border-0 py-3 fw-semibold"
                  onClick={() => addToCart(product, 1, { color: selectedColor?.name, size: selectedSize })}
                  style={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    letterSpacing: '2px',
                    fontSize: '11px',
                    transition: 'background-color 0.25s ease'
                  }}
                >
                  ADD TO CART
                </button>

                {/* Secondary Button: SAVE TO WISHLIST */}
                <button
                  type="button"
                  className="btn-wishlist-secondary w-100 text-uppercase bg-transparent py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  onClick={() => toggleWishlist(product.id)}
                  style={{
                    border: '1px solid #1C1917',
                    color: '#1C1917',
                    letterSpacing: '2px',
                    fontSize: '11px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <i className={`bi ${wishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                  <span>{wishlisted ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}</span>
                </button>
              </div>

              {/* Expandable Accordion Sections */}
              <div className="product-accordions border-top">
                
                {/* 1. DESCRIPTION (Expanded by default) */}
                <div className="accordion-item-custom border-bottom">
                  <button
                    type="button"
                    className="accordion-header-btn w-100 d-flex justify-content-between align-items-center py-3 border-0 bg-transparent text-uppercase fw-semibold"
                    onClick={() => toggleSection('description')}
                    style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#1C1917' }}
                  >
                    <span>DESCRIPTION</span>
                    <i className={`bi ${openAccordion.description ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </button>
                  {openAccordion.description && (
                    <div className="accordion-body-custom pb-3 pt-1">
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '13px' }}>
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. DETAILS & FIT */}
                <div className="accordion-item-custom border-bottom">
                  <button
                    type="button"
                    className="accordion-header-btn w-100 d-flex justify-content-between align-items-center py-3 border-0 bg-transparent text-uppercase fw-semibold"
                    onClick={() => toggleSection('details')}
                    style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#1C1917' }}
                  >
                    <span>DETAILS &amp; FIT</span>
                    <i className={`bi ${openAccordion.details ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </button>
                  {openAccordion.details && (
                    <div className="accordion-body-custom pb-3 pt-1">
                      <ul className="small text-muted ps-3 mb-0" style={{ lineHeight: 1.8, fontSize: '13px' }}>
                        {(product.details || [
                          'Lightweight pure silk gabardine',
                          'Tailored waist with padded shoulders',
                          'Double-breasted horn button closure',
                          'Full cupro lining',
                          'Dry clean only'
                        ]).map((detail, dIdx) => (
                          <li key={`det-${dIdx}`}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 3. SHIPPING & RETURNS */}
                <div className="accordion-item-custom border-bottom">
                  <button
                    type="button"
                    className="accordion-header-btn w-100 d-flex justify-content-between align-items-center py-3 border-0 bg-transparent text-uppercase fw-semibold"
                    onClick={() => toggleSection('shipping')}
                    style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#1C1917' }}
                  >
                    <span>SHIPPING &amp; RETURNS</span>
                    <i className={`bi ${openAccordion.shipping ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </button>
                  {openAccordion.shipping && (
                    <div className="accordion-body-custom pb-3 pt-1">
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '13px' }}>
                        {product.shippingInfo || 'Complimentary shipping on all orders over $300. Complimentary returns within 30 days.'}
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* 3. Horizontal Divider */}
        <hr className="my-5" style={{ borderColor: '#E5E7EB' }} />

        {/* 4. "Complete the Look" Section (Exact Image Match) */}
        <section className="complete-the-look-section my-5 pt-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 
              className="m-0 font-serif"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '32px', fontWeight: 500, color: '#1C1917' }}
            >
              Complete the Look
            </h2>
            <div className="carousel-nav-arrows d-flex gap-2">
              <button 
                type="button" 
                className="btn-arrow border-0 bg-transparent p-1 fs-5 text-dark"
                onClick={() => scrollCarousel('left')}
                aria-label="Previous recommended items"
              >
                &larr;
              </button>
              <button 
                type="button" 
                className="btn-arrow border-0 bg-transparent p-1 fs-5 text-dark"
                onClick={() => scrollCarousel('right')}
                aria-label="Next recommended items"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Recommended Product Cards List */}
          <div 
            ref={carouselRef}
            className="row g-4 flex-nowrap overflow-x-auto pb-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.map(relProduct => (
              <div key={`rel-${relProduct.id}`} className="col-lg-4 col-md-6 col-10 flex-shrink-0">
                <article className="complete-look-card">
                  <div 
                    className="position-relative overflow-hidden mb-3"
                    style={{ height: '420px', background: '#F6F5F3' }}
                  >
                    <Link to={`/products/${relProduct.id}`}>
                      <img 
                        src={relProduct.imageUrl} 
                        alt={relProduct.name}
                        className="w-100 h-100 object-fit-cover"
                        style={{ transition: 'transform 0.4s ease' }}
                      />
                    </Link>
                    {relProduct.isNew && (
                      <span className="badge-new position-absolute top-0 start-0 m-3">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 
                    className="font-serif fs-5 mb-1" 
                    style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 500 }}
                  >
                    <Link to={`/products/${relProduct.id}`} className="text-decoration-none text-dark">
                      {relProduct.name}
                    </Link>
                  </h3>
                  <p className="text-muted small m-0 fw-normal">
                    ${relProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 5. Interactive Size Guide Modal */}
      {showSizeGuide && (
        <div className="sn-modal-backdrop sn-modal-open" onClick={() => setShowSizeGuide(false)}>
          <div className="sn-modal-card position-relative" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button 
              type="button" 
              className="sn-modal-close close-btn position-absolute" 
              onClick={() => setShowSizeGuide(false)}
            >
              <i className="bi bi-x"></i>
            </button>
            <h3 className="sn-modal-brand text-center mb-1">SIZE &amp; MEASUREMENTS</h3>
            <p className="sn-modal-subtitle text-center mb-4">ATELIER Tailored Fit Guide</p>
            
            <div className="table-responsive">
              <table className="table table-bordered table-sm text-center small">
                <thead className="table-light text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                  <tr>
                    <th>EU</th>
                    <th>US</th>
                    <th>UK</th>
                    <th>IT</th>
                    <th>Bust (cm)</th>
                    <th>Waist (cm)</th>
                    <th>Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>34</td><td>2</td><td>6</td><td>38</td><td>80</td><td>62</td><td>88</td></tr>
                  <tr><td>36</td><td>4</td><td>8</td><td>40</td><td>84</td><td>66</td><td>92</td></tr>
                  <tr className="table-active fw-bold"><td>38</td><td>6</td><td>10</td><td>42</td><td>88</td><td>70</td><td>96</td></tr>
                  <tr><td>40</td><td>8</td><td>12</td><td>44</td><td>92</td><td>74</td><td>100</td></tr>
                  <tr><td>42</td><td>10</td><td>14</td><td>46</td><td>96</td><td>78</td><td>104</td></tr>
                  <tr><td>44</td><td>12</td><td>16</td><td>48</td><td>100</td><td>82</td><td>108</td></tr>
                </tbody>
              </table>
            </div>

            <p className="small text-muted mt-3 mb-0" style={{ lineHeight: 1.6 }}>
              <strong>Fit Advice:</strong> This blazer has an immaculate tailored drape. If you prefer a relaxed or layered silhouette over knitwear, we advise taking one size larger than your typical EU size.
            </p>
          </div>
        </div>
      )}

    </main>
  );
}
