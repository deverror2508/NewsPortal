import React from 'react';
import { FiGlobe, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

const About = () => {
  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-alt) 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Empowering Minds with Truth
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            NewsPortal is your ultimate destination for breaking news, deep-dive journalism, and insightful analysis from around the globe.
          </p>
        </div>
      </div>

      <div className="container section">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          {/* Mission & Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginBottom: 80 }}>
            <div className="card" style={{ padding: 40, borderTop: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: 24, marginBottom: 16, color: 'var(--text-primary)' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                In an era of rapid information flow, finding a trustworthy source can be challenging. Our mission is to cut through the noise and deliver high-quality, verified, and objective news that matters. We believe that an informed public is the foundation of a healthy society.
              </p>
            </div>
            <div className="card" style={{ padding: 40, borderTop: '4px solid var(--accent)' }}>
              <h3 style={{ fontSize: 24, marginBottom: 16, color: 'var(--text-primary)' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                To build a globally recognized digital platform where journalism thrives on integrity, inclusivity, and innovation. We aim to inspire critical thinking by offering diverse perspectives on complex global issues.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>Why Choose Us</h2>
            <div style={{ width: 60, height: 4, background: 'var(--accent)', margin: '0 auto', borderRadius: 2 }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30, marginBottom: 80 }}>
            {[
              { icon: FiGlobe, title: 'Global Reach', desc: 'Covering stories from every corner of the world.' },
              { icon: FiShield, title: 'Verified Facts', desc: 'Rigorous fact-checking for every published article.' },
              { icon: FiTrendingUp, title: 'Deep Analysis', desc: 'Beyond the headlines: understanding the why.' },
              { icon: FiUsers, title: 'Community', desc: 'A platform driven by reader engagement and feedback.' }
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: 32, textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} 
                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: 60, height: 60, background: 'rgba(46,134,171,0.1)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <feature.icon size={28} />
                </div>
                <h4 style={{ fontSize: 18, marginBottom: 12 }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-light)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
