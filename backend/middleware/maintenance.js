const Settings = require('../models/Settings');

const maintenance = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    // Check for admin status via token if present
    let isAdmin = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        const User = require('../models/User');
        const user = await User.findById(decoded.id);
        if (user && user.role === 'admin') isAdmin = true;
      } catch (err) {
        // Token invalid, treat as guest
      }
    }

    const isAuthRoute = req.originalUrl.includes('/api/v1/auth');
    const isSettingsRoute = req.originalUrl.includes('/api/v1/settings');

    if (settings.maintenanceMode && !isAdmin && !isAuthRoute && !isSettingsRoute) {
      return res.status(503).json({
        success: false,
        message: 'Site is currently under maintenance. Please try again later.',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = maintenance;
