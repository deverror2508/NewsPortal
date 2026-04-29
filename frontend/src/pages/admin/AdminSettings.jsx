import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSettings, FiUser, FiGlobe, FiLock, FiBell, FiShield, 
  FiSave, FiCheckCircle, FiAlertCircle, FiChevronRight,
  FiEye, FiEyeOff, FiActivity, FiTarget, FiSmartphone, FiMail
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, authAPI, settingsAPI } from '../../api';

const AdminSettings = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);

  // System State
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'NewsPortal',
    siteDescription: '',
    maintenanceMode: false,
    allowRegistration: true,
    contactEmail: ''
  });

  // Notifications State (Mock for now or can be added to user meta)
  const [notifPrefs, setNotifPrefs] = useState({
    emailOnSubmission: true,
    emailOnApproval: true,
    browserAlerts: true,
    weeklyDigest: false
  });

  useEffect(() => {
    if (activeTab === 'system') {
      fetchSystemSettings();
    }
  }, [activeTab]);

  const fetchSystemSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getSettings();
      setSystemSettings(res.data.data);
    } catch (err) {
      showToast('Failed to load system settings', 'error');
    }
    setLoading(false);
  };

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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      showToast('Password changed successfully! Logging out...', 'success');
      
      // Clear passwords
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Redirect after short delay
      setTimeout(() => {
        logout();
        navigate('/login', { 
          state: { message: 'Password changed successfully, please login again' },
          replace: true 
        });
      }, 2000);
      
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
      setLoading(false);
    }
  };

  const handleSystemUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.updateSettings(systemSettings);
      showToast('System settings updated!', 'success');
    } catch (err) {
      showToast('Failed to update system settings', 'error');
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

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Platform Settings</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Configure system-wide preferences and identity parameters.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
        {/* Navigation Sidebar */}
        <div className="saas-card" style={{ padding: '12px', height: 'fit-content' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                marginBottom: '2px'
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <FiChevronRight style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="saas-card" style={{ padding: '24px' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'white' }}>
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Profile Identity</h3>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Update your personal details and public profile.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input"
                    disabled
                    value={profileData.email}
                    style={{ padding: '8px 12px', fontSize: '14px', background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Bio / Description</label>
                <textarea 
                  className="form-input"
                  rows="2" 
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  style={{ padding: '8px 12px', fontSize: '14px', resize: 'none' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={loading} className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'system' && (
            <form onSubmit={handleSystemUpdate} className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <FiGlobe />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>System Configuration</h3>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Manage site-wide settings and SEO parameters.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Site Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Contact Email</label>
                  <input 
                    type="email" 
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, contactEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Site Description</label>
                <textarea 
                  className="form-input"
                  rows="2" 
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                  style={{ padding: '8px 12px', fontSize: '14px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="maint-mode"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="maint-mode" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Maintenance Mode</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="allow-reg"
                    checked={systemSettings.allowRegistration}
                    onChange={(e) => setSystemSettings({...systemSettings, allowRegistration: e.target.checked})}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="allow-reg" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Allow Registration</label>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={loading} className="btn-glow" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  {loading ? 'Saving...' : <><FiSave /> Update System</>}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <FiLock />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Security Protocol</h3>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Manage your credentials and authentication settings.</p>
                </div>
              </div>

              <div style={{ maxWidth: '440px' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPass ? "text" : "password"} 
                      className="form-input"
                      required
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>New Password</label>
                  <input 
                    type="password" 
                    className="form-input"
                    required
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ marginBottom: '4px', fontSize: '13px' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-input"
                    required
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  />
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" disabled={loading} className="btn-glow" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <FiBell />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Alert Preferences</h3>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Control platform alerts and email notifications.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'emailOnSubmission', label: 'Email on submission', icon: <FiMail />, desc: 'Alerts for new article submissions.' },
                  { id: 'emailOnApproval', label: 'Email on approval', icon: <FiCheckCircle />, desc: 'Confirmation when articles go live.' },
                  { id: 'browserAlerts', label: 'Browser notifications', icon: <FiActivity />, desc: 'Real-time dashboard alerts.' },
                  { id: 'weeklyDigest', label: 'Weekly digest', icon: <FiTarget />, desc: 'Summary of site performance.' }
                ].map((pref) => (
                  <div key={pref.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                        {pref.icon}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{pref.label}</h4>
                        <p style={{ margin: '0', fontSize: '11px', color: '#94a3b8' }}>{pref.desc}</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setNotifPrefs({...notifPrefs, [pref.id]: !notifPrefs[pref.id]})}
                      style={{ 
                        width: '40px', 
                        height: '22px', 
                        borderRadius: '11px', 
                        background: notifPrefs[pref.id] ? '#3b82f6' : '#e2e8f0',
                        padding: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: notifPrefs[pref.id] ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;


