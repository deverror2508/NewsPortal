import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiEdit2, FiTrash2, FiSearch, FiFilter, FiFileText, FiPlus, 
  FiChevronRight, FiCheckCircle, FiClock, FiAlertCircle, FiCheck, FiX, FiRefreshCw
} from 'react-icons/fi';
import { format } from 'date-fns';
import { articlesAPI, categoriesAPI } from '../../api';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState(''); // Empty string for 'All'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toast, setToast] = useState(null);
  
  // Moderation state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewingArticle, setViewingArticle] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { 
    fetchCategories();
    fetchArticles(); 
  }, [page, status, selectedCategory, debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await articlesAPI.getAllAdmin({ 
        page, 
        limit: 10, 
        keyword: debouncedSearch || undefined,
        status: status || undefined,
        category: selectedCategory || undefined
      });
      setArticles(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchArticles();
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setStatus('');
    setPage(1);
  };

  const handleApprove = async (id) => {
    try {
      await articlesAPI.approve(id);
      showToast('Article approved and published!', 'success');
      setViewingArticle(null);
      fetchArticles();
    } catch (err) {
      showToast('Failed to approve article', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }
    try {
      await articlesAPI.reject(rejectingId, rejectionReason);
      showToast('Article rejected', 'success');
      setRejectingId(null);
      setRejectionReason('');
      setViewingArticle(null);
      fetchArticles();
    } catch (err) {
      showToast('Failed to reject article', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will permanently delete the article.')) return;
    try {
      await articlesAPI.delete(id);
      showToast('Article deleted successfully', 'success');
      fetchArticles();
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: '', label: 'All Articles' },
    { id: 'published', label: 'Published' },
    { id: 'pending', label: 'Pending' },
    { id: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="animate-fade">
      {toast && (
        <div className={`toast toast-${toast.type} animate-slideUp btn-glow`} style={{ zIndex: 9999 }}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.message}
        </div>
      )}

      {/* Review Modal */}
      {viewingArticle && (
        <div className="modal-overlay animate-fade" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '20px' }}>
          <div className="animate-slideUp" style={{ background: 'white', width: '100%', maxWidth: '1000px', maxHeight: '95vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Moderation Pipeline • Article Review</span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{viewingArticle.title}</h2>
              </div>
              <button onClick={() => setViewingArticle(null)} style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', color: '#64748b' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                <FiX size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: '40px' }}>
              {/* ── Meta & Author ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', background: '#f8fafc', padding: '16px 24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                  {viewingArticle.author?.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>{viewingArticle.author?.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '12px' }}>
                    <span>{viewingArticle.author?.email}</span>
                    <span>•</span>
                    <span>{format(new Date(viewingArticle.createdAt), 'MMMM d, yyyy')}</span>
                    <span>•</span>
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>{viewingArticle.category?.name}</span>
                  </div>
                </div>
              </div>

              {/* ── Featured Image ── */}
              {viewingArticle.coverImage && (
                <div style={{ width: '100%', marginBottom: '32px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
                  <img 
                    src={viewingArticle.coverImage.startsWith('http') ? viewingArticle.coverImage : `http://localhost:5000${viewingArticle.coverImage}`} 
                    style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block' }} 
                    alt="Cover" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              {/* ── 2. Content (Text) ── */}
              {viewingArticle.summary && (
                <div style={{ background: '#f0f9ff', padding: '24px 32px', borderRadius: '16px', borderLeft: '5px solid #0ea5e9', marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Executive Summary</h4>
                  <p style={{ fontSize: '16px', color: '#0c4a6e', lineHeight: '1.6', margin: 0, fontWeight: 500 }}>{viewingArticle.summary}</p>
                </div>
              )}

              {/* ── 3. Video ── */}
              {viewingArticle.videoUrl && (
                <div style={{ margin: '32px 0', borderRadius: '20px', overflow: 'hidden', background: '#000', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                  <video 
                    src={viewingArticle.videoUrl.startsWith('http') ? viewingArticle.videoUrl : `http://localhost:5000${viewingArticle.videoUrl}`} 
                    controls 
                    style={{ width: '100%', maxHeight: '500px', display: 'block' }} 
                  />
                </div>
              )}

              {/* ── 4. Remaining Content ── */}
              <div style={{ padding: '0 10px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>Article Content</h4>
                <div 
                  className="article-preview-content" 
                  dangerouslySetInnerHTML={{ __html: viewingArticle.body }} 
                  style={{ 
                    fontSize: '17px', 
                    lineHeight: '1.8', 
                    color: '#334155', 
                    wordWrap: 'break-word', 
                    overflowWrap: 'break-word' 
                  }} 
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '24px 40px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '16px', position: 'sticky', bottom: 0, zIndex: 100 }}>
              <button onClick={() => setViewingArticle(null)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}>Close Review</button>
              {viewingArticle.status === 'pending' && (
                <>
                  <button onClick={() => { setRejectingId(viewingArticle._id); }} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}>Reject Submission</button>
                  <button onClick={() => handleApprove(viewingArticle._id)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s ease' }}>Approve & Publish</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="modal-overlay animate-fade" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="saas-card animate-slideUp" style={{ width: '400px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 12px' }}>Reject Article</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Please provide a brief explanation of why this article is being rejected. This will be shown to the author.</p>
            <textarea 
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{ width: '100%', height: '120px', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', resize: 'none', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectingId(null)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleReject} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Reject Article</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>Content Management</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Moderate submissions and curate the platform content flow.</p>
        </div>
        <NavLink to="/admin/upload" className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}>
          <FiPlus /> Create Article
        </NavLink>
      </div>

      <div className="saas-card" style={{ padding: '0', overflow: 'visible' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '32px', padding: '0 32px', borderBottom: '1px solid #f1f5f9' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setStatus(tab.id); setPage(1); }}
              style={{
                padding: '20px 0',
                background: 'none',
                border: 'none',
                borderBottom: status === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                color: status === tab.id ? '#3b82f6' : '#64748b',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div className="global-search-saas" style={{ flex: 1, minWidth: '300px' }}>
            <FiSearch style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '40px' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <FiChevronRight style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#64748b' }} />
          </div>

          <button className="btn-glow" onClick={handleApplyFilters} style={{ background: '#3b82f6', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFilter /> Apply Filters
          </button>

          <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiRefreshCw size={14} /> Reset
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Details</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : articles.length > 0 ? (
                articles.map((a) => (
                  <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div 
                          style={{ 
                            width: '64px', 
                            height: '44px', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            border: '1px solid #e2e8f0', 
                            flexShrink: 0, 
                            background: '#f8fafc', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            position: 'relative'
                          }}
                        >
                          {a.coverImage ? (
                            <div 
                              style={{ 
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${a.coverImage.startsWith('http') ? a.coverImage : `http://localhost:5000${a.coverImage}`})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                          ) : (
                            <FiFileText style={{ color: '#cbd5e1' }} size={18} />
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', lineHeight: '1.2' }}>{a.title}</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>by {a.author?.name}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#f1f5f9', color: '#3b82f6', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {a.category?.name}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: a.status === 'published' ? '#ecfdf5' : a.status === 'pending' ? '#fffbeb' : a.status === 'rejected' ? '#fef2f2' : '#f8fafc',
                        color: a.status === 'published' ? '#10b881' : a.status === 'pending' ? '#f59e0b' : a.status === 'rejected' ? '#ef4444' : '#64748b'
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiClock size={12} />
                        {format(new Date(a.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => setViewingArticle(a)} title="Review Content" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <FiFileText size={16} />
                        </button>
                        {a.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(a._id)} title="Approve" style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#ecfdf5', color: '#10b881', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <FiCheck size={16} />
                            </button>
                            <button onClick={() => setRejectingId(a._id)} title="Reject" style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                        <NavLink to={`/admin/upload/${a._id}`} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <FiEdit2 size={14} />
                        </NavLink>
                        <button onClick={() => handleDelete(a._id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    No articles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Page <strong>{page}</strong> of <strong>{pagination.pages}</strong></span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '13px', fontWeight: 600, cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Previous</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '13px', fontWeight: 600, cursor: page === pagination.pages ? 'default' : 'pointer', opacity: page === pagination.pages ? 0.5 : 1 }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
