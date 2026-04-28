import { useState } from 'react';
import PendingQueue from './PendingQueue';
import AdminArticles from './AdminArticles';

const ManagePosts = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title">Content Management</h1>
        <p className="page-subtitle">Moderate submissions and manage published articles.</p>
      </div>

      <div className="tab-navigation" style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border-light)', marginBottom: 32 }}>
        <button 
          className={`tab-link ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
          style={{ 
            padding: '12px 4px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'all' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          All Articles
        </button>
        <button 
          className={`tab-link ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
          style={{ 
            padding: '12px 4px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Pending Queue
        </button>
      </div>

      {activeTab === 'all' ? <AdminArticles /> : <PendingQueue />}
    </div>
  );
};

export default ManagePosts;
