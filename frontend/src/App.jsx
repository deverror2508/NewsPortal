import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleDetail from './pages/ArticleDetail';
import SearchResults from './pages/SearchResults';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthorDashboard from './pages/author/AuthorDashboard';
import ArticleEditor from './pages/author/ArticleEditor';
import AdminPanel from './pages/admin/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import TermsOfService from './pages/TermsOfService';

const AppContent = () => {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // If admin is logged in, they see only the admin panel layout
  if (isAuthenticated && isAdmin) {
    return (
      <div className="app-wrapper admin-mode">
        <Routes>
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Policy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Author routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['author']}>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute roles={['author']}>
                <ArticleEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute roles={['author']}>
                <ArticleEditor />
              </ProtectedRoute>
            }
          />

          {/* Fallback for unauthenticated or non-admins trying to access /admin */}
          <Route path="/admin/*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h1 style={{ fontSize: 80, fontWeight: 800, color: 'var(--text-light)' }}>404</h1>
                <h2 style={{ marginBottom: 8 }}>Page Not Found</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  The page you're looking for doesn't exist.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
