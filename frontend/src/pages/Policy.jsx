import React from 'react';

const Policy = () => {
  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-alt) 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Privacy Policy</h1>
        <div style={{ display: 'inline-block', background: 'rgba(46,134,171,0.1)', color: 'var(--accent)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ maxWidth: 800, margin: '0 auto', padding: '50px 60px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: 32, fontSize: 18, color: 'var(--text-primary)', fontWeight: 500 }}>
              At NewsPortal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by NewsPortal and how we use it.
            </p>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>1. Information We Collect</h3>
            <p style={{ marginBottom: 16 }}>
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 32 }}>
              <li style={{ marginBottom: 12, position: 'relative', paddingLeft: 24 }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span> If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us.</li>
              <li style={{ marginBottom: 12, position: 'relative', paddingLeft: 24 }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span> When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</li>
            </ul>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>2. How We Use Your Information</h3>
            <p style={{ marginBottom: 16 }}>We use the information we collect in various ways, including to:</p>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 32 }}>
              {[
                'Provide, operate, and maintain our website',
                'Improve, personalize, and expand our website',
                'Understand and analyze how you use our website',
                'Develop new products, services, features, and functionality',
                'Communicate with you, including for customer service, updates, and marketing',
                'Send you emails and prevent fraud'
              ].map((item, i) => (
                <li key={i} style={{ marginBottom: 12, position: 'relative', paddingLeft: 24 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span> {item}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>3. Log Files & Cookies</h3>
            <p style={{ marginBottom: 24 }}>
              NewsPortal follows a standard procedure of using log files. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            </p>
            <p style={{ marginBottom: 32 }}>
              Like any other website, NewsPortal uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience.
            </p>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>4. Contact Us</h3>
            <p style={{ marginBottom: 24, background: 'var(--bg-alt)', padding: 24, borderRadius: 8, borderLeft: '4px solid var(--primary)' }}>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <strong>support@newsportal.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
