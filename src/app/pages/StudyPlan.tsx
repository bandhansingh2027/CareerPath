import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { careerService } from '../services/api';
import { useSearchParams, Link } from 'react-router';
import { 
  Calendar, Clock, CheckCircle, CheckCircle2, ChevronDown, 
  ChevronUp, Sparkles, BookOpen, AlertCircle, Trash2, 
  TrendingUp, Award, Compass, Star, FileText 
} from 'lucide-react';

const PROJECT_RECOMMENDATIONS: Record<string, any[]> = {
  'fullstack-web-dev': [
    { title: "Collaborative Kanban Board", difficulty: "Medium", stack: "React, Node.js, Express, Socket.io, MongoDB", features: ["Real-time state updates", "Drag-and-drop task items", "Auth system for teams"], tips: "Deploy on Render/Vercel and use standard GitHub commits." },
    { title: "E-Commerce Microservices Mock", difficulty: "Hard", stack: "Next.js, Node.js, MongoDB, Redis, Docker", features: ["Product search filter", "Cart caching in Redis", "Payment gateway mock API"], tips: "Document your backend design diagrams in your readme." },
    { title: "Personal Finance Tracker", difficulty: "Easy", stack: "React, Chart.js, LocalStorage", features: ["Visual charts for expenditures", "Custom budget categories", "CSV export utility"], tips: "Focus on clean animations and clean CSS styling." }
  ],
  'data-analyst': [
    { title: "Global Sales Interactive Report", difficulty: "Medium", stack: "Power BI, SQL Server, Excel", features: ["ETL parsing of raw sales data", "Interactive dashboard slices", "Regional revenue metrics"], tips: "Publish your report on Power BI Web and link it in your resume." },
    { title: "Crypto Price Predictor & Visualizer", difficulty: "Hard", stack: "Python, Pandas, NumPy, Scikit-Learn, Streamlit", features: ["Live API price scraping", "Linear Regression prediction model", "Interactive sliders for projections"], tips: "Host your python web-app on Streamlit Sharing." },
    { title: "Web Scraping & Sentiment Analysis", difficulty: "Easy", stack: "Python, BeautifulSoup, NLTK", features: ["Scrape Twitter/Reddit reviews", "Sentiment classification (pos/neg)", "Word cloud visualization"], tips: "Explain your cleaning steps in your Jupyter Notebook." }
  ],
  'ui-ux-designer': [
    { title: "Hometown Tourism Landing Page", difficulty: "Easy", stack: "Figma, Wireframing", features: ["High-fidelity interactive prototype", "Style Guide & component library", "Responsive design grids"], tips: "Conduct simple 5-user usability testing and log insights." },
    { title: "Healthcare Appointment Mobile App", difficulty: "Medium", stack: "Figma, User Research", features: ["User persona definition maps", "Low-fidelity wireframes flow", "Dark mode UI design kit"], tips: "Include user journey mapping slides in your final case study." },
    { title: "Task Management SaaS Dashboard", difficulty: "Hard", stack: "Figma, Advanced AutoLayout", features: ["Interactive charts & nested components", "State transitions animation", "Design token variables setup"], tips: "Design for web accessibility (WCAG 2.1 compliance)." }
  ],
  'cybersecurity-analyst': [
    { title: "Snort IDS Local Intrusion Alerting", difficulty: "Medium", stack: "Linux, Snort, Bash Scripting", features: ["Local network packet capturing", "Custom alert rule configurations", "CSV alert logs formatter"], tips: "Set up in a virtual machine sandbox to monitor simulated pings." },
    { title: "Automated Vulnerability Port Scanner", difficulty: "Easy", stack: "Python, Socket Programming", features: ["TCP/UDP port scanning script", "Banner grabbing of active ports", "Markdown reports compiler"], tips: "Never run scans on unauthorized public IPs." },
    { title: "Mock Active Directory Penetration Case", difficulty: "Hard", stack: "VirtualBox, Kali Linux, Metasploitable", features: ["Secure virtualization networks setup", "Log monitoring with Sysmon", "Privilege escalation documentation"], tips: "Write a detailed remediation report as if reporting to a client." }
  ]
};

