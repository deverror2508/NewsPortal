import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  FiTrash2, FiUsers, FiAlertTriangle, FiCheck, FiSearch, 
  FiMoreVertical, FiUserPlus, FiFilter, FiMail, FiShield, FiCalendar, FiChevronRight
} from 'react-icons/fi';
import { usersAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { 
    fetchUsers(); 
  }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll({ 
        page, 
        limit: 10,
        keyword: search,
        role: roleFilter
      });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      showToast(`Role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Remove access for ${userName}?`)) {
      try {
        await usersAPI.delete(userId);
        showToast('Access revoked', 'success');
        fetchUsers();
      } catch (err) {
        showToast('Revocation failed', 'error');
      }
    }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-fade">
      {toast && (
        <div className={`toast toast-${toast.type} animate-slideUp btn-glow`} style={{ zIndex: 1000 }}>
          {toast.type === 'success' ? <FiCheck /> : <FiAlertTriangle />}
          {toast.message}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>Access Control</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Manage platform identities and security permissions.</p>
        </div>
        <button className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <FiUserPlus /> Invite User
        </button>
      </div>

      <div className="saas-card" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div className="global-search-saas" style={{ width: '400px' }}>
            <FiSearch style={{ color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-select-wrap" style={{ position: 'relative' }}>
            <FiFilter style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ height: '44px', padding: '0 16px 0 40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
            >
              <option value="">All Identities</option>
              <option value="admin">Administrators</option>
              <option value="author">Authors</option>
              <option value="reader">Readers</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Privileges</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeiht: 700, color: '#0f172a' }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{u.email}</p>
                      </div>
                    </div>
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
                      background: u.role === 'admin' ? '#fef2f2' : u.role === 'author' ? '#f0f9ff' : '#f8fafc',
                      color: u.role === 'admin' ? '#ef4444' : u.role === 'author' ? '#0ea5e9' : '#64748b'
                    }}>
                      {u.role === 'admin' && <FiShield size={10} />} {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>
                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                      {u._id !== currentUser?._id ? (
                        <>
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{ height: '32px', padding: '0 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, outline: 'none' }}
                          >
                            <option value="reader">Reader</option>
                            <option value="author">Author</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button 
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Current Session</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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

export default AdminUsers;
