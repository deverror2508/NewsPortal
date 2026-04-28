import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiRss } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Gradient top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: 'linear-gradient(90deg, var(--accent) 0%, #5BC0EB 50%, var(--primary-light) 100%)',
      }} />

      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <div className="footer-brand">
              News<span>Portal</span>
            </div>
            <p style={{ marginBottom: 20 }}>
              Your trusted source for curated news across technology, sports, politics,
              business, and more. Stay informed with quality journalism.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { Icon: FiTwitter,  href: '#', label: 'Twitter'  },
                { Icon: FiGithub,   href: '#', label: 'GitHub'   },
                { Icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                { Icon: FiRss,      href: '#', label: 'RSS Feed' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.65)',
                    transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4>Categories</h4>
            <div className="footer-links">
              <Link to="/search?category=technology">Technology</Link>
              <Link to="/search?category=sports">Sports</Link>
              <Link to="/search?category=politics">Politics</Link>
              <Link to="/search?category=business">Business</Link>
              <Link to="/search?category=entertainment">Entertainment</Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/">Latest News</Link>
              <Link to="/search">Search</Link>
              <Link to="/register">Join Us</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4>Company</h4>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>&copy; {new Date().getFullYear()} NewsPortal. All rights reserved.</span>
          <span style={{ fontSize: 12, opacity: 0.5 }}>Built with ❤️ for quality journalism</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
