import React from 'react';

export default function LoadingSpinner({ message = 'Curating collection...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5 text-center">
      <div 
        className="spinner-border text-dark mb-3" 
        style={{ width: '2.5rem', height: '2.5rem', borderWidth: '2px' }} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small text-uppercase" style={{ letterSpacing: '2px' }}>
        {message}
      </p>
    </div>
  );
}
