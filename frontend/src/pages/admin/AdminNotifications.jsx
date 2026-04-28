import { useState } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiTrash2, FiClock } from 'react-icons/fi';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Article Submission',
      message: 'John Doe submitted "The Future of Quantum Computing" for review.',
      time: '2 minutes ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'New User Registered',
      message: 'A new author "Sarah Smith" has joined the platform.',
      time: '1 hour ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Server Alert',
      message: 'Storage capacity reaching 90%. Please consider upgrading.',
      time: '5 hours ago',
      type: 'warning',
      read: true
    },
    {
      id: 4,
      title: 'Article Rejected',
      message: 'Your article "Crypto Trends" was rejected by Admin.',
      time: 'Yesterday',
      type: 'error',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-success" />;
      case 'warning': return <FiAlertCircle className="text-warning" />;
      case 'error': return <FiAlertCircle className="text-danger" />;
      default: return <FiInfo className="text-primary" />;
    }
  };

  return (
    <div className="notifications-container animate-slideIn">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <span className="badge-pill" style={{ background: 'rgba(26, 60, 94, 0.1)', color: 'var(--primary)', fontWeight: 600, fontSize: 12, padding: '4px 12px', borderRadius: 20, marginBottom: 12, display: 'inline-block' }}>
            System Updates
          </span>
          <h1 className="page-title" style={{ fontSize: 32, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiBell style={{ color: 'var(--primary)' }} /> Notifications
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 15 }}>
            Stay updated with the latest platform activity and system alerts.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={markAllRead} style={{ borderRadius: 12, padding: '10px 20px', fontWeight: 600 }}>
          Mark all as read
        </button>
      </div>

      <div className="card" style={{ padding: 0, border: 'none', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', borderRadius: 24 }}>
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                <div className="notification-icon-wrap">
                  {getIcon(n.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">
                      {n.title} 
                      {!n.read && <span className="unread-dot"></span>}
                    </h4>
                    <span className="notification-time">
                      <FiClock size={12} /> {n.time}
                    </span>
                  </div>
                  <p className="notification-message">{n.message}</p>
                </div>

                <div className="notification-actions">
                  <button className="btn-icon" onClick={() => deleteNotification(n.id)} title="Delete Notification" style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}>
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 20px' }}>
                <FiBell size={32} style={{ color: 'var(--text-light)', opacity: 0.5 }} />
              </div>
              <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>All caught up!</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>You have no new notifications at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
