import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast, closeToast } = useCart();

  if (!toast) return null;

  const isInfo = toast.type === 'info';
  const isError = toast.type === 'error';

  let icon = 'bi-check-circle-fill text-success';
  if (isInfo) icon = 'bi-info-circle-fill text-info';
  if (isError) icon = 'bi-x-circle-fill text-danger';

  return (
    <div 
      className="position-fixed bottom-0 end-0 p-3" 
      style={{ zIndex: 1100 }}
      role="alert"
      aria-live="assertive"
    >
      <div 
        className="toast show align-items-center text-white border-0 shadow-lg"
        style={{ background: 'rgba(28, 25, 23, 0.95)', backdropFilter: 'blur(8px)', borderRadius: '4px' }}
      >
        <div className="d-flex align-items-center px-3 py-2">
          <i className={`bi ${icon} me-2 fs-5`}></i>
          <div className="toast-body p-0 small flex-grow-1" style={{ letterSpacing: '0.3px' }}>
            {toast.message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white ms-3 p-1 small" 
            onClick={closeToast}
            aria-label="Close notification"
          ></button>
        </div>
      </div>
    </div>
  );
}
