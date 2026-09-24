import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item) return null;

  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <article className="cart-page-item-row d-flex">
      {/* Thumbnail */}
      <div className="cart-page-item-thumb flex-shrink-0">
        <Link to={`/products/${item.id}`}>
          <img src={item.imageUrl} alt={item.name} className="w-100 h-100 object-fit-cover" />
        </Link>
      </div>

      {/* Item Body */}
      <div className="cart-page-item-body flex-grow-1 ps-4 d-flex flex-column justify-content-between">
        <div className="cart-page-item-top d-flex justify-content-between align-items-start">
          <div>
            <h3 className="cart-page-item-name mb-1">
              <Link to={`/products/${item.id}`} className="text-decoration-none text-dark">
                {item.name}
              </Link>
            </h3>
            <div className="cart-page-item-meta text-muted small">
              <span>{item.category}</span>
              {item.selectedSize && (
                <> &bull; <span>Size: {item.selectedSize}</span></>
              )}
              {item.selectedColor && (
                <> &bull; <span>Color: {item.selectedColor}</span></>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button 
            type="button" 
            className="btn-remove-page-item border-0 bg-transparent text-muted"
            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
            aria-label={`Remove ${item.name} from bag`}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Bottom controls: Quantity Stepper & Price */}
        <div className="cart-page-item-bottom d-flex justify-content-between align-items-center mt-3">
          <div className="cart-page-qty-box d-inline-flex align-items-center">
            <button 
              type="button" 
              className="cart-page-qty-btn"
              onClick={() => updateQuantity(item.id, -1, item.selectedSize, item.selectedColor)}
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="cart-page-qty-num px-2">{item.quantity}</span>
            <button 
              type="button" 
              className="cart-page-qty-btn"
              onClick={() => updateQuantity(item.id, 1, item.selectedSize, item.selectedColor)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-end">
            <span className="cart-page-item-price fw-semibold fs-5">${lineTotal}</span>
            {item.quantity > 1 && (
              <span className="text-muted small d-block">
                (${item.price.toFixed(2)} each)
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
