import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router';
import { 
  Award, CheckCircle, AlertTriangle, Briefcase, FileText, 
  TrendingUp, Activity, Sparkles, BookOpen, Star, 
  Plus, Check, ChevronRight, Compass, Trash2 
} from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';

export function PlacementDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [mockScore, setMockScore] = useState<number | null>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([
    { id: 1, text: 'Analyze resume match for target position', completed: false, xpReward: 20 },
    { id: 2, text: 'Complete Week 1 Tasks in Study Plan', completed: false, xpReward: 30 },
    { id: 3, text: 'Attempt first AI Mock Interview session', completed: false, xpReward: 50 },
    { id: 4, text: 'Read the recommended free resources on APIs', completed: false, xpReward: 20 }
  ]);
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    // Load user state
    const user = localStorage.getItem('careerpath_currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      const defaultUser = {
        name: 'Guest Scholar',
        email: 'guest@college.edu',
        college: 'Aryabhatta University of Tech',
        year: 'B.Tech CS / IT',
        savedCareers: ['mern-stack-dev'],
        studyPlanProgress: 25,
        streakCount: 5,
        lastActiveDate: new Date().toDateString(),
        badges: ['explorer'],
        xp: 120
      };
      localStorage.setItem('careerpath_currentUser', JSON.stringify(defaultUser));
      setCurrentUser(defaultUser);
    }

    // Load active study plan
    const plan = localStorage.getItem('careerpath_activeStudyPlan');
    if (plan) {
      setActivePlan(JSON.parse(plan));
    }

    // Load resume history
    const savedAnalyzerHistory = localStorage.getItem('careerpath_analyzerHistory');
    if (savedAnalyzerHistory) {
      const history = JSON.parse(savedAnalyzerHistory);
      if (history.length > 0) {
        setResumeResult(history[history.length - 1]);
      }
    }

    // Load mock interview results to check
    // In our system, completing interview updates user profile badges like 'interview_complete'
    // Let's mock a score or check if user completed the interview
    const completedInterview = localStorage.getItem('careerpath_currentUser') 
      ? JSON.parse(localStorage.getItem('careerpath_currentUser')!).badges.includes('interview_complete')
      : false;
    
    if (completedInterview) {
      setMockScore(85);
    } else {
      setMockScore(null);
    }

    // Load local weekly goals if they exist
    const savedGoals = localStorage.getItem('careerpath_weeklyGoals');
    if (savedGoals) {
      setWeeklyGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleToggleGoal = (goalId: number) => {
    const updated = weeklyGoals.map(g => {
      if (g.id === goalId) {
        const completed = !g.completed;
        // Award XP if completed
        if (completed && currentUser) {
          const updatedUser = { ...currentUser, xp: (currentUser.xp || 0) + g.xpReward };
          localStorage.setItem('careerpath_currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
        return { ...g, completed };
      }
      return g;
    });

    setWeeklyGoals(updated);
    localStorage.setItem('careerpath_weeklyGoals', JSON.stringify(updated));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal = {
      id: Date.now(),
      text: newGoalText,
      completed: false,
      xpReward: 20
    };

    const updated = [...weeklyGoals, newGoal];
    setWeeklyGoals(updated);
    localStorage.setItem('careerpath_weeklyGoals', JSON.stringify(updated));
    setNewGoalText('');
  };

  const handleDeleteGoal = (goalId: number) => {
    const updated = weeklyGoals.filter(g => g.id !== goalId);
    setWeeklyGoals(updated);
    localStorage.setItem('careerpath_weeklyGoals', JSON.stringify(updated));
  };

  if (!currentUser) return null;

  // Calculation parameters
  const resumeScoreVal = resumeResult?.score || 0;
  const roadmapProgressVal = currentUser.studyPlanProgress || 0;
  const mockScoreVal = mockScore || 0;
  const totalBadgesVal = (currentUser.badges?.length || 0) * 15; // out of 75 max

  // Placement score (Career Score)
  const careerScore = Math.min(100, Math.round(
    (resumeScoreVal * 0.35) + 
    (roadmapProgressVal * 0.35) + 
    (mockScoreVal * 0.15) + 
    (totalBadgesVal * 0.15)
  ));

  // Internship Readiness Checklist items
  const checks = [
    { 
      name: "ATS Resume Verified", 
      desc: "Resume scanned with ATS match score >= 70%",
      status: resumeScoreVal >= 70, 
      linkText: "Update Resume", 
      linkUrl: "/resume-analyzer",
      valText: resumeScoreVal ? `${resumeScoreVal}%` : "Not scanned"
    },
    { 
      name: "Roadmap Milestones", 
      desc: "Completed at least 40% of weekly learning milestones",
      status: roadmapProgressVal >= 40, 
      linkText: "Study Planner", 
      linkUrl: "/study-plan",
      valText: `${roadmapProgressVal}%`
    },
    { 
      name: "AI Mock Screening", 
      desc: "Completed technical interview with score >= 75%",
      status: mockScoreVal >= 75, 
      linkText: "Start Mock Interview", 
      linkUrl: "/mock-interview",
      valText: mockScoreVal ? `${mockScoreVal}%` : "Not started"
    },
    { 
      name: "Core Portfolio Project", 
      desc: "Completed week tasks designated as mini-applications",
      status: roadmapProgressVal >= 25, 
      linkText: "View Milestones", 
      linkUrl: "/dashboard",
      valText: roadmapProgressVal >= 25 ? "Ready" : "Pending"
    }
  ];

  const completedChecksCount = checks.filter(c => c.status).length;
  const isReadyForInternship = completedChecksCount === checks.length;

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Placement Readiness Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Verify your portfolio checklist and check if you are eligible for tech placements</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ color: 'var(--text-inverse)', borderColor: 'rgba(255,255,255,0.3)' }}>
            My Main Dashboard
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        
        {/* Career Score Gauge & Internship Eligibility */}
        <div className="grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)', alignItems: 'stretch' }}>
          
          {/* Career Score Gauge */}
          <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-6)' }}>
            <div style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: `conic-gradient(var(--accent) ${careerScore * 3.6}deg, var(--surface-hover) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                width: 116,
                height: 116,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)', lineHeight: 1 }}>
                  <AnimatedCounter value={careerScore} />
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Score</span>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Calculated across your Resume Match, study plan milestones, and AI Mock Interview performances.
            </p>
          </div>

          {/* Internship Readiness Checker */}
          <div className="card glass-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-6)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Eligibility Checker
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xl)' }}>Internship Readiness Status</h3>
                </div>
                <span className={`badge ${isReadyForInternship ? 'badge-success' : 'badge-warning'}`} style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
                  {completedChecksCount}/4 Verification Steps
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                Based on recruitment algorithms, your profile needs to fulfill the following parameters to unlock corporate tier-2/3 placements and remote positions:
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isReadyForInternship ? 'var(--success-bg)' : 'var(--warning-bg)',
              border: `1.5px solid ${isReadyForInternship ? 'var(--success)' : 'var(--warning)'}`
            }}>
              {isReadyForInternship ? (
                <>
                  <CheckCircle style={{ width: 28, height: 28, color: 'var(--success)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--success)' }}>Ready to Apply!</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>You satisfy all primary constraints. Start seeking internships on the Resources page!</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle style={{ width: 28, height: 28, color: 'var(--warning)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--warning)' }}>Not Fully Eligible Yet</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Fulfill the remaining checkpoints below to lock in your placement verification.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Checkpoints & Weekly Goals */}
        <div className="grid-3" style={{ gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* Verification Checkpoints list */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Readiness Checkpoints</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {checks.map((c, i) => (
                <div key={i} className="card glass-card" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  border: `1px solid ${c.status ? 'var(--border)' : 'var(--warning)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: c.status ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: c.status ? 'var(--success)' : 'var(--warning)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {c.status ? <Check style={{ width: 14, height: 14 }} /> : <AlertTriangle style={{ width: 14, height: 14 }} />}
                    </div>
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)', display: 'block' }}>{c.name}</strong>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.desc}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'bold',
                      color: c.status ? 'var(--success)' : 'var(--warning)'
                    }}>{c.valText}</span>
                    <Link to={c.linkUrl} className="btn btn-secondary btn-sm" style={{ minWidth: '100px' }}>
                      {c.linkText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goals & XP System */}
          <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-base)', margin: 0 }}>
                <Star style={{ color: 'var(--accent)', fill: 'var(--accent)', width: 18, height: 18 }} /> Weekly Goals & XP
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                Complete custom targets to boost your Career XP and level up.
              </p>
            </div>

            {/* Goals Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {weeklyGoals.map(goal => (
                <div key={goal.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => handleToggleGoal(goal.id)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: goal.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: goal.completed ? 'line-through' : 'none'
                    }}>{goal.text}</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', padding: '1px 4px', borderRadius: '3px' }}>
                      +{goal.xpReward} XP
                    </span>
                    <button 
                      onClick={() => handleDeleteGoal(goal.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', padding: 2 }}
                    >
                      <Trash2 style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Goal Form */}
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="text"
                className="form-input"
                placeholder="New custom goal..."
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
                style={{ flex: 1, height: '32px', padding: '0 8px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)' }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ height: '32px', borderRadius: 'var(--radius-md)' }}>
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Skill Progress Analytics */}
        <div className="card glass-card" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Activity style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Skill Progress Analytics
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Visual breakdown of your tech competencies across different domain indices. Completing weekly study plan topics will dynamically advance these bars.
          </p>

          <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
            {[
              { name: "Frontend Development Index (HTML, CSS, React, JS)", val: roadmapProgressVal >= 25 ? 65 : 30, color: "var(--accent)" },
              { name: "Backend Engineering Index (Node.js, Spring Boot, Databases)", val: roadmapProgressVal >= 50 ? 55 : 15, color: "var(--info)" },
              { name: "Project & Version Control Index (Git, Repository Setup)", val: roadmapProgressVal >= 10 ? 80 : 20, color: "var(--success)" },
              { name: "Interview Screening Index (Verbal articulation, logic definitions)", val: mockScoreVal || 10, color: "#a855f7" }
            ].map((skill, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{skill.name}</strong>
                  <strong style={{ color: skill.color }}>{skill.val}%</strong>
                </div>
                <div className="progress-track" style={{ height: '10px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${skill.val}%`,
                      backgroundColor: skill.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Tracking Timeline */}
        <div className="card glass-card" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-6)' }}>
            <BookOpen style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Career Milestone Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { title: "Stage 1: Foundational Training", desc: "Understand syntactic syntax, coding guidelines, basic HTML/CSS layouts, and local Git repository setup.", completed: true },
              { title: "Stage 2: Mini Project Construction", desc: "Build checkable single-page applications or basic SQL reports using online sandboxes.", completed: roadmapProgressVal >= 25 },
              { title: "Stage 3: Resume Keyword Synchronization", desc: "Review resume drafts with the ATS Score Checker, embedding required technologies from the gap list.", completed: resumeScoreVal >= 50 },
              { title: "Stage 4: Technical Screening Simulation", desc: "Practice answering algorithmic and core parameters with the AI Mock Interview system.", completed: mockScoreVal >= 60 },
              { title: "Stage 5: Campus Placement Matrix", desc: "Submit verified credentials and portfolio repositories to local and remote campus hiring systems.", completed: isReadyForInternship }
            ].map((milestone, index) => (
              <div key={index} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: milestone.completed ? 'var(--success-bg)' : 'var(--bg-secondary)',
                    color: milestone.completed ? 'var(--success)' : 'var(--text-muted)',
                    border: `1.5px solid ${milestone.completed ? 'var(--success)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {milestone.completed ? <Check style={{ width: 14, height: 14 }} /> : index + 1}
                  </div>
                  {index < 4 && <div style={{ width: 2, flex: 1, backgroundColor: 'var(--border)', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingBottom: '16px' }}>
                  <strong style={{ fontSize: 'var(--text-sm)', display: 'block', color: milestone.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {milestone.title}
                  </strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{milestone.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
