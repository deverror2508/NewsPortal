import { useState } from 'react';
import { 
  FiSettings, FiUser, FiGlobe, FiLock, FiBell, FiShield, 
  FiSave, FiCheckCircle, FiAlertCircle, FiChevronRight 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../api';

const AdminSettings = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await usersAPI.updateMe(profileData);
      setUser(res.data.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
    setLoading(false);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <FiUser /> },
    { id: 'system', label: 'System Config', icon: <FiGlobe /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'notifications', label: 'Alerts', icon: <FiBell /> }
  ];

  return (
    <div className="animate-fade">
      {toast && (
        <div className={`toast toast-${toast.type} animate-slideUp btn-glow`} style={{ zIndex: 1000 }}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.message}
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>Platform Settings</h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Configure system-wide preferences and identity parameters.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Navigation Sidebar */}
        <div className="saas-card" style={{ padding: '16px', height: 'fit-content' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                marginBottom: '4px'
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <FiChevronRight style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="saas-card" style={{ padding: '40px' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: '#475569' }}>
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Profile Identity</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Update your personal details and public profile.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={profileData.email}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#94a3b8', fontSize: '14px', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Bio / Description</label>
                <textarea 
                  rows="4" 
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={loading} className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'system' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  <FiGlobe />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>System Configuration</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Manage site-wide settings and SEO parameters.</p>
                </div>
              </div>

              <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                <FiShield size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Admin Only Module</h4>
                <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>This section is currently being synced with the backend environment.</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade" style={{ textAlign: 'center', padding: '80px 0' }}>
              <FiLock size={64} style={{ color: '#e2e8f0', marginBottom: '24px' }} />
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Security Protocol</h3>
              <p style={{ color: '#64748b', maxWidth: 400, margin: '16px auto', fontSize: '14px', lineHeight: 1.6 }}>
                Manage your credentials and two-factor authentication settings. 
                <br/>
                <span style={{ color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>Click here to reset password.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

