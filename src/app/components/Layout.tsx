import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Target, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BackgroundPatterns } from './BackgroundPatterns';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export function Layout({ children, showNav = true, showFooter = true }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
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
              <Link to="/about" className="btn btn-ghost btn-sm">About</Link>
              <ThemeToggle />
              <Link to="/quiz" className="btn btn-primary btn-sm">Start Quiz</Link>
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
              <Link to="/about" className="btn btn-ghost">About</Link>
              <div style={{ display: 'flex', padding: 'var(--space-2) var(--space-4)' }}>
                <ThemeToggle />
              </div>
              <Link to="/quiz" className="btn btn-primary">Start Quiz</Link>
            </div>
          </div>
        </div>
      )}

      <main style={{ flex: 1 }}>
        {children}
      </main>

      {showFooter && (
        <footer className="footer">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/careers" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Careers</Link>
              <Link to="/resources" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Resources</Link>
              <Link to="/compare" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Compare</Link>
              <Link to="/quiz" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Take Quiz</Link>
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
