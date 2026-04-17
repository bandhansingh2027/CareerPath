import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ExternalLink, Search, BookOpen, Filter } from 'lucide-react';
import { resourceService } from '../services/api';
import { Layout } from '../components/Layout';

export function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    resourceService.getAll()
      .then(d => { setResources(d); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const levels = ['All', ...new Set(resources.map(r => r.level).filter(Boolean))];
  const categories = ['All', ...new Set(resources.map(r => r.category).filter(Boolean))];

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.careerTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || r.level === levelFilter;
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  if (isLoading) {
    return <Layout><div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div></Layout>;
  }

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-10) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>Free Learning Resources</h1>
          <p style={{ maxWidth: 600, margin: '0 auto var(--space-6)', color: 'var(--text-secondary)' }}>
            {resources.length} curated free courses and tutorials across all career paths
          </p>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <Search style={{ width: 18, height: 18, position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search resources..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: 44 }} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />

          <div className="tab-group" style={{ flex: 'none' }}>
            {levels.map(l => (
              <button key={l} className={`tab-item ${levelFilter === l ? 'tab-item-active' : ''}`} onClick={() => setLevelFilter(l)}>{l}</button>
            ))}
          </div>

          <div className="tab-group" style={{ flex: 'none' }}>
            {categories.map(c => (
              <button key={c} className={`tab-item ${categoryFilter === c ? 'tab-item-active' : ''}`} onClick={() => setCategoryFilter(c)}>
                {c === 'All' ? 'All Categories' : c.length > 15 ? c.slice(0, 15) + '...' : c}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} resources
          </span>
        </div>

        {/* Resource Grid */}
        <div className="grid-2">
          {filtered.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link" style={{ display: 'block' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span className="resource-title">{r.title}</span>
                  <ExternalLink style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                </div>
                <div className="resource-provider">{r.provider}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  <span className={`badge ${r.level === 'Beginner' ? 'badge-success' : r.level === 'Intermediate' ? 'badge-info' : 'badge-warning'}`}>{r.level}</span>
                  {r.duration && <span className="badge badge-neutral">{r.duration}</span>}
                  <Link to={`/career/${r.careerId}`} className="badge badge-accent" onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>{r.careerTitle}</Link>
                </div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-muted)' }}>
            <BookOpen style={{ width: 48, height: 48, margin: '0 auto var(--space-4)' }} />
            <p>No resources found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
