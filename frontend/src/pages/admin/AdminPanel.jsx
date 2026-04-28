import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiFileText, FiUsers, FiSettings, FiLogOut,
  FiMenu, FiX, FiBell, FiChevronRight, FiUpload, FiFolder, FiSearch, FiActivity, FiZap, FiTarget, FiInfo, FiClock, FiAlertCircle, FiCheckCircle, FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

// Import refactored components
import DashboardHome from './DashboardHome';
import PendingQueue from './PendingQueue';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminSettings from './AdminSettings';
import AdminArticles from './AdminArticles';
import AdminNotifications from './AdminNotifications';
import ArticleEditor from '../author/ArticleEditor';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'New Article Submission', time: '2 mins ago', desc: 'John Doe submitted "The Future of Quantum Computing" for review.', unread: true },
    { id: 2, type: 'success', title: 'New User Registered', time: '1 hour ago', desc: 'A new author "Sarah Smith" has joined the platform.', unread: true },
    { id: 3, type: 'warning', title: 'Server Alert', time: '5 hours ago', desc: 'Storage capacity reaching 90%. Please consider upgrading.', unread: false },
    { id: 4, type: 'danger', title: 'Article Rejected', time: 'Yesterday', desc: 'Your article "Crypto Trends" was rejected by Admin.', unread: false }
  ]);

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = document.querySelector('.admin-content')?.scrollTop > 10;
      setScrolled(isScrolled);
    };
    document.querySelector('.admin-content')?.addEventListener('scroll', handleScroll);
    return () => document.querySelector('.admin-content')?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1024) setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle style={{ color: '#10b881' }} />;
      case 'warning': return <FiAlertCircle style={{ color: '#f59e0b' }} />;
      default: return <FiInfo style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div className="admin-layout modern-saas-theme">
      {/* Mobile Backdrop */}
      {window.innerWidth <= 1024 && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar premium-sidebar-saas ${sidebarOpen ? 'mobile-open' : 'collapsed'}`}>
        <div className="sidebar-brand-saas">
          <div className="brand-icon-box">
            <FiZap size={24} />
          </div>
          <span className="brand-name-saas">MEDNEXT</span>
        </div>

        <nav className="admin-nav custom-scrollbar">
          <NavLink to="/admin/dashboard" className="nav-link-saas">
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/notifications" className="nav-link-saas">
            <FiBell className="nav-icon" />
            <span>Notifications</span>
          </NavLink>
          <NavLink to="/admin/posts" className="nav-link-saas">
            <FiFileText className="nav-icon" />
            <span>Manage Posts</span>
          </NavLink>
          <NavLink to="/admin/upload" className="nav-link-saas">
            <FiUpload className="nav-icon" />
            <span>Upload Content</span>
          </NavLink>
          <NavLink to="/admin/categories" className="nav-link-saas">
            <FiFolder className="nav-icon" />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/admin/users" className="nav-link-saas">
            <FiUsers className="nav-icon" />
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/settings" className="nav-link-saas">
            <FiSettings className="nav-icon" />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-link-saas logout-btn" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
            <FiLogOut className="nav-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className={`admin-top-bar premium-topbar-saas ${scrolled ? 'scrolled' : ''}`}>
          <div className="top-bar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          <div className="global-search-saas">
            <FiSearch />
            <input type="text" placeholder="Search analytics, users, or posts..." />
          </div>


          <div className="top-bar-actions">
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <button 
                className="notification-box-saas"
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              >
                <FiBell />
                <span className="notification-dot"></span>
              </button>

              {notificationsOpen && (
                <div className="dropdown-panel animate-slideUp" style={{ right: 0, width: '400px', padding: 0 }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Notifications</h3>
                      <span style={{ background: '#3b82f6', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                        {notifications.length} NEW
                      </span>
                    </div>
                    <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Clear All</button>
                  </div>
                  <div className="custom-scrollbar" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      <div className="notification-list">
                        {notifications.map(n => (
                          <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                            <div className={`notification-icon-wrap text-${n.type === 'info' ? 'primary' : n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'danger'}`}>
                              {getIcon(n.type)}
                            </div>
                            <div className="notification-content">
                              <div className="notification-header">
                                <h4 className="notification-title">
                                  {n.title}
                                  {n.unread && <span className="unread-dot"></span>}
                                </h4>
                                <span className="notification-time">
                                  <FiClock size={12} />
                                  {n.time}
                                </span>
                              </div>
                              <p className="notification-message">{n.message || n.desc || 'New event received in the system.'}</p>
                            </div>
                            <div className="notification-actions">
                              <button className="btn-icon" title="Delete Notification" onClick={(e) => { e.stopPropagation(); /* delete logic */ }}>
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                        <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#cbd5e1' }}>
                          <FiBell size={32} />
                        </div>
                        <h4 style={{ margin: '0 0 4px', color: '#475569', fontWeight: 800 }}>All caught up!</h4>
                        <p style={{ fontSize: '13px', margin: 0 }}>No new notifications for now.</p>
                      </div>
                    )}
                  </div>
                  <NavLink to="/admin/notifications" style={{ display: 'block', padding: '18px', textAlign: 'center', fontSize: '13px', fontWeight: 800, color: '#3b82f6', textDecoration: 'none', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                    View All Notifications
                  </NavLink>
                </div>
              )}

            </div>

            <div className="profile-wrapper" style={{ position: 'relative' }}>
              <div 
                className="profile-pill-saas"
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
              >
                <div className="avatar-box-saas">
                  {user?.name?.charAt(0)}
                </div>
                <div className="profile-info-saas">
                  <span className="profile-name-saas">{user?.name}</span>
                  <span className="profile-role-saas">Administrator</span>
                </div>
              </div>

              {profileOpen && (
                <div className="dropdown-panel animate-slideUp" style={{ right: 0, width: '220px' }}>
                  <NavLink to="/admin/settings" className="dropdown-item">
                    <FiSettings /> Account Settings
                  </NavLink>
                  <button onClick={handleLogout} className="dropdown-item logout" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-content custom-scrollbar">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="posts" element={<AdminArticles />} />
            <Route path="moderation" element={<PendingQueue />} />
            <Route path="upload" element={<ArticleEditor />} />
            <Route path="upload/:id" element={<ArticleEditor />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
