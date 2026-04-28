import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiFileText, FiClock, FiUsers, FiFolder, FiPlus, 
  FiTrendingUp, FiTrendingDown, FiActivity, FiArrowRight, FiZap, FiTarget, FiMessageSquare
} from 'react-icons/fi';
import { articlesAPI, categoriesAPI, usersAPI } from '../../api';

const DashboardHome = () => {
  const [stats, setStats] = useState({ users: 0, articles: 0, pending: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersRes, articlesRes, pendingRes, catsRes] = await Promise.all([
          usersAPI.getAll({ limit: 1 }),
          articlesAPI.getAllAdmin({ limit: 1 }),
          articlesAPI.getPending(),
          categoriesAPI.getAll()
        ]);
        
        setStats({
          users: usersRes.data.pagination.total || 0,
          articles: articlesRes.data.pagination.total || 0,
          pending: pendingRes.data.data.length || 0,
          categories: catsRes.data.data.length || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>Command Center</h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Strategic overview of your medical news ecosystem.</p>
      </div>

      <div className="stats-grid-saas">
        <div className="saas-card stat-card-saas primary animate-lift">
          <div className="stat-header-saas">
            <div className="stat-icon-saas blue"><FiFileText /></div>
            <div className="stat-trend-saas up"><FiTrendingUp /> 12%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{stats.articles}</h3>
            <span className="stat-label-saas">Total Articles</span>
          </div>
        </div>

        <div className="saas-card stat-card-saas warning animate-lift" style={{ transitionDelay: '0.1s' }}>
          <div className="stat-header-saas">
            <div className="stat-icon-saas orange"><FiClock /></div>
            <div className="stat-trend-saas down"><FiTrendingDown /> 2%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{stats.pending}</h3>
            <span className="stat-label-saas">Pending Review</span>
          </div>
        </div>

        <div className="saas-card stat-card-saas success animate-lift" style={{ transitionDelay: '0.2s' }}>
          <div className="stat-header-saas">
            <div className="stat-icon-saas green"><FiUsers /></div>
            <div className="stat-trend-saas up"><FiTrendingUp /> 8%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{stats.users}</h3>
            <span className="stat-label-saas">Active Authors</span>
          </div>
        </div>

        <div className="saas-card stat-card-saas danger animate-lift" style={{ transitionDelay: '0.3s' }}>
          <div className="stat-header-saas">
            <div className="stat-icon-saas red"><FiFolder /></div>
            <div className="stat-trend-saas up"><FiTrendingUp /> 4%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{stats.categories}</h3>
            <span className="stat-label-saas">Taxonomy Units</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-saas">
        <div className="saas-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900 }}>Recent Activity</h3>
            <button className="btn-glow" style={{ background: '#ffffffff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>View All</button>
          </div>
          
          <div className="activity-list">
            {[
              { icon: <FiZap />, color: '#3b82f6', title: 'New article published', time: '2 mins ago', desc: 'Dr. Sarah just published "Advances in Cardiology".' },
              { icon: <FiUsers />, color: '#10b881', title: 'New author onboarded', time: '45 mins ago', desc: 'Michael Scott joined the editorial team.' },
              { icon: <FiMessageSquare />, color: '#f59e0b', title: 'Feedback received', time: '2 hours ago', desc: 'User requested more articles on mental health.' },
            ].map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon-box" style={{ background: `${item.color}10`, color: item.color }}>
                  {item.icon}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h4 className="activity-title">{item.title}</h4>
                    <span className="activity-time">{item.time}</span>
                  </div>
                  <p className="activity-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="side-panel-saas">
          <div className="saas-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 28px', fontSize: '20px', fontWeight: 900 }}>Quick Actions</h3>
            <NavLink to="/admin/upload" className="action-card-saas">
              <div className="action-icon-saas"><FiPlus /></div>
              <div className="action-info-saas">
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Draft Article</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Create new content unit</p>
              </div>
              <FiArrowRight style={{ marginLeft: 'auto', color: '#cbd5e1' }} />
            </NavLink>
            <NavLink to="/admin/moderation" className="action-card-saas">
              <div className="action-icon-saas" style={{ color: '#f59e0b' }}><FiTarget /></div>
              <div className="action-info-saas">
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Moderation</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Review submissions</p>
              </div>
              <FiArrowRight style={{ marginLeft: 'auto', color: '#cbd5e1' }} />
            </NavLink>
          </div>

          <div className="saas-card" style={{ padding: '32px', background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', color: 'white', border: 'none' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 900 }}>Pro Tip</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', lineHeight: 1.6, opacity: 0.9 }}>
              Articles with high-quality thumbnails get 40% more engagement. Remind authors to use 1200x800px images.
            </p>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '12px 24px', borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
