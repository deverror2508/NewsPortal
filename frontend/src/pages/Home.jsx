import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { articlesAPI, categoriesAPI } from '../api';
import ArticleCard from '../components/ArticleCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [activeCategory, page]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (activeCategory) params.category = activeCategory;

      const res = await articlesAPI.getAll(params);
      setArticles(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(91,192,235,0.15)', border: '1px solid rgba(91,192,235,0.3)', borderRadius: 999, padding: '5px 14px', marginBottom: 20 }} className="animate-fade">
            <FiTrendingUp size={13} style={{ color: '#5BC0EB' }} />
            <span style={{ fontSize: 13, color: '#5BC0EB', fontWeight: 600, letterSpacing: '0.04em' }}>LIVE &amp; TRENDING</span>
          </div>
          <h1 className="animate-slide" style={{ animationDelay: '0.08s' }}>
            Stay Informed with <span>NewsPortal</span>
          </h1>
          <p className="animate-slide" style={{ animationDelay: '0.18s' }}>
            Discover the latest stories from around the world. Curated content across
            technology, sports, politics, business, and more — delivered with quality.
          </p>
          <div style={{ display: 'flex', gap: 12 }} className="animate-slide" data-delay="0.28">
            <Link to="/search" className="btn btn-accent btn-lg">
              Explore Articles <FiArrowRight />
            </Link>
            {isAdmin && (
              <Link to="/editor" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                Start Writing
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="container">
        <div className="category-pills">
          <button
            className={`category-pill ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => { setActiveCategory(''); setPage(1); }}
          >
            All News
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`category-pill ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
            >
              {cat.name}
              {cat.articleCount > 0 && (
                <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 12 }}>
                  ({cat.articleCount})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiTrendingUp style={{ color: 'var(--accent)' }} />
            {activeCategory
              ? categories.find(c => c.slug === activeCategory)?.name + ' News'
              : 'Latest Articles'}
          </h2>
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : articles.length > 0 ? (
          <>
            <div className="article-grid stagger">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={page === i + 1 ? 'active' : ''}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h3>No articles found</h3>
            <p>
              {activeCategory
                ? 'No articles in this category yet. Check back soon!'
                : 'No articles have been published yet. Be the first to write one!'}
            </p>
            {isAdmin && (
              <Link to="/editor" className="btn btn-primary" style={{ marginTop: 16 }}>
                Start Writing
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
