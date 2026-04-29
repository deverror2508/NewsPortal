const Settings = require('../models/Settings');

// @desc    Get system settings
// @route   GET /api/v1/settings
// @access  Private (Admin only)
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PATCH /api/v1/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.getSettings();
    
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
