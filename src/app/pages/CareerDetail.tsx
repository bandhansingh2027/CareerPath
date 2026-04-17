import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft, TrendingUp, MapPin, DollarSign, BookOpen, Award,
  ExternalLink, Clock, CheckCircle, XCircle, Briefcase, GraduationCap
} from 'lucide-react';
import { careerService } from '../services/api';
import { Layout } from '../components/Layout';

export function CareerDetail() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState('sixMonths');

  useEffect(() => {
    if (!id) return;
    careerService.getCareerById(id)
      .then(data => { setCareer(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [id]);

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
          <div style={{ textAlign: 'center' }}>
            <h2>Career not found</h2>
            <Link to="/careers" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Browse Careers</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <Link to="/careers" style={{ color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> All Careers
          </Link>
          <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>{career.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 640 }}>{career.description}</p>

          <div className="grid-4" style={{ marginTop: 'var(--space-6)' }}>
            {[
              { icon: TrendingUp, label: 'Demand', value: career.demandLevel },
              { icon: MapPin, label: 'Tier 2/3', value: career.tier2Tier3Opportunities },
              { icon: DollarSign, label: 'Entry Salary', value: career.salaryEntry },
              { icon: Clock, label: 'Time to Start', value: '3–6 months' }
            ].map((m, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
                <m.icon style={{ width: 20, height: 20, color: 'var(--text-inverse)', margin: '0 auto var(--space-2)' }} />
                <div style={{ color: 'var(--text-inverse)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{m.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-xs)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="grid-2" style={{ gap: 'var(--space-8)' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 100, height: 'max-content' }}>

            {/* Job Roles */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Briefcase style={{ width: 20, height: 20, color: 'var(--accent)' }} /> Job Roles
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {career.jobRoles?.map((role, i) => <span key={i} className="tag tag-accent">{role}</span>)}
              </div>
            </div>

            {/* Salary */}
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Salary Progression</h3>
              {[
                { label: 'Entry Level', exp: '0–2 years', value: career.salaryEntry, bg: 'var(--success-bg)', color: 'var(--success)' },
                { label: 'Mid Level', exp: '2–5 years', value: career.salaryMid, bg: 'var(--info-bg)', color: 'var(--info)' },
                { label: 'Senior Level', exp: '5+ years', value: career.salarySenior, bg: 'var(--accent-bg)', color: 'var(--accent)' }
              ].map((s, i) => (
                <div key={i} className="salary-row" style={{ backgroundColor: s.bg }}>
                  <div>
                    <div className="salary-level">{s.label}</div>
                    <div className="salary-experience">{s.exp}</div>
                  </div>
                  <div className="salary-amount" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Pros & Cons */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <CheckCircle style={{ width: 20, height: 20, color: 'var(--success)' }} /> Pros
              </h3>
              <ul className="indicator-list">
                {career.pros?.map((p, i) => (
                  <li key={i}><span style={{ color: 'var(--success)' }}>+</span><span style={{ color: 'var(--text-secondary)' }}>{p}</span></li>
                ))}
              </ul>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 'var(--space-6) 0 var(--space-4)' }}>
                <XCircle style={{ width: 20, height: 20, color: 'var(--error)' }} /> Cons
              </h3>
              <ul className="indicator-list">
                {career.cons?.map((c, i) => (
                  <li key={i}><span style={{ color: 'var(--error)' }}>-</span><span style={{ color: 'var(--text-secondary)' }}>{c}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Roadmap */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <GraduationCap style={{ width: 20, height: 20, color: 'var(--accent)' }} /> Learning Roadmap
              </h3>
              <div className="tab-group" style={{ marginBottom: 'var(--space-6)' }}>
                {['sixMonths', 'oneYear', 'twoYears'].map(t => (
                  <button key={t} onClick={() => setActiveRoadmap(t)} className={`tab-item ${activeRoadmap === t ? 'tab-item-active' : ''}`}>
                    {t === 'sixMonths' ? '6 Months' : t === 'oneYear' ? '1 Year' : '2 Years'}
                  </button>
                ))}
              </div>
              <div className="timeline">
                {career.roadmap?.[activeRoadmap]?.map((m, i, arr) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-marker">
                      <div className="timeline-dot">{m.month}</div>
                      {i < arr.length - 1 && <div className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">{m.title}</div>
                      <div className="timeline-description">{m.description}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                        {m.skills?.map((s, j) => <span key={j} className="tag">{s}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <BookOpen style={{ width: 20, height: 20, color: 'var(--accent)' }} /> Free Learning Resources
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {career.courses?.map((course, i) => (
                  <a key={i} href={course.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="resource-title">{course.title}</span>
                        <ExternalLink style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0 }} />
                      </div>
                      <div className="resource-provider">{course.provider}</div>
                      <div className="resource-meta">
                        <span>{course.duration}</span>
                        <span className={`badge ${course.level === 'Beginner' ? 'badge-success' : course.level === 'Intermediate' ? 'badge-info' : 'badge-warning'}`}>{course.level}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Award style={{ width: 20, height: 20, color: 'var(--accent)' }} /> Certifications
              </h3>
              <ul className="indicator-list">
                {career.certifications?.map((cert, i) => (
                  <li key={i}>
                    <Award style={{ width: 14, height: 14, color: 'var(--accent)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-banner" style={{ marginTop: 'var(--space-8)' }}>
          <h3>Want to see if this career fits you?</h3>
          <p>Take our 5-minute quiz to get a personalized match score</p>
          <Link to="/quiz" className="btn btn-lg">Take the Quiz</Link>
        </div>
      </div>
    </Layout>
  );
}
