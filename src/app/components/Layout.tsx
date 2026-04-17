import { Link } from 'react-router';
import { Target } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export function Layout({ children, showNav = true, showFooter = true }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showNav && (
        <nav className="nav">
          <div className="nav-inner">
            <Link to="/" className="nav-brand">
              <Target />
              <span>CareerPath</span>
            </Link>
            <div className="nav-actions">
              <Link to="/careers" className="btn btn-ghost btn-sm">Careers</Link>
              <Link to="/resources" className="btn btn-ghost btn-sm">Resources</Link>
              <Link to="/compare" className="btn btn-ghost btn-sm">Compare</Link>
              <Link to="/about" className="btn btn-ghost btn-sm">About</Link>
              <ThemeToggle />
              <Link to="/quiz" className="btn btn-primary btn-sm">Start Quiz</Link>
            </div>
          </div>
        </nav>
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
            <p>Team CODE TITANS | Innovathon 2026 | RRGI</p>
          </div>
        </footer>
      )}
    </div>
  );
}
