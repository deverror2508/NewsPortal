import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSend, FiEye, FiClock, 
  FiCheckCircle, FiXCircle, FiFileText, FiSearch, FiLayers, FiAlertCircle 
} from 'react-icons/fi';
import { format } from 'date-fns';
import { articlesAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  draft: { label: 'Draft', badge: 'badge-neutral', icon: <FiFileText />, color: '#64748b' },
  pending: { label: 'Pending Review', badge: 'badge-warning', icon: <FiClock />, color: '#f59e0b' },
  published: { label: 'Published', badge: 'badge-success', icon: <FiCheckCircle />, color: '#10b981' },
  rejected: { label: 'Rejected', badge: 'badge-danger', icon: <FiXCircle />, color: '#ef4444' },
};

const AuthorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMyArticles();
  }, [filterStatus]);

  const fetchMyArticles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await articlesAPI.getMyArticles(params);
      setArticles(res.data.data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (id) => {
    try {
      await articlesAPI.submitForReview(id);
      showToast('Article submitted for review!', 'success');
      fetchMyArticles();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await articlesAPI.delete(id);
      showToast('Article deleted', 'success');
      setDeleteConfirm(null);
      fetchMyArticles();
    } catch (error) {
      showToast('Failed to delete article', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    pending: articles.filter((a) => a.status === 'pending').length,
    draft: articles.filter((a) => a.status === 'draft').length,
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container section animate-fade" style={{ maxWidth: 1200 }}>
      {/* --- Toast Notifications --- */}
      {toast && (
        <div className={`toast toast-${toast.type} animate-slideUp`}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.message}
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {deleteConfirm && (
        <div className="modal-overlay animate-fade" onClick={() => setDeleteConfirm(null)}>
          <div className="modal animate-slideUp" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 24, padding: 32 }}>
            <div className="modal-header">
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>Delete Article</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>&times;</button>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>
              Are you sure you want to delete this article? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                <FiTrash2 /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Page Header --- */}
      <div className="dashboard-header animate-slide" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ background: 'rgba(26, 60, 94, 0.1)', color: 'var(--primary)', width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
            <FiLayers />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Author Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 16 }}>Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name}</span>. Here's an overview of your work.</p>
          </div>
        </div>
        <Link to="/editor" className="btn btn-primary btn-lg btn-glow">
          <FiPlus /> Create New Article
        </Link>
      </div>

      {/* --- Statistics Grid --- */}
      <div className="stats-grid animate-slide" style={{ marginBottom: 40, animationDelay: '0.1s' }}>
        <div className="stat-card modern">
          <div className="stat-info">
            <p className="stat-label">Total Work</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
          <div className="stat-icon-wrap" style={{ background: 'rgba(26, 60, 94, 0.05)', color: 'var(--primary)' }}>
            <FiFileText />
          </div>
        </div>
        <div className="stat-card modern">
          <div className="stat-info">
            <p className="stat-label">Published</p>
            <h3 className="stat-value" style={{ color: 'var(--success)' }}>{stats.published}</h3>
          </div>
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.05)', color: 'var(--success)' }}>
            <FiCheckCircle />
          </div>
        </div>
        <div className="stat-card modern">
          <div className="stat-info">
            <p className="stat-label">In Review</p>
            <h3 className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</h3>
          </div>
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.05)', color: 'var(--warning)' }}>
            <FiClock />
          </div>
        </div>
        <div className="stat-card modern">
          <div className="stat-info">
            <p className="stat-label">Drafts</p>
            <h3 className="stat-value" style={{ color: '#64748b' }}>{stats.draft}</h3>
          </div>
          <div className="stat-icon-wrap" style={{ background: 'rgba(100, 116, 139, 0.05)', color: '#64748b' }}>
            <FiEdit2 />
          </div>
        </div>
      </div>

      {/* --- Content Management Card --- */}
      <div className="saas-card" style={{ padding: 0, overflow: 'visible', marginBottom: 32 }}>
        <div style={{ padding: '32px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div className="global-search-saas" style={{ flex: 1, maxWidth: 500 }}>
            <FiSearch style={{ color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search your articles by title or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Optional secondary actions here */}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="saas-tabs">
          {['', 'draft', 'pending', 'published', 'rejected'].map((status) => (
            <button
              key={status}
              className={`saas-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All Content'}
            </button>
          ))}
        </div>

        {/* --- Articles Table Section --- */}
        <div style={{ padding: 0, overflow: 'hidden' }}>


        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: 20, color: 'var(--text-muted)', fontWeight: 500 }}>Fetching your articles...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 24 }}>Article Details</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Metrics</th>
                  <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => {
                  const sc = statusConfig[article.status];
                  return (
                    <tr key={article._id} style={{ transition: 'all 0.2s ease' }}>
                      <td style={{ padding: '24px 0 24px 24px' }}>
                        <div style={{ maxWidth: 350 }}>
                          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: article.status === 'rejected' ? 8 : 0 }}>{article.title}</div>
                          {article.status === 'rejected' && article.rejectionReason && (
                            <div style={{ 
                              fontSize: 12, 
                              color: '#ef4444', 
                              padding: '8px 12px', 
                              background: '#fef2f2', 
                              borderRadius: 10,
                              border: '1px solid rgba(239, 68, 68, 0.1)',
                              display: 'inline-flex', 
                              alignItems: 'flex-start', 
                              gap: 8,
                              lineHeight: 1.5
                            }}>
                              <FiAlertCircle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                              <span><strong>Feedback:</strong> {article.rejectionReason}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-light)' }}></div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {article.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${sc.badge}`} style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          padding: '6px 14px', 
                          borderRadius: 10, 
                          fontSize: 11, 
                          fontWeight: 800, 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                        {format(new Date(article.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          <FiEye size={14} style={{ color: 'var(--primary-light)' }} /> {article.views || 0}
                        </div>
                      </td>
                      <td style={{ paddingRight: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                          {article.status === 'published' && (
                            <Link to={`/article/${article.slug}`} className="btn-icon modern" title="View Published" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
                              <FiEye size={18} />
                            </Link>
                          )}
                          <button
                            className="btn-icon modern"
                            onClick={() => navigate(`/editor/${article._id}`)}
                            title="Edit Content"
                            style={{ background: '#f5f3ff', color: '#8b5cf6' }}
                          >
                            <FiEdit2 size={18} />
                          </button>
                          {['draft', 'rejected'].includes(article.status) && (
                            <button
                              className="btn-icon modern"
                              onClick={() => handleSubmit(article._id)}
                              title="Submit for Review"
                              style={{ background: '#ecfdf5', color: '#10b981' }}
                            >
                              <FiSend size={18} />
                            </button>
                          )}
                          <button
                            className="btn-icon modern"
                            onClick={() => setDeleteConfirm(article._id)}
                            title="Delete Permanently"
                            style={{ background: '#fef2f2', color: '#ef4444' }}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-alt)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-light)' }}>
              <FiFileText size={40} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No articles found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 24px' }}>
              {searchQuery ? `No matches for "${searchQuery}". Try a different search term.` : "Start your journey by creating your very first article today."}
            </p>
            <Link to="/editor" className="btn btn-primary btn-glow">
              <FiPlus /> Create Article
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AuthorDashboard;

