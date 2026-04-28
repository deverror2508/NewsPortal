import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiEdit2, FiTrash2, FiSearch, FiFilter, FiFileText, FiPlus, 
  FiChevronRight, FiCheckCircle, FiClock, FiAlertCircle, FiCheck, FiX 
} from 'react-icons/fi';
import { format } from 'date-fns';
import { articlesAPI } from '../../api';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  
  // Moderation state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => { fetchArticles(); }, [page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await articlesAPI.getAllAdmin({ page, limit: 12, search });
      setArticles(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await articlesAPI.approve(id);
      showToast('Article approved and published!', 'success');
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

  return (
    <div className="animate-fade">
      {toast && (
        <div className={`toast toast-${toast.type} animate-slideUp btn-glow`} style={{ zIndex: 1000 }}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.message}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="modal-overlay animate-fade" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="saas-card animate-slideUp" style={{ width: '400px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 12px' }}>Reject Article</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Please provide a brief explanation of why this article is being rejected. This will be shown to the author.</p>
            <textarea 
              placeholder="Reason for rejection (e.g., Missing sources, offensive content...)"
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
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>Content Repository</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Manage and curate all content units across the platform.</p>
        </div>
        <NavLink to="/admin/upload" className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}>
          <FiPlus /> Create Article
        </NavLink>
      </div>

      <div className="saas-card" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div className="global-search-saas" style={{ width: '400px' }}>
            <FiSearch style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
            />
          </div>
          <button className="btn-glow" onClick={fetchArticles} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFilter /> Apply Filters
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
                        {a.coverImage && (
                          <div style={{ width: '64px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                            <img src={`http://localhost:5000${a.coverImage}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{a.title}</span>
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
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
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

