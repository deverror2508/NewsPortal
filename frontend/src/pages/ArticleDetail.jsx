import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser, FiClock, FiEye, FiTag, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import { articlesAPI } from '../api';

const API_URL = 'http://localhost:5000';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await articlesAPI.getBySlug(slug);
      setArticle(res.data.data);

      // Fetch related articles from same category
      if (res.data.data.category) {
        const relRes = await articlesAPI.getAll({
          category: res.data.data.category.slug,
          limit: 3,
        });
        setRelatedArticles(
          relRes.data.data.filter((a) => a._id !== res.data.data._id).slice(0, 3)
        );
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  const coverImage = article.coverImage ? `${API_URL}${article.coverImage}` : null;
  const videoUrl   = article.videoUrl   ? `${API_URL}${article.videoUrl}`   : null;

  return (
    <article className="article-detail">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
          <FiArrowLeft /> Back to articles
        </Link>

        {article.category && (
          <Link to={`/search?category=${article.category.slug}`}>
            <span className="badge badge-accent">
              {article.category.name}
            </span>
          </Link>
        )}
      </div>

      <h1 className="animate-slide">{article.title}</h1>

      <div className="article-detail-meta animate-fade" style={{ animationDelay: '0.15s' }}>
        <span className="article-detail-meta-item">
          <FiUser />
          <strong>{article.author?.name}</strong>
        </span>
        <span className="article-detail-meta-item">
          <FiClock />
          {article.publishedAt
            ? format(new Date(article.publishedAt), 'MMMM d, yyyy')
            : format(new Date(article.createdAt), 'MMMM d, yyyy')}
        </span>
        <span className="article-detail-meta-item">
          <FiEye />
          {article.views} views
        </span>
      </div>

      {coverImage && (
        <img src={coverImage} alt={article.title} className="article-detail-cover" />
      )}

      {/* ── Embedded Video ── */}
      {videoUrl && (
        <div
          style={{
            margin: '28px 0',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          }}
        >
          <video
            controls
            preload="metadata"
            style={{ width: '100%', maxHeight: 480, display: 'block' }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div
        className="article-detail-body"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
          <FiTag style={{ color: 'var(--text-muted)', marginTop: 4 }} />
          {article.tags.map((tag, i) => (
            <span key={i} className="badge badge-neutral">{tag}</span>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div style={{ marginTop: 60, paddingTop: 40, borderTop: '2px solid var(--border-light)' }}>
          <h2 style={{ fontSize: 24, marginBottom: 24 }}>Related Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {relatedArticles.map((rel) => (
              <Link key={rel._id} to={`/article/${rel.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-body">
                  <span className="badge badge-accent" style={{ marginBottom: 8, fontSize: 11 }}>
                    {rel.category?.name}
                  </span>
                  <h3 className="card-title" style={{ fontSize: 15 }}>{rel.title}</h3>
                  <p className="card-meta" style={{ fontSize: 12, marginTop: 8 }}>
                    {format(new Date(rel.publishedAt || rel.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default ArticleDetail;
