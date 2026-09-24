import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row align-items-start">
          <div className="col-lg-5 footer-left mb-4 mb-lg-0">
            <Link to="/" className="footer-logo d-inline-block text-decoration-none">
              ATELIER
            </Link>
            <p className="copyright m-0">
              &copy; {new Date().getFullYear()} ATELIER. DEFINING QUIET LUXURY.
            </p>
          </div>
          <div className="col-lg-7">
            <ul className="footer-links list-unstyled d-flex flex-wrap gap-4 m-0 justify-content-lg-end">
              <li>
                <Link to="/contact" className="text-decoration-none">
                  SUSTAINABILITY
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none">
                  SHIPPING
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none">
                  CONTACT
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none">
                  PRIVACY
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
