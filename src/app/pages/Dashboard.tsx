import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  User, Award, CheckCircle, Clock, BookOpen, FileText, 
  ChevronRight, Briefcase, Star, Flame, Sparkles, 
  TrendingUp, CheckCircle2, AlertTriangle, RefreshCw, 
  UploadCloud, ListTodo, Activity, Plus 
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { careersData } from '../data/careersData';
import { quizService } from '../services/api';
import { AnimatedCounter } from '../components/AnimatedCounter';

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Resume analysis state
  const [resumeText, setResumeText] = useState('');
  const [targetCareer, setTargetCareer] = useState('mern-stack-dev');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeResult, setResumeResult] = useState<any>(null);

  // Load state on mount
  useEffect(() => {
    // Read or initialize user
    let user = localStorage.getItem('careerpath_currentUser');
    if (!user) {
      const defaultUser = {
        name: 'Guest Scholar',
        email: 'guest@college.edu',
        college: 'Aryabhatta University of Tech',
        year: 'B.Tech CS / IT',
        savedCareers: ['mern-stack-dev'],
        studyPlanProgress: 15,
        streakCount: 5,
        lastActiveDate: new Date().toDateString(),
        badges: ['explorer'],
        xp: 120
      };
      localStorage.setItem('careerpath_currentUser', JSON.stringify(defaultUser));
      setCurrentUser(defaultUser);
    } else {
      const parsed = JSON.parse(user);
      if (parsed.xp === undefined) {
        parsed.xp = 120;
      }
      localStorage.setItem('careerpath_currentUser', JSON.stringify(parsed));
      setCurrentUser(parsed);
    }

    // Read active study plan
    const plan = localStorage.getItem('careerpath_activeStudyPlan');
    if (plan) {
      setActivePlan(JSON.parse(plan));
    } else {
      // Initialize a default plan for MERN Stack Dev if none exists
      const target = careersData[0];
      const defaultPlan = {
        careerId: target.id,
        careerTitle: target.title,
        experienceLevel: 'Beginner',
        hoursPerWeek: 15,
        weeks: target.weeklyLearningPlan.slice(0, 8).map((desc, idx) => ({
          week: idx + 1,
          title: `Week ${idx + 1}: ${desc.split(':')[1]?.trim() || desc}`,
          hoursAllocated: 15,
          tasks: [
            { id: `w${idx+1}-t1`, label: `Learn: ${desc.split(':')[1]?.trim() || desc}`, completed: idx < 1, hours: 5 },
            { id: `w${idx+1}-t2`, label: `Build a mini application demonstrating this competency`, completed: false, hours: 6 },
            { id: `w${idx+1}-t3`, label: `Submit project code and review with AI Career Mentor`, completed: false, hours: 4 }
          ],
          resources: [
            { title: `${target.title} Free Tutorial`, provider: 'freeCodeCamp', url: 'https://freecodecamp.org' }
          ]
        })),
        createdAt: new Date().toLocaleDateString()
      };
      localStorage.setItem('careerpath_activeStudyPlan', JSON.stringify(defaultPlan));
      setActivePlan(defaultPlan);
    }

    // Read resume result
    const savedAnalyzerHistory = localStorage.getItem('careerpath_analyzerHistory');
    if (savedAnalyzerHistory) {
      const history = JSON.parse(savedAnalyzerHistory);
      if (history.length > 0) {
        setResumeResult(history[history.length - 1]);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        setAnimatedProgress(currentUser.studyPlanProgress);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.studyPlanProgress]);

  if (!currentUser || !activePlan) return null;

  // Extract next tasks
  const getNextTasks = () => {
    const next: any[] = [];
    activePlan.weeks.forEach((week: any, wIdx: number) => {
      week.tasks.forEach((task: any) => {
        if (!task.completed && next.length < 3) {
          next.push({
            ...task,
            weekNum: week.week,
            weekIndex: wIdx
          });
        }
      });
    });
    return next;
  };

  const nextTasks = getNextTasks();

  const handleToggleTask = (weekIndex: number, taskId: string) => {
    const updatedWeeks = activePlan.weeks.map((w: any, idx: number) => {
      if (idx === weekIndex) {
        return {
          ...w,
          tasks: w.tasks.map((t: any) => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return w;
    });

    const updatedPlan = { ...activePlan, weeks: updatedWeeks };
    localStorage.setItem('careerpath_activeStudyPlan', JSON.stringify(updatedPlan));
    setActivePlan(updatedPlan);

    // Calculate new progress percentage
    const total = updatedWeeks.reduce((sum: number, w: any) => sum + w.tasks.length, 0);
    const completed = updatedWeeks.reduce((sum: number, w: any) => sum + w.tasks.filter((t: any) => t.completed).length, 0);
    const percent = Math.round((completed / total) * 100);

    const updatedUser = { ...currentUser, studyPlanProgress: percent };
    // Automatically award badges if progress is updated
    const updatedBadges = [...updatedUser.badges];
    if (percent >= 50 && !updatedBadges.includes('achiever')) {
      updatedBadges.push('achiever');
    }
    if (percent === 100 && !updatedBadges.includes('finisher')) {
      updatedBadges.push('finisher');
    }
    updatedUser.badges = updatedBadges;

    localStorage.setItem('careerpath_currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Extract skills categorization
  const getSkillsState = () => {
    const targetCareerObj = careersData.find(c => c.id === activePlan.careerId) || careersData[0];
    const allSkills = targetCareerObj.requiredSkills;
    
    // Split skills: first 2 completed, next 3 in progress, rest not started
    const completed = allSkills.slice(0, 2);
    const inProgress = allSkills.slice(2, 5);
    const notStarted = allSkills.slice(5);

    return { completed, inProgress, notStarted };
  };

  const skillsState = getSkillsState();

  // Career Score Calculation: based on progress, resume analysis, and badges
  const calculateCareerScore = () => {
    const progressWeight = currentUser.studyPlanProgress * 0.4; // max 40
    const resumeWeight = (resumeResult?.score || 55) * 0.4; // max 40
    const badgesWeight = (currentUser.badges?.length || 1) * 5; // max 20
    return Math.min(100, Math.round(progressWeight + resumeWeight + badgesWeight));
  };

  const careerScore = calculateCareerScore();

  // Badges lists
  const availableBadges = [
    { id: 'explorer', name: 'Roadmap Explorer', desc: 'Completed onboarding flow', icon: CompassIcon, unlocked: true },
    { id: 'streak', name: 'Habit Builder', desc: 'Maintained a 5-day streak', icon: StreakIcon, unlocked: currentUser.streakCount >= 5 },
    { id: 'achiever', name: 'Skill Master', desc: 'Achieved 50% roadmap progress', icon: StarIcon, unlocked: currentUser.studyPlanProgress >= 50 },
    { id: 'resume', name: 'ATS Ready', desc: 'Attained a >70% resume score', icon: ATSIcon, unlocked: (resumeResult?.score || 0) >= 70 },
    { id: 'finisher', name: 'Elite Graduate', desc: 'Completed all learning weeks', icon: EliteIcon, unlocked: currentUser.studyPlanProgress === 100 }
  ];

  // Resume Upload / Paste Handler
  const handleAnalyzeResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const selectedCareerObj = careersData.find(c => c.id === targetCareer) || careersData[0];
      const matched: string[] = [];
      const missing: string[] = [];
      
      const testSkills = selectedCareerObj.requiredSkills;
      testSkills.forEach((s, idx) => {
        // Mock matching 60% of skills
        if (idx % 2 === 0 || resumeText.toLowerCase().includes(s.toLowerCase())) {
          matched.push(s);
        } else {
          missing.push(s);
        }
      });

      const score = Math.round((matched.length / testSkills.length) * 100);
      
      const newResult = {
        date: new Date().toLocaleDateString(),
        careerId: targetCareer,
        careerTitle: selectedCareerObj.title,
        score,
        matchedCount: matched.length,
        missingCount: missing.length,
        matchedSkills: matched,
        missingSkills: missing,
        recommendations: [
          `Integrate more active verbs in your summary matching: ${missing.slice(0, 2).join(', ')}.`,
          `Highlight projects built with ${selectedCareerObj.requiredSkills.slice(0, 3).join(', ')}.`,
          `Include a specialized certifications tab listing the recommended credentials.`
        ]
      };

      const history = JSON.parse(localStorage.getItem('careerpath_analyzerHistory') || '[]');
      history.push(newResult);
      localStorage.setItem('careerpath_analyzerHistory', JSON.stringify(history));

      const updatedUser = { ...currentUser };
      if (score >= 70 && !updatedUser.badges.includes('resume')) {
        updatedUser.badges.push('resume');
        localStorage.setItem('careerpath_currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      setResumeResult(newResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  const triggerMockUpload = () => {
    setResumeText(`BANDHAN SINGH
Email: bandhan@gmail.com
Education: B.Tech Computer Science, 2026
Skills: HTML, CSS, JavaScript, Basic React, Git
Projects: Todo Web Application using React.`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/quiz');
  };

  return (
    <Layout>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        
        {/* Welcome Banner */}
        <div className="glass-card" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-bg) 100%)',
          borderLeft: '4px solid var(--accent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-inverse)'
            }}>
              <User style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Welcome Back, {currentUser.name}! <Sparkles style={{ width: 18, height: 18, color: 'var(--accent)' }} />
              </h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Onboarding Status: Verified • Target Goal: <strong>{activePlan.careerTitle}</strong>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: 'var(--accent)', color: 'var(--text-inverse)', padding: '2px 8px', borderRadius: '4px' }}>
                  LVL {Math.floor((currentUser.xp || 120) / 100) + 1}
                </span>
                <div style={{ width: '150px' }}>
                  <div className="progress-track" style={{ height: 6, backgroundColor: 'var(--border)' }}>
                    <div className="progress-fill" style={{ width: `${(currentUser.xp || 120) % 100}%`, height: 6 }} />
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {(currentUser.xp || 120) % 100}/100 XP
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/quiz" className="btn btn-secondary btn-sm">
              Update Profile Goal
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid Dashboard Overview */}
        <div className="grid-3" style={{ gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: PRIMARY STATS & PLAN */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            {/* TOP METRICS ROW */}
            <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
              {/* Metric 1: Roadmap Progress */}
              <div className="card glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyCenter: 'center', padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto var(--space-2)' }}>
                  <TrendingUp style={{ color: 'var(--accent)', width: 20, height: 20 }} />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', lineHeight: '1.1' }}>
                  <AnimatedCounter value={currentUser.studyPlanProgress} suffix="%" />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                  Roadmap Progress
                </span>
                <div className="progress-track" style={{ height: 6, marginTop: 'var(--space-3)' }}>
                  <div className="progress-fill" style={{ width: `${animatedProgress}%`, height: 6 }} />
                </div>
              </div>

              {/* Metric 2: Career Readiness Score */}
              <div className="card glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyCenter: 'center', padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto var(--space-2)' }}>
                  <Activity style={{ color: 'var(--success)', width: 20, height: 20 }} />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)', lineHeight: '1.1' }}>
                  <AnimatedCounter value={careerScore} />/100
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                  Career Score
                </span>
                <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Skills + Badges + Resume Match
                </p>
              </div>

              {/* Metric 3: Streak Counter */}
              <div className="card glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyCenter: 'center', padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto var(--space-2)' }}>
                  <Flame style={{ color: '#f97316', width: 24, height: 24, fill: '#f97316' }} />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316', lineHeight: '1.1' }}>
                  {currentUser.streakCount} Days
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                  Active Streak
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: 'var(--space-2.5)' }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <span key={i} style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: i < 5 ? '#f97316' : 'var(--border)',
                      color: '#fff',
                      fontSize: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next learning tasks (Checkable list that updates progress) */}
            <div className="card glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-1)' }}>
                <ListTodo style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Current Milestones & Next Tasks
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
                Complete these to dynamically update your Roadmap progress percentage and overall Career Score.
              </p>

              {nextTasks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {nextTasks.map((task) => (
                    <label key={task.id} className="task-checkbox-container option-card" style={{
                      padding: '12px 16px',
                      border: '1px solid var(--border)'
                    }}>
                      <input
                        type="checkbox"
                        className="task-checkbox-input"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.weekIndex, task.id)}
                      />
                      <div className="task-checkbox-custom">
                        <CheckCircle2 style={{ width: 12, height: 12 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'bold', display: 'block' }}>
                          Week {task.weekNum} Objective
                        </span>
                        <span className={`task-text ${task.completed ? 'task-text-completed' : ''}`} style={{ fontSize: 'var(--text-sm)' }}>
                          {task.label}
                        </span>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        🕒 {task.hours}h
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                  <CheckCircle style={{ color: 'var(--success)', width: 32, height: 32, margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>All current weekly tasks completed! Generation of next block underway...</p>
                  <Link to="/study-plan" className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>Generate Next Month</Link>
                </div>
              )}
            </div>

            {/* Resume Optimizer Widget */}
            <div className="card glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-1)' }}>
                <FileText style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Resume & ATS Profiler
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-5)' }}>
                Paste your latest resume details to calculate your ATS match score against {activePlan.careerTitle} and fix critical missing keywords.
              </p>

              <div className="grid-2" style={{ gap: 'var(--space-6)', alignItems: 'stretch' }}>
                {/* Form */}
                <form onSubmit={handleAnalyzeResume} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Target Position</label>
                    <button type="button" onClick={triggerMockUpload} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                      ⚡ Load Sample Resume
                    </button>
                  </div>
                  
                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your education, skills, and projects list here..."
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'monospace'
                    }}
                    required
                  />

                  <button type="submit" disabled={isAnalyzing || !resumeText.trim()} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    {isAnalyzing ? <span className="spinner" style={{ width: 14, height: 14 }}></span> : 'Optimize Resume Profile'}
                  </button>
                </form>

                {/* Score / Result Widget */}
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '180px'
                }}>
                  {resumeResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>ATS Score:</span>
                        <span style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'bold',
                          color: resumeResult.score >= 70 ? 'var(--success)' : 'var(--warning)',
                          backgroundColor: resumeResult.score >= 70 ? 'var(--success-bg)' : 'var(--warning-bg)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>{resumeResult.score}% Match</span>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--warning)', display: 'block', marginBottom: '2px' }}>Missing Core Keywords:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {resumeResult.missingSkills?.slice(0, 3).map((s: string) => (
                            <span key={s} className="tag" style={{ fontSize: '9px', padding: '1px 4px' }}>{s}</span>
                          )) || <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>None! You're ready.</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        💡 {resumeResult.recommendations?.[0] || 'Keep pushing your skills gaps to hit 80%+.'}
                      </div>
                      <Link to="/resume-analyzer" style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'underline' }}>
                        View Full Recommendations &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <UploadCloud style={{ width: 32, height: 32, margin: '0 auto 8px', color: 'var(--text-muted)' }} />
                      <p style={{ fontSize: 'var(--text-xs)', margin: 0 }}>No resume profile scanned yet. Run a scan to fetch recommendations.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SKILLS GROUP & ACHIEVEMENT BADGES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            {/* Career Badges (unlocked vs locked with hover effects) */}
            <div className="card glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                <Award style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Achievement Badges
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {availableBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="badge-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      opacity: badge.unlocked ? 1 : 0.35,
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                    title={badge.desc}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: badge.unlocked ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                      color: badge.unlocked ? 'var(--accent)' : 'var(--text-muted)',
                      border: badge.unlocked ? '1.5px solid var(--accent)' : '1px dashed var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: badge.unlocked ? '0 0 10px var(--glow-1)' : 'none'
                    }}>
                      <badge.icon style={{ width: 22, height: 22 }} />
                    </div>
                    <div>
                      <strong style={{ fontSize: 'var(--text-sm)', display: 'block', color: badge.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {badge.name}
                      </strong>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {badge.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Status Board */}
            <div className="card glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                <BookOpen style={{ color: 'var(--accent)', width: 18, height: 18 }} /> Skills to Learn
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                Track competency milestones for {activePlan.careerTitle}.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Completed */}
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--success)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    ✓ Mastered ({skillsState.completed.length})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skillsState.completed.map(s => (
                      <span key={s} className="tag tag-success" style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* In Progress */}
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    ⚡ In Progress ({skillsState.inProgress.length})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skillsState.inProgress.map(s => (
                      <span key={s} className="tag tag-accent" style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Locked / Not Started */}
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    🔒 Locked / Next ({skillsState.notStarted.length})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skillsState.notStarted.map(s => (
                      <span key={s} className="tag" style={{ fontSize: '10px', padding: '2px 8px', color: 'var(--text-muted)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Career Missions */}
            <div className="card glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                <Award style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Daily Missions
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                Earn bonus XP by completing these daily training objectives.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { name: "Ask AI Mentor a Career Query", xp: 10, done: (currentUser.xp || 120) > 120, link: "/mentor" },
                  { name: "Check Resume ATS Score", xp: 20, done: !!resumeResult, link: "/resume-analyzer" },
                  { name: "Attempt a Mock Interview Question", xp: 50, done: currentUser.badges?.includes('interview_complete'), link: "/mock-interview" }
                ].map((mission, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div>
                      <strong style={{ fontSize: 'var(--text-xs)', display: 'block', textDecoration: mission.done ? 'line-through' : 'none', color: mission.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{mission.name}</strong>
                      <span style={{ fontSize: '9px', color: 'var(--accent)', fontWeight: 'bold' }}>+{mission.xp} XP</span>
                    </div>
                    {mission.done ? (
                      <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 'bold' }}>Done ✓</span>
                    ) : (
                      <Link to={mission.link} className="btn btn-primary btn-sm" style={{ padding: '2px 8px', fontSize: '9px' }}>Go</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="card glass-card">
              <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link to="/placement-dashboard" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  Placement Readiness Hub <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/mock-interview" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  AI Mock Interview <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/mentor" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  AI Career Mentor Chat <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/study-plan" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  Full Study Planner <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/careers" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  Explore Career Catalog <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/compare" className="btn btn-secondary btn-sm" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  Compare Career Tracks <ChevronRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

// Inline Icons for Badges
function CompassIcon(props: any) {
  return <Briefcase {...props} />;
}
function StreakIcon(props: any) {
  return <Flame {...props} />;
}
function StarIcon(props: any) {
  return <Star {...props} />;
}
function ATSIcon(props: any) {
  return <FileText {...props} />;
}
function EliteIcon(props: any) {
  return <Award {...props} />;
}
