const Article = require('../models/Article');
const User = require('../models/User');

/**
 * @desc    Get latest articles as notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Fetch latest 10 published articles
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(10)
      .select('title summary publishedAt slug coverImage');

    // Map to include read status
    const notifications = articles.map(article => ({
      _id: article._id,
      title: article.title,
      summary: article.summary,
      publishedAt: article.publishedAt,
      slug: article.slug,
      coverImage: article.coverImage,
      isRead: user.readNotifications.includes(article._id)
    }));

    // Count unread
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.status(200).json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const articleId = req.params.id;

    if (!user.readNotifications.includes(articleId)) {
      user.readNotifications.push(articleId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/v1/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Fetch latest 10 published articles
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(10)
      .select('_id');

    const articleIds = articles.map(a => a._id);

    // Add unique IDs to readNotifications
    articleIds.forEach(id => {
      if (!user.readNotifications.includes(id)) {
        user.readNotifications.push(id);
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};
