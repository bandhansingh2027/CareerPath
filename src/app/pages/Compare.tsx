import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { careerService, compareService } from '../services/api';
import { Layout } from '../components/Layout';

export function Compare() {
  const [allCareers, setAllCareers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['', '']);
  const [compared, setCompared] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    careerService.getCareers().then(setAllCareers).catch(() => {});
  }, []);

  const handleSelect = (index: number, id: string) => {
    const newIds = [...selectedIds];
    newIds[index] = id;
    setSelectedIds(newIds);
    setCompared(null);
  };

  const handleCompare = () => {
    const valid = selectedIds.filter(Boolean);
    if (valid.length < 2) return;
    setIsLoading(true);
    compareService.compare(valid)
      .then(d => { setCompared(d); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  };

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-10) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>Compare Careers</h1>
          <p style={{ maxWidth: 600, margin: '0 auto', color: 'var(--text-secondary)' }}>
            See a side-by-side comparison of two career paths to help you decide
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Selectors */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
          {[0, 1].map(idx => (
            <div key={idx} className="card">
              <label className="form-label">Career {idx + 1}</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="form-input"
                  value={selectedIds[idx]}
                  onChange={e => handleSelect(idx, e.target.value)}
                  style={{ appearance: 'none', paddingRight: 36 }}
                >
                  <option value="">Select a career...</option>
                  {allCareers.map(c => (
                    <option key={c.id} value={c.id} disabled={selectedIds.includes(c.id) && selectedIds[idx] !== c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <ChevronDown style={{ width: 16, height: 16, position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCompare}
            disabled={!selectedIds[0] || !selectedIds[1] || isLoading}
            style={!selectedIds[0] || !selectedIds[1] ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          >
            {isLoading ? 'Comparing...' : 'Compare Now'}
          </button>
        </div>

        {/* Comparison Table */}
        {compared && compared.length >= 2 && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)', width: '25%' }}>Criteria</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 'var(--font-semibold)' }}>{compared[0].title}</th>
                  <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 'var(--font-semibold)' }}>{compared[1].title}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Category', a: compared[0].category, b: compared[1].category },
                  { label: 'Demand Level', a: compared[0].demandLevel, b: compared[1].demandLevel },
                  { label: 'Tier 2/3 Opportunities', a: compared[0].tier2Tier3Opportunities, b: compared[1].tier2Tier3Opportunities },
                  { label: 'Entry Salary', a: compared[0].salaryEntry, b: compared[1].salaryEntry },
                  { label: 'Mid Salary', a: compared[0].salaryMid, b: compared[1].salaryMid },
                  { label: 'Senior Salary', a: compared[0].salarySenior, b: compared[1].salarySenior },
                  { label: 'Job Roles', a: compared[0].jobRoles?.length + ' roles', b: compared[1].jobRoles?.length + ' roles' },
                  { label: 'Free Courses', a: compared[0].courses?.length + ' courses', b: compared[1].courses?.length + ' courses' },
                  { label: 'Certifications', a: compared[0].certifications?.length + ' available', b: compared[1].certifications?.length + ' available' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>{row.label}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-primary)' }}>{row.a}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-primary)' }}>{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
              {compared.map((c, i) => (
                <Link key={i} to={`/career/${c.id}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  View {c.title} Details <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {!compared && (
          <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-muted)' }}>
            <p>Select two careers above and click "Compare Now" to see a side-by-side comparison</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
