import { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiFolder, FiSearch, 
  FiGrid, FiList, FiChevronRight, FiMoreVertical, FiAlertCircle
} from 'react-icons/fi';
import { categoriesAPI } from '../../api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoriesAPI.update(editId, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setModalOpen(false);
      setEditId(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>Taxonomy Hub</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Organize and classify your content architecture.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <FiPlus /> New Category
        </button>
      </div>

      <div className="saas-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div className="global-search-saas" style={{ width: '400px' }}>
            <FiSearch style={{ color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button 
              onClick={() => setView('grid')}
              style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', background: view === 'grid' ? 'white' : 'transparent', color: view === 'grid' ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: view === 'grid' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}
            >
              <FiGrid />
            </button>
            <button 
              onClick={() => setView('list')}
              style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', background: view === 'list' ? 'white' : 'transparent', color: view === 'list' ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: view === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner"></div>
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredCategories.map(cat => (
            <div key={cat._id} className="saas-card saas-card-hover primary" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <FiFolder />
                </div>
                <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <FiMoreVertical />
                </button>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>{cat.name}</h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b', lineHeight: 1.6, minHeight: '44px' }}>{cat.description || 'No description provided.'}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setEditId(cat._id); setFormData({ name: cat.name, description: cat.description }); setModalOpen(true); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '13px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                  <FiEdit2 size={14} /> Edit
                </button>
                <button onClick={async () => { if(window.confirm('Delete this category?')) { await categoriesAPI.delete(cat._id); fetchCategories(); } }} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #fef2f2', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="saas-card" style={{ padding: '0' }}>
          <table className="admin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Category Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Description</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(cat => (
                <tr key={cat._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FiFolder style={{ color: '#3b82f6' }} />
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{cat.description}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => { setEditId(cat._id); setFormData({ name: cat.name, description: cat.description }); setModalOpen(true); }} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={async () => { if(window.confirm('Delete this category?')) { await categoriesAPI.delete(cat._id); fetchCategories(); } }} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fef2f2', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="animate-scaleIn" style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>{editId ? 'Edit Category' : 'Create Category'}</h2>
            <p style={{ margin: '0 0 32px', fontSize: '14px', color: '#64748b' }}>Define the taxonomy for your content units.</p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Category Name</label>
                <input 
                  type="text" 
                  required 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Technology, Health, etc."
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Description</label>
                <textarea 
                  rows="4" 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none', resize: 'none' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what this category covers..."
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-glow" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#3b82f6', fontWeight: 700, color: 'white', cursor: 'pointer' }}>{editId ? 'Update' : 'Create'} Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
