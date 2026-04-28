import React from 'react';

const TermsOfService = () => {
  return (
    <div className="animate-fade">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-alt) 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Terms of Service</h1>
        <div style={{ display: 'inline-block', background: 'rgba(46,134,171,0.1)', color: 'var(--accent)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ maxWidth: 800, margin: '0 auto', padding: '50px 60px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: 16, fontSize: 18, color: 'var(--text-primary)', fontWeight: 500 }}>
              Welcome to NewsPortal. These terms and conditions outline the rules and regulations for the use of NewsPortal's Website.
            </p>
            <p style={{ marginBottom: 32 }}>
              By accessing this website we assume you accept these terms and conditions. Do not continue to use NewsPortal if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>1. License</h3>
            <p style={{ marginBottom: 16 }}>
              Unless otherwise stated, NewsPortal and/or its licensors own the intellectual property rights for all material on NewsPortal. All intellectual property rights are reserved. You may access this from NewsPortal for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p style={{ marginBottom: 16, fontWeight: 500, color: 'var(--text-primary)' }}>You must not:</p>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 32 }}>
              {[
                'Republish material from NewsPortal',
                'Sell, rent or sub-license material from NewsPortal',
                'Reproduce, duplicate or copy material from NewsPortal',
                'Redistribute content from NewsPortal'
              ].map((item, i) => (
                <li key={i} style={{ marginBottom: 12, position: 'relative', paddingLeft: 24 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--danger)' }}>×</span> {item}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>2. User Comments</h3>
            <p style={{ marginBottom: 16 }}>
              Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. NewsPortal does not filter, edit, publish or review Comments prior to their presence on the website. Comments reflect the views and opinions of the person who post their views and opinions.
            </p>
            <p style={{ marginBottom: 32, background: 'rgba(243,156,18,0.1)', padding: 16, borderRadius: 8, borderLeft: '4px solid var(--warning)' }}>
              NewsPortal reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
            </p>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>3. Content Liability</h3>
            <p style={{ marginBottom: 32 }}>
              We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>

            <h3 style={{ fontSize: 22, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)', borderBottom: '2px solid var(--bg-alt)', paddingBottom: 8 }}>4. Disclaimer</h3>
            <p style={{ marginBottom: 16 }}>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
            </p>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 32 }}>
              {[
                'Limit or exclude our or your liability for death or personal injury;',
                'Limit or exclude our or your liability for fraud or fraudulent misrepresentation;',
                'Limit any of our or your liabilities in any way that is not permitted under applicable law;',
                'Exclude any of our or your liabilities that may not be excluded under applicable law.'
              ].map((item, i) => (
                <li key={i} style={{ marginBottom: 12, position: 'relative', paddingLeft: 24 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
