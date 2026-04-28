import { FiSettings } from 'react-icons/fi';

const AdminSettings = () => {
  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>Settings</h1>
        <p className="page-subtitle" style={{ fontSize: '15px', color: '#64748b' }}>Configure application settings and preferences.</p>
      </div>
      <div className="saas-card" style={{ padding: 40, textAlign: 'center' }}>
        <FiSettings size={64} style={{ color: '#e2e8f0', margin: '0 auto 24px', animation: 'spin 4s linear infinite' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Global Settings</h2>
        <p style={{ color: '#64748b', maxWidth: 400, margin: '16px auto', fontSize: '14px', lineHeight: 1.6 }}>
          This module is under construction. It will contain options to manage site configurations, SEO metadata, and email templates.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
