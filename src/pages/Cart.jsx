import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { 
    cart, 
    clearCart, 
    subtotal, 
    discountCode, 
    discountRate, 
    discountAmount, 
    shipping, 
    taxEstimate, 
    total, 
    itemCount,
    freeShippingThreshold,
    applyDiscount,
    removeDiscount,
    showToast
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const res = applyDiscount(promoInput);
    setPromoFeedback(res);
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleRemovePromo = () => {
    removeDiscount();
    setPromoFeedback(null);
    setPromoInput('');
  };

  const handleProceedCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    clearCart();
    setCheckoutModalOpen(false);
    showToast('Order confirmed! A confirmation email has been dispatched.', 'success');
  };

  return (
    <main className="cart-page-section">
      <div className="container py-4">

        {/* Top Header: Title, Items Counter & Continue Shopping Link */}
        <div className="cart-page-header d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
          <div>
            <h1 className="cart-page-title mb-1 font-serif">Your Cart</h1>
            <p className="cart-page-subtitle mb-0 text-muted small">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout.
            </p>
          </div>
          <Link to="/products" className="btn-continue-shopping text-decoration-none text-uppercase fw-semibold">
            CONTINUE SHOPPING
          </Link>
        </div>

        {/* Empty State (Refined Luxury Centered Presentation) */}
        {cart.length === 0 ? (
          <div className="cart-page-empty text-center py-5 my-4">
            <div 
              className="cart-empty-icon-wrap d-inline-flex align-items-center justify-content-center mb-4 rounded-circle"
              style={{ width: '88px', height: '88px', background: '#F7F6F4' }}
            >
              <i className="bi bi-bag fs-1 text-muted"></i>
            </div>
            <h2 className="font-serif mb-2" style={{ fontSize: '32px', fontWeight: 500, color: '#1C1917' }}>
              Your shopping bag is empty
            </h2>
            <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '440px', lineHeight: 1.7, fontSize: '13.5px' }}>
              Discover pieces defined by meticulous craftsmanship, understated elegance, and timeless quiet luxury.
            </p>
            <div className="pt-2">
              <Link to="/products" className="btn-explore-collection text-decoration-none text-uppercase">
                <span>EXPLORE COLLECTION</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Cart Content Layout (2-Column) */
          <div className="cart-page-layout row g-5">

            {/* Left Column: Items List */}
            <div className="col-lg-8 col-12">
              <div className="cart-page-items-list d-flex flex-column">
                {cart.map((item, idx) => (
                  <CartItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} item={item} />
                ))}
              </div>

              {/* Clear Bag Button */}
              <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                <button 
                  type="button" 
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  onClick={clearCart}
                >
                  <i className="bi bi-trash3 me-1"></i> Clear Shopping Bag
                </button>
                <Link to="/products" className="small text-uppercase fw-semibold text-dark text-decoration-underline">
                  + Add More Items
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="col-lg-4 col-12">
              <aside className="order-summary-card">
                <h2 className="order-summary-heading mb-4 text-uppercase">ORDER SUMMARY</h2>

                {/* Discount Code Box */}
                <div className="summary-discount-box mb-4 pb-4 border-bottom">
                  <label htmlFor="cartDiscountInput" className="summary-discount-label d-block mb-2 text-uppercase">
                    DISCOUNT CODE
                  </label>
                  
                  {discountCode ? (
                    <div className="applied-discount-row d-flex justify-content-between align-items-center p-2 mb-2">
                      <span className="applied-text">
                        Applied: <strong>{discountCode}</strong> (-10%)
                      </span>
                      <button 
                        type="button" 
                        onClick={handleRemovePromo}
                        className="btn-remove-discount"
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="summary-discount-group d-flex">
                      <input 
                        type="text" 
                        id="cartDiscountInput"
                        className="summary-discount-input flex-grow-1 border-0" 
                        placeholder="Try LUXE10 or ATELIER10"
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value)}
                        autoComplete="off"
                      />
                      <button type="submit" className="summary-discount-btn text-uppercase">
                        APPLY
                      </button>
                    </form>
                  )}

                  {promoFeedback && (
                    <div className={`discount-feedback-msg mt-2 ${promoFeedback.success ? 'success' : 'error'}`}>
                      {promoFeedback.message}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="summary-breakdown-list d-flex flex-column gap-3 mb-4">
                  {/* Subtotal */}
                  <div className="summary-breakdown-row d-flex justify-content-between">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Discount */}
                  {discountRate > 0 && (
                    <div className="summary-breakdown-row summary-discount-line d-flex justify-content-between text-success">
                      <span className="summary-label">Discount ({discountCode})</span>
                      <span className="summary-value discount-text">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="summary-breakdown-row d-flex justify-content-between">
                    <span className="summary-label">Estimated Shipping</span>
                    <span className="summary-value">
                      {shipping === 0 ? (
                        <span className="text-success fw-semibold">Complimentary</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {/* Tax Estimate */}
                  <div className="summary-breakdown-row d-flex justify-content-between">
                    <span className="summary-label">Estimated Tax (8.5%)</span>
                    <span className="summary-value">${taxEstimate.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="summary-total-row d-flex justify-content-between align-items-baseline pt-3 mb-4 border-top">
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-price fw-bold">${total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                  type="button" 
                  className="btn-proceed-checkout w-100 text-uppercase border-0 mb-4"
                  onClick={handleProceedCheckout}
                >
                  PROCEED TO CHECKOUT
                </button>

                {/* Trust Badges */}
                <div className="summary-trust-badges d-flex flex-column gap-2 pt-1 small text-muted">
                  <div className="trust-badge-item d-flex align-items-center gap-2">
                    <i className="bi bi-truck fs-5"></i>
                    <span>
                      {subtotal >= freeShippingThreshold 
                        ? 'Complimentary shipping applied.' 
                        : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for complimentary shipping.`}
                    </span>
                  </div>
                  <div className="trust-badge-item d-flex align-items-center gap-2">
                    <i className="bi bi-shield-lock fs-5"></i>
                    <span>256-bit encrypted secure checkout.</span>
                  </div>
                </div>
              </aside>
            </div>

          </div>
        )}

      </div>

      {/* Checkout Modal Simulation */}
      {checkoutModalOpen && (
        <div className="sn-modal-backdrop sn-modal-open" onClick={() => setCheckoutModalOpen(false)}>
          <div className="sn-modal-card position-relative" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <button type="button" className="sn-modal-close close-btn position-absolute" onClick={() => setCheckoutModalOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
            <h3 className="sn-modal-brand text-center mb-1">ATELIER CHECKOUT</h3>
            <p className="sn-modal-subtitle text-center mb-4">Complete your bespoke order</p>

            <form onSubmit={handleCompleteOrder}>
              <div className="mb-3">
                <label className="sn-form-label text-uppercase d-block mb-1">Shipping Full Name</label>
                <input type="text" className="sn-form-input w-100" placeholder="Jane Doe" required />
              </div>
              <div className="mb-3">
                <label className="sn-form-label text-uppercase d-block mb-1">Delivery Address</label>
                <input type="text" className="sn-form-input w-100" placeholder="100 Luxury Avenue, Suite 4B" required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="sn-form-label text-uppercase d-block mb-1">City</label>
                  <input type="text" className="sn-form-input w-100" placeholder="New York" required />
                </div>
                <div className="col-6">
                  <label className="sn-form-label text-uppercase d-block mb-1">Postal Code</label>
                  <input type="text" className="sn-form-input w-100" placeholder="10001" required />
                </div>
              </div>
              <div className="p-3 bg-light border mb-4 small">
                <div className="d-flex justify-content-between mb-1">
                  <span>Items:</span>
                  <span>{itemCount}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Total Amount:</span>
                  <span className="fw-bold">${total.toFixed(2)}</span>
                </div>
                <div className="text-muted small mt-2">
                  Payment simulation with dummy authorization.
                </div>
              </div>

              <button type="submit" className="sn-btn-primary w-100 border-0 text-uppercase py-3">
                CONFIRM &amp; PLACE ORDER (${total.toFixed(2)})
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
