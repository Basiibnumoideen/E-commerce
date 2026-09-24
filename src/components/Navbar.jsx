import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authMessage, setAuthMessage] = useState(null);
  const [userSession, setUserSession] = useState(() => {
    try {
      const u = localStorage.getItem('atelier_auth_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authEmail.includes('@')) {
      setAuthMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (authPassword.length < 6) {
      setAuthMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (authMode === 'signin') {
      const user = { email: authEmail, loggedInAt: new Date().toISOString() };
      localStorage.setItem('atelier_auth_user', JSON.stringify(user));
      setUserSession(user);
      setAuthMessage({ type: 'success', text: `Welcome back to ATELIER!` });
      setTimeout(() => {
        setShowAccountModal(false);
        setAuthMessage(null);
      }, 1000);
    } else {
      const user = { firstName: authFirstName, lastName: authLastName, email: authEmail, registeredAt: new Date().toISOString() };
      localStorage.setItem('atelier_auth_user', JSON.stringify(user));
      setUserSession(user);
      setAuthMessage({ type: 'success', text: `Welcome to ATELIER, ${authFirstName || 'Client'}!` });
      setTimeout(() => {
        setShowAccountModal(false);
        setAuthMessage(null);
      }, 1200);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('atelier_auth_user');
    setUserSession(null);
    setAuthMessage({ type: 'info', text: 'You have been signed out.' });
    setTimeout(() => {
      setShowAccountModal(false);
      setAuthMessage(null);
    }, 1000);
  };

  return (
    <>
      {/* Top Header */}
      <header className="top-header sticky-top">
        <nav className="navbar navbar-expand-md navbar-custom py-0">
          <div className="container position-relative d-flex justify-content-between align-items-center">

            {/* Mobile Menu Toggle Button */}
            <button 
              className="menu-btn d-md-none border-0 bg-transparent p-0" 
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <i className="bi bi-list fs-2"></i>
            </button>

            {/* Left Navigation Links (Matching Reference Image) */}
            <ul className="nav-links d-none d-md-flex list-unstyled m-0 p-0 align-items-center">
              <li className="nav-item">
                <NavLink 
                  to="/products" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active-nav-link' : ''}`}
                >
                  SHOP
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/products?category=Clothing" 
                  className="nav-link"
                >
                  CATEGORIES
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active-nav-link' : ''}`}
                >
                  ABOUT
                </NavLink>
              </li>
            </ul>

            {/* Centered Brand Logo */}
            <Link to="/" className="logo navbar-brand">
              ATELIER
            </Link>

            {/* Right Action Icons */}
            <div className="nav-icons d-none d-md-flex align-items-center">
              {/* Search Trigger */}
              <button 
                type="button" 
                className="bg-transparent border-0 p-0 nav-icon-btn" 
                onClick={() => setShowSearchModal(true)}
                aria-label="Search catalog"
              >
                <i className="bi bi-search"></i>
              </button>

              {/* Wishlist Link */}
              <Link to="/products" className="position-relative nav-icon-link" aria-label="View wishlist">
                <i className={`bi ${wishlist.length > 0 ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                {wishlist.length > 0 && (
                  <span className="cart-count-badge">{wishlist.length}</span>
                )}
              </Link>

              {/* Shopping Bag Trigger */}
              <Link to="/cart" className="cart-trigger-btn position-relative nav-icon-link" aria-label="View shopping bag">
                <i className="bi bi-bag"></i>
                <span className="cart-count-badge" key={itemCount}>
                  {itemCount}
                </span>
              </Link>

              {/* Account Trigger */}
              <button 
                type="button" 
                className="bg-transparent border-0 p-0 nav-icon-btn position-relative" 
                onClick={() => setShowAccountModal(true)}
                aria-label="User account"
              >
                <i className={`bi ${userSession ? 'bi-person-check-fill' : 'bi-person'}`}></i>
                {userSession && <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>}
              </button>
            </div>

            {/* Mobile Cart Link */}
            <Link to="/cart" className="mobile-cart d-md-none cart-trigger-btn position-relative" aria-label="View shopping bag">
              <i className="bi bi-bag"></i>
              <span className="cart-count-badge">{itemCount}</span>
            </Link>

          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <>
          <div className="cart-backdrop open" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="cart-drawer open" style={{ maxWidth: '320px', left: 0, right: 'auto', transform: 'none' }}>
            <div className="cart-drawer-header d-flex align-items-center justify-content-between p-3 border-bottom">
              <h5 className="m-0 font-serif" style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '4px' }}>ATELIER</h5>
              <button type="button" className="btn-close-cart bg-transparent border-0" onClick={() => setMobileMenuOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 d-flex flex-column gap-3">
              <Link to="/" className="text-decoration-none text-dark py-2 border-bottom fw-semibold small text-uppercase" onClick={() => setMobileMenuOpen(false)}>
                HOME
              </Link>
              <Link to="/products" className="text-decoration-none text-dark py-2 border-bottom fw-semibold small text-uppercase" onClick={() => setMobileMenuOpen(false)}>
                SHOP ALL
              </Link>
              <Link to="/products?category=Clothing" className="text-decoration-none text-dark py-2 border-bottom fw-semibold small text-uppercase" onClick={() => setMobileMenuOpen(false)}>
                CLOTHING
              </Link>
              <Link to="/products?category=Electronics" className="text-decoration-none text-dark py-2 border-bottom fw-semibold small text-uppercase" onClick={() => setMobileMenuOpen(false)}>
                ELECTRONICS
              </Link>
              <Link to="/cart" className="text-decoration-none text-dark py-2 border-bottom fw-semibold small text-uppercase d-flex justify-content-between" onClick={() => setMobileMenuOpen(false)}>
                <span>SHOPPING BAG</span>
                <span className="badge bg-dark rounded-pill">{itemCount}</span>
              </Link>
              <Link to="/contact" className="text-decoration-none text-dark py-2 border-bottom fw-semibold small text-uppercase" onClick={() => setMobileMenuOpen(false)}>
                CONTACT & ABOUT
              </Link>
              <button 
                type="button" 
                className="btn btn-outline-dark w-100 text-uppercase mt-3 py-2 small fw-semibold"
                onClick={() => { setMobileMenuOpen(false); setShowAccountModal(true); }}
              >
                {userSession ? 'My Account' : 'Sign In / Register'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="sn-modal-backdrop sn-modal-open" onClick={() => setShowSearchModal(false)}>
          <div className="sn-modal-card position-relative" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <button type="button" className="sn-modal-close close-btn position-absolute" onClick={() => setShowSearchModal(false)}>
              <i className="bi bi-x"></i>
            </button>
            <h3 className="sn-modal-brand text-center mb-1">SEARCH</h3>
            <p className="sn-modal-subtitle text-center mb-4">Discover timeless luxury pieces</p>
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group border-bottom pb-1">
                <span className="input-group-text bg-transparent border-0 ps-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none px-2"
                  placeholder="Search by blazer, coat, trousers, headphones..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-dark text-uppercase small px-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  SEARCH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Authentication Modal */}
      {showAccountModal && (
        <div className="sn-modal-backdrop sn-modal-open" onClick={() => setShowAccountModal(false)}>
          <div className="sn-modal-card position-relative" onClick={e => e.stopPropagation()}>
            <button type="button" className="sn-modal-close close-btn position-absolute" onClick={() => setShowAccountModal(false)}>
              <i className="bi bi-x"></i>
            </button>

            <header className="sn-modal-header text-center mb-4">
              <h2 className="sn-modal-brand text-uppercase mb-1">ATELIER</h2>
              <p className="sn-modal-subtitle m-0">
                {userSession 
                  ? `Signed in as ${userSession.email}` 
                  : (authMode === 'signin' ? 'Sign in to your account' : 'Create your account')}
              </p>
            </header>

            {authMessage && (
              <div className={`sn-form-alert sn-alert-${authMessage.type} mb-3`} style={{ display: 'block' }}>
                {authMessage.text}
              </div>
            )}

            {userSession ? (
              <div className="text-center py-3">
                <div className="mb-3">
                  <i className="bi bi-person-circle display-4 text-dark"></i>
                </div>
                <h5 className="font-serif mb-1">{userSession.firstName ? `${userSession.firstName} ${userSession.lastName}` : 'Valued Client'}</h5>
                <p className="text-muted small mb-4">{userSession.email}</p>
                <div className="d-flex flex-column gap-2">
                  <Link to="/cart" className="btn btn-outline-dark text-uppercase small py-2 fw-semibold" onClick={() => setShowAccountModal(false)}>
                    View Shopping Bag ({itemCount})
                  </Link>
                  <button type="button" className="btn btn-dark text-uppercase small py-2 fw-semibold" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="sn-tabs-nav d-flex border-bottom mb-4">
                  <button 
                    type="button" 
                    className={`sn-tab-btn flex-grow-1 border-0 bg-transparent text-uppercase ${authMode === 'signin' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('signin'); setAuthMessage(null); }}
                  >
                    SIGN IN
                  </button>
                  <button 
                    type="button" 
                    className={`sn-tab-btn flex-grow-1 border-0 bg-transparent text-uppercase ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('register'); setAuthMessage(null); }}
                  >
                    CREATE ACCOUNT
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit}>
                  {authMode === 'register' && (
                    <div className="d-flex gap-3 mb-3">
                      <div className="flex-grow-1">
                        <label className="sn-form-label text-uppercase d-block mb-1">First Name</label>
                        <input 
                          type="text" 
                          className="sn-form-input w-100" 
                          placeholder="First Name *"
                          value={authFirstName}
                          onChange={e => setAuthFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-grow-1">
                        <label className="sn-form-label text-uppercase d-block mb-1">Last Name</label>
                        <input 
                          type="text" 
                          className="sn-form-input w-100" 
                          placeholder="Last Name *"
                          value={authLastName}
                          onChange={e => setAuthLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="sn-form-label text-uppercase d-block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="sn-form-input w-100" 
                      placeholder="your@email.com"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="sn-form-label text-uppercase d-block mb-1">Password</label>
                    <input 
                      type="password" 
                      className="sn-form-input w-100" 
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="sn-btn-primary w-100 border-0 text-uppercase mb-3">
                    {authMode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                  </button>

                  <button 
                    type="button" 
                    className="sn-btn-google w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => {
                      const user = { email: 'client@atelier.luxury', provider: 'google' };
                      localStorage.setItem('atelier_auth_user', JSON.stringify(user));
                      setUserSession(user);
                      setAuthMessage({ type: 'success', text: 'Signed in with Google successfully.' });
                      setTimeout(() => {
                        setShowAccountModal(false);
                        setAuthMessage(null);
                      }, 1000);
                    }}
                  >
                    <span>CONTINUE WITH GOOGLE</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
