import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message sent successfully! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-alt) 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
          Have a tip, a question, or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="container section">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            {/* Contact Info */}
            <div>
              <div className="card" style={{ padding: 40, height: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>Get in Touch</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Our team is ready to answer all your questions.</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'transform 0.2s ease' }} className="contact-item">
                  <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', padding: 12, borderRadius: 12, color: 'white', boxShadow: '0 4px 12px rgba(46,134,171,0.2)' }}>
                    <FiMail size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>Email Us</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>support@newsportal.com</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>press@newsportal.com</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'transform 0.2s ease' }} className="contact-item">
                  <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', padding: 12, borderRadius: 12, color: 'white', boxShadow: '0 4px 12px rgba(26,60,94,0.2)' }}>
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>Call Us</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>+1 (555) 123-4567</p>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: 13 }}>Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'transform 0.2s ease' }} className="contact-item">
                  <div style={{ background: 'linear-gradient(135deg, var(--success), #2ecc71)', padding: 12, borderRadius: 12, color: 'white', boxShadow: '0 4px 12px rgba(39,174,96,0.2)' }}>
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>Office</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>123 Journalism Way<br />New York, NY 10001<br />United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="card" style={{ padding: 40 }} onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 24, fontSize: 24 }}>Send a Message</h3>
                
                {status && (
                  <div className="animate-slide" style={{ background: 'rgba(39,174,96,0.1)', borderLeft: '4px solid var(--success)', color: 'var(--success)', padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 24, fontSize: 14 }}>
                    {status}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Full Name</label>
                  <input type="text" className="form-input" required placeholder="John Doe" style={{ background: 'var(--bg-alt)' }} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</label>
                  <input type="email" className="form-input" required placeholder="john@example.com" style={{ background: 'var(--bg-alt)' }} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Message</label>
                  <textarea className="form-input" rows="5" required placeholder="How can we help you?" style={{ background: 'var(--bg-alt)' }}></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 8 }}>
                  <FiSend /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
