import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiSend, FiArrowLeft } from 'react-icons/fi';
import { authAPI } from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await authAPI.forgotPassword({ email });
      setSuccessMsg(response.data.message);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p className="subtitle">Enter your email and we'll send you a link to reset your password.</p>

        {errorMsg && (
          <div className="toast-error" style={{
            position: 'static', animation: 'none', padding: '12px 16px',
            borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 14
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(39, 174, 96, 0.1)', color: 'var(--success)',
            padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 14,
            border: '1px solid rgba(39, 174, 96, 0.2)'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: 42 }}
                id="forgot-email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: 20, height: 20, margin: 0, borderWidth: 2 }} /> : <><FiSend /> Send Reset Link</>}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: 24 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
