import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Target, Menu, X, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BackgroundPatterns } from './BackgroundPatterns';
import { Chatbot } from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export function Layout({ children, showNav = true, showFooter = true }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    const user = localStorage.getItem('careerpath_currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      <BackgroundPatterns />
      {showNav && (
        <nav className="nav">
          <div className="nav-inner">
            <Link to="/" className="nav-brand">
              <Target />
              <span>CareerPath</span>
            </Link>
            <div className="nav-actions desktop-only">
              <Link to="/careers" className="btn btn-ghost btn-sm">Careers</Link>
              <Link to="/resources" className="btn btn-ghost btn-sm">Resources</Link>
              <Link to="/compare" className="btn btn-ghost btn-sm">Compare</Link>
              <Link to="/resume-analyzer" className="btn btn-ghost btn-sm">Resume Match</Link>
              <Link to="/study-plan" className="btn btn-ghost btn-sm">Study Plan</Link>
              <ThemeToggle />
              {currentUser ? (
                <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User style={{ width: 14, height: 14 }} /> Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary btn-sm">Login</Link>
              )}
            </div>

            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ThemeToggle />
              <button className="btn btn-icon" onClick={() => setIsMenuOpen(true)}>
                <Menu />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Sidebar overlay */}
      {isMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <div className="nav-brand" style={{ color: 'var(--text-primary)' }}>
                <Target />
                <span>CareerPath</span>
              </div>
              <button className="btn btn-icon" onClick={() => setIsMenuOpen(false)}>
                <X />
              </button>
            </div>
            <div className="sidebar-links">
              <Link to="/careers" className="btn btn-ghost">Careers</Link>
              <Link to="/resources" className="btn btn-ghost">Resources</Link>
              <Link to="/compare" className="btn btn-ghost">Compare</Link>
              <Link to="/resume-analyzer" className="btn btn-ghost">Resume Match</Link>
              <Link to="/study-plan" className="btn btn-ghost">Study Plan</Link>
              <div style={{ display: 'flex', padding: 'var(--space-2) var(--space-4)' }}>
                <ThemeToggle />
              </div>
              {currentUser ? (
                <Link to="/dashboard" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <User style={{ width: 16, height: 16 }} /> Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <Chatbot />

      {showFooter && (
        <footer className="footer">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/careers" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Careers</Link>
              <Link to="/resources" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Resources</Link>
              <Link to="/compare" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Compare</Link>
              <Link to="/quiz" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Take Quiz</Link>
              <Link to="/feedback" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Feedback Form</Link>
              <Link to="/about" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>About</Link>
            </div>
            <p>© 2026 CareerPath Recommender — Built for Tier 2/3 Students</p>
            <p>Built by Bandhan Singh</p>
          </div>
        </footer>
      )}
    </div>
  );
}

