const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes: validates JWT and attaches req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB excluding password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized: User no longer exists'
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized: Invalid or expired token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized: No Bearer token provided'
    });
  }
};

/**
 * Role-based middleware: restricts access to admin role, returning 403 for non-admins
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin access required'
    });
  }
};

module.exports = {
  protect,
  adminOnly
};
