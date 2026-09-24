import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found-page py-5 my-5 text-center">
      <div className="container py-5" style={{ maxWidth: '600px' }}>
        <span className="text-uppercase small text-muted" style={{ letterSpacing: '2px' }}>
          404 &bull; PAGE NOT FOUND
        </span>
        <h1 className="font-serif my-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 500 }}>
          Understated Elegance
        </h1>
        <p className="text-muted small mb-4" style={{ lineHeight: 1.7 }}>
          The piece or page you are seeking is either no longer available in our active curation or has moved to an archival destination.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn btn-dark text-uppercase small px-4 py-2" style={{ letterSpacing: '1.5px', borderRadius: 0 }}>
            RETURN HOME
          </Link>
          <Link to="/products" className="btn btn-outline-dark text-uppercase small px-4 py-2" style={{ letterSpacing: '1.5px', borderRadius: 0 }}>
            VIEW COLLECTION
          </Link>
        </div>
      </div>
    </main>
  );
}
