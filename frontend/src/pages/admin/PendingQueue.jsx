import { useState, useEffect } from 'react';
import { FiClock, FiUser, FiEye, FiCheckCircle, FiXCircle, FiFilter, FiSearch, FiAlertCircle, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';
import { articlesAPI } from '../../api';

const PendingQueue = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewArticle, setPreviewArticle] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await articlesAPI.getPending();
      setArticles(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await articlesAPI.approve(id);
      showToast('Article approved and published!', 'success');
      setPreviewArticle(null);
      fetchPending();
    } catch (err) {
      showToast('Failed to approve article', 'error');
    }
  };

  const handleReject = async () => {
    try {
      await articlesAPI.reject(rejectModal, rejectReason);
      showToast('Article rejected with feedback', 'success');
      setRejectModal(null);
      setRejectReason('');
      setPreviewArticle(null);
      fetchPending();
    } catch (err) {
      showToast('Failed to process rejection', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade">
      {toast && (
        <div className={`toast toast-${toast.type} animate-slideUp btn-glow`} style={{ zIndex: 1000 }}>
          <FiAlertCircle /> {toast.message}
        </div>
      )}

      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>Reject Article</h3>
            <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#64748b' }}>Provide feedback to the author about the required changes.</p>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Rejection Feedback</label>
              <textarea
                placeholder="Explain why this article wasn't approved..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={5}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none', resize: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setRejectModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', fontWeight: 700, color: 'white', cursor: 'pointer', opacity: !rejectReason.trim() ? 0.5 : 1 }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {previewArticle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>Content Inspection</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Reviewing submission from <strong>{previewArticle.author?.name}</strong></p>
              </div>
              <button onClick={() => setPreviewArticle(null)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>&times;</button>
            </div>
            
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCalendar /> {format(new Date(previewArticle.createdAt), 'MMMM do, yyyy')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiUser /> {previewArticle.author?.name}</span>
                <span style={{ marginLeft: 'auto', background: '#f1f5f9', color: '#3b82f6', padding: '4px 12px', borderRadius: '8px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>{previewArticle.category?.name}</span>
              </div>

              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '24px', lineHeight: 1.2 }}>{previewArticle.title}</h1>
              
              {/* ── Featured Image ── */}
              {previewArticle.coverImage && (
                <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                  <img 
                    src={previewArticle.coverImage.startsWith('http') ? previewArticle.coverImage : `http://localhost:5000${previewArticle.coverImage}`} 
                    alt="" 
                    style={{ width: '100%', display: 'block', maxHeight: '450px', objectFit: 'cover' }} 
                  />
                </div>
              )}
              
              {/* ── 2. Content (Text) ── */}
              {previewArticle.summary && (
                <div style={{ background: '#f8fafc', padding: '20px 24px', borderRadius: '16px', borderLeft: '4px solid #3b82f6', marginBottom: '24px' }}>
                  <p style={{ margin: 0, fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>{previewArticle.summary}</p>
                </div>
              )}

              {/* ── 3. Video ── */}
              {previewArticle.videoUrl && (
                <div style={{ margin: '24px 0', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
                  <video 
                    src={previewArticle.videoUrl.startsWith('http') ? previewArticle.videoUrl : `http://localhost:5000${previewArticle.videoUrl}`} 
                    controls 
                    style={{ width: '100%', display: 'block', maxHeight: '400px' }} 
                  />
                </div>
              )}

              {/* ── 4. Remaining Content ── */}
              <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#334155' }} dangerouslySetInnerHTML={{ __html: previewArticle.body }} />
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setPreviewArticle(null)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Close</button>
              <button onClick={() => { const id = previewArticle._id; setPreviewArticle(null); setRejectModal(id); }} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #ef4444', background: 'transparent', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <FiXCircle /> Reject
              </button>
              <button onClick={() => handleApprove(previewArticle._id)} className="btn-glow" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#10b881', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <FiCheckCircle /> Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>Editorial Queue</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Inspect and moderate pending content submissions.</p>
        </div>
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiClock /> {articles.length} Pending Review
        </div>
      </div>

      <div className="saas-card" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div className="global-search-saas" style={{ width: '400px' }}>
            <FiSearch style={{ color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Filter by title or author..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-select-wrap" style={{ position: 'relative' }}>
            <FiFilter style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
            <select style={{ height: '44px', padding: '0 16px 0 40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <table className="admin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Submission Title</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Author</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Wait Time</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((a) => (
                  <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setPreviewArticle(a)}>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{a.title}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>{a.category?.name}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>{a.author?.name?.charAt(0)}</div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{a.author?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>
                      {format(new Date(a.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => setPreviewArticle(a)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <FiEye size={14} />
                        </button>
                        <button onClick={() => handleApprove(a._id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#ecfdf5', color: '#10b881', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <FiCheckCircle size={14} />
                        </button>
                        <button onClick={() => setRejectModal(a._id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <FiXCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#10b881', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 24px' }}>
                <FiCheckCircle />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>Queue Cleared!</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>All submitted articles have been processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingQueue;
