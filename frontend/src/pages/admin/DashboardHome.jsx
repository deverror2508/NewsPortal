import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiFileText, FiClock, FiUsers, FiFolder, FiPlus, 
  FiTrendingUp, FiTrendingDown, FiActivity, FiArrowRight, FiZap, FiTarget, FiMessageSquare, FiUserPlus
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { articlesAPI, categoriesAPI, usersAPI } from '../../api';

const DashboardHome = () => {
  const [stats, setStats] = useState({ users: 0, articles: 0, pending: 0, categories: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [usersRes, articlesRes, pendingRes, catsRes, recentArticlesRes] = await Promise.all([
          usersAPI.getAll({ limit: 1 }),
          articlesAPI.getAllAdmin({ limit: 1 }),
          articlesAPI.getPending(),
          categoriesAPI.getAll(),
          articlesAPI.getAllAdmin({ limit: 5 }) // Fetch 5 most recent articles
        ]);
        
        setStats({
          users: usersRes.data.pagination.total || 0,
          articles: articlesRes.data.pagination.total || 0,
          pending: pendingRes.data.data.length || 0,
          categories: catsRes.data.data.length || 0
        });

        // Map articles to activity format
        const activities = recentArticlesRes.data.data.map(article => ({
          id: article._id,
          icon: article.status === 'published' ? <FiZap /> : <FiClock />,
          color: article.status === 'published' ? '#10b881' : '#f59e0b',
          title: article.status === 'published' ? 'Article Published' : 'New Submission',
          time: formatDistanceToNow(new Date(article.createdAt), { addSuffix: true }),
          desc: `"${article.title}" by ${article.author?.name || 'Unknown'}`
        }));

        setRecentActivity(activities);

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
      setLoading(false);
    };
    fetchDashboardData();
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
            <h3 className="stat-value-saas">{loading ? '...' : stats.articles}</h3>
            <span className="stat-label-saas">Total Articles</span>
          </div>
        </div>

        <div className="saas-card stat-card-saas warning animate-lift" style={{ transitionDelay: '0.1s' }}>
          <div className="stat-header-saas">
            <div className="stat-icon-saas orange"><FiClock /></div>
            <div className="stat-trend-saas down"><FiTrendingDown /> 2%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{loading ? '...' : stats.pending}</h3>
            <span className="stat-label-saas">Pending Review</span>
          </div>
        </div>

        <div className="saas-card stat-card-saas success animate-lift" style={{ transitionDelay: '0.2s' }}>
          <div className="stat-header-saas">
            <div className="stat-icon-saas green"><FiUsers /></div>
            <div className="stat-trend-saas up"><FiTrendingUp /> 8%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{loading ? '...' : stats.users}</h3>
            <span className="stat-label-saas">Active Authors</span>
          </div>
        </div>

        <div className="saas-card stat-card-saas danger animate-lift" style={{ transitionDelay: '0.3s' }}>
          <div className="stat-header-saas">
            <div className="stat-icon-saas red"><FiFolder /></div>
            <div className="stat-trend-saas up"><FiTrendingUp /> 4%</div>
          </div>
          <div className="stat-info-saas">
            <h3 className="stat-value-saas">{loading ? '...' : stats.categories}</h3>
            <span className="stat-label-saas">Taxonomy Units</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-saas">
        <div className="saas-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900 }}>Recent Activity</h3>
            <NavLink to="/admin/posts" className="btn-glow" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#475569', cursor: 'pointer', textDecoration: 'none' }}>View All</NavLink>
          </div>
          
          <div className="activity-list">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading activity stream...</div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="activity-item">
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
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No recent activity found.</div>
            )}
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
            <NavLink to="/admin/posts" className="action-card-saas">
              <div className="action-icon-saas" style={{ color: '#f59e0b' }}><FiTarget /></div>
              <div className="action-info-saas">
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Manage Posts</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Review submissions</p>
              </div>
              <FiArrowRight style={{ marginLeft: 'auto', color: '#cbd5e1' }} />
            </NavLink>
            <NavLink to="/admin/users" className="action-card-saas">
              <div className="action-icon-saas" style={{ color: '#10b881' }}><FiUserPlus /></div>
              <div className="action-info-saas">
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Manage Users</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Roles & access control</p>
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

