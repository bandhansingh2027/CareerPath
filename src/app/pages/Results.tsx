import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  TrendingUp, MapPin, DollarSign, CheckCircle2, AlertTriangle,
  ArrowLeft, ArrowRight, Award, Briefcase, Calendar, Clock,
  Code, Sparkles, BookOpen, ChevronRight, BookmarkCheck
} from 'lucide-react';
import { quizService } from '../services/api';
import { Layout } from '../components/Layout';

export function Results() {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAnswers = sessionStorage.getItem('careerpath_answers');
    if (!savedAnswers) {
      navigate('/quiz');
      return;
    }

    quizService.submitAnswers(JSON.parse(savedAnswers))
      .then(data => {
        setTimeout(() => {
          if (data.recommendations?.length > 0) {
            setRoadmapData(data.recommendations[0]);
          } else {
            setError("No recommendations found.");
          }
          setIsLoading(false);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setTimeout(() => {
          setError("Something went wrong during roadmap generation.");
          setIsLoading(false);
        }, 1500);
      });
  }, [navigate]);

  if (isLoading) {
    return <ResultsLoadingState />;
  }

  if (error || !roadmapData) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <AlertTriangle style={{ width: 48, height: 48, color: 'var(--error)', margin: '0 auto var(--space-4)' }} />
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Onboarding Failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>{error}</p>
            <Link to="/quiz" className="btn btn-primary">Try Onboarding Flow</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { career, matchPercentage, matchReasons, matchedSkills, missingSkills, weeklyLearningPlan, monthlyMilestones, recommendedProjects } = roadmapData;

  const handleActivateRoadmap = () => {
    // Already initialized in Quiz.tsx, but make sure to update stats and notify
    const user = JSON.parse(localStorage.getItem('careerpath_currentUser') || '{}');
    user.studyPlanProgress = 5; // Start with 5% since they onboarded
    user.streakCount = 1;
    localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #0d9488 100%)',
        padding: 'var(--space-12) 0',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-6)', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '650px' }}>
            <div className="badge badge-accent" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)', marginBottom: 'var(--space-4)' }}>
              <Sparkles style={{ width: 12, height: 12 }} /> AI Recommended Roadmap
            </div>
            <h1 style={{ color: '#fff', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>{career.title}</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>
              {career.description}
            </p>
          </div>
          <div className="glass-card" style={{
            textAlign: 'center',
            minWidth: '180px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div className="match-score" style={{ color: '#fff', fontSize: '3.5rem' }}>{matchPercentage}%</div>
            <div className="match-score-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Profile Compatibility</div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-10) var(--space-6)' }}>
        
        {/* Onboarding Match Reasons & Quick Stats */}
        <div className="grid-3" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="card glass-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookmarkCheck style={{ color: 'var(--accent)' }} /> Why this path matches you
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2.5)', paddingLeft: 0, listStyle: 'none' }}>
              {matchReasons.map((reason: string, idx: number) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-sm)' }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Salary Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Entry Level</span>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>₹{career.salary_entry_min / 100000} - {career.salary_entry_max / 100000} LPA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Mid Career</span>
                <strong style={{ fontSize: 'var(--text-sm)' }}>₹{career.salary_mid_min / 100000} - {career.salary_mid_max / 100000} LPA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Senior Roles</span>
                <strong style={{ fontSize: 'var(--text-sm)' }}>₹{career.salary_senior_min / 100000} - {career.salary_senior_max / 100000} LPA</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: '10px', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
              <span>Tier 2/3 Friendly:</span>
              <strong style={{ color: 'var(--success)' }}>{career.tier2_tier3_opportunities}</strong>
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis Section */}
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase style={{ color: 'var(--accent)' }} /> Skill Gap Analysis
        </h2>
        <div className="grid-2" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="card glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
              <CheckCircle2 style={{ width: 18, height: 18 }} /> Current Core Strengths ({matchedSkills.length})
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              Skills matching your education background or specified interests:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {matchedSkills.map((s: string) => (
                <span key={s} className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(52, 211, 153, 0.1)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="card glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <h4 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
              <AlertTriangle style={{ width: 18, height: 18, color: 'var(--accent)' }} /> Missing Skills to Acquire ({missingSkills.length})
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              Target areas that will be prioritized in your study roadmap:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {missingSkills.map((s: string) => (
                <span key={s} className="badge" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid rgba(45, 212, 191, 0.1)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Timeline Section */}
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar style={{ color: 'var(--accent)' }} /> 6-Month Visual Roadmap Timeline
        </h2>
        <div className="card glass-card" style={{ padding: 'var(--space-8) var(--space-6)', marginBottom: 'var(--space-10)' }}>
          <div className="timeline">
            {monthlyMilestones.map((m: any, idx: number) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-dot">M{m.month}</div>
                  {idx < monthlyMilestones.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                    <h4 className="timeline-title" style={{ margin: 0 }}>{m.title}</h4>
                    <span className="badge badge-accent" style={{ fontSize: '10px' }}>Month {m.month} Milestone</span>
                  </div>
                  <p className="timeline-description" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                    {m.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {m.skills.map((s: string) => (
                      <span key={s} className="tag" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly breakdown preview */}
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock style={{ color: 'var(--accent)' }} /> Weekly Learning Plan (24-Week Structure)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
          A granular view of your step-by-step learning progression. You can track, check off and receive resources for all 24 weeks in your Study Planner.
        </p>
        <div className="card glass-card" style={{ marginBottom: 'var(--space-10)', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-muted)' }}>WEEKLY MILESTONE BREAKDOWN</span>
            <span className="badge badge-neutral" style={{ fontSize: '10px' }}>24 Steps total</span>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto', padding: 'var(--space-4) var(--space-6)' }}>
            {weeklyLearningPlan.map((step: string, idx: number) => {
              const parts = step.split(':');
              const weekTitle = parts[0];
              const weekContent = parts[1] || step;
              return (
                <div key={idx} style={{
                  padding: 'var(--space-3) 0',
                  borderBottom: idx < weeklyLearningPlan.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)'
                }}>
                  <div style={{
                    backgroundColor: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    marginTop: '2px'
                  }}>
                    {weekTitle}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {weekContent.trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects & Certifications */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-12)' }}>
          {/* Projects Card */}
          <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code style={{ color: 'var(--accent)' }} /> Recommended Capstone Projects
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Build these projects to build a robust portfolio and overcome tier-3 placement hurdles:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {recommendedProjects.map((p: any, idx: number) => (
                <div key={idx} style={{ padding: 'var(--space-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{p.title}</strong>
                    <span className="badge" style={{
                      fontSize: '9px',
                      padding: '1px 6px',
                      backgroundColor: p.difficulty === 'Advanced' ? 'var(--error-bg)' : 'var(--warning-bg)',
                      color: p.difficulty === 'Advanced' ? 'var(--error)' : 'var(--warning)'
                    }}>
                      {p.difficulty}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 var(--space-2) 0', lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {p.technologies.map((t: string) => (
                      <span key={t} className="tag" style={{ fontSize: '9px', padding: '1px 4px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Card */}
          <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award style={{ color: 'var(--accent)' }} /> Industry Respected Certifications
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Boost your profile ATS score and showcase verify skills with these target certificates:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {career.certifications.map((cert: string, idx: number) => (
                <div key={idx} style={{
                  padding: 'var(--space-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                    <Award style={{ width: 14, height: 14, color: 'var(--accent)', margin: 'auto' }} />
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Link to="/quiz" className="btn btn-secondary btn-lg">
            <ArrowLeft style={{ width: 16, height: 16 }} /> Edit Onboarding Info
          </Link>
          <button onClick={handleActivateRoadmap} className="btn btn-primary btn-lg" style={{ boxShadow: '0 8px 24px rgba(15, 118, 110, 0.3)' }}>
            Activate Roadmap & View Dashboard <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>

      </div>
    </Layout>
  );
}

function ResultsLoadingState() {
  return (
    <Layout>
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
        <div className="spinner"></div>
        <h2 style={{ fontSize: 'var(--text-lg)', animation: 'pulse 1.5s infinite' }}>Analyzing Onboarding Choices...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Synthesizing personalized 6-month roadmap timeline...</p>
      </div>
    </Layout>
  );
}
