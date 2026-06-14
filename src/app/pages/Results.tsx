import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  TrendingUp, MapPin, DollarSign, BookOpen, CheckCircle,
  AlertCircle, ArrowLeft, ArrowRight, Target
} from 'lucide-react';
import { quizService } from '../services/api';
import { Layout } from '../components/Layout';
import { CareerIcon } from '../components/CareerIcon';

export function Results() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAnswers = sessionStorage.getItem('careerpath_answers');
    if (!savedAnswers) { navigate('/quiz'); return; }

    quizService.submitAnswers(JSON.parse(savedAnswers))
      .then(data => {
        setTimeout(() => {
          if (data.recommendations?.length > 0) setRecommendations(data.recommendations);
          else setError("No recommendations found.");
          setIsLoading(false);
        }, 1500);
      })
      .catch(() => {
        setTimeout(() => {
          setError("Something went wrong.");
          setIsLoading(false);
        }, 1500);
      });
  }, [navigate]);

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (error || recommendations.length === 0) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <AlertCircle style={{ width: 48, height: 48, color: 'var(--error)', margin: '0 auto var(--space-4)' }} />
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Oops!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>{error}</p>
            <Link to="/quiz" className="btn btn-primary">Retake Quiz</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const topCareer = recommendations[0].career;

  return (
    <Layout>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--text-inverse)', marginBottom: 'var(--space-2)' }}>Your Results</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>
            We found {recommendations.length} career paths that match your profile
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>

        {/* Top Match — Featured */}
        <div className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-8)', borderColor: 'var(--accent-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <span className="badge badge-accent">Best Match</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent)',
                  flexShrink: 0
                }}>
                  <CareerIcon id={topCareer.id} category={topCareer.category} style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>{topCareer.title}</h2>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{topCareer.category}</span>
                </div>
              </div>
              <p style={{ marginBottom: 'var(--space-4)' }}>{topCareer.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <TrendingUp style={{ width: 14, height: 14, color: 'var(--success)' }} /> {topCareer.demand_level} Demand
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <MapPin style={{ width: 14, height: 14, color: 'var(--info)' }} /> {topCareer.tier2_tier3_opportunities} in Tier 2/3
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <DollarSign style={{ width: 14, height: 14, color: 'var(--accent)' }} /> Entry: ₹{topCareer.salary_entry_min / 100000}–{topCareer.salary_entry_max / 100000} LPA
                </div>
              </div>

              {/* Reasons */}
              <ul className="indicator-list" style={{ marginBottom: 'var(--space-4)' }}>
                {recommendations[0].matchReasons.map((r, i) => (
                  <li key={i}><CheckCircle style={{ width: 14, height: 14, color: 'var(--success)', flexShrink: 0 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{r}</span></li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link to={`/career/${topCareer.id}`} className="btn btn-primary btn-sm">
                  Full Details <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to={`/skill-gap/${topCareer.id}`} className="btn btn-secondary btn-sm">
                  <Target style={{ width: 14, height: 14 }} /> Skill Gap
                </Link>
                <Link to={`/career-report/${topCareer.id}`} className="btn btn-secondary btn-sm">
                  Detailed Report
                </Link>
                <Link to={`/study-plan?career=${topCareer.id}`} className="btn btn-secondary btn-sm">
                  Study Plan
                </Link>
              </div>
            </div>

            <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '150px' }}>
              <div className="match-score" style={{ fontSize: '3.5rem' }}>{recommendations[0].matchPercentage}%</div>
              <div className="match-score-label" style={{ marginBottom: 'var(--space-3)' }}>Match Score</div>
              <div className="progress-track" style={{ height: 8, width: '100%', maxWidth: '160px', margin: '0 auto' }}>
                <div className="progress-fill" style={{ width: `${recommendations[0].matchPercentage}%`, height: 8, background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Other Matches */}
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Other Career Matches</h3>
        <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
          {recommendations.slice(1).map((rec, index) => (
            <Link key={rec.career.id} to={`/career/${rec.career.id}`} className="card card-interactive" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span className="badge badge-neutral">#{index + 2} Match</span>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-extrabold)', color: 'var(--accent)' }}>{rec.matchPercentage}% Match</span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    flexShrink: 0
                  }}>
                    <CareerIcon id={rec.career.id} category={rec.career.category} style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <div className="card-title" style={{ fontSize: 'var(--text-base)', margin: 0 }}>{rec.career.title}</div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{rec.career.category}</span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${rec.matchPercentage}%`, height: 6, background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <span>{rec.career.demand_level} Demand</span>
                    <span>Entry: ₹{rec.career.salary_entry_min / 100000}–{rec.career.salary_entry_max / 100000} LPA</span>
                  </div>
                  <ArrowRight style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/quiz" className="btn btn-secondary">
            <ArrowLeft style={{ width: 16, height: 16 }} /> Retake Quiz
          </Link>
          <Link to="/careers" className="btn btn-primary">
            <BookOpen style={{ width: 16, height: 16 }} /> Browse All Careers
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function ResultsSkeleton() {
  return (
    <Layout>
      {/* Header Skeleton */}
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0', opacity: 0.8 }} className="skeleton">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--text-inverse)', marginBottom: 'var(--space-2)' }}>Analyzing Profile...</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Finding best matched careers based on your answers...</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Top Match Featured Skeleton */}
        <div className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', border: '1.5px solid var(--border)' }}>
          <div style={{ width: '100px', height: '24px' }} className="skeleton" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)' }} className="skeleton" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ width: '200px', height: '24px' }} className="skeleton" />
                  <div style={{ width: '100px', height: '14px' }} className="skeleton" />
                </div>
              </div>
              <div style={{ width: '100%', height: '16px' }} className="skeleton" />
              <div style={{ width: '90%', height: '16px' }} className="skeleton" />
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ width: '100px', height: '16px' }} className="skeleton" />
                <div style={{ width: '120px', height: '16px' }} className="skeleton" />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', minWidth: '150px' }}>
              <div style={{ width: '80px', height: '56px', borderRadius: 'var(--radius-md)' }} className="skeleton" />
              <div style={{ width: '100px', height: '14px' }} className="skeleton" />
              <div style={{ width: '140px', height: '8px', borderRadius: 'var(--radius-full)' }} className="skeleton" />
            </div>
          </div>
        </div>

        {/* Other Matches Skeleton */}
        <div style={{ width: '180px', height: '28px', marginBottom: 'var(--space-4)' }} className="skeleton" />
        <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
          {[1, 2].map((i) => (
            <div key={i} className="card" style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div style={{ width: '80px', height: '20px' }} className="skeleton" />
                  <div style={{ width: '60px', height: '20px' }} className="skeleton" />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)' }} className="skeleton" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ width: '150px', height: '16px' }} className="skeleton" />
                    <div style={{ width: '80px', height: '12px' }} className="skeleton" />
                  </div>
                </div>
              </div>
              <div>
                <div style={{ width: '100%', height: '6px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }} className="skeleton" />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '120px', height: '14px' }} className="skeleton" />
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%' }} className="skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