export function StudyPlan() {
  const [searchParams] = useSearchParams();
  const [careers, setCareers] = useState<any[]>([]);
  
  // Input settings
  const [selectedCareer, setSelectedCareer] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [focusMissingSkills, setFocusMissingSkills] = useState(false);
  
  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [planFormat, setPlanFormat] = useState<'weekly' | 'semester'>('weekly');

  // Custom learning path generator state
  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customSyllabus, setCustomSyllabus] = useState<any>(null);

  // Resume parameter check
  const missingParam = searchParams.get('missing');
  const missingSkillsList = missingParam ? missingParam.split(',') : [];

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

        if (missingParam) {
          setFocusMissingSkills(true);
        }
      })
      .catch(console.error);
  }, [searchParams, missingParam]);

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
      const numWeeks = experienceLevel === 'Beginner' ? 8 : 4;
      const weeksData = [];

      // Extract skills from roadmap to distribute
      let skillsToDistribute = [];
      if (focusMissingSkills && missingSkillsList.length > 0) {
        skillsToDistribute = [...missingSkillsList];
      } else {
        const careerSkills = careerObj.roadmap?.sixMonths?.flatMap((step: any) => step.skills) || ['General Skill'];
        skillsToDistribute = Array.from(new Set(careerSkills)) as string[];
      }

      for (let i = 1; i <= numWeeks; i++) {
        const skillIndex1 = (i * 2 - 2) % skillsToDistribute.length;
        const skillIndex2 = (i * 2 - 1) % skillsToDistribute.length;
        const s1 = skillsToDistribute[skillIndex1] || 'Foundations';
        const s2 = skillsToDistribute[skillIndex2] || 'Advanced concepts';

        weeksData.push({
          week: i,
          title: `Week ${i}: Master ${s1} & ${s2}`,
          hoursAllocated: hoursPerWeek,
          tasks: [
            { id: `w${i}-t1`, label: `Read documentation and guides on ${s1}`, completed: false, hours: Math.round(hoursPerWeek * 0.3) },
            { id: `w${i}-t2`, label: `Watch foundational videos / tutorials for ${s2}`, completed: false, hours: Math.round(hoursPerWeek * 0.3) },
            { id: `w${i}-t3`, label: `Build a mini application incorporating ${s1} and ${s2}`, completed: false, hours: Math.round(hoursPerWeek * 0.4) }
          ],
          resources: [
            { title: `${s1} interactive handbook`, provider: 'MDN Web Docs / freeCodeCamp', url: 'https://freecodecamp.org' },
            { title: `Introduction to ${s2}`, provider: 'GeeksforGeeks', url: 'https://geeksforgeeks.org' }
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
        user.studyPlanProgress = 0;
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
      // Award XP for checking tasks
      user.xp = (user.xp || 0) + 15;
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

  // Custom Syllabus Generator
  const handleGenerateCustomSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGeneratingCustom(true);
    setCustomSyllabus(null);

    setTimeout(() => {
      const topic = customTopic;
      const syllabus = {
        topic,
        createdAt: new Date().toLocaleDateString(),
        weeks: [
          {
            week: 1,
            title: `Week 1: Introduction to ${topic} Core Concepts`,
            objective: `Set up the local environment and write basic scripts using ${topic}.`,
            tasks: [
              `Install dependencies and configure workspace for ${topic}`,
              `Implement a minimal HelloWorld program or basic data structure`,
              `Understand core configurations and API guidelines`
            ]
          },
          {
            week: 2,
            title: `Week 2: Intermediate API Architecture`,
            objective: `Build simple multi-functional components and connect modular elements.`,
            tasks: [
              `Implement basic CRUD operations or state cycles`,
              `Learn routing, parameter matching, or utility filters in ${topic}`,
              `Write unit tests validating parameters`
            ]
          },
          {
            week: 3,
            title: `Week 3: Advanced Optimizations & Caching`,
            objective: `Address latency, file parameters, and configure persistent stores.`,
            tasks: [
              `Integrate mock middleware or database connection points`,
              `Configure visual layouts, graphs, or caching utilities`,
              `Handle error boundaries and compile debug matrices`
            ]
          },
          {
            week: 4,
            title: `Week 4: Capstone Portfolio Integration`,
            objective: `Deploy the project on Vercel/Render and write clean README files.`,
            tasks: [
              `Write GitHub workflows for automatic code verification`,
              `Build a responsive landing showcase featuring ${topic}`,
              `Record a 2-minute video walkthrough of the app flow`
            ]
          }
        ]
      };
      setCustomSyllabus(syllabus);
      setIsGeneratingCustom(false);
      
      // Award XP for generating a learning path
      const user = JSON.parse(localStorage.getItem('careerpath_currentUser') || '{}');
      if (user.email) {
        user.xp = (user.xp || 0) + 20;
        localStorage.setItem('careerpath_currentUser', JSON.stringify(user));
      }
    }, 1800);
  };

  // Calculations for display
  const totalTasks = activePlan?.weeks?.reduce((sum: number, w: any) => sum + w.tasks.length, 0) || 0;
  const completedTasks = activePlan?.weeks?.reduce((sum: number, w: any) => sum + w.tasks.filter((t: any) => t.completed).length, 0) || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Semester Mapping Helper: groups 8 weeks of study plan into semesters
  const getSemesterGroups = () => {
    if (!activePlan) return [];
    
    // Group Weeks:
    // Sem 1-2 (Year 1): Week 1-2
    // Sem 3-4 (Year 2): Week 3-4
    // Sem 5-6 (Year 3): Week 5-6
    // Sem 7-8 (Year 4): Week 7-8
    return [
      { name: "Year 1 (Semester 1-2): Fundamental Building Blocks", weeks: activePlan.weeks.slice(0, 2), wIdxStart: 0 },
      { name: "Year 2 (Semester 3-4): Intermediate Architecture & Core Projects", weeks: activePlan.weeks.slice(2, 4), wIdxStart: 2 },
      { name: "Year 3 (Semester 5-6): Advanced Development & Placement Screening", weeks: activePlan.weeks.slice(4, 6), wIdxStart: 4 },
      { name: "Year 4 (Semester 7-8): Portfolio Deployment & Capstone Launch", weeks: activePlan.weeks.slice(6, 8), wIdxStart: 6 }
    ].filter(group => group.weeks.length > 0);
  };

  const semesters = getSemesterGroups();
  const recommendedProjects = activePlan ? (PROJECT_RECOMMENDATIONS[activePlan.careerId] || PROJECT_RECOMMENDATIONS['fullstack-web-dev']) : [];

  return (
    <Layout>
      <div style={{ backgroundColor: 'var(--accent)', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>AI Study Planner & Roadmaps</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Get a customized weekly or semester breakdown matching your profile targets</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary" style={{ color: 'var(--text-inverse)', borderColor: 'rgba(255,255,255,0.3)' }}>
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        
        {/* Banner if redirected with missing skills from resume scanner */}
        {missingParam && !activePlan && (
          <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'var(--accent-bg)',
            border: '1.5px solid var(--accent)',
            marginBottom: 'var(--space-6)'
          }}>
            <FileText style={{ color: 'var(--accent)', width: 24, height: 24, flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>Resume-to-Roadmap Synchronization Active</strong>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                We detected missing skills from your resume scan: <strong>{missingSkillsList.join(', ')}</strong>. Select your target career below to generate a focused bridging roadmap!
              </span>
            </div>
          </div>
        )}

        {isGenerating ? (
          <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
            <div className="spinner" />
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', animation: 'pulse 1.5s infinite' }}>
              Synthesizing customized learning path milestones...
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Filtering tutorials and configuring sandbox practice modules...</p>
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

                {missingParam && (
                  <label className="option-card option-card-selected" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={focusMissingSkills}
                      onChange={(e) => setFocusMissingSkills(e.target.checked)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', display: 'block' }}>Focus exclusively on missing resume skills</strong>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Target only: {missingSkillsList.slice(0, 3).join(', ')}...</span>
                    </div>
                  </label>
                )}

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
            
            {/* Left Column: Progress Sidebar & Custom syllabus generator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Plan Metadata Card */}
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

              {/* Custom Topic Syllabus Generator Widget */}
              <div className="card glass-card">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--accent)', marginBottom: 'var(--space-1)' }}>
                  <Sparkles style={{ width: 16, height: 16 }} /> AI Learning Path Generator
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                  Need to learn a specific topic not listed on the catalog? Type it below to generate a week-by-week practice roadmap.
                </p>

                <form onSubmit={handleGenerateCustomSyllabus} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Docker, GraphQL, Redis"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: 'var(--text-xs)' }}
                    required
                  />
                  <button type="submit" disabled={isGeneratingCustom || !customTopic.trim()} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    {isGeneratingCustom ? 'Generating...' : 'Build Custom Syllabus'}
                  </button>
                </form>

                {customSyllabus && (
                  <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)' }}>
                    <strong style={{ fontSize: 'var(--text-xs)', display: 'block', color: 'var(--accent)', marginBottom: 'var(--space-2)' }}>Syllabus: {customSyllabus.topic}</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                      {customSyllabus.weeks.map((cw: any, idx: number) => (
                        <div key={idx} style={{ backgroundColor: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{cw.title}</span>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Objective: {cw.objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Weekly or Semester breakdown & Project Recommendations */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Roadmap Milestones</h3>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Generated on {activePlan.createdAt}</span>
                </div>
                
                {/* Format toggle switch */}
                <div className="tab-group" style={{ display: 'flex', gap: '2px', padding: '3px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                  <button 
                    onClick={() => setPlanFormat('weekly')}
                    className={`btn btn-sm ${planFormat === 'weekly' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}
                  >
                    Weekly Timeline
                  </button>
                  <button 
                    onClick={() => setPlanFormat('semester')}
                    className={`btn btn-sm ${planFormat === 'semester' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}
                  >
                    Semester-wise Plan
                  </button>
                </div>
              </div>

              {/* Weekly Format View */}
              {planFormat === 'weekly' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
              )}

              {/* Semester-wise Format View */}
              {planFormat === 'semester' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  {semesters.map((sem, semIdx) => {
                    return (
                      <div key={semIdx} className="card" style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ color: 'var(--accent)', fontSize: 'var(--text-base)', borderBottom: '2px solid var(--accent-border)', paddingBottom: '8px', marginBottom: 'var(--space-4)' }}>
                          {sem.name}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                          {sem.weeks.map((week: any, wIdxRel: number) => {
                            const wIdxGlobal = sem.wIdxStart + wIdxRel;
                            const completedInWeek = week.tasks.filter((t: any) => t.completed).length;
                            const totalInWeek = week.tasks.length;
                            const isWeekFinished = completedInWeek === totalInWeek;

                            return (
                              <div key={week.week} style={{
                                padding: '16px',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isWeekFinished ? 'var(--success-bg)' : 'var(--bg-secondary)'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <strong style={{ fontSize: 'var(--text-sm)' }}>Week {week.week}: {week.title.split(': ')[1] || week.title}</strong>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{completedInWeek}/{totalInWeek} Tasks Completed</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {week.tasks.map((task: any) => (
                                    <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--text-xs)' }}>
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleTask(wIdxGlobal, task.id)}
                                        style={{ accentColor: 'var(--accent)' }}
                                      />
                                      <span style={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                                      }}>{task.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Project Recommendations Based on Active Career Target */}
              {recommendedProjects && recommendedProjects.length > 0 && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                    <Award style={{ color: 'var(--accent)', width: 20, height: 20 }} /> Recommended Portfolio Projects
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
                    Build these resume-worthy projects tailored specifically for {activePlan.careerTitle} to showcase your skill competencies.
                  </p>

                  <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    {recommendedProjects.map((proj, idx) => (
                      <div key={idx} className="card glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: 'bold',
                              color: proj.difficulty === 'Hard' ? 'var(--error)' : proj.difficulty === 'Medium' ? 'var(--info)' : 'var(--success)',
                              backgroundColor: proj.difficulty === 'Hard' ? 'var(--error-bg)' : proj.difficulty === 'Medium' ? 'var(--info-bg)' : 'var(--success-bg)',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>{proj.difficulty}</span>
                            <span style={{ fontSize: '9px', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>+100 XP</span>
                          </div>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: 'var(--text-sm)' }}>{proj.title}</h4>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}><strong>Stack:</strong> {proj.stack}</span>
                          
                          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Key Deliverables:</span>
                            <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {proj.features.map((f: string, fi: number) => (
                                <li key={fi} style={{ marginBottom: '2px' }}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                          💡 <strong>Mentor Tip:</strong> {proj.tips}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
