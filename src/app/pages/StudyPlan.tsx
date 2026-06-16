import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { careerService } from '../services/api';
import { useSearchParams, Link } from 'react-router';
import { Calendar, Clock, CheckCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, BookOpen, AlertCircle, Trash2 } from 'lucide-react';

export function StudyPlan() {
  const [searchParams] = useSearchParams();
  const [careers, setCareers] = useState<any[]>([]);
  
  // Input settings
  const [selectedCareer, setSelectedCareer] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);

  useEffect(() => {
    careerService.getCareers()
      .then(data => {
        setCareers(data);
        const careerParam = searchParams.get('career');
        if (careerParam && data.some(d => d.id === careerParam)) {
          setSelectedCareer(careerParam);
        } else if (data.length > 0) {
          setSelectedCareer(data[0].id);
        }
      })
      .catch(console.error);
  }, [searchParams]);

  // Load existing plan on mount
  useEffect(() => {
    const saved = localStorage.getItem('careerpath_activeStudyPlan');
    if (saved) {
      setActivePlan(JSON.parse(saved));
    }
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const careerObj = careers.find(c => c.id === selectedCareer);
      if (!careerObj) {
        setIsGenerating(false);
        return;
      }

      // Generate week list depending on experienceLevel and hoursPerWeek
      // Beginner gets 8 weeks, Intermediate gets 4 weeks
      const numWeeks = experienceLevel === 'Beginner' ? 8 : 4;
      const weeksData = [];

      // Extract skills from roadmap to distribute
      const careerSkills = careerObj.roadmap?.sixMonths?.flatMap((step: any) => step.skills) || ['General Skill'];
      const uniqueSkills = Array.from(new Set(careerSkills)) as string[];

      for (let i = 1; i <= numWeeks; i++) {
        const skillIndex1 = (i * 2 - 2) % uniqueSkills.length;
        const skillIndex2 = (i * 2 - 1) % uniqueSkills.length;
        const s1 = uniqueSkills[skillIndex1] || 'Foundations';
        const s2 = uniqueSkills[skillIndex2] || 'Advanced concepts';

        weeksData.push({
          week: i,
          title: `Week ${i}: Master ${s1} & ${s2}`,
          hoursAllocated: hoursPerWeek,
          tasks: [
            { id: `w${i}-t1`, label: `Read documentation and guides on ${s1}`, completed: false, hours: Math.round(hoursPerWeek * 0.3) },
            { id: `w${i}-t2`, label: `Watch foundational YouTube videos / tutorials for ${s2}`, completed: false, hours: Math.round(hoursPerWeek * 0.3) },
            { id: `w${i}-t3`, label: `Build a small practice exercise incorporating both ${s1} and ${s2}`, completed: false, hours: Math.round(hoursPerWeek * 0.4) }
          ],
          resources: [
            { title: `${s1} interactive playground`, provider: 'freeCodeCamp', url: 'https://freecodecamp.org' },
            { title: `Introduction to ${s2}`, provider: 'W3Schools', url: 'https://w3schools.com' }
          ]
        });
      }

      const newPlan = {
        careerId: selectedCareer,
        careerTitle: careerObj.title,
        experienceLevel,
        hoursPerWeek,
        weeks: weeksData,
        createdAt: new Date().toLocaleDateString()
      };

      localStorage.setItem('careerpath_activeStudyPlan', JSON.stringify(newPlan));
      
      // Update dashboard user state
      const user = JSON.parse(localStorage.getItem('careerpath_currentUser') || '{}');
      if (user.email) {
        user.activePlanId = selectedCareer;
        localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
      }

      setActivePlan(newPlan);
      setIsGenerating(false);
      setExpandedWeeks([1]);
    }, 2000);
  };

  const handleToggleTask = (weekIndex: number, taskId: string) => {
    if (!activePlan) return;

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

    // Save history progress for dashboard
    const totalTasks = updatedPlan.weeks.reduce((sum: number, w: any) => sum + w.tasks.length, 0);
    const completedTasks = updatedPlan.weeks.reduce(
      (sum: number, w: any) => sum + w.tasks.filter((t: any) => t.completed).length,
      0
    );
    const percent = Math.round((completedTasks / totalTasks) * 100);

    // Save completed skills to user completed lessons
    const user = JSON.parse(localStorage.getItem('careerpath_currentUser') || '{}');
    if (user.email) {
      user.studyPlanProgress = percent;
      localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
    }
  };

  const handleToggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleDeletePlan = () => {
    if (window.confirm('Are you sure you want to delete this study plan? Your progress will be lost.')) {
      localStorage.removeItem('careerpath_activeStudyPlan');
      
      const user = JSON.parse(localStorage.getItem('careerpath_currentUser') || '{}');
      if (user.email) {
        delete user.activePlanId;
        user.studyPlanProgress = 0;
        localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
      }
      
      setActivePlan(null);
    }
  };

  // Calculations for display
  const totalTasks = activePlan?.weeks?.reduce((sum: number, w: any) => sum + w.tasks.length, 0) || 0;
  const completedTasks = activePlan?.weeks?.reduce((sum: number, w: any) => sum + w.tasks.filter((t: any) => t.completed).length, 0) || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>AI Study Planner</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Get a customized weekly breakdown matching your study hours and target goals</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ color: 'var(--text-inverse)', borderColor: 'rgba(255,255,255,0.3)' }}>
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        {isGenerating ? (
          <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
            <div className="spinner" />
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', animation: 'pulse 1.5s infinite' }}>
              Synthesizing week-by-week milestones...
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Calibrating course recommendations and practice schedules...</p>
          </div>
        ) : !activePlan ? (
          <div className="grid-2" style={{ gap: 'var(--space-8)', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Input Config Form */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <Calendar style={{ color: 'var(--accent)' }} /> Configure Study Plan
              </h3>
              
              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                    Target Career Path
                  </label>
                  <select
                    value={selectedCareer}
                    onChange={(e) => setSelectedCareer(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  >
                    {careers.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                    Current Knowledge Level
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    {['Beginner', 'Intermediate'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`btn ${experienceLevel === level ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1 }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                    Weekly Study Commitment: <strong style={{ color: 'var(--accent)' }}>{hoursPerWeek} Hours</strong>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={5}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>5 hrs/wk (Casual)</span>
                    <span>20 hrs/wk (Focused)</span>
                    <span>40 hrs/wk (Bootcamp)</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: 'var(--space-2)' }}>
                  <Sparkles style={{ width: 16, height: 16 }} /> Generate Customized Plan
                </button>
              </form>
            </div>

            {/* Explanation Guide */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <Clock style={{ color: 'var(--accent)', width: 18, height: 18 }} /> Pace Customization
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Whether you commit 5 hours or 40 hours per week, we dynamically adjust deadlines and complexity so you stay motivated without burning out.
                </p>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <BookOpen style={{ color: 'var(--success)', width: 18, height: 18 }} /> Hand-picked Free Resources
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Includes direct links to high-quality textbooks, free tutorials, and open-source project sandboxes for every learning block.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: 'var(--space-8)' }}>
            {/* Left Column: Progress Sidebar */}
            <div>
              <div className="card sticky-col" style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Active Study Plan</h3>
                <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--accent)', marginBottom: 'var(--space-4)' }}>{activePlan.careerTitle}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', margin: 'var(--space-4) 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Level:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{activePlan.experienceLevel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Commitment:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{activePlan.hoursPerWeek} hrs/week</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Timeline:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{activePlan.weeks.length} Weeks</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span>Plan Progress</span>
                    <strong>{progressPercent}%</strong>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${progressPercent}%`, height: 8 }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)', textAlign: 'center' }}>
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Link to="/dashboard" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleDeletePlan}
                    className="btn btn-ghost"
                    style={{ width: '100%', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Trash2 style={{ width: 16, height: 16 }} /> Delete Study Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Weekly breakdown */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Weekly Milestones</h3>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Generated on {activePlan.createdAt}</span>
              </div>

              {activePlan.weeks.map((week: any, wIdx: number) => {
                const isExpanded = expandedWeeks.includes(week.week);
                const completedInWeek = week.tasks.filter((t: any) => t.completed).length;
                const totalInWeek = week.tasks.length;
                const isWeekFinished = completedInWeek === totalInWeek;

                return (
                  <div key={week.week} className="card" style={{ padding: 0, overflow: 'hidden', border: isWeekFinished ? '1.5px solid var(--success)' : '1px solid var(--border)' }}>
                    {/* Header */}
                    <div
                      onClick={() => handleToggleWeek(week.week)}
                      style={{
                        padding: 'var(--space-4) var(--space-6)',
                        backgroundColor: isWeekFinished ? 'var(--success-bg)' : 'var(--bg-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isWeekFinished ? (
                          <CheckCircle style={{ color: 'var(--success)', width: 22, height: 22 }} />
                        ) : (
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-bg)',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-bold)'
                          }}>
                            {week.week}
                          </div>
                        )}
                        <div>
                          <h4 style={{ margin: 0, fontSize: 'var(--text-base)', color: isWeekFinished ? 'var(--success)' : 'var(--text-primary)' }}>{week.title}</h4>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{week.hoursAllocated} Hours commitment</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{completedInWeek}/{totalInWeek} Done</span>
                        {isExpanded ? <ChevronUp style={{ width: 18, height: 18 }} /> : <ChevronDown style={{ width: 18, height: 18 }} />}
                      </div>
                    </div>

                    {/* Content */}
                    {isExpanded && (
                      <div style={{ padding: 'var(--space-6) var(--space-6)' }}>
                        <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>Practice Checklist</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                          {week.tasks.map((task: any) => (
                            <label key={task.id} className="task-checkbox-container option-card" style={{ padding: '10px 14px' }}>
                              <input
                                type="checkbox"
                                className="task-checkbox-input"
                                checked={task.completed}
                                onChange={() => handleToggleTask(wIdx, task.id)}
                              />
                              <div className="task-checkbox-custom">
                                <CheckCircle2 style={{ width: 12, height: 12 }} />
                              </div>
                              <span className={`task-text ${task.completed ? 'task-text-completed' : ''}`} style={{ flex: 1, fontSize: 'var(--text-sm)' }}>
                                {task.label}
                              </span>
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <Clock style={{ width: 10, height: 10 }} /> {task.hours}h
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Learning Materials */}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
                          <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>Recommended Free Resources</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {week.resources.map((res: any, rIdx: number) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-secondary)',
                                  textDecoration: 'none',
                                  color: 'inherit',
                                  fontSize: 'var(--text-sm)',
                                  border: '1px solid var(--border)'
                                }}
                              >
                                <span>{res.title}</span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-semibold)' }}>{res.provider}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
