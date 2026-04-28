/**
 * Seed script - Comprehensive data restoration
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Article = require('./models/Article');
const Counter = require('./models/Counter');
const slugify = require('slugify');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Article.deleteMany({}),
      Counter.deleteMany({}),
    ]);
    console.log('✅ Database cleared\n');

    // ---- 1. Seed Categories ----
    console.log('🌿 Seeding Categories...');
    const categoriesData = [
      { name: 'Technology', description: 'Latest tech news, AI, gadgets, and software.' },
      { name: 'Sports', description: 'Scores, highlights, and sports analysis.' },
      { name: 'Politics', description: 'Political news and government updates.' },
      { name: 'Business', description: 'Markets, startups, and financial news.' },
      { name: 'Entertainment', description: 'Movies, music, celebrity news, and pop culture.' },
      { name: 'Science', description: 'Scientific discoveries and space research.' },
      { name: 'Health', description: 'Medical news, wellness, and fitness tips.' },
      { name: 'World', description: 'International news from around the globe.' },
    ];

    const categories = [];
    for (const catData of categoriesData) {
      const slug = slugify(catData.name, { lower: true, strict: true });
      const cat = await Category.create({ ...catData, slug });
      categories.push(cat);
    }
    console.log(`✅ ${categories.length} categories created\n`);

    // ---- 2. Seed Users ----
    console.log('👤 Seeding Users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@newsportal.com',
      passwordHash: 'Admin@123',
      role: 'admin',
      isVerified: true,
    });

    const author1 = await User.create({
      name: 'John Journalist',
      email: 'author1@newsportal.com',
      passwordHash: 'Author@123',
      role: 'author',
      isVerified: true,
    });

    const author2 = await User.create({
      name: 'Sarah Scribe',
      email: 'author2@newsportal.com',
      passwordHash: 'Author@123',
      role: 'author',
      isVerified: true,
    });

    const reader = await User.create({
      name: 'Dave Reader',
      email: 'reader@newsportal.com',
      passwordHash: 'Reader@123',
      role: 'reader',
      isVerified: true,
    });
    console.log(`✅ Users created: Admin, Authors x2, Reader\n`);

    // ---- 3. Seed Articles ----
    console.log('📝 Seeding Articles...');
    const articlesData = [
      {
        title: 'The Future of AI in 2026',
        summary: 'How artificial intelligence is reshaping our daily lives and industries.',
        body: '<p>Artificial Intelligence is no longer a futuristic concept. In 2026, we see AI integrated into everything from our home appliances to complex scientific research...</p><h3>The Rise of Agentic AI</h3><p>Agents that can plan and execute complex tasks are the new standard.</p>',
        category: categories.find(c => c.name === 'Technology')._id,
        author: author1._id,
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        tags: ['AI', 'Tech', '2026'],
      },
      {
        title: 'Champions League: Final Predictions',
        summary: 'Analyzing the top contenders for this year\'s football crown.',
        body: '<p>The road to the final has been filled with upsets and stunning performances. As we approach the climax of the tournament, all eyes are on the favorites...</p>',
        category: categories.find(c => c.name === 'Sports')._id,
        author: author2._id,
        status: 'published',
        publishedAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
        tags: ['Football', 'Sports', 'ChampionsLeague'],
      },
      {
        title: 'Global Economic Outlook: Q2 Update',
        summary: 'Inflation trends and market growth projections for the upcoming quarter.',
        body: '<p>Market analysts are cautiously optimistic as new data suggests a cooling of inflation in major economies...</p>',
        category: categories.find(c => c.name === 'Business')._id,
        author: author1._id,
        status: 'pending',
        tags: ['Economy', 'Finance', 'Global'],
      },
      {
        title: 'Revolutionary Clean Energy Breakthrough',
        summary: 'Scientists achieve stable fusion reaction for a record duration.',
        body: '<p>In a historic achievement, the International Fusion Energy Research consortium announced a breakthrough today...</p>',
        category: categories.find(c => c.name === 'Science')._id,
        author: author2._id,
        status: 'draft',
        tags: ['Energy', 'Science', 'Innovation'],
      },
      {
        title: 'New Policy Change in Urban Planning',
        summary: 'Government announces new initiative to increase green spaces in major cities.',
        body: '<p>Starting next month, urban development projects will be required to allocate at least 20%!o(MISSING)f land to green spaces...</p>',
        category: categories.find(c => c.name === 'Politics')._id,
        author: author1._id,
        status: 'published',
        publishedAt: new Date(Date.now() - 3600000 * 48),
        tags: ['Urban', 'Politics', 'Green'],
      }
    ];

    for (const art of articlesData) {
      await Article.create(art);
    }
    console.log(`✅ ${articlesData.length} articles created`);

    console.log('\n🎉 Seed completed successfully! All IDs and attributes are synchronized.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
