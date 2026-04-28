import { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiTrash2, FiClock, FiUserPlus, FiFileText } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { articlesAPI, usersAPI } from '../../api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const [pendingRes, latestRes, usersRes] = await Promise.all([
          articlesAPI.getPending(),
          articlesAPI.getAllAdmin({ limit: 5 }), // Latest articles
          usersAPI.getAll({ limit: 5 })         // Recent users
        ]);

        const allNotifications = [];

        // 1. Pending Articles (High Priority)
        pendingRes.data.data.forEach(a => {
          allNotifications.push({
            id: `pending-${a._id}`,
            title: 'Action Required: Pending Review',
            message: `"${a.title}" by ${a.author?.name} is waiting for approval.`,
            time: new Date(a.createdAt),
            type: 'warning',
            icon: <FiAlertCircle />,
            read: false
          });
        });

        // 2. Published Articles (System Updates)
        latestRes.data.data.filter(a => a.status === 'published').forEach(a => {
          allNotifications.push({
            id: `pub-${a._id}`,
            title: 'Article Published',
            message: `"${a.title}" has been successfully published to the portal.`,
            time: new Date(a.createdAt),
            type: 'success',
            icon: <FiCheckCircle />,
            read: true
          });
        });

        // 3. New Users
        usersRes.data.data.forEach(u => {
          allNotifications.push({
            id: `user-${u._id}`,
            title: 'New Member Onboarded',
            message: `${u.name} (${u.role}) has joined the NewsPortal ecosystem.`,
            time: new Date(u.createdAt),
            type: 'info',
            icon: <FiUserPlus />,
            read: true
          });
        });

        // Sort by time (newest first)
        allNotifications.sort((a, b) => b.time - a.time);

        setNotifications(allNotifications);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle style={{ color: '#10b881' }} />;
      case 'warning': return <FiAlertCircle style={{ color: '#f59e0b' }} />;
      case 'error': return <FiAlertCircle style={{ color: '#ef4444' }} />;
      case 'info': return <FiInfo style={{ color: '#3b82f6' }} />;
      default: return <FiBell style={{ color: '#64748b' }} />;
    }
  };

  return (
    <div className="animate-fade">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
        <div>
          <span className="badge-pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 700, fontSize: 12, padding: '4px 12px', borderRadius: 10, marginBottom: 12, display: 'inline-block', textTransform: 'uppercase' }}>
            Platform Intelligence
          </span>
          <h1 className="page-title" style={{ fontSize: 32, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
            <FiBell style={{ color: '#3b82f6' }} /> Event Logs
          </h1>
          <p className="page-subtitle" style={{ color: '#64748b', marginTop: 8, fontSize: 16 }}>
            Consolidated stream of system events and content lifecycle updates.
          </p>
        </div>
        <button 
          className="btn-glow" 
          onClick={markAllRead} 
          disabled={loading || notifications.length === 0}
          style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#475569' }}
        >
          Mark all as read
        </button>
      </div>

      <div className="saas-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="notification-list">
          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '16px', color: '#64748b', fontWeight: 600 }}>Syncing with system logs...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`} style={{ borderBottom: '1px solid #f1f5f9', padding: '24px 32px', display: 'flex', gap: '20px', alignItems: 'flex-start', transition: 'all 0.2s ease' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: n.read ? '#f8fafc' : 'rgba(59, 130, 246, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {getIcon(n.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {n.title} 
                      {!n.read && <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></span>}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiClock size={12} /> {formatDistanceToNow(n.time, { addSuffix: true })}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>{n.message}</p>
                </div>

                <div className="notification-actions">
                  <button onClick={() => deleteNotification(n.id)} title="Dismiss" style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'} onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: '#f8fafc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#cbd5e1' }}>
                <FiBell size={32} />
              </div>
              <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontWeight: 800 }}>Clear Logs</h3>
              <p style={{ color: '#64748b', margin: 0 }}>No system events detected in the current cycle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;

