import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiEye, FiVideo } from 'react-icons/fi';
import { format } from 'date-fns';

const API_URL = 'http://localhost:5000';

const ArticleCard = ({ article }) => {
  const coverImage = article.coverImage
    ? (article.coverImage.startsWith('http') ? article.coverImage : `${API_URL}${article.coverImage}`)
    : null;

  const hasVideo = !!article.videoUrl;

  const date = article.publishedAt
    ? format(new Date(article.publishedAt), 'MMM d, yyyy')
    : format(new Date(article.createdAt), 'MMM d, yyyy');

  const authorName  = article.author?.name   || 'Unknown';
  const categoryName = article.category?.name || '';

  const plainSummary =
    article.summary ||
    article.body?.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

  return (
    <Link
      to={`/article/${article.slug}`}
      className="card"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image wrapper — overflow hidden so the zoom stays clipped */}
      <div style={{ overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={article.title} 
            className="card-image" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div
          className="card-image"
          style={{
            display: coverImage ? 'none' : 'flex',
            background: `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)`,
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '40px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          {article.title?.charAt(0)}
        </div>

        {/* Video badge */}
        {hasVideo && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              color: 'white',
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 999,
              letterSpacing: '0.03em',
            }}
          >
            <FiVideo size={11} /> VIDEO
          </span>
        )}
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {categoryName && (
          <span className="badge badge-accent" style={{ marginBottom: 10 }}>
            {categoryName}
          </span>
        )}

        <h3 className="card-title">{article.title}</h3>
        <p className="card-text" style={{ flex: 1 }}>{plainSummary}</p>

        <div className="card-meta" style={{ marginTop: 'auto', paddingTop: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiUser size={13} /> {authorName}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiClock size={13} /> {date}
          </span>
          {article.views > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiEye size={13} /> {article.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
