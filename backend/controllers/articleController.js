const Article = require('../models/Article');
const Category = require('../models/Category');

// @desc    Get all published articles (paginated, filterable)
// @route   GET /api/v1/articles
// @access  Public
exports.getArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      keyword,
      startDate,
      endDate,
      sort = '-publishedAt',
    } = req.query;

    const query = { status: 'published' };

    // Filter by category slug
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Full-text search by keyword
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Date range filter
    if (startDate || endDate) {
      query.publishedAt = {};
      if (startDate) query.publishedAt.$gte = new Date(startDate);
      if (endDate) query.publishedAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 50);
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('author', 'name avatar')
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Article.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug
// @route   GET /api/v1/articles/slug/:slug
// @access  Public
exports.getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published',
    })
      .populate('author', 'name avatar')
      .populate('category', 'name slug');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Increment view count
    article.views += 1;
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by ID (for editing)
// @route   GET /api/v1/articles/:id
// @access  Private (Author own / Admin)
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('category', 'name slug');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check ownership or admin
    if (
      article.author._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this article',
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new article
// @route   POST /api/v1/articles
// @access  Private (Author, Admin)
exports.createArticle = async (req, res, next) => {
  try {
    const { title, body, summary, category, tags, status } = req.body;

    const articleData = {
      title,
      body,
      summary: summary || '',
      category,
      tags: tags || [],
      author: req.user._id,
      status: status === 'pending' ? 'pending' : 'draft',
    };

    // Handle cover image upload (upload.fields stores files as arrays)
    if (req.files?.coverImage?.[0]) {
      articleData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    // Handle video upload
    if (req.files?.videoFile?.[0]) {
      articleData.videoUrl = `/uploads/${req.files.videoFile[0].filename}`;
    }

    const article = await Article.create(articleData);
    await article.populate('author', 'name avatar');
    await article.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an article
// @route   PATCH /api/v1/articles/:id
// @access  Private (Author own / Admin)
exports.updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check ownership or admin
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article',
      });
    }

    const { title, body, summary, category, tags, removeVideo } = req.body;

    if (title) article.title = title;
    if (body) article.body = body;
    if (summary !== undefined) article.summary = summary;
    if (category) article.category = category;
    if (tags) article.tags = tags;

    // Handle cover image upload (upload.fields stores files as arrays)
    if (req.files?.coverImage?.[0]) {
      article.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    // Handle video upload
    if (req.files?.videoFile?.[0]) {
      article.videoUrl = `/uploads/${req.files.videoFile[0].filename}`;
    }

    // Allow explicit removal of the video
    if (removeVideo === 'true') {
      article.videoUrl = '';
    }

    await article.save();
    await article.populate('author', 'name avatar');
    await article.populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an article
// @route   DELETE /api/v1/articles/:id
// @access  Private (Author own / Admin)
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check ownership or admin
    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article',
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit article for review
// @route   PATCH /api/v1/articles/:id/submit
// @access  Private (Author)
exports.submitArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!['draft', 'rejected'].includes(article.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot submit article with status '${article.status}'`,
      });
    }

    article.status = 'pending';
    article.rejectionReason = '';
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Article submitted for review',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve an article
// @route   PATCH /api/v1/articles/:id/approve
// @access  Private (Admin)
exports.approveArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    if (article.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending articles can be approved',
      });
    }

    article.status = 'published';
    article.publishedAt = new Date();
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Article approved and published',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject an article
// @route   PATCH /api/v1/articles/:id/reject
// @access  Private (Admin)
exports.rejectArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    if (article.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending articles can be rejected',
      });
    }

    article.status = 'rejected';
    article.rejectionReason = req.body.reason || 'No reason provided';
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Article rejected',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending articles
// @route   GET /api/v1/articles/pending
// @access  Private (Admin)
exports.getPendingArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ status: 'pending' })
      .populate('author', 'name avatar email')
      .populate('category', 'name slug')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get articles by current author
// @route   GET /api/v1/articles/my-articles
// @access  Private (Author)
exports.getMyArticles = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { author: req.user._id };
    if (status) query.status = status;

    const articles = await Article.find(query)
      .populate('category', 'name slug')
      .sort('-updatedAt')
      .lean();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles for admin (any status)
// @route   GET /api/v1/articles/admin/all
// @access  Private (Admin)
exports.getAllArticlesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, keyword } = req.query;
    const query = {};

    if (status) query.status = status;
    if (keyword) query.$text = { $search: keyword };

    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 50);
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('author', 'name email avatar')
        .populate('category', 'name slug')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Article.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
