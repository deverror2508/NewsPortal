import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiLogOut, FiUser, FiEdit3, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, isAuthenticated, isAuthor, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            News<span>Portal</span>
          </Link>

          <form className="navbar-search" onSubmit={handleSearch}>
            <FiSearch className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
          </form>

          <div className="navbar-links">
            <NavLink to="/" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>

            {isAuthor && (
              <NavLink to="/dashboard" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`}>
                Admin
              </NavLink>
            )}

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <NotificationDropdown />
                <div style={{ position: 'relative' }}>
                  <div className="navbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="navbar-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                </div>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-light)',
                    minWidth: 200,
                    padding: 8,
                    zIndex: 100,
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                      <span className={`badge badge-${user.role === 'admin' ? 'danger' : user.role === 'author' ? 'accent' : 'neutral'}`} style={{ marginTop: 4 }}>
                        {user.role}
                      </span>
                    </div>
                    {isAuthor && (
                      <button className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14 }}
                        onClick={() => { navigate('/editor'); setDropdownOpen(false); }}>
                        <FiEdit3 /> New Article
                      </button>
                    )}
                    <button className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--danger)' }}
                      onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="hamburger" onClick={() => setMobileOpen(true)}>
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span className="navbar-brand" style={{ fontSize: 20 }}>News<span>Portal</span></span>
            <button className="hamburger" onClick={() => setMobileOpen(false)} style={{ display: 'block' }}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <input
              className="form-input"
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <NavLink to="/" className="navbar-link" onClick={() => setMobileOpen(false)}>Home</NavLink>
          {isAuthor && <NavLink to="/dashboard" className="navbar-link" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className="navbar-link" onClick={() => setMobileOpen(false)}>Admin Panel</NavLink>}

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 16, paddingTop: 16 }}>
            {isAuthenticated ? (
              <>
                <div style={{ padding: '8px 0', fontWeight: 600 }}>{user.name}</div>
                <button className="btn btn-danger" style={{ width: '100%', marginTop: 8 }} onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link to="/register" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
