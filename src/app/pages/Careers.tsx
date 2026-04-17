import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { TrendingUp, ArrowRight, Search } from 'lucide-react';
import { careerService } from '../services/api';
import { Layout } from '../components/Layout';

export function Careers() {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    careerService.getCareers()
      .then(data => { setCareers(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const filtered = careers.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-10) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>Explore Career Paths</h1>
          <p style={{ maxWidth: 600, margin: '0 auto var(--space-6)', color: 'var(--text-secondary)' }}>
            Browse all available career paths with salary data, learning resources, and detailed roadmaps
          </p>
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <Search style={{ width: 18, height: 18, position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="form-input"
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 44 }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="grid-3">
          {filtered.map(career => (
            <Link key={career.id} to={`/career/${career.id}`} className="card card-interactive" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div className="card-title" style={{ flex: 1 }}>{career.title}</div>
                <span className={`badge ${career.demandLevel === 'High' ? 'badge-success' : 'badge-neutral'}`} style={{ flexShrink: 0 }}>
                  <TrendingUp style={{ width: 12, height: 12 }} />
                  {career.demandLevel}
                </span>
              </div>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                {career.category}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Entry Salary</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--accent)' }}>{career.salaryEntry}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>
                  View Details <ArrowRight style={{ width: 14, height: 14 }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-muted)' }}>
            <p>No careers found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
