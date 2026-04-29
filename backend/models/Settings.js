const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'NewsPortal',
    trim: true,
  },
  siteDescription: {
    type: String,
    default: 'The ultimate medical news ecosystem.',
    trim: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  allowRegistration: {
    type: Boolean,
    default: true,
  },
  footerText: {
    type: String,
    default: '© 2026 NewsPortal. All rights reserved.',
  },
  contactEmail: {
    type: String,
    default: 'admin@newsportal.com',
  }
}, { timestamps: true });

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
