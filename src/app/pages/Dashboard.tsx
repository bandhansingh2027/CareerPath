import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link, useNavigate } from 'react-router';
import { User, Award, CheckCircle, Clock, BookOpen, FileText, ChevronRight, Briefcase, Star, Settings, ExternalLink } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [analyzerHistory, setAnalyzerHistory] = useState<any[]>([]);

  useEffect(() => {
    // Read user
    const user = localStorage.getItem('careerpath_currentUser');
    if (!user) {
      // Create a mock user if not logged in to showcase dashboard immediately
      const mockUser = {
        name: 'Amit Kumar',
        email: 'amit.kumar@college.edu',
        college: 'Aryabhatta Institute of Technology (GEC)',
        year: '3rd Year B.Tech',
        savedCareers: ['fullstack-web-dev'],
        studyPlanProgress: 25
      };
      localStorage.setItem('careerpath_currentUser', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
    } else {
      setCurrentUser(JSON.parse(user));
    }

    // Read active plan
    const plan = localStorage.getItem('careerpath_activeStudyPlan');
    if (plan) {
      setActivePlan(JSON.parse(plan));
    }

    // Read analyzer history
    const history = localStorage.getItem('careerpath_analyzerHistory');
    if (history) {
      setAnalyzerHistory(JSON.parse(history));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('careerpath_currentUser');
    navigate('/auth');
  };

  // Badges logic
  const badges = [
    { id: 'quiz', name: 'Explorer', desc: 'Completed the Career Match Quiz', unlocked: true, icon: Star },
    { id: 'plan', name: 'Planner', desc: 'Created an active week-by-week study plan', unlocked: !!activePlan, icon: Clock },
    { id: 'resume', name: 'ATS Ready', desc: 'ATS Resume Match Score > 70%', unlocked: analyzerHistory.some(h => h.score >= 70), icon: FileText },
    { id: 'finisher', name: 'Overachiever', desc: 'Completed all weeks in a study plan', unlocked: currentUser?.studyPlanProgress === 100, icon: Award }
  ];

  // Mock jobs recommendations based on saved or active career
  const mockJobs = [
    { title: 'Junior Frontend Developer (React)', company: 'TechSolutions Pvt. Ltd.', location: 'Indore, MP (Tier-2)', salary: '₹3.6 - ₹5 LPA', type: 'Full-time', match: '95%', careerId: 'fullstack-web-dev' },
    { title: 'Full Stack Web Developer (Internship)', company: 'Inov8 Labs', location: 'Remote (India)', salary: '₹20,000 / month', type: 'Remote', match: '90%', careerId: 'fullstack-web-dev' },
    { title: 'Junior Data Analyst', company: 'BizAnalytics Inc.', location: 'Jaipur, Rajasthan (Tier-2)', salary: '₹4 - ₹6 LPA', type: 'Full-time', match: '88%', careerId: 'data-analyst' },
    { title: 'Digital Marketing Intern', company: 'BrandGlow Media', location: 'Patna, Bihar (Tier-3)', salary: '₹12,000 / month', type: 'Part-time', match: '85%', careerId: 'digital-marketing' },
    { title: 'Junior UI/UX Designer', company: 'PixelPerfect Agency', location: 'Remote', salary: '₹3 - ₹4.8 LPA', type: 'Full-time', match: '92%', careerId: 'ui-ux-designer' }
  ];

  // Filter jobs based on user active plan or default to first 3
  const userCareerId = activePlan?.careerId || currentUser?.savedCareers?.[0] || 'fullstack-web-dev';
  const matchingJobs = mockJobs.filter(j => j.careerId === userCareerId);
  const displayJobs = matchingJobs.length > 0 ? matchingJobs : mockJobs.slice(0, 3);

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {/* Profile Card */}
        <div className="card" style={{
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, var(--accent-bg) 0%, var(--bg-glass) 100%)',
          border: '1px solid var(--accent-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 'var(--font-bold)'
            }}>
              <User style={{ width: 32, height: 32 }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{currentUser.name}</h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {currentUser.college} • {currentUser.year}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/feedback" className="btn btn-secondary btn-sm">
              Provide Feedback
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid-3" style={{ gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* Main Dashboard Columns */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Active Study Plan progress card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen style={{ color: 'var(--accent)' }} /> Active Study Plan Progress
                </h3>
                {activePlan ? (
                  <Link to="/study-plan" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>
                    Resume Study Plan &rarr;
                  </Link>
                ) : (
                  <Link to="/study-plan" className="btn btn-primary btn-sm">
                    Activate a Plan
                  </Link>
                )}
              </div>

              {activePlan ? (
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>{activePlan.careerTitle}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1.5)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    <span>Milestones Tracked</span>
                    <strong>{currentUser.studyPlanProgress || 0}% Completed</strong>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${currentUser.studyPlanProgress || 0}%`, height: 8 }} />
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  You do not have an active study plan. Select a career pathway and generate an AI-customized plan to begin tracking.
                </p>
              )}
            </div>

            {/* Job Recommendations list */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                <Briefcase style={{ color: 'var(--accent)' }} /> Matching Job Opportunities (Tier 2/3 & Remote)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
                Handpicked job roles that fit your active learning plan and require minimal tier-1 campus tags.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {displayJobs.map((job, idx) => (
                  <div key={idx} style={{
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <strong style={{ fontSize: 'var(--text-sm)' }}>{job.title}</strong>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontWeight: 'var(--font-semibold)' }}>
                          {job.match} Match
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {job.company} • {job.location}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-medium)', marginTop: '2px' }}>
                        Salary Package: {job.salary} ({job.type})
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Redirecting to mock apply portal for ${job.title}`)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Apply Mock <ExternalLink style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume analysis history */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText style={{ color: 'var(--accent)' }} /> Resume Analysis History
                </h3>
                <Link to="/resume-analyzer" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>
                  Analyze Resume &rarr;
                </Link>
              </div>

              {analyzerHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {analyzerHistory.map((h, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <div>
                        <strong style={{ fontSize: 'var(--text-sm)' }}>{h.careerTitle}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Analyzed: {h.date}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{h.matchedCount} Matched / {h.missingCount} Missing</span>
                        <span style={{
                          fontWeight: 'var(--font-bold)',
                          color: h.score >= 75 ? 'var(--success)' : 'var(--warning)',
                          backgroundColor: h.score >= 75 ? 'var(--success-bg)' : 'var(--warning-bg)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: 'var(--text-xs)'
                        }}>
                          {h.score}% Match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  No resume analysis run yet. Paste your profile text in our optimizer to see how ATS-ready you are.
                </p>
              )}
            </div>

          </div>

          {/* Right Column (Badges & Settings) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Badges unlocked card */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                <Award style={{ color: 'var(--accent)' }} /> Career Badges ({badges.filter(b => b.unlocked).length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {badges.map(b => (
                  <div key={b.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: b.unlocked ? 1 : 0.4
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: b.unlocked ? 'var(--success-bg)' : 'var(--bg-secondary)',
                      color: b.unlocked ? 'var(--success)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <b.icon style={{ width: 20, height: 20 }} />
                    </div>
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)', display: 'block' }}>{b.name}</strong>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links shortcuts */}
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-3)' }}>Quick Shortcuts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link to="/quiz" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  Retake Aptitude Quiz <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/careers" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  Explore Career Pathways <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/compare" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  Compare Careers <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}
