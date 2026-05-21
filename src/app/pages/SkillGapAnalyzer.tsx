import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { Layout } from '../components/Layout';
import { careerService } from '../services/api';
import { ArrowLeft, Target, BookOpen, CheckCircle } from 'lucide-react';

export function SkillGapAnalyzer() {
  const { careerId } = useParams();
  const [career, setCareer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!careerId) return;
    careerService.getCareerById(careerId)
      .then(data => { setCareer(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [careerId]);

  const allSkills = useMemo(() => {
    if (!career || !career.roadmap) return [];
    const skillsSet = new Set<string>();
    const periods = ['sixMonths', 'oneYear', 'twoYears'];
    periods.forEach(period => {
      career.roadmap[period]?.forEach((step: any) => {
        step.skills?.forEach((skill: string) => skillsSet.add(skill));
      });
    });
    return Array.from(skillsSet);
  }, [career]);

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!career) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Career not found</h2>
        </div>
      </Layout>
    );
  }

  const progressPercentage = allSkills.length > 0 ? Math.round((selectedSkills.length / allSkills.length) * 100) : 0;
  const missingSkills = allSkills.filter(s => !selectedSkills.includes(s));

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <Link to={-1 as any} style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back
          </Link>
          <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Skill Gap Analyzer</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>Track your readiness for {career.title}</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
          {/* Left Column: Skill Checklist */}
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Target style={{ width: 20, height: 20, color: 'var(--accent)' }} /> Required Skills
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
              Select the skills you already possess to see your career readiness score.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {allSkills.map(skill => (
                <label key={skill} className={`option-card ${selectedSkills.includes(skill) ? 'option-card-selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleToggleSkill(skill)}
                  />
                  <span className="option-card-label">{skill}</span>
                  {selectedSkills.includes(skill) && <CheckCircle style={{ width: 16, height: 16 }} className="option-card-check" />}
                </label>
              ))}
            </div>
          </div>

          {/* Right Column: Progress and Missing Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 100, height: 'max-content' }}>
            <div className="card">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                <div className="match-score" style={{ fontSize: '3.5rem' }}>{progressPercentage}%</div>
                <div className="match-score-label">Career Readiness Score</div>
              </div>
              <div className="progress-track" style={{ height: 8, marginBottom: 'var(--space-4)' }}>
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                You have {selectedSkills.length} out of {allSkills.length} required skills.
              </p>
            </div>

            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <BookOpen style={{ width: 20, height: 20, color: 'var(--accent)' }} /> Skills to Learn ({missingSkills.length})
              </h3>
              {missingSkills.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--success)', fontWeight: 'var(--font-semibold)' }}>
                  You have all the required skills!
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {missingSkills.map(skill => (
                    <span key={skill} className="tag">{skill}</span>
                  ))}
                </div>
              )}
              {missingSkills.length > 0 && (
                <div style={{ marginTop: 'var(--space-6)' }}>
                  <Link to="/resources" className="btn btn-secondary" style={{ width: '100%' }}>
                    Find Learning Resources
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
