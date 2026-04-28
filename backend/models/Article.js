const mongoose = require('mongoose');
const slugify = require('slugify');

const Counter = require('./Counter');

const articleSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    body: {
      type: String,
      required: [true, 'Article body is required'],
    },
    summary: {
      type: String,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'draft',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDesc: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ title: 'text', body: 'text' });

// Auto-increment id before saving
articleSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { model: 'Article' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Auto-generate slug from title before saving
articleSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    
    // Ensure uniqueness by appending a number if needed
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Article.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Default meta fields to title/summary
  if (!this.metaTitle) this.metaTitle = this.title;
  if (!this.metaDesc) this.metaDesc = this.summary;

  next();
});

module.exports = mongoose.model('Article', articleSchema);
