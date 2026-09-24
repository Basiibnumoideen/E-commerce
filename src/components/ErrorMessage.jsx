import React from 'react';

export default function ErrorMessage({ message = 'An unexpected error occurred.', onRetry }) {
  return (
    <div className="container py-5 text-center my-4">
      <div 
        className="p-5 border bg-white mx-auto shadow-sm"
        style={{ maxWidth: '580px', borderColor: '#E7E5E4' }}
      >
        <div className="mb-3 text-secondary" style={{ fontSize: '2.5rem' }}>
          <i className="bi bi-exclamation-circle"></i>
        </div>
        <h4 className="font-serif mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px' }}>
          Service Unavailable
        </h4>
        <p className="text-muted mb-4 small">
          {message}
        </p>
        {onRetry && (
          <button 
            type="button" 
            onClick={onRetry}
            className="btn btn-dark px-4 py-2 text-uppercase fw-semibold"
            style={{ letterSpacing: '1.5px', fontSize: '11px', borderRadius: 0 }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Try Again
          </button>
        )}
      </div>
    </div>
  );
}
