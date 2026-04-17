import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  TrendingUp, MapPin, DollarSign, BookOpen, CheckCircle,
  AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { quizService } from '../services/api';
import { Layout } from '../components/Layout';

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
        if (data.recommendations?.length > 0) setRecommendations(data.recommendations);
        else setError("No recommendations found.");
        setIsLoading(false);
      })
      .catch(() => { setError("Something went wrong."); setIsLoading(false); });
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="spinner"></div>
          <p>Analyzing your profile...</p>
        </div>
      </Layout>
    );
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
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>{topCareer.title}</h2>
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

              <Link to={`/career/${topCareer.id}`} className="btn btn-primary">
                View Full Details <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>

            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div className="match-score" style={{ fontSize: '3.5rem' }}>{recommendations[0].matchPercentage}%</div>
              <div className="match-score-label">Match Score</div>
            </div>
          </div>
        </div>

        {/* Other Matches */}
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Other Career Matches</h3>
        <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
          {recommendations.slice(1).map((rec, index) => (
            <Link key={rec.career.id} to={`/career/${rec.career.id}`} className="card card-interactive" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span className="badge badge-neutral" style={{ marginBottom: 'var(--space-2)' }}>#{index + 2}</span>
                  <div className="card-title">{rec.career.title}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--accent)' }}>{rec.matchPercentage}%</div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${rec.matchPercentage}%`, height: 6 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <span>{rec.career.demand_level} Demand</span>
                  <span>Entry: ₹{rec.career.salary_entry_min / 100000}–{rec.career.salary_entry_max / 100000} LPA</span>
                </div>
                <ArrowRight style={{ width: 14, height: 14, color: 'var(--accent)' }} />
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
